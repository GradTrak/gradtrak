import { TagPrototype } from 'common/prototypes/tag.prototype';
import { Tag } from '../models/tag.model';
import { get } from './utils';

namespace Tags {
  const API_TAG_ENDPOINT = '/api/tags';
  let tagsMap: Map<string, Tag> = null;

  async function fetchTagData(): Promise<Map<string, Tag>> {
    const res = await get(API_TAG_ENDPOINT);
    const data = (await res.json()) as TagPrototype[];
    const tagArr = data.map((tagProto) => Tag.fromProto(tagProto));
    return new Map<string, Tag>(tagArr.map((tag) => [tag.id, tag]));
  }

  export async function getTags(): Promise<Tag[]> {
    if (!tagsMap) {
      tagsMap = await fetchTagData();
    }
    return Array.from(tagsMap.values());
  }

  export async function getTagsMap(): Promise<Map<string, Tag>> {
    if (!tagsMap) {
      tagsMap = await fetchTagData();
    }
    return tagsMap;
  }
}

export default Tags;
