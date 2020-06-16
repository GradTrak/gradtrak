import { RequirementCategoryPrototype } from 'common/prototypes/requirement-category.prototype';
import { RequirementSetPrototype } from 'common/prototypes/requirement-set.prototype';
import { RequirementCategory } from './requirement-category.model';
import { Course } from './course.model';
import { Tag } from './tag.model';

/**
 * The RequirementSet class represents a set of cohesive requirements composed of {@link RequirementCategory}s such as
 * the overarching requirements for a university or requirements for a specific major.
 */
export class RequirementSet {
  id: string;
  name: string;
  parent: RequirementSet;
  type: string;
  requirementCategories: RequirementCategory[];

  constructor(
    id: string,
    name: string,
    parent: RequirementSet,
    type: string,
    requirementCategories: RequirementCategory[],
  ) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.type = type;
    this.requirementCategories = requirementCategories;
  }

  static fromProto(
    proto: RequirementSetPrototype,
    reqSetMap: Map<string, RequirementSet>,
    coursesMap: Map<string, Course>,
    tagsMap: Map<string, Tag>,
  ): RequirementSet {
    let parent: RequirementSet;
    if (proto.parentId) {
      parent = reqSetMap.get(proto.parentId);
      if (!parent) {
        console.error(`Parent RequirementSet not yet instantiated or nonexistent: ${proto.parentId}`);
      }
    } else {
      parent = null;
    }

    return new RequirementSet(
      proto.id,
      proto.name,
      parent,
      proto.type,
      proto.requirementCategories.map((reqCategoryProto: RequirementCategoryPrototype) =>
        RequirementCategory.fromProto(reqCategoryProto, coursesMap, tagsMap),
      ),
    );
  }
}
