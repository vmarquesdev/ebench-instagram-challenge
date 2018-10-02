import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { EJSON } from 'meteor/ejson';

import { Tags } from '../tags/tags.js';

class MediasCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.thumbUrl = ourDoc.metadata.images.standard_resolution.url;
    ourDoc.instagramId = ourDoc.metadata.id;
    ourDoc.tags = ourDoc.metadata.tags;

    const date = new Date(0);
    date.setUTCSeconds(ourDoc.metadata.created_time);

    ourDoc.createdAt = date;

    ourDoc.metadata = EJSON.stringify(ourDoc.metadata);

    return super.insert(ourDoc, callback);
  }
}

export const Medias = new MediasCollection('Medias');

Medias.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  instagramId: {
    type: String,
    unique: true,
  },
  thumbUrl: {
    type: String,
  },
  tags: {
    type: Array,
  },
  'tags.$': {
    type: String,
  },
  metadata: {
    type: String,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
});

Medias.attachSchema(Medias.schema);

Medias.publicFields = {
  thumbUrl: 1,
  tags: 1,
  createdAt: 1,
};

Medias.helpers({
  tags() {
    return Tags.find({ name: this.name });
  },
});
