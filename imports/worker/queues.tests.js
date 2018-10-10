/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';

import Queue from 'bull';
import { queues } from './queues';

if (Meteor.isServer) {
  describe('Woker | Queues', () => {
    describe('smoke tests', () => {
      let queuesNames;

      before(() => {
        queuesNames = [
          'TAG_RATE_LIMITER',
          'MEDIAS_RATE_LIMITER',
          'RAKE_TAGS',
          'INSERT_TAG',
          'UPDATE_TAG_COUNT',
          'UPDATE_TAG_MEDIAS',
        ];
      });

      it('should exists 6 queues', () => {
        expect(Object.keys(queues)).to.have.lengthOf(queuesNames.length);
      });

      it('it should all the constants inside the queues', () => {
        queuesNames.forEach(qN => expect(queues).to.have.property(qN));
      });

      it('all queues should only be queue instance', () => {
        queuesNames.forEach(qN => expect(queues[qN]).to.be.an.instanceof(Queue));
      });
    });

    describe('rate limits', () => {
      it('TAG_RATE_LIMITER should contain the limiter with duration of', () => {
        expect(queues.TAG_RATE_LIMITER.limiter.duration).to.equal(60 * 60 * 1000);
      });

      it('MEDIAS_RATE_LIMITER should contain the limiter with duration of', () => {
        expect(queues.MEDIAS_RATE_LIMITER.limiter.duration).to.equal(15 * 60 * 1000);
      });

      it('TAG_RATE_LIMITER should contain the limiter with max jobs of', () => {
        expect(queues.TAG_RATE_LIMITER.limiter.max).to.equal(450);
      });

      it('MEDIAS_RATE_LIMITER should contain the limiter with max jobs of', () => {
        expect(queues.MEDIAS_RATE_LIMITER.limiter.max).to.equal(38);
      });
    });
  });
}
