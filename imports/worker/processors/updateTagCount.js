import { HTTP } from 'meteor/http';

import { queues, MEDIAS_RATE_LIMITER, UPDATE_TAG_MEDIAS } from '../queues';

import { Tags } from '../../api/tags/tags.js';
import { Medias } from '../../api/medias/medias.js';

/* eslint-disable */
// Casos de uso para testar esse os métodos
// 1. Testar print do erro.
// 2. Testar o método creatTag.
//      1. Se o returnedTag não tiver media count não retorna nd.
//      2. Fazer um try, catch da inserção da tag,
//          - Se inserir retornar a tag e verificar se ela foi adicionada a fila MEDIAS_RATE_LIMITER,
//          - Se der error verifcar se foi printado o erro e se vou adicionar a tag para fila TAG_RATE_LIMITER.
// 3. Testar o método insertTag
//      1. Se não existe tag com esse nome não retorna nada
//      2. Se a requisição retornar error verificar se a tag é adicionada a fila TAG_RATE_LIMITER
//      3. Se a requisção der certo deve retornar a tag inserida.
/* eslint-enable */

// const INSTAGRAM_API_ENDPOINT = 'http://localhost:9000/v1/tags/';
const INSTAGRAM_API_ENDPOINT = 'https://api.instagram.com/v1/tags/';

const printError = (tag, error, errorType) => {
  /* eslint-disable no-alert, no-console */
  console.log(`TAG: ${tag}`);
  console.log({
    domain: `WARNING ${new Date().toString()}: worker.processors.UPDATE_TAG_COUNT.${errorType}`,
    error,
  });
  /* eslint-enable no-alert, no-console */
};

const updateTag = (tag, returnedTag) => {
  if (tag.mediaCount + tag.unListedMediaCount !== returnedTag.media_count) {
    try {
      Tags.update(tag._id, {
        $set: {
          updated: false,
          apiMediaCount: returnedTag.media_count,
        },
      });

      queues[MEDIAS_RATE_LIMITER].add(
        {
          queue: UPDATE_TAG_MEDIAS,
          data: {
            lastMediaId: Medias.findOne(
              { tags: tag.name },
              { sort: { createdAt: -1, limit: 1 }, fields: { instagramId: 1 } },
            ).instagramId,
            tag: tag.name,
          },
        },
        { removeOnComplete: true },
      );
    } catch (collectionUpdateCatchError) {
      printError(tag.name, collectionUpdateCatchError, 'collectionUpdateCatchError');
    }
  }
};

export default (tag) => {
  console.log('Checking counts...');

  try {
    const result = HTTP.call(
      'GET',
      `${INSTAGRAM_API_ENDPOINT}${
        tag.name
      }?&access_token=1354295816.448c75f.8f30fe849ead4e72b98f3b42a041826d`,
      {},
    );

    updateTag(tag, result.data.data);
  } catch (httpGetError) {
    printError(tag.name, httpGetError, 'httpGetError');
  }
};
