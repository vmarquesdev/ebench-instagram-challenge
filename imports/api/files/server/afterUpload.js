import { _ } from 'meteor/underscore';
import { queues, TAG_RATE_LIMITER, INSERT_TAG } from '../../../worker/queues';

import { Files } from '../files.js';

const csv = require('fast-csv');

Files.on('afterUpload', function(_fileRef) {
  csv.fromPath(_fileRef.path).on('data', function(data) {
    const uniqData = _.uniq(data);

    for (let i = 0; i < uniqData.length; i += 1) {
      queues[TAG_RATE_LIMITER].add(
        {
          queue: INSERT_TAG,
          data: {
            tag: uniqData[i],
          },
        },
        { removeOnComplete: true },
      );
    }
  });
});
