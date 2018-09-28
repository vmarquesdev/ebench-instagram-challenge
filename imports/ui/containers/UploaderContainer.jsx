import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Files } from '../../api/files/files.js';
import Uploader from '../components/Uploader.jsx';

const UploaderContainer = withTracker(() => {
  const filesHandle = Meteor.subscribe('files.all');
  const files = Files.find({}, { sort: { name: 1 } }).fetch();

  return {
    docsReadyYet: filesHandle.ready(),
    files,
  };
})(Uploader);

export default UploaderContainer;
