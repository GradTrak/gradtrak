import memoize from 'memoizee';

import { RequirementSetPrototype } from 'common/prototypes/requirement-set.prototype';
import { RequirementSet } from '../models/requirement-set.model';
import Courses from './courses';
import Tags from './tags';
import { get } from './utils';

namespace Requirements {
  const REQUIREMENT_API_ENDPOINT = '/api/requirements';

  let requirementsMap: Map<string, RequirementSet> = null;

  export const getRequirementsMap = memoize(
    async (): Promise<Map<string, RequirementSet>> => {
      const [res, coursesMap, tagsMap] = await Promise.all([
        get(REQUIREMENT_API_ENDPOINT),
        Courses.getCoursesMap(),
        Tags.getTagsMap(),
      ]);
      const data = (await res.json()) as RequirementSetPrototype[];

      const reqSetMap = new Map<string, RequirementSet>();

      let lastSize;
      while (reqSetMap.size < data.length) {
        lastSize = reqSetMap.size;

        // Only set prototypes whose parent IDs are contained within reqSetMap but not their own IDs
        const reqSetIds = [...reqSetMap.values()].map((reqSet: RequirementSet) => reqSet.id);
        data
          .filter(
            (reqSetProto: RequirementSetPrototype) =>
              !reqSetProto.parentId || reqSetIds.some((reqSetId: string) => reqSetId === reqSetProto.parentId),
          )
          .filter((reqSetProto: RequirementSetPrototype) => !reqSetIds.includes(reqSetProto.id))
          .map((reqSetProto: RequirementSetPrototype) =>
            RequirementSet.fromProto(reqSetProto, reqSetMap, coursesMap, tagsMap),
          )
          .forEach((reqSet: RequirementSet) => reqSetMap.set(reqSet.id, reqSet));

        // If size did not grow, we know there are orphans
        if (lastSize === reqSetMap.size) {
          let error = 'RequirementSets exist with orphaned parents:';
          const reqIds = [...reqSetMap.values()].map((reqSet: RequirementSet) => reqSet.id);
          data
            .filter((reqSetProto: RequirementSetPrototype) => !reqIds.includes(reqSetProto.id))
            .forEach((orphanProto: RequirementSetPrototype) => {
              error += `\n${orphanProto.id} with parent ${orphanProto.parentId}`;
            });
          console.error(error);
          break;
        }
      }

      return reqSetMap;
    },
    { promise: true },
  );

  export const getRequirements = memoize(
    async (): Promise<RequirementSet[]> => {
      const requirementsMap = await getRequirementsMap();
      return Array.from(requirementsMap.values());
    },
    { promise: true },
  );
}

export default Requirements;
