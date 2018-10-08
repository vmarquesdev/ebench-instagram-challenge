import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';

import { Files } from '../../api/files/files.js';
import File from './File.jsx';

export default class Uploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: [],
      progress: 0,
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
          alert('Only upload CSV files.');

          return false;
        }

        const uploadInstance = Files.insert(
          {
            file,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            allowWebWorkers: true, // If you see issues with uploads, change this to false
          },
          false,
        );

        self.setState({
          inProgress: true, // Show the progress bar now
          uploading: uploadInstance, // Keep track of this instance to use below
        });

        uploadInstance.on('uploaded', function() {
          self.fileInput.value = '';

          // Reset our state for the next file
          self.setState({
            uploading: [],
            progress: 0,
            inProgress: false,
          });
        });

        uploadInstance.on('error', function(error) {
          console.log(`Error during upload: ${error}`);
        });

        uploadInstance.on('progress', function(progress) {
          self.setState({
            progress,
          });
        });

        uploadInstance.start();
      }
    }

    return true;
  }

  showUploads() {
    const { uploading, progress } = this.state;

    if (!_.isEmpty(uploading)) {
      return (
        <div>
          {uploading.file.name}

          <div className="progress progress-bar-default">
            <div
              style={{ width: `${progress}%` }}
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={progress || 0}
              role="progressbar"
              className="progress-bar"
            >
              <span className="sr-only">
                {progress}
                % Complete (success)
              </span>
              <span>
                {progress}
                %
              </span>
            </div>
          </div>
        </div>
      );
    }

    return true;
  }

  render() {
    const { inProgress } = this.state;
    const { files, docsReadyYet } = this.props;

    if (files && docsReadyYet) {
      const fileCursors = files;

      const display = fileCursors.map((aFile) => {
        const link = Files.findOne({ _id: aFile._id }).link();

        return (
          <div key={`file${aFile._id}`}>
            <File fileName={aFile.name} fileUrl={link} fileId={aFile._id} fileSize={aFile.size} />
          </div>
        );
      });

      return (
        <div className="tags-upload">
          <div className="tags-upload__container">
            <div className="tags-upload__form">
              <form>
                <input
                  type="file"
                  id="fileinput"
                  disabled={inProgress}
                  ref={(c) => {
                    this.fileInput = c;
                  }}
                  onChange={this.uploadIt}
                />
              </form>
            </div>

            <div className="tags-upload__list">
              {this.showUploads()}
              {display}
            </div>
          </div>
        </div>
      );
    }
    return <div>Loading file list</div>;
  }
}

Uploader.propTypes = {
  docsReadyYet: PropTypes.bool,
  files: PropTypes.array,
};
