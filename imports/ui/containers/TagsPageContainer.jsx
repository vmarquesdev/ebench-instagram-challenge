import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Tags } from '../../api/tags/tags.js';
import TagPage from '../pages/TagPage.jsx';

const TagPageContainer = withTracker(({ match }) => {
  const { id } = match.params;
  const mediasHandle = Meteor.subscribe('medias.inTag', { tagId: id, limit: 36 });
  const loading = !mediasHandle.ready();
  const tag = Tags.findOne(id);
  const tagExists = !loading && !!tag;

  return {
    loading,
    tag,
    tagExists,
    medias: tagExists ? tag.medias(36).fetch() : [],
  };
})(TagPage);

export default TagPageContainer;
