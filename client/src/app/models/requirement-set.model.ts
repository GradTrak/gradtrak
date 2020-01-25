import { RequirementCategory } from 'models/requirement-category.model';

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

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
