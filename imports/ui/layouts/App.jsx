import React, { Component } from 'react';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Tags } from '../../api/tags/tags.js';
import Loading from '../components/Loading.jsx';
import RateLimiterStatus from '../components/RateLimiterStatus.jsx';
import TagsDashboard from '../components/TagsDashboard.jsx';
import TagsPageContainer from '../containers/TagsPageContainer.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends Component {
  static getDerivedStateFromProps(nextProps) {
    const newState = { defaultPath: null, redirectTo: null };
    if (!nextProps.loading) {
      const tag = Tags.findOne();
      newState.defaultPath = tag ? `/tags/${tag.name}` : '/tags';
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
    const { connected, tags, loading, rateLimitersStatus } = this.props; // eslint-disable-line
    const { showConnectionIssue } = this.state;

    return (
      <div className="wrapper">
        <a
          className="gh-ribbon"
          href="https://github.com/eBench/victor"
          target="_blank"
          aria-label="Fork me on GitHub"
          title="Fork me on GitHub"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 250 250" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
            <path
              d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              className="octo-arm"
            />
            <path
              d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              className="octo-body"
            />
          </svg>
        </a>

        {showConnectionIssue && !connected ? <ConnectionNotification /> : null}

        <div className="content">
          <TagsDashboard tags={tags} />

          <div className="content__side content__right">
            {rateLimitersStatus ? (
              <RateLimiterStatus
                tagsLimited={rateLimitersStatus.tagsLimited}
                mediasLimited={rateLimitersStatus.mediasLimited}
              />
            ) : (
              ''
            )}

            {loading ? (
              <Loading />
            ) : (
              <TransitionGroup id="medias-scroller" className="content__body">
                <CSSTransition key={location.key} classNames="fade" timeout={200}>
                  <Switch location={location}>
                    <Route exact path="/tags" />
                    <Route
                      path="/tags/:name"
                      render={({ match }) => <TagsPageContainer match={match} />}
                    />
                    <Route path="/*" render={() => <NotFoundPage />} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
          </div>
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
