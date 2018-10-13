import { queues, TAG_RATE_LIMITER, UPDATE_TAG_COUNT } from '../queues';

export default (tags) => {
  if (tags) {
    for (let i = 0; i < tags.length; i += 1) {
      queues[TAG_RATE_LIMITER].add(
        {
          queue: UPDATE_TAG_COUNT,
          data: {
            tag: tags[i],
          },
        },
        { removeOnComplete: true },
      );
    }
  }
};
