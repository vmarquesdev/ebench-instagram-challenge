// import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Tags } from './tags.js';

export const insert = new ValidatedMethod({
  name: 'tags.insert',
  validate: new SimpleSchema({
    name: { type: String },
  }).validator(),
  run({ name }) {
    Tags.insert({ name });
  },
});

// // Get list of all method names on Todos
// const TODOS_METHODS = _.pluck([insert], 'name');
//
// if (Meteor.isServer) {
//   // Only allow 5 todos operations per connection per second
//   DDPRateLimiter.addRule(
//     {
//       name(name) {
//         return _.contains(TODOS_METHODS, name);
//       },
//
//       // Rate limit per connection ID
//       connectionId() {
//         return true;
//       },
//     },
//     5,
//     1000,
//   );
// }
