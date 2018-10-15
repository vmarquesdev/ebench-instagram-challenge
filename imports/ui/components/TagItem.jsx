/* eslint-disable */
import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import Icon from './Icon.jsx';

const TagItem = props => {
  const { tag } = props;

  return (
    <NavLink to={`/tags/${tag.name}`} key={tag._id} className="tag-item">
      <div className="tag-item__info">
        <span className="tag-item__status">
          {tag.updated ? (
            <Icon name="live" className="sprite--micro" />
          ) : (
            <Icon name="refresh" className="sprite--micro" />
          )}
        </span>
        <span className="tag-item__name">
          <strong>#</strong>
          {tag.name}
        </span>
      </div>
      <div className="tag-item__counts">
        <div className="tag-item__lastsync">
          {tag.updated ? moment(tag.lastSync).format('MMM Do YY, h:mm a') : 'Synching...'}
        </div>

        <div className="tag-item__mediacount">
          <span>medias count</span>
          <span className="count">{tag.mediaCount}</span>
        </div>

        <div className="tag-item__unlistedcount">
          <span>unlisted count</span>
          <span className="count">{tag.unListedMediaCount}</span>
        </div>

        <div className="tag-item__apicount">
          <span>API count</span>
          <span>{tag.apiMediaCount}</span>
        </div>
      </div>
    </NavLink>
  );
};

export default TagItem;

TagItem.propTypes = {
  tag: PropTypes.object.isRequired,
};
