import React from 'react';
import PropTypes from 'prop-types';

import NotFoundPage from './NotFoundPage.jsx';
import MediasContainer from '../containers/MediasContainer.jsx';

const TagPage = (props) => {
  const { tag } = props;

  if (!tag) return <NotFoundPage />;

  return (
    <div className="medias-panel">
      <div className="medias-panel__header">
        <span>
          #
          {tag.name}
        </span>
      </div>

      <MediasContainer tag={tag} />
    </div>
  );
};

export default TagPage;

TagPage.propTypes = {
  tag: PropTypes.object.isRequired,
};
