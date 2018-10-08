import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { FilesCollection } from 'meteor/ostrio:files';
import { queues, TAG_RATE_LIMITER, INSERT_TAG } from '../../worker/queues';

const csv = require('fast-csv');

export const Files = new FilesCollection({ collectionName: 'Files' });

Files.collection.deny({
  insert() {
    return false;
  },
  update() {
    return true;
  },
  remove() {
    return false;
  },
});

Files.collection.attachSchema(FilesCollection.schema);

if (Meteor.isServer) {
  Files.on('afterUpload', function(_fileRef) {
    csv.fromPath(_fileRef.path).on('data', function(data) {
      const uniqData = _.uniq(data);

      for (let i = 0; i < uniqData.length; i += 1) {
        queues[TAG_RATE_LIMITER].add({
          queue: INSERT_TAG,
          data: {
            tag: uniqData[i],
          },
        });
      }
    });
  });
}
