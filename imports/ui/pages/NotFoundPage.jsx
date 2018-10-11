import React from 'react';

import Icon from '../components/Icon.jsx';

const NotFoundPage = () => (
  <div className="message-page">
    <Icon name="caution" className="sprite--lg" />
    <span className="title">Not found</span>
    <p>Sorry, but the page you were trying to view does not exist.</p>
  </div>
);

export default NotFoundPage;
