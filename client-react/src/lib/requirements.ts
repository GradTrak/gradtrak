import { RequirementSetPrototype } from 'common/prototypes/requirement-set.prototype';
import { RequirementSet } from '../models/requirement-set.model';
import Courses from './courses';
import Tags from './tags';

namespace Requirements {
  const REQUIREMENT_API_ENDPOINT = '/api/requirements';

  let requirementsMap: Map<string, RequirementSet> = null;

  async function fetchRequirementData(): Promise<Map<string, RequirementSet>> {
    const [res, coursesMap, tagsMap] = await Promise.all([
      fetch(REQUIREMENT_API_ENDPOINT),
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
  }

  export async function getRequirements(): Promise<RequirementSet[]> {
    if (!requirementsMap) {
      requirementsMap = await fetchRequirementData();
    }
    return Array.from(requirementsMap.values());
  }

  export async function getRequirementsMap(): Promise<Map<string, RequirementSet>> {
    if (!requirementsMap) {
      requirementsMap = await fetchRequirementData();
    }
    return requirementsMap;
  }
}

export default Requirements;
