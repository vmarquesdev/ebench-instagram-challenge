import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { queues, MEDIAS_RATE_LIMITER, UPDATE_TAG_MEDIAS } from '../queues';

import { Tags } from '../../api/tags/tags.js';
import { Medias } from '../../api/medias/medias.js';

const { INSTAGRAM_API_ENDPOINT } = Meteor.settings.private;

const printError = (tag, error, errorType) => {
  /* eslint-disable no-alert, no-console */
  console.log(`TAG: ${tag}`);
  console.log({
    domain: `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_COUNT.${errorType}`,
    error,
  });
  /* eslint-enable no-alert, no-console */
};

const updateTag = (tag, returnedTag) => {
  if (tag.mediaCount + tag.unListedMediaCount !== returnedTag.media_count) {
    try {
      Tags.update(tag._id, {
        $set: {
          updated: false,
          apiMediaCount: returnedTag.media_count,
        },
      });

      queues[MEDIAS_RATE_LIMITER].add(
        {
          queue: UPDATE_TAG_MEDIAS,
          data: {
            lastMediaId: Medias.findOne(
              { tags: tag.name },
              { sort: { createdAt: -1, limit: 1 }, fields: { instagramId: 1 } },
            ).instagramId,
            tag: tag.name,
          },
        },
        { removeOnComplete: true },
      );
    } catch (collectionUpdateCatchError) {
      printError(tag.name, collectionUpdateCatchError, 'collectionUpdateCatchError');
    }
  }
};

export default (tag) => {
  try {
    const result = HTTP.call(
      'GET',
      `${INSTAGRAM_API_ENDPOINT}${
        tag.name
      }?&access_token=1354295816.448c75f.8f30fe849ead4e72b98f3b42a041826d`,
      {},
    );

    updateTag(tag, result.data.data);
  } catch (httpGetError) {
    printError(tag.name, httpGetError, 'httpGetError');
  }
};
