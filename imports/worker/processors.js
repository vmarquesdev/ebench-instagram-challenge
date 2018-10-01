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

export const processorInitialisers = {
  [RAKE_TAGS]: () => async () => {
    const tags = Tags.find({ updated: true }).fetch();

    console.log('Init check tags');

    if (tags) {
      for (let i = 0; i < tags.length; i += 1) {
        queues[TAG_RATE_LIMITER].add({
          queue: UPDATE_TAG_COUNT,
          data: {
            tag: {
              _id: tags[i]._id,
              name: tags[i].name,
              mediaCount: tags[i].mediaCount,
            },
          },
        });
      }
    }
  },
  [INSERT_TAG]: () => async (job) => {
    const { tag } = job.data;

    if (job.data.error) console.log(job.data.error); /* eslint-disable-line */

    const tagExists = Tags.find({ name: tag }).count();

    if (!tagExists) {
      HTTP.get(`http://localhost:9000/v1/tags/${tag}`, {}, (error, response) => {
        if (!error) {
          const returnedTagtag = response.data.data;

          if (returnedTagtag.media_count) {
            Tags.insert({
              name: returnedTagtag.name,
              lastUnScyncMediaCount: returnedTagtag.media_count,
            });
          }
        } else {
          const errorObject = {
            domain: `ERROR ${new Date().toString()}: worker.processors.INSERT_TAG.httpGetError`,
            error,
          };

          queues[TAG_RATE_LIMITER].add({
            queue: INSERT_TAG,
            data: {
              error: errorObject,
              tag,
            },
          });
        }
      });
    }
  },
  [UPDATE_TAG_COUNT]: () => async (job) => {
    console.log('Checking counts...');

    const { tag } = job.data;

    HTTP.get(`http://localhost:9000/v1/tags/${tag.name}`, {}, (error, response) => {
      if (!error) {
        const returnedTag = response.data.data;

        if (tag.mediaCount !== returnedTag.media_count) {
          Tags.update(tag._id, {
            $set: { updated: false, lastUnScyncMediaCount: returnedTag.media_count },
          });

          queues[MEDIAS_RATE_LIMITER].add({
            queue: UPDATE_TAG_MEDIAS,
            data: {
              tag: tag.name,
            },
          });
        }
      } else {
        /* eslint-disable no-alert, no-console */
        console.log(
          `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_COUNT.httpGetError`,
        );
        console.log(`TAG: ${tag.name}`);
        console.log(error);
        /* eslint-enable no-alert, no-console */
      }
    });
  },
  [UPDATE_TAG_MEDIAS]: () => async (job) => {
    let tag = Tags.findOne({ name: job.data.tag });
    const endpoint = job.data.nextUrl || `http://localhost:9000/v1/tags/${tag.name}/media/recent`;

    console.log(`Init update ${job.data.tag}...`);
    console.log(endpoint);

    HTTP.get(endpoint, {}, (error, response) => {
      if (!error) {
        let tags = [];

        response.data.data.forEach((mediaMetadata) => {
          try {
            Medias.insert({ metadata: mediaMetadata });
            tags = tags.concat(mediaMetadata.tags);
          } catch (e) {
            /* eslint-disable no-alert, no-console */
            console.log(
              `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_MEDIAS.collectionInsertCatch`,
            );
            console.log(`MAIN TAG: ${tag.name}`);
            console.log(mediaMetadata);
            console.log(e);
            /* eslint-enable no-alert, no-console */
          }
        });

        // Update tags mediasCount
        mediasCountDenormalizer.afterInsertMedias(_.uniq(tags));

        tag = Tags.findOne({ name: tag.name });

        if (tag.lastUnScyncMediaCount > tag.mediaCount) {
          queues[MEDIAS_RATE_LIMITER].add({
            queue: UPDATE_TAG_MEDIAS,
            data: {
              nextUrl: response.data.pagination.next_url,
              tag: tag.name,
            },
          });
        } else {
          Tags.update(tag._id, {
            $set: { lastUnScyncMediaCount: 0, updated: true, lastSync: new Date() },
          });
        }
      } else {
        const errorObject = {
          domain: `ERROR ${new Date().toString()}: worker.processors.UPDATE_TAG_MEDIAS.httpGetError`,
          error,
        };

        queues[MEDIAS_RATE_LIMITER].add({
          queue: UPDATE_TAG_MEDIAS,
          data: {
            error: errorObject,
            nextUrl: endpoint,
            tag: tag.name,
          },
        });

        // throw new Error(errorObject.domain);
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
