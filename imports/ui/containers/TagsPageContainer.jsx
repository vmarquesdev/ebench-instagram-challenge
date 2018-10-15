import { withTracker } from 'meteor/react-meteor-data';

import { Tags } from '../../api/tags/tags.js';
import TagPage from '../pages/TagPage.jsx';

const TagPageContainer = withTracker(({ match }) => ({
  tag: Tags.findOne({ name: match.params.name }),
}))(TagPage);

export default TagPageContainer;
