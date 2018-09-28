import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { displayError } from '../helpers/errors.js';

export default class TagsSearch extends Component {
  constructor(props) {
    super(props);
    this.loading = false;
  }

  render() {
    const { handleChange } = this.props;

    return (
      <div>
        <div className="tags-search">
          <h3>Full Text Search:</h3>
          <div className="tags-search__container">
            <div className="tags-search__form">
              <form>
                <input type="search" onChange={handleChange} placeholder="Search or create tags" />
              </form>

              {this.loading ? <span className="tags-search__loading">Searching...</span> : ''}
            </div>

            {/* <div className="tags-search__instagram-list" /> */}
          </div>
        </div>

        <div className="tags-upload">
          <h3>Upload Tags CSV List:</h3>
          <div className="tags-upload__container">
            <div className="tags-upload__form">
              <form />

              {this.loading ? <span className="tags-upload__loading">Searching...</span> : ''}
            </div>

            {/* <div className="tags-search__instagram-list" /> */}
          </div>
        </div>
      </div>
    );
  }
}

TagsSearch.propTypes = {
  handleChange: PropTypes.func.isRequired,
};
