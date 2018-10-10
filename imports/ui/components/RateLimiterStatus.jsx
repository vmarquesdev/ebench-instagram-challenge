import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon.jsx';

const RateLimiterStatus = (props) => {
  const { mediasLimited, tagsLimited } = props;

  const statusProps = {
    on: {
      class: '',
      icon: <Icon name="wifi" className="sprite--micro" />,
      text: 'rate: on',
    },
    off: {
      class: 'rate-limited',
      icon: <Icon name="wifioff" className="sprite--micro" />,
      text: 'rate: off',
    },
  };

  const StatusItem = (item, itemProps) => (
    <span className={itemProps.class}>
      {itemProps.icon}
      {item}
      {' '}
      {itemProps.text}
    </span>
  );

  return (
    <div className="rate-limiters">
      {StatusItem('Tags', tagsLimited ? statusProps.off : statusProps.on)}
      {StatusItem('Medias', mediasLimited ? statusProps.off : statusProps.on)}
    </div>
  );
};

export default RateLimiterStatus;

RateLimiterStatus.propTypes = {
  mediasLimited: PropTypes.bool.isRequired,
  tagsLimited: PropTypes.bool.isRequired,
};
