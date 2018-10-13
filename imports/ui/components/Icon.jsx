/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

const Icon = props => {
  const { name, className } = props;

  return (
    <svg className={`sprite ${className}`}>
      <use xlinkHref={`${Meteor.settings.public.HOST}/i.svg#icon-${name}`} />
    </svg>
  );
};

export default Icon;

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};
