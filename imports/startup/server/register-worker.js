import { Meteor } from 'meteor/meteor';

import '../../worker/index.js';

import Arena from 'bull-arena';

import {
  TAG_RATE_LIMITER,
  MEDIAS_RATE_LIMITER,
  RAKE_TAGS,
  INSERT_TAG,
  UPDATE_TAG_COUNT,
  UPDATE_TAG_MEDIAS,
} from '../../worker/queues';

const { REDIS } = Meteor.settings.private;

Arena(
  {
    queues: [
      {
        name: TAG_RATE_LIMITER,
        hostId: 'Worker',
        redis: REDIS,
      },
      {
        name: MEDIAS_RATE_LIMITER,
        hostId: 'Worker',
        redis: REDIS,
      },
      {
        name: RAKE_TAGS,
        hostId: 'Worker',
        redis: REDIS,
      },
      {
        name: INSERT_TAG,
        hostId: 'Worker',
        redis: REDIS,
      },
      {
        name: UPDATE_TAG_COUNT,
        hostId: 'Worker',
        redis: REDIS,
      },
      {
        name: UPDATE_TAG_MEDIAS,
        hostId: 'Worker',
        redis: REDIS,
      },
    ],
  },
  {
    basePath: '/arena',
  },
);
