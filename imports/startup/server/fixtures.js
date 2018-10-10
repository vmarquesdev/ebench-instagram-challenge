import { Meteor } from 'meteor/meteor';
import { RateLimitersStatus } from '../../api/rateLimitersStatus/rateLimitersStatus.js';

Meteor.startup(() => {
  if (RateLimitersStatus.find().count() === 0) RateLimitersStatus.insert({});
});
