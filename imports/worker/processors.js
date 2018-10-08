import { _ } from 'meteor/underscore';
import { HTTP } from 'meteor/http';
import {
  queues,
  TAG_RATE_LIMITER,
  MEDIAS_RATE_LIMITER,
  RAKE_TAGS,
  INSERT_TAG,
  UPDATE_TAG_COUNT,
  UPDATE_TAG_MEDIAS,
} from './queues';

import rakeTags from './processors/rakeTags.js';
import createTag from './processors/createTag.js';
import updateTagCount from './processors/updateTagCount.js';

import { Tags } from '../api/tags/tags.js';
import mediasCountDenormalizer from '../api/tags/mediasCountDenormalizer.js';
import { Medias } from '../api/medias/medias.js';

const INSTAGRAM_API_ENDPOINT = 'http://localhost:9000/v1/tags/';
// const INSTAGRAM_API_ENDPOINT = 'https://api.instagram.com/v1/tags/';

export const processorInitialisers = {
  [RAKE_TAGS]: () => async () => {
    const tags = Tags.find(
      { updated: true },
      {
        fields: {
          _id: 1,
          name: 1,
          mediaCount: 1,
          unListedMediaCount: 1,
        },
      },
    ).fetch();

    rakeTags(tags);
  },
  [INSERT_TAG]: () => async (job) => {
    createTag(job.data.tag);
  },
  [UPDATE_TAG_COUNT]: () => async (job) => {
    updateTagCount(job.data.tag);
  },
  [UPDATE_TAG_MEDIAS]: () => async (job) => {
    let tag = Tags.findOne({ name: job.data.tag });
    const endpoint = job.data.nextUrl
      || `${INSTAGRAM_API_ENDPOINT}${
        tag.name
      }/media/recent?count=33&access_token=223835195.631ddc9.d1c64501404549c2a8c26d002f8f08f5`;

    console.log(`Init update ${job.data.tag}...`);
    console.log(endpoint);

    HTTP.get(endpoint, {}, (httpGetError, response) => {
      if (!httpGetError) {
        let tags = [];
        let isUpdating = true;
        const { lastMediaId } = job.data;

        response.data.data.forEach((mediaMetadata) => {
          if (lastMediaId === mediaMetadata.id) isUpdating = false;

          // Test else case
          if (isUpdating) {
            try {
              Medias.insert({ metadata: mediaMetadata });
              tags = tags.concat(mediaMetadata.tags);
            } catch (collectionInsertCatchError) {
              /* eslint-disable no-alert, no-console */
              console.log(`TAG: ${tag.name}`);
              console.log(mediaMetadata);
              console.log({
                domain: `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_MEDIAS.collectionInsertCatchError`,
                collectionInsertCatchError,
              });
              /* eslint-enable no-alert, no-console */
            }
          }
        });

        // Update tags mediasCount
        mediasCountDenormalizer.afterInsertMedias(_.uniq(tags));

        tag = Tags.findOne({ name: tag.name });

        if (isUpdating && _.has(response.data.pagination, 'next_url')) {
          queues[MEDIAS_RATE_LIMITER].add({
            queue: UPDATE_TAG_MEDIAS,
            data: {
              lastMediaId,
              nextUrl: response.data.pagination.next_url,
              tag: tag.name,
            },
          });
        } else {
          Tags.update(tag._id, {
            $set: {
              unListedMediaCount: tag.apiMediaCount - tag.mediaCount,
              lastSync: new Date(),
              updated: true,
            },
          });
        }
      } else {
        /* eslint-disable no-alert, no-console */
        console.log(`TAG: ${tag.name}`);
        console.log(`TAG MEDIAS PAGE: ${endpoint}`);
        console.log({
          domain: `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_MEDIAS.httpGetError`,
          httpGetError,
        });
        /* eslint-enable no-alert, no-console */

        queues[MEDIAS_RATE_LIMITER].add({
          queue: UPDATE_TAG_MEDIAS,
          data: {
            nextUrl: endpoint,
            tag: tag.name,
          },
        });
      }
    });

    console.log(`Finish ${job.data.tag}...`);
  },
  [TAG_RATE_LIMITER]: () => async (job) => {
    queues[job.data.queue].add(job.data.data);
  },
  [MEDIAS_RATE_LIMITER]: () => async (job) => {
    queues[job.data.queue].add(job.data.data);
  },
};
