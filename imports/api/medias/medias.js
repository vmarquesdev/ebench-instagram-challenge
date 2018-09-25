import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Tags } from '../tags/tags.js';

class MediasCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.thumbUrl = ourDoc.metadata.images.standard_resolution.url;
    ourDoc.instagramId = ourDoc.metadata.id;
    ourDoc.tags = ourDoc.metadata.tags;

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
    // unique: true,
  },
  thumbUrl: {
    type: String,
  },
  // tags: {
  //   type: [String],
  // },
  metadata: {
    type: Object,
  },
});

Medias.attachSchema(Medias.schema);

Medias.publicFields = {
  thumbUrl: 1,
};

Medias.helpers({
  tags() {
    return Tags.find({ name: this.name });
  },
});
