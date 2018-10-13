/* eslint-env mocha */
/* eslint-disable */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { _ } from 'meteor/underscore';

import { HTTP } from 'meteor/http';
import { Tags } from '../../api/tags/tags.js';
import createTag from './createTag.js';
import { queues, TAG_RATE_LIMITER, UPDATE_TAG_COUNT } from '../queues.js';

if (Meteor.isServer) {
  chai.use(sinonChai);

  describe('Worker | Processors: createTag', () => {
    let tagStub;

    beforeEach(() => {
      resetDatabase();
      tagStub = sinon.stub(HTTP, 'call');
    });

    afterEach(() => {
      tagStub.restore();
    });

    it('should not call the http call method if the tag exist', () => {
      const tag = Factory.create('tag', { name: 'tag1' });
      createTag(tag.name);
      return expect(tagStub).to.not.have.been.called;
    });

    it('should call the http call method with correct args if the does not tag exist', () => {
      createTag('test2');
      return expect(tagStub).to.have.been.calledWithExactly(
        'GET',
        `${INSTAGRAM_API_ENDPOINT}test2?&access_token=1354295816.448c75f.8f30fe849ead4e72b98f3b42a041826d`,
        {},
      );
    });

    // it('it should call TAG_RATE_LIMITER queue add and printError if an exception is thrown', () => {
    //   const
    //
    //   createTag('test2');
    //   tagStub.throws(new Error());
    //
    //   return expect(tagStub).to.have.been.calledWith({
    //     queue: UPDATE_TAG_COUNT,
    //     data: {
    //       tag: addJobStub,
    //     },
    //   });
    // });
  });
}
