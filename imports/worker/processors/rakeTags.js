import { queues, TAG_RATE_LIMITER, UPDATE_TAG_COUNT } from '../queues';

/* eslint-disable */
// Casos de uso para testar esse método.
// 1. Se tags for null o método deve retornar undefined.
// 2. Preciso passar uma lista de tags como parametro, após a execução do método
//    preciso verificar se na fila TAG_RATE_LIMITER foi adicionada cada tag da forma como o objeto está montado aqui.
/* eslint-enable */

export default (tags) => {
  console.log('Init check tags');

  if (tags) {
    for (let i = 0; i < tags.length; i += 1) {
      queues[TAG_RATE_LIMITER].add({
        queue: UPDATE_TAG_COUNT,
        data: {
          tag: tags[i],
        },
      });
    }
  }
};
