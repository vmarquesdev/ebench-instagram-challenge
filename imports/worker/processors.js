import {
  queues,
  TAG_RATE_LIMITER,
  MEDIAS_RATE_LIMITER,
  RAKE_TAGS,
  INSERT_TAG,
  UPDATE_TAG_COUNT,
  UPDATE_TAG_MEDIAS,
} from './queues';

import rateLimitersRegisterStatus from './rateLimitersRegisterStatus.js';
import rakeTags from './processors/rakeTags.js';
import createTag from './processors/createTag.js';
import updateTagCount from './processors/updateTagCount.js';
import updateTagMedias from './processors/updateTagMedias.js';

import { Tags } from '../api/tags/tags.js';

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
    updateTagMedias(job.data.tag, job.data.nextUrl, job.data.lastMediaId);
  },
  [TAG_RATE_LIMITER]: () => async (job) => {
    queues[job.data.queue].add(job.data.data, { removeOnComplete: true });
    rateLimitersRegisterStatus('tags', 450);
  },
  [MEDIAS_RATE_LIMITER]: () => async (job) => {
    queues[job.data.queue].add(job.data.data, { removeOnComplete: true });
    rateLimitersRegisterStatus('medias', 155);
  },
};
