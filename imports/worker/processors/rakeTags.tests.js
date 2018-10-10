/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { _ } from 'meteor/underscore';

import rakeTags from './rakeTags.js';
import { queues, TAG_RATE_LIMITER, UPDATE_TAG_COUNT } from '../queues.js';

if (Meteor.isServer) {
  chai.use(sinonChai);

  describe('Worker | Processors: rakeTags', () => {
    let tags;
    let addJobStub;

    beforeEach(() => {
      addJobStub = sinon.stub(queues[TAG_RATE_LIMITER], 'add');
    });

    afterEach(() => {
      tags = [];
      addJobStub.restore();
    });

    it('it should not call TAG_RATE_LIMITER queue add if tags are empty', () => {
      tags = [];
      rakeTags(tags);
      expect(addJobStub).to.not.have.been.called;
    });

    it('should add the tag object in the TAG_RATE_LIMITER queue with correct args', () => {
      _.times(3, () => tags.push(addJobStub));

      rakeTags(tags);

      return expect(addJobStub).to.have.been.calledThrice.calledWith({
        queue: UPDATE_TAG_COUNT,
        data: {
          tag: addJobStub,
        },
      });
    });
  });
}
