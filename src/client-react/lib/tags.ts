import memoize from 'memoizee';

import { TagPrototype } from '../../common/prototypes/tag.prototype';
import { Tag } from '../models/tag.model';
import { get } from './utils';

namespace Tags {
  const API_TAG_ENDPOINT = '/api/tags';

  export const getTagsMap = memoize(
    async (): Promise<Map<string, Tag>> => {
      const res = await get(API_TAG_ENDPOINT);
      const data = (await res.json()) as TagPrototype[];
      const tagArr = data.map((tagProto) => Tag.fromProto(tagProto));
      return new Map<string, Tag>(tagArr.map((tag) => [tag.id, tag]));
    },
    { promise: true },
  );

  export const getTags = memoize(
    async (): Promise<Tag[]> => {
      const tagsMap = await getTagsMap();
      return Array.from(tagsMap.values());
    },
    { promise: true },
  );
}

export default Tags;
