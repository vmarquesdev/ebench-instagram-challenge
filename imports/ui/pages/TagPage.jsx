import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from '../components/Loading.jsx';
import Icon from '../components/Icon.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default class TagPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showMediaView: false, mediaViewItem: null };
    this.showMediaView = this.showMediaView.bind(this);
    this.hideMediaView = this.hideMediaView.bind(this);
  }

  showMediaView(index) {
    this.setState({ showMediaView: true, mediaViewItem: this.props.medias[index] }); // eslint-disable-line
  }

  hideMediaView() {
    this.setState({ showMediaView: false });
  }

  render() {
    const {
      tag, loading, medias, tagExists,
    } = this.props;
    const { showMediaView } = this.state;
    let { mediaViewItem } = this.state;

    let Medias;
    let MediaView;

    if (!tagExists) {
      return <NotFoundPage />;
    }

    if (!medias || !medias.length) {
      Medias = <span>This tag does not have medias yet</span>;
    } else {
      /* eslint-disable */
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
      /* eslint-enable */

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

            <div className="media-view__info">
              <span className="media__tags">
                <strong>METADATA</strong>
              </span>
              <textarea
                className="media__metadata"
                defaultValue={JSON.stringify(JSON.parse(mediaViewItem.metadata), null, 4)}
                disabled
              />
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

          <div className="medias-panel__content">{loading ? <Loading /> : Medias}</div>
        </div>
      </div>
    );
  }
}

TagPage.propTypes = {
  tagExists: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  medias: PropTypes.array,
  tag: PropTypes.object.isRequired,
};

TagPage.defaultProps = {
  medias: [],
};
