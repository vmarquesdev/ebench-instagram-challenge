import { Meteor } from 'meteor/meteor';
import { RateLimitersStatus } from '../rateLimitersStatus.js';

Meteor.publish('rateLimitersStatus', function rateLimitersStatusPublication() {
  return RateLimitersStatus.find({});
});
