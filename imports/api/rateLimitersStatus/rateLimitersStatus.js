import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const RateLimitersStatus = new Mongo.Collection('RateLimitersStatus');

RateLimitersStatus.deny({
  insert() {
    return true;
  },
});

RateLimitersStatus.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  mediasLimited: {
    type: Boolean,
    defaultValue: false,
  },
  tagsLimited: {
    type: Boolean,
    defaultValue: false,
  },
});

RateLimitersStatus.attachSchema(RateLimitersStatus.schema);
