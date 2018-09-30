import '../../worker/index.js';

import Arena from 'bull-arena';
import {
  RAKE_TAGS, INSERT_TAG, UPDATE_TAG_COUNT, UPDATE_TAG_MEDIAS,
} from '../../worker/queues';

Arena(
  {
    queues: [
      {
        name: RAKE_TAGS,
        hostId: 'Worker',
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: INSERT_TAG,
        hostId: 'Worker',
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: UPDATE_TAG_COUNT,
        hostId: 'Worker',
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: UPDATE_TAG_MEDIAS,
        hostId: 'Worker',
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
    ],
  },
  {
    basePath: '/arena',
  },
);
