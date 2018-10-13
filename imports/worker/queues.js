import { Meteor } from 'meteor/meteor';
import Queue from 'bull';

export const TAG_RATE_LIMITER = 'TAG_RATE_LIMITER';
export const MEDIAS_RATE_LIMITER = 'MEDIAS_RATE_LIMITER';

export const RAKE_TAGS = 'RAKE_TAGS';
export const INSERT_TAG = 'INSERT_TAG';
export const UPDATE_TAG_COUNT = 'UPDATE_TAG_COUNT';
export const UPDATE_TAG_MEDIAS = 'UPDATE_TAG_MEDIAS';

const {
  REDIS,
  TAG_RATE,
  TAG_MINUTES_LIMITER,
  MEDIAS_RATE,
  MEDIAS_MINUTES_LIMITER,
} = Meteor.settings.private;

export const queues = {
  [TAG_RATE_LIMITER]: new Queue(TAG_RATE_LIMITER, {
    redis: REDIS,
    limiter: {
      max: TAG_RATE,
      duration: TAG_MINUTES_LIMITER * 60 * 1000,
    },
  }),
  [MEDIAS_RATE_LIMITER]: new Queue(MEDIAS_RATE_LIMITER, {
    redis: REDIS,
    limiter: {
      max: MEDIAS_RATE,
      duration: MEDIAS_MINUTES_LIMITER * 60 * 1000,
    },
  }),
  [RAKE_TAGS]: new Queue(RAKE_TAGS, REDIS),
  [INSERT_TAG]: new Queue(INSERT_TAG, REDIS),
  [UPDATE_TAG_COUNT]: new Queue(UPDATE_TAG_COUNT, REDIS),
  [UPDATE_TAG_MEDIAS]: new Queue(UPDATE_TAG_MEDIAS, REDIS),
};
