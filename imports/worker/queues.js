import Queue from 'bull';

export const UPDATE_TAG_MEDIAS = 'UPDATE_TAG_MEDIAS';

export const queues = {
  [UPDATE_TAG_MEDIAS]: new Queue(UPDATE_TAG_MEDIAS, 'redis://127.0.0.1:6379'),
};
