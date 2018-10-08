import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon.jsx';
import UploaderContainer from '../containers/UploaderContainer.jsx';
import Tags from './Tags.jsx';

export default class TagsDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = { searchQuery: '' };
    this.tagsSearchHandleChange = this.tagsSearchHandleChange.bind(this);
  }

  tagsSearchHandleChange(e) {
    this.setState({ searchQuery: e.target.value.trim() });
  }

  renderTags(tags, searchQueryOrder) {
    let SyncTagsComponent;
    let SyncedTagsComponent;
    const syncTags = tags.filter(tag => !tag.updated);
    const syncedTags = tags.filter(tag => tag.updated);

    if (syncTags.length) {
      if (searchQueryOrder !== '') {
        syncTags.sort(
          (a, b) => b.name.indexOf(searchQueryOrder) - a.name.indexOf(searchQueryOrder),
        );
      }

      SyncTagsComponent = Tags({ synchronizing: true, tags: syncTags });
    }

    if (syncedTags.length) {
      if (searchQueryOrder !== '') {
        syncedTags.sort(
          (a, b) => b.name.indexOf(searchQueryOrder) - a.name.indexOf(searchQueryOrder),
        );
      }

      SyncedTagsComponent = Tags({ synchronizing: false, tags: syncedTags });
    }

    return (
      <div className="content__body">
        {SyncTagsComponent}
        {SyncedTagsComponent}
      </div>
    );
  }

  render() {
    const { tags } = this.props;
    const { searchQuery } = this.state;

    const TagsSearchForm = (
      <form className="form tags-search-form">
        <div className="form__input-group">
          <Icon name="search" />
          <input
            placeholder="Search for some tag ..."
            className="input"
            type="serach"
            onChange={this.tagsSearchHandleChange}
            name="search"
          />
        </div>
      </form>
    );

    return (
      <div className="content__side content__left">
        <div className="content__left__header">
          {TagsSearchForm}
          <UploaderContainer />
        </div>

        {this.renderTags(tags, searchQuery)}
      </div>
    );
  }
}

TagsDashboard.propTypes = {
  tags: PropTypes.array.isRequired,
};
