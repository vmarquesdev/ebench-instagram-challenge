import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UploaderContainer from '../containers/UploaderContainer.jsx';

// import { displayError } from '../helpers/errors.js';

// import { insert } from '../../api/tags/methods.js';

// import TagsSearch from '../components/TagsSearch.jsx';

export default class TagPage extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.loading = false;
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
        {tag.name}
        <br />
        Update:
        {' '}
        {tag.updated ? 'Yes' : 'Updating...'}
        <br />
        Last Sync:
        {' '}
        {moment(tag.lastSync).format('MMMM Do YYYY, h:mm a') || 'Is the first Sync'}
        <br />
        Media Count:
        {' '}
        {tag.mediaCount}
        <br />
        Last Un Sync Media Count:
        {' '}
        {tag.lastUnScyncMediaCount}
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

            {this.loading ? <span className="tags-search__loading">Searching...</span> : ''}
          </div>

          {/* <div className="tags-search__instagram-list" /> */}
        </div>
      </div>
    );

    return (
      <div className="tag-page">
        <div className="left">
          <UploaderContainer />
          {TagsSearch}
          {/* <TagsSearch handleChange={this.handleChange} /> */}

          <div>
            <h3>Tags List:</h3>
            <div>{this.renderTags(tags, value)}</div>
          </div>
        </div>

        <div className="right" />
      </div>
    );
  }
}

TagPage.propTypes = {
  tags: PropTypes.array.isRequired,
};
