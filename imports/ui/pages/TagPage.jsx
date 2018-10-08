import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '../components/Icon.jsx';

export default class TagPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showMediaView: false, mediaViewItem: null };
    this.showMediaView = this.showMediaView.bind(this);
    this.hideMediaView = this.hideMediaView.bind(this);
  }

  showMediaView(index) {
    this.setState({ showMediaView: true, mediaViewItem: this.props.medias[index] });
  }

  hideMediaView() {
    this.setState({ showMediaView: false });
  }

  render() {
    const { tag, loading, medias } = this.props;
    const { showMediaView } = this.state;
    let { mediaViewItem } = this.state;

    let Medias;
    let MediaView;

    if (!medias || !medias.length) {
      Medias = <span>This tag does not have medias yet</span>;
    } else {
      Medias = medias.map((media, index) => (
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

      mediaViewItem = mediaViewItem || medias[0];
      MediaView = (
        <div className={`media-view ${showMediaView ? ' media-view--show' : ''}`}>
          <div className="medias-panel__header">
            <button type="button" className="button" onClick={this.hideMediaView}>
              <Icon name="back" />
              <span>
                #
                {tag.name}
              </span>
            </button>
          </div>

          <div className="media-view__container">
            <div
              className="media-view__img"
              style={{ backgroundImage: `url(${mediaViewItem.thumbUrl})` }}
            />

            <div className="content__body">
              <div className="media-view__info">
                <span className="media__tags">
                  <strong>TAGS:</strong>
                  {' '}
                  {mediaViewItem.tags.map(tagName => tagName)}
                </span>
                <pre className="media__metadata">
                  {JSON.stringify(JSON.parse(mediaViewItem.metadata), null, 4)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {MediaView}

        <div className="medias-panel">
          <div className="medias-panel__header">
            <span>
              #
              {tag.name}
            </span>
          </div>

          <div className="medias-panel__content">
            {loading ? <span className="loading">Loading medias...</span> : Medias}
          </div>
        </div>
      </div>
    );
  }
}

TagPage.propTypes = {
  tag: PropTypes.object,
  medias: PropTypes.array,
  loading: PropTypes.bool,
  tagExists: PropTypes.bool,
};
