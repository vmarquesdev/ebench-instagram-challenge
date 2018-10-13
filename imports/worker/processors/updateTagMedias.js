import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { HTTP } from 'meteor/http';
import { queues, MEDIAS_RATE_LIMITER, UPDATE_TAG_MEDIAS } from '../queues';

import { Tags } from '../../api/tags/tags.js';
import mediasCountDenormalizer from '../../api/tags/mediasCountDenormalizer.js';
import { Medias } from '../../api/medias/medias.js';

const { INSTAGRAM_API_ENDPOINT } = Meteor.settings.private;

const printError = (tag, error, errorType, endpoint = false, metadata = false) => {
  /* eslint-disable no-alert, no-console */
  console.log(`TAG: ${tag}`);

  if (endpoint) console.log(`TAG MEDIAS PAGE: ${endpoint}`);
  if (metadata) console.log(metadata);

  console.log({
    domain: `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_MEDIAS.${errorType}`,
    error,
  });
  /* eslint-enable no-alert, no-console */
};

const updateTagMedias = (tag, returnedMedias, lastMediaId) => {
  let tags = [];
  let isUpdating = true;

  returnedMedias.forEach((metadata) => {
    if (lastMediaId === metadata.id) isUpdating = false;

    if (isUpdating) {
      try {
        Medias.insert({ metadata });
        tags = tags.concat(metadata.tags);
      } catch (collectionInsertCatchError) {
        printError(tag, collectionInsertCatchError, 'collectionInsertCatchError', false, metadata);
      }
    }
  });

  mediasCountDenormalizer.afterInsertMedias(_.uniq(tags));

  return isUpdating;
};

const continueTagMediasUpdate = (tagName, isUpdating, pagination, lastMediaId) => {
  const tag = Tags.findOne({ name: tagName });

  if (isUpdating && _.has(pagination, 'next_url')) {
    queues[MEDIAS_RATE_LIMITER].add(
      {
        queue: UPDATE_TAG_MEDIAS,
        data: {
          lastMediaId,
          nextUrl: pagination.next_url,
          tag: tag.name,
        },
      },
      { removeOnComplete: true },
    );
  } else {
    Tags.update(tag._id, {
      $set: {
        unListedMediaCount: tag.apiMediaCount - tag.mediaCount,
        lastSync: new Date(),
        updated: true,
      },
    });
  }
};

export default (tag, nextUrl, lastMediaId) => {
  const endpoint = nextUrl
    || `${INSTAGRAM_API_ENDPOINT}${tag}/media/recent?count=33&access_token=223835195.631ddc9.d1c64501404549c2a8c26d002f8f08f5`;

  /* eslint-disable no-alert, no-console */
  console.log(`Updating tag: ${tag}...`);
  console.log(endpoint);
  /* eslint-enable no-alert, no-console */

  try {
    const result = HTTP.call('GET', endpoint, {});
    const isUpdating = updateTagMedias(tag, result.data.data, lastMediaId);
    continueTagMediasUpdate(tag, isUpdating, result.data.pagination, lastMediaId);
  } catch (httpGetError) {
    queues[MEDIAS_RATE_LIMITER].add(
      {
        queue: UPDATE_TAG_MEDIAS,
        data: {
          nextUrl: endpoint,
          tag,
        },
      },
      { removeOnComplete: true },
    );

    printError(tag, httpGetError, 'httpGetError', endpoint);
  }
};
