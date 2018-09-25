import { Tags } from './tags.js';

const mediasCountDenormalizer = {
  _updateTag(tag) {
    // Verificar o que acontece caso exista uma tag na lista que
    // não exista, verificar se ele retorna somente as existentes
    // ou se lança uma exception.
    const count = Tags.medias(tags).count();

    Tags.update(tag, { $set: { mediaCount: count } });
  },
  afterInsertMedias(tags) {
    tags.forEach((tag) => {
      this._updateTag(tag);
    });
  },
};

export default mediasCountDenormalizer;
