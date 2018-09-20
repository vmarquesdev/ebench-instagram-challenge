/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Tags } from '../tags.js';

Meteor.publish('tags', function tagsPublication() {
  return Tags.find();
});