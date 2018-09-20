import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { displayError } from '../helpers/errors.js';

import { insert } from '../../api/tags/methods.js';

export default class TagPage extends Component {
  constructor(props) {
    super(props);
    this.createTag = this.createTag.bind(this);
  }

  createTag(event) {
    event.preventDefault();
    const input = this.newTagInput;
    if (input.value.trim()) {
      insert.call(
        {
          name: input.value,
        },
        displayError,
      );
      input.value = '';
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.createTag}>
          <input
            type="text"
            ref={(c) => {
              this.newTagInput = c;
            }}
            placeholder="New tag"
          />
        </form>
        <br />

        <div>{this.props.tags.map(tag => <div key={tag._id}>{tag.name}</div>)}</div>
      </div>
    );
  }
}

TagPage.propTypes = {
  tags: PropTypes.array,
};
