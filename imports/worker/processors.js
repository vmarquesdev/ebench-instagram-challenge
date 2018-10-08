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

    console.log('Init check tags');

    if (tags) {
      for (let i = 0; i < tags.length; i += 1) {
        queues[TAG_RATE_LIMITER].add({
          queue: UPDATE_TAG_COUNT,
          data: {
            tag: tags[i],
          },
        });
      }
    }
  },
  [INSERT_TAG]: () => async (job) => {
    const { tag } = job.data;

    const tagExists = Tags.find({ name: tag }).count();

    if (!tagExists) {
      HTTP.get(
        `${INSTAGRAM_API_ENDPOINT}${tag}?&access_token=1354295816.448c75f.8f30fe849ead4e72b98f3b42a041826d`,
        {},
        (httpGetError, response) => {
          if (!httpGetError) {
            const returnedTagtag = response.data.data;

            if (returnedTagtag.media_count) {
              try {
                Tags.insert({
                  name: returnedTagtag.name,
                  apiMediaCount: returnedTagtag.media_count,
                });

                queues[MEDIAS_RATE_LIMITER].add({
                  queue: UPDATE_TAG_MEDIAS,
                  data: {
                    tag: returnedTagtag.name,
                  },
                });
              } catch (collectionInsertCatchError) {
                /* eslint-disable no-alert, no-console */
                console.log(`TAG: ${tag.name}`);
                console.log({
                  domain: `WARNING ${new Date().toString()}: worker.processors.INSERT_TAG.collectionInsertCatchError`,
                  collectionInsertCatchError,
                });
                /* eslint-enable no-alert, no-console */

                queues[TAG_RATE_LIMITER].add({
                  queue: INSERT_TAG,
                  data: {
                    tag,
                  },
                });
              }
            }
          } else {
            /* eslint-disable no-alert, no-console */
            console.log(`TAG: ${tag.name}`);
            console.log({
              domain: `WARNING ${new Date().toString()}: worker.processors.INSERT_TAG.httpGetError`,
              httpGetError,
            });
            /* eslint-enable no-alert, no-console */

            queues[TAG_RATE_LIMITER].add({
              queue: INSERT_TAG,
              data: {
                tag,
              },
            });
          }
        },
      );
    }
  },
  [UPDATE_TAG_COUNT]: () => async (job) => {
    const { tag } = job.data;

    console.log('Checking counts...');

    HTTP.get(
      `${INSTAGRAM_API_ENDPOINT}${
        tag.name
      }?&access_token=1354295816.448c75f.8f30fe849ead4e72b98f3b42a041826d`,
      {},
      (httpGetError, response) => {
        if (!httpGetError) {
          const returnedTag = response.data.data;

          if (tag.mediaCount + tag.unListedMediaCount !== returnedTag.media_count) {
            Tags.update(tag._id, {
              $set: {
                updated: false,
                apiMediaCount: returnedTag.media_count,
              },
            });

            queues[MEDIAS_RATE_LIMITER].add({
              queue: UPDATE_TAG_MEDIAS,
              data: {
                lastMediaId: Medias.findOne(
                  { tags: tag.name },
                  { sort: { createdAt: -1, limit: 1 }, fields: { instagramId: 1 } },
                ).instagramId,
                tag: tag.name,
              },
            });
          }
        } else {
          /* eslint-disable no-alert, no-console */
          console.log(`TAG: ${tag.name}`);
          console.log({
            domain: `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_COUNT.httpGetError`,
            httpGetError,
          });
          /* eslint-enable no-alert, no-console */
        }
      },
    );
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
