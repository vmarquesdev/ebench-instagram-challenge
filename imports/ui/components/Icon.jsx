import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
  const { name, className } = props; // eslint-disable-line

  return (
    <svg className={`sprite ${className}`}>
      <use xlinkHref={`http://localhost:3000/i.svg#icon-${name}`} />
    </svg>
  );
};

export default Icon;

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};
