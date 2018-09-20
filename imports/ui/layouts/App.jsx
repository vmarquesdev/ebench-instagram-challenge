import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TagPage from '../pages/TagPage.jsx';

export default class App extends Component {
  render() {
    return <TagPage tags={this.props.tags} />;
  }
}

App.propTypes = {
  // server connection status
  connected: PropTypes.bool.isRequired,
  // subscription status
  loading: PropTypes.bool.isRequired,
  tags: PropTypes.array,
};

App.defaultProps = {
  tags: [],
};
