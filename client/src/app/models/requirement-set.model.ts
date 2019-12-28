import { RequirementCategory } from 'models/requirement-category.model';

export class RequirementSet {
  id: string;
  name: string;
  parent: RequirementSet;
  requirementCategories: RequirementCategory[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
