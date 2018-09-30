import { Tags } from './tags.js';

const mediasCountDenormalizer = {
  _updateTag(tagName) {
    const tag = Tags.findOne({ name: tagName });

    if (tag) {
      const count = tag.medias().count();
      Tags.update(tag._id, { $set: { mediaCount: count } });
    }
  },
  afterInsertMedias(tags) {
    tags.forEach((tag) => {
      this._updateTag(tag);
    });
  },
};

export default mediasCountDenormalizer;
