import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon.jsx';

const MediaView = (props) => {
  const {
    tagName, media, showMediaView, hideMediaView,
  } = props;

  return (
    <div className={`media-view ${showMediaView ? ' media-view--show' : ''}`}>
      <div className="medias-panel__header">
        <button type="button" className="button" onClick={hideMediaView}>
          <Icon name="back" />
          <span>
            #
            {tagName}
          </span>
        </button>
      </div>

      <div className="media-view__container">
        <div className="media-view__img" style={{ backgroundImage: `url(${media.thumbUrl})` }} />

        <div className="media-view__info">
          <span className="media__tags">
            <strong>METADATA</strong>
          </span>
          <textarea
            className="media__metadata"
            defaultValue={JSON.stringify(JSON.parse(media.metadata), null, 4)}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default MediaView;

MediaView.propTypes = {
  showMediaView: PropTypes.bool.isRequired,
  hideMediaView: PropTypes.func.isRequired,
  tagName: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
};
