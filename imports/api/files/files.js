import { FilesCollection } from 'meteor/ostrio:files';

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
