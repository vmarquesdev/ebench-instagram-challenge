import React from 'react';
import PropTypes from 'prop-types';

import TagItem from './TagItem.jsx';

const Tags = (props) => {
  const { synchronizing, tags } = props;

  return (
    <div className="tags-container">
      <div className="tags-container__title">
        {synchronizing ? 'Tags in Sync...' : 'Synced Tags'}
      </div>
      <div className={synchronizing ? 'tags tags--sync' : 'tags'}>
        {tags.map(tag => TagItem({ tag }))}
      </div>
    </div>
  );
};

export default Tags;

Tags.propTypes = {
  synchronizing: PropTypes.bool.isRequired,
  tags: PropTypes.array.isRequired,
};
