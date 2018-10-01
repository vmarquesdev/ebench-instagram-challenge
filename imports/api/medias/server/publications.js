import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { Medias } from '../medias.js';
import { Tags } from '../../tags/tags.js';

Meteor.publishComposite('medias.inTag', function mediasInTag(params) {
  new SimpleSchema({
    tagId: { type: String },
  }).validate(params);

  const { tagId } = params;

  return {
    find() {
      return Tags.find({ _id: tagId }, { fields: { name: 1 } });
    },

    children: [
      {
        find(tag) {
          return Medias.find({ tags: tag.name }, { fields: Medias.publicFields });
        },
      },
    ],
  };
});
