import { Meteor } from 'meteor/meteor';

import { Tags } from '../tags.js';

Meteor.publish('tags', function tagsPublication() {
  return Tags.find({}, { sort: { createdAt: -1 }, fields: Tags.publicFields });
});
