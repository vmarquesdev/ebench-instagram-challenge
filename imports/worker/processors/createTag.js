import { HTTP } from 'meteor/http';
import {
  queues,
  TAG_RATE_LIMITER,
  MEDIAS_RATE_LIMITER,
  INSERT_TAG,
  UPDATE_TAG_MEDIAS,
} from '../queues';

import { Tags } from '../../api/tags/tags.js';

/* eslint-disable */
// Casos de uso para testar esse os métodos
// 1. Testar print do erro.
// 2. Testar default func
//     - Não deve chamar método http se a tag não existir.
//     - Deve chamar get HTTP se a tag não existir.
//     - Se a http retornar uma exceção deve chamar tag add e printerror.
//     - Se não retornar exeção deve chamar o método insertTag
// 2. Testar o método creatTag.
//      1. Se o returnedTag não tiver media count não retorna undefined
//      2. Fazer um try, catch da inserção da tag,
//          - Se inserir retornar a tag e verificar se ela foi adicionada a fila MEDIAS_RATE_LIMITER
//            com objeto igual está aqui.
//          - Verficar se foi adicionar a fila a TAG_RATE_LIMITER com objeto igual está aqui
// 3. Testar o método insertTag
//      1. Se não existe tag com esse nome retorna undefined
//      2. Se a requisição retornar error verificar se a tag é adicionada a fila TAG_RATE_LIMITER
//      3. Se a requisção der certo deve retornar a tag inserida.
/* eslint-enable */

const INSTAGRAM_API_ENDPOINT = 'http://localhost:9000/v1/tags/';
// const INSTAGRAM_API_ENDPOINT = 'https://api.instagram.com/v1/tags/';

const printError = (tag, error, errorType) => {
  /* eslint-disable no-alert, no-console */
  console.log(`TAG: ${tag}`);
  console.log({
    domain: `WARNING ${new Date().toString()}: worker.processors.INSERT_TAG.${errorType}`,
    error,
  });
  /* eslint-enable no-alert, no-console */
};

const insertTag = (tag, returnedTag) => {
  if (returnedTag.media_count) {
    try {
      Tags.insert({
        name: returnedTag.name,
        apiMediaCount: returnedTag.media_count,
      });

      queues[MEDIAS_RATE_LIMITER].add(
        {
          queue: UPDATE_TAG_MEDIAS,
          data: {
            tag: returnedTag.name,
          },
        },
        { removeOnComplete: true },
      );
    } catch (collectionInsertCatchError) {
      queues[TAG_RATE_LIMITER].add(
        {
          queue: INSERT_TAG,
          data: {
            tag,
          },
        },
        { removeOnComplete: true },
      );

      printError(tag, collectionInsertCatchError, 'collectionInsertCatchError');
    }
  }
};

export default (tag) => {
  if (!Tags.find({ name: tag }).count()) {
    try {
      const result = HTTP.call(
        'GET',
        `${INSTAGRAM_API_ENDPOINT}${tag}?&access_token=1354295816.448c75f.8f30fe849ead4e72b98f3b42a041826d`,
        {},
      );
      insertTag(tag, result.data.data);
    } catch (httpGetError) {
      queues[TAG_RATE_LIMITER].add(
        {
          queue: INSERT_TAG,
          data: {
            tag,
          },
        },
        { removeOnComplete: true },
      );

      printError(tag, httpGetError, 'httpGetError');
    }
  }
};
