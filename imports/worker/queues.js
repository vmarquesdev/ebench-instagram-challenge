import Queue from 'bull';

export const TAG_RATE_LIMITER = 'TAG_RATE_LIMITER';
export const MEDIAS_RATE_LIMITER = 'MEDIAS_RATE_LIMITER';

export const RAKE_TAGS = 'RAKE_TAGS';
export const INSERT_TAG = 'INSERT_TAG';
export const UPDATE_TAG_COUNT = 'UPDATE_TAG_COUNT';
export const UPDATE_TAG_MEDIAS = 'UPDATE_TAG_MEDIAS';

export const queues = {
  [TAG_RATE_LIMITER]: new Queue(TAG_RATE_LIMITER, 'redis://127.0.0.1:6379'),
  [MEDIAS_RATE_LIMITER]: new Queue(MEDIAS_RATE_LIMITER, 'redis://127.0.0.1:6379'),
  [RAKE_TAGS]: new Queue(RAKE_TAGS, 'redis://127.0.0.1:6379'),
  [INSERT_TAG]: new Queue(INSERT_TAG, 'redis://127.0.0.1:6379'),
  [UPDATE_TAG_COUNT]: new Queue(UPDATE_TAG_COUNT, 'redis://127.0.0.1:6379'),
  [UPDATE_TAG_MEDIAS]: new Queue(UPDATE_TAG_MEDIAS, 'redis://127.0.0.1:6379'),
};
