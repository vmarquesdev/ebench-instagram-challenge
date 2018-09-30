import { _ } from 'meteor/underscore';
import { HTTP } from 'meteor/http';
import {
  queues, RAKE_TAGS, INSERT_TAG, UPDATE_TAG_COUNT, UPDATE_TAG_MEDIAS,
} from './queues';

import { Tags } from '../api/tags/tags.js';
import mediasCountDenormalizer from '../api/tags/mediasCountDenormalizer.js';
import { Medias } from '../api/medias/medias.js';

export const processorInitialisers = {
  [RAKE_TAGS]: () => async () => {
    const tagsFetch = Tags.find({ updated: true }).fetch();
    const groupedTags = [];

    console.log('Init check tags');

    if (tagsFetch) {
      // This loop groups tags in 5
      for (let i = 0; i < tagsFetch.length; i += 10) {
        groupedTags.push(
          tagsFetch.slice(i, i + 10).map(tag => ({
            _id: tag._id,
            name: tag.name,
            mediaCount: tag.mediaCount,
          })),
        );
      }

      groupedTags.forEach((tags) => {
        queues[UPDATE_TAG_COUNT].add({
          tags,
        });
      });
    }
  },
  [INSERT_TAG]: () => async (job) => {
    const tagsList = job.data.tags;

    if (job.data.error) console.log(job.data.error); /* eslint-disable-line */

    for (let i = 0; i < tagsList.length; i += 1) {
      const tagExists = Tags.find({ name: tagsList[i] }).count();

      if (!tagExists) {
        HTTP.get(`http://localhost:9000/v1/tags/${tagsList[i]}`, {}, (error, response) => {
          if (!error) {
            const tag = response.data.data;

            if (tag.media_count) {
              Tags.insert({
                name: tag.name,
                lastUnScyncMediaCount: tag.media_count,
              });
            }
          } else {
            const errorObject = {
              domain: `ERROR ${new Date().toString()}: worker.processors.INSERT_TAG.httpGetError`,
              error,
            };

            queues[INSERT_TAG].add({
              error: errorObject,
              tags: tagsList[i],
            });
          }
        });
      }
    }
  },
  [UPDATE_TAG_COUNT]: () => async (job) => {
    console.log('Checking counts...');

    job.data.tags.forEach((tag) => {
      HTTP.get(`http://localhost:9000/v1/tags/${tag.name}`, {}, (error, response) => {
        if (!error) {
          const returnedTag = response.data.data;

          if (tag.mediaCount !== returnedTag.media_count) {
            Tags.update(tag._id, {
              $set: { updated: false, lastUnScyncMediaCount: returnedTag.media_count },
            });

            queues[UPDATE_TAG_MEDIAS].add({
              tag: tag.name,
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
          queues[UPDATE_TAG_MEDIAS].add({
            nextUrl: response.data.pagination.next_url,
            tag: tag.name,
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

        queues[UPDATE_TAG_MEDIAS].add({
          error: errorObject,
          nextUrl: endpoint,
          tag: tag.name,
        });

        // throw new Error(errorObject.domain);
      }
    });

    console.log(`Finish ${job.data.tag}...`);
  },
};
