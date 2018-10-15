import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

import Medias from '../components/Medias.jsx';

const mediasLimit = new ReactiveVar(1);

const loadMoreMedias = () => {
  mediasLimit.set(mediasLimit.get() + 1);
};

const MediasContainer = withTracker(({ tag }) => {
  const mediasHandle = Meteor.subscribe('medias.inTag', {
    tagId: tag._id,
    limit: mediasLimit.get() === 1 ? 72 : mediasLimit.get() * 72,
  });
  const loading = !mediasHandle.ready();

  return {
    loadMoreMedias,
    tagName: tag.name,
    loading,
    medias: tag.medias().fetch(),
  };
})(Medias);

export default MediasContainer;
