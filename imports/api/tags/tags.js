import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
// import { queues, UPDATE_TAG_MEDIAS } from '../../worker/queues';

import { Medias } from '../medias/medias.js';

class TagsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const result = super.insert(doc, callback);

    // Only if the tag exists in the instagram API and not
    // exists in local db.
    // queues[UPDATE_TAG_MEDIAS].add({
    //   tag: doc.name,
    // });

    return result;
  }
}

export const Tags = new TagsCollection('Tags');

// Deny all client-side updates since we will be using methods to manage this collection
Tags.deny({
  insert() {
    return true;
  },
});

Tags.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    unique: true,
  },
  updated: {
    type: Boolean,
    defaultValue: false,
  },
  last_sync: {
    type: Date,
    optional: true,
  },
  mediaCount: {
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

Tags.helpers({
  medias(tag) {
    return Medias.find({ tags: tag || this.name });
  },
});
