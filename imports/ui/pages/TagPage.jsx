/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TagPage extends Component {
  render() {
    const { tag, tagExists, loading, medias } = this.props;

    // if (!tagExists) {
    //   return <NotFoundPage />;
    // }

    // const TagHeader = (
    //
    // );

    const TagHeader = <div className="tag-page__header">{tag.name}</div>;

    let Medias;
    if (!medias || !medias.length) {
      Medias = <span>This tag does not have medias yet</span>;
    } else {
      Medias = medias.map(media => (
        <div key={media._id} className="media-item">
          <div className="media-item__bg" style={{ backgroundImage: `url(${media.thumbUrl})` }} />
          <span className="media-item__date">
            {moment(media.createdAt).format('MMM Do YY, h:mm a')}
          </span>
        </div>
      ));
    }

    return (
      <div className="page tag-page">
        {TagHeader}

        <div className="tag-page__medias">
          {loading ? <span className="loading">Loading medias...</span> : Medias}
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
