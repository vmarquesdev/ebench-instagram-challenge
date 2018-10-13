/* eslint-disable */
import React from 'react';

const Loading = () => (
  <span className="loading">
    <img src={`${Meteor.settings.public.HOST}/loading.gif`} alt="" />
  </span>
);

export default Loading;
