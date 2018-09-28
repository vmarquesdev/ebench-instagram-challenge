import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class File extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { fileName, fileUrl, fileSize } = this.props;

    return (
      <div className="m-t-sm">
        <div className="row">
          <div className="col-md-12">
            <strong>{fileName}</strong>
            <div className="m-b-sm" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <a
              href={fileUrl}
              className="btn btn-outline btn-primary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </div>

          <div className="col-md-4">
            Size:
            {fileSize}
          </div>
        </div>
      </div>
    );
  }
}

File.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  fileUrl: PropTypes.string,
  fileId: PropTypes.string.isRequired,
};
