import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Icon from './Icon.jsx';
import MediaView from './MediaView.jsx';

export default class Medias extends Component {
  constructor(props) {
    super(props);
    this.state = { showMediaView: false, mediaViewItem: null };
    this.showMediaView = this.showMediaView.bind(this);
    this.hideMediaView = this.hideMediaView.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.scroller = document.getElementById('medias-scroller');
    this.scroller.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.scroller.removeEventListener('scroll', this.handleScroll);
  }

  showMediaView(index) {
    this.setState({ showMediaView: true, mediaViewItem: this.props.medias[index] }); // eslint-disable-line
  }

  hideMediaView() {
    this.setState({ showMediaView: false, mediaViewItem: null });
  }

  handleScroll(e) {
    if (
      this.scroller.offsetHeight + 1 + e.target.scrollTop >= this.scroller.scrollHeight
      && !this.props.loading // eslint-disable-line
    ) {
      this.props.loadMoreMedias(); // eslint-disable-line
    }
  }

  render() {
    const { loading, medias, tagName } = this.props;
    const { showMediaView, mediaViewItem } = this.state;

    let MediasItems;
    /* eslint-disable */
    MediasItems = medias.map((media, index) => (
      <figure key={media._id} className="media-item">
        <a
          index={index}
          onClick={e => this.showMediaView(index)}
          className="media-item__img"
          style={{ backgroundImage: `url(${media.thumbUrl})` }}
        />
        <span className="media-item__date">
          {moment(media.createdAt).format('MMM Do YY, h:mm a')}
        </span>
      </figure>
    ));
    /* eslint-enable */

    if (!medias.length && !loading) {
      MediasItems = (
        <div className="message-page">
          <Icon name="pictures" className="sprite--lg" />
          <span className="title">There are no medias</span>
          <p>This tag does not have medias yet.</p>
        </div>
      );
    }

    return (
      <div>
        <ReactCSSTransitionGroup
          element="div"
          className="medias-panel__content"
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {mediaViewItem ? (
            <MediaView
              tagName={tagName}
              media={mediaViewItem}
              showMediaView={showMediaView}
              hideMediaView={this.hideMediaView}
            />
          ) : (
            ''
          )}
          {MediasItems}
        </ReactCSSTransitionGroup>
        {loading ? <div className="loader" /> : ''}
      </div>
    );
  }
}

Medias.propTypes = {
  loadMoreMedias: PropTypes.func.isRequired,
  tagName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  medias: PropTypes.array,
};

Medias.defaultProps = {
  medias: [],
};
