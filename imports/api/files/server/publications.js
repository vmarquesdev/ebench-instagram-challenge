import { Meteor } from 'meteor/meteor';

import { Files } from '../files.js';

Meteor.publish('files.all', function filesPublication() {
  const files = Files.collection.find({});

  return files;
});
