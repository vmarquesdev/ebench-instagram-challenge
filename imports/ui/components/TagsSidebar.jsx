import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import UploaderContainer from '../containers/UploaderContainer.jsx';

export default class TagsSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.searching = false;
    this.handleChange = this.handleChange.bind(this);
    // this.createTag = this.createTag.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value.trim() });
  }

  renderTags(tags, order) {
    // .sort((a, b) => b.name.indexOf('tra') - a.name.indexOf('tra'))

    // console.log(`${b.name} ${b.name.indexOf('tra') - a.name.indexOf('tra')}`);
    // return b.name.indexOf('tra') - a.name.indexOf('tra');
    //
    // const order = b.name.indexOf('tra') - a.name.indexOf('tra');
    //
    // if (!order)

    // if (a.name < b.name) return -1;
    // if (a.name > b.name) return 1;
    // return 0;

    if (order !== '') {
      tags.sort((a, b) => b.name.indexOf(order) - a.name.indexOf(order));
    } else {
      // Order by createdAt
    }

    const Tags = tags.map(tag => (
      <div key={tag._id}>
        Tag Name:
        {' '}
        <NavLink to={`/tags/${tag._id}`} key={tag._id}>
          {tag.name}
        </NavLink>
        <br />
        Update:
        {' '}
        {tag.updated ? 'Yes' : 'Updating...'}
        <br />
        Last Sync:
        {' '}
        {moment(tag.lastSync).format('MMMM Do YYYY, h:mm a') || 'Is the first Sync'}
        <br />
        API Medias Count:
        {' '}
        {tag.apiMediaCount}
        <br />
        Media Count:
        {' '}
        {tag.mediaCount}
        <br />
        Un Listed Media Count:
        {' '}
        {tag.unListedMediaCount}
        <br />
        Created At:
        {' '}
        {moment(tag.createdAt).format('MMMM Do YYYY, h:mm a')}
        <br />
        <br />
      </div>
    ));

    return Tags;
  }

  // createTag(event) {
  //   event.preventDefault();
  //   const input = this.newTagInput;
  //   if (input.value.trim()) {
  //     insert.call(
  //       {
  //         name: input.value,
  //       },
  //       displayError,
  //     );
  //     input.value = '';
  //   }
  // }

  render() {
    const { tags } = this.props;
    const { value } = this.state;

    const TagsSearch = (
      <div className="tags-search">
        <h3>Full Text Search:</h3>
        <div className="tags-search__container">
          <div className="tags-search__form">
            <form>
              <input
                type="search"
                onChange={this.handleChange}
                placeholder="Search or create tags"
              />
            </form>

            {this.searching ? <span className="tags-search__loading">Searching...</span> : ''}
          </div>

          {/* <div className="tags-search__instagram-list" /> */}
        </div>
      </div>
    );

    return (
      <div className="tags-sidebar">
        <div className="tags-sidebar__header">
          {TagsSearch}
          <UploaderContainer />
        </div>
        {/* <TagsSearch handleChange={this.handleChange} /> */}

        <div>
          <h3>Tags List:</h3>
          <div className="tag-list">{this.renderTags(tags, value)}</div>
        </div>
      </div>
    );
  }
}

TagsSidebar.propTypes = {
  tags: PropTypes.array,
};
