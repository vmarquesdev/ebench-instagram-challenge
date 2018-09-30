import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { queues, INSERT_TAG } from '../../worker/queues';

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
      for (let i = 0; i < data.length; i += 1) {
        queues[INSERT_TAG].add({
          tag: data[i],
        });
      }
    });
  });
}
