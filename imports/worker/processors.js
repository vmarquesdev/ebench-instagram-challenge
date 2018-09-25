import { HTTP } from 'meteor/http';
import { queues, UPDATE_TAG_MEDIAS } from './queues';

import mediasCountDenormalizer from '../api/tags/mediasCountDenormalizer.js';
import { Medias } from '../api/medias/medias.js';

export const processorInitialisers = {
  [UPDATE_TAG_MEDIAS]: () => async (job) => {
    try {
      const endpoint = job.data.nextUrl || `http://localhost:9000/v1/tags/${job.data.tag}/media/recent`;
      const result = HTTP.call('GET', endpoint);
      const tags = [];

      // result.data.forEach((mediaMetadata) => {
      //   Medias.insert({ metadata: mediaMetadata });
      //
      //   // Verificar qual método para não adicionar tags repetidas.
      //   tags.pluck(mediaMetadata.tags);
      // });
      //
      // // Update tags mediasCount
      // mediasCountDenormalizer.afterInsertMedias(tags);
      //
      // if (result.pagination.next_url) {
      //   queues[UPDATE_TAG_MEDIAS].add({
      //     nextUrl: result.pagination.next_url,
      //     tag: doc.name,
      //   });
      // }
    } catch (e) {
      console.log(e);
    }
  },
};
