import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Tags = new Mongo.Collection('Tags');

// Deny all client-side updates since we will be using methods to manage this collection
// Tags.deny({
//   insert() {
//     return true;
//   },
// });

Tags.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
  },
  updated: {
    type: Boolean,
    defaultValue: false,
  },
  last_sync: {
    type: Date,
    optional: true,
  },
  media_count: {
    type: Number,
    defaultValue: 0,
  },
  unread_media_count: {
    type: Number,
    defaultValue: 0,
  },
});

Tags.attachSchema(Tags.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
// Tags.publicFields = {
//   name: 1,
//   updated: 1,
//   last_sync: 1,
//   media_count: 1,
//   unread_media_count: 1,
// };
