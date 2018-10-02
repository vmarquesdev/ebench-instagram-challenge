import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { queues, MEDIAS_RATE_LIMITER, UPDATE_TAG_MEDIAS } from '../../worker/queues';

import { Medias } from '../medias/medias.js';

class TagsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = new Date();
    return super.insert(ourDoc, callback);
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
  lastSync: {
    type: Date,
    optional: true,
  },
  mediaCount: {
    type: Number,
    defaultValue: 0,
  },
  apiMediaCount: {
    type: Number,
    defaultValue: 0,
  },
  unListedMediaCount: {
    type: Number,
    defaultValue: 0,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
});

Tags.attachSchema(Tags.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Tags.publicFields = {
  name: 1,
  updated: 1,
  lastSync: 1,
  mediaCount: 1,
  unListedMediaCount: 1,
  createdAt: 1,
};

Tags.helpers({
  medias() {
    return Medias.find({ tags: this.name }, { sort: { createdAt: -1 }, fields: Medias.fields });
  },
});
