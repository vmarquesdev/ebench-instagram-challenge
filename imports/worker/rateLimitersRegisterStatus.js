import { ReactiveVar } from 'meteor/reactive-var';
import { RateLimitersStatus } from '../api/rateLimitersStatus/rateLimitersStatus.js';

const mediasRateLimiterCount = new ReactiveVar(0);
const tagsRateLimiterCount = new ReactiveVar(0);

export default (item, limit) => {
  const count = item === 'medias' ? mediasRateLimiterCount : tagsRateLimiterCount;

  count.set(count.get() + 1);

  if (count.get() === limit) {
    const rateLimitersStatus = RateLimitersStatus.findOne();

    if (item === 'medias') {
      RateLimitersStatus.update(rateLimitersStatus._id, { $set: { mediasLimited: true } });
    } else {
      RateLimitersStatus.update(rateLimitersStatus._id, { $set: { tagsLimited: true } });
    }
  }

  if (count.get() === limit + 1) {
    count.set(1);

    const rateLimitersStatus = RateLimitersStatus.findOne();

    if (item === 'medias') {
      RateLimitersStatus.update(rateLimitersStatus._id, { $set: { mediasLimited: false } });
    } else {
      RateLimitersStatus.update(rateLimitersStatus._id, { $set: { tagsLimited: false } });
    }
  }
};
