import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import {
  queues,
  TAG_RATE_LIMITER,
  MEDIAS_RATE_LIMITER,
  INSERT_TAG,
  UPDATE_TAG_MEDIAS,
} from '../queues';

import { Tags } from '../../api/tags/tags.js';

const { INSTAGRAM_API_ENDPOINT } = Meteor.settings.private;

const printError = (tag, error, errorType) => {
  /* eslint-disable no-alert, no-console */
  console.log(`TAG: ${tag}`);
  console.log({
    domain: `WARNING ${new Date().toString()}: worker.processors.INSERT_TAG.${errorType}`,
    error,
  });
  /* eslint-enable no-alert, no-console */
};

const insertTag = (tag, returnedTag) => {
  if (returnedTag.media_count) {
    try {
      Tags.insert({
        name: returnedTag.name,
        apiMediaCount: returnedTag.media_count,
      });

      queues[MEDIAS_RATE_LIMITER].add(
        {
          queue: UPDATE_TAG_MEDIAS,
          data: {
            tag: returnedTag.name,
          },
        },
        { removeOnComplete: true },
      );
    } catch (collectionInsertCatchError) {
      queues[TAG_RATE_LIMITER].add(
        {
          queue: INSERT_TAG,
          data: {
            tag,
          },
        },
        { removeOnComplete: true },
      );

      printError(tag, collectionInsertCatchError, 'collectionInsertCatchError');
    }
  }
};

export default (tag) => {
  if (!Tags.find({ name: tag }).count()) {
    try {
      const result = HTTP.call(
        'GET',
        `${INSTAGRAM_API_ENDPOINT}${tag}?&access_token=1354295816.448c75f.8f30fe849ead4e72b98f3b42a041826d`,
        {},
      );
      insertTag(tag, result.data.data);
    } catch (httpGetError) {
      queues[TAG_RATE_LIMITER].add(
        {
          queue: INSERT_TAG,
          data: {
            tag,
          },
        },
        { removeOnComplete: true },
      );

      printError(tag, httpGetError, 'httpGetError');
    }
  }
};
