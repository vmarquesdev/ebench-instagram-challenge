/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon.jsx';
import { Files } from '../../api/files/files.js';

export default class Uploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      uploading: [],
      inProgress: false,
    };

    this.uploadIt = this.uploadIt.bind(this);
  }

  uploadIt(e) {
    e.preventDefault();

    const self = this;

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];

      if (file) {
        if (file.type !== 'text/csv') {
          self.fileInput.value = '';
          // alert('Only upload CSV files.');

          return false;
        }

        const uploadInstance = Files.insert(
          {
            file,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            allowWebWorkers: true,
          },
          false,
        );

        self.setState({
          inProgress: true,
          uploading: uploadInstance,
        });

        uploadInstance.on('uploaded', () => {
          self.fileInput.value = '';

          self.setState({
            progress: 0,
            uploading: [],
            inProgress: false,
          });
        });

        // uploadInstance.on('error', (error) => {
        //   console.log(`Error during upload: ${error}`);
        // });

        uploadInstance.on('progress', progress => {
          self.setState({
            progress,
          });
        });

        uploadInstance.start();
      }
    }

    return true;
  }

  render() {
    const { inProgress } = this.state;

    return (
      <form className="form form-upload">
        <label className="button upload-button" htmlFor="fileInput">
          <input
            id="fileInput"
            className="hidden"
            type="file"
            disabled={inProgress}
            ref={c => {
              this.fileInput = c;
            }}
            onChange={this.uploadIt}
            required
          />
          <Icon name="upload" />
          CSV File
        </label>
      </form>
    );
  }
}

Uploader.propTypes = {
  docsReadyYet: PropTypes.bool,
  files: PropTypes.array,
};
