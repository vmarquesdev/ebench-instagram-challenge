import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tags } from '../../api/tags/tags.js';
import App from '../layouts/App.jsx';

export default withTracker(() => {
  const tagsSub = Meteor.subscribe('tags');

  return {
    loading: !tagsSub.ready(),
    connected: Meteor.status().connected,
    tags: Tags.find().fetch(),
  };
})(App);
