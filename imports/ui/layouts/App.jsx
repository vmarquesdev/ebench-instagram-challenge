import React, { Component } from 'react';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Tags } from '../../api/tags/tags.js';
import TagsSidebar from '../components/TagsSidebar.jsx';
import TagsPageContainer from '../containers/TagsPageContainer.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends Component {
  static getDerivedStateFromProps(nextProps) {
    const newState = { defaultPath: null, redirectTo: null };
    if (!nextProps.loading) {
      const tag = Tags.findOne();
      if (tag) {
        newState.defaultPath = `/tags/${tag._id}`;
      } else {
        newState.defaultPath = '/tags';
      }

      // newState.defaultPath = '/tags';
    }
    return newState;
  }

  constructor(props) {
    super(props);
    this.state = {
      showConnectionIssue: false,
      defaultPath: null,
      redirectTo: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  renderRedirect(location) {
    const { redirectTo, defaultPath } = this.state;
    const { pathname } = location;
    let redirect = null;
    if (redirectTo && redirectTo !== pathname) {
      redirect = <Redirect to={redirectTo} />;
    } else if (pathname === '/' && defaultPath) {
      redirect = <Redirect to={defaultPath} />;
    }
    return redirect;
  }

  renderContent(location) {
    const { connected, tags, loading } = this.props;

    const { showConnectionIssue } = this.state;

    return (
      <div className="wrapper">
        {showConnectionIssue && !connected ? (
          <span className="connection-issue">
            Trying to connect,
            <br />
            {' '}
There seems to be a connection issue
          </span>
        ) : null}

        <div className="sidebar">
          <TagsSidebar tags={tags} />
        </div>

        <div className="content">
          {loading ? (
            <span className="loading">Loading...</span>
          ) : (
            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={200}>
                <Switch location={location}>
                  <Route
                    path="/tags/:id"
                    render={({ match }) => <TagsPageContainer match={match} />}
                  />
                  {/* <Route path="/*" render={() => <NotFoundPage {...commonChildProps} />} /> */}
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <Route
          render={({ location }) => this.renderRedirect(location) || this.renderContent(location)}
        />
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  connected: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  tags: PropTypes.array,
};

App.defaultProps = {
  tags: [],
};
