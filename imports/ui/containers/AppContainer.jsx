import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { RateLimitersStatus } from '../../api/rateLimitersStatus/rateLimitersStatus.js';
import { Tags } from '../../api/tags/tags.js';
import App from '../layouts/App.jsx';

export default withTracker(() => {
  const rateLimitersStatusSub = Meteor.subscribe('rateLimitersStatus');
  const tagsSub = Meteor.subscribe('tags');

  return {
    rateLimitersStatus: RateLimitersStatus.findOne(),
    connected: Meteor.status().connected,
    loading: !(tagsSub.ready() && rateLimitersStatusSub.ready()),
    tags: Tags.find({}, { sort: { createdAt: -1 }, fields: Tags.publicFields }).fetch(),
  };
})(App);
