import '../../worker/index.js';

import Arena from 'bull-arena';
import { UPDATE_TAG_MEDIAS } from '../../worker/queues';

Arena(
  {
    queues: [
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
