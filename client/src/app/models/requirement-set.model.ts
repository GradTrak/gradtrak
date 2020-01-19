import { RequirementCategoryPrototype } from 'common/prototypes/requirement-category.prototype';
import { RequirementSetPrototype } from 'common/prototypes/requirement-set.prototype';
import { RequirementCategory } from 'models/requirement-category.model';
import { Course } from 'models/course.model';
import { Tag } from 'models/tag.model';

/**
 * The RequirementSet class represents a set of cohesive requirements composed of {@link RequirementCategory}s such as
 * the overarching requirements for a university or requirements for a specific major.
 */
export class RequirementSet {
  id: string;
  name: string;
  parent: RequirementSet;
  type: string; // string id. either major, minor, other, or unselectable
  requirementCategories: RequirementCategory[];

  constructor(
    proto: RequirementSetPrototype,
    reqSetMap: Map<string, RequirementSet>,
    coursesMap: Map<string, Course>,
    tagsMap: Map<string, Tag>,
  ) {
    this.id = proto.id;
    this.name = proto.name;
    this.type = proto.type;
    this.requirementCategories = proto.requirementCategories.map(
      (reqCategoryProto: RequirementCategoryPrototype) =>
        new RequirementCategory(reqCategoryProto, coursesMap, tagsMap),
    );

    if (proto.parentId) {
      this.parent = reqSetMap.get(proto.parentId);
      if (!this.parent) {
        console.error(`Parent RequirementSet not yet instantiated or nonexistent: ${proto.parentId}`);
      }
    } else {
      this.parent = null;
    }
  }
}
