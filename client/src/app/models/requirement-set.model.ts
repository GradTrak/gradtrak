import { RequirementCategory } from 'models/requirement-category.model';

export class RequirementSet {
  id: string;
  name: string;
  parent: RequirementSet;
  type: string; // string id. either major, minor, other, or unselectable
  requirementCategories: RequirementCategory[];
}
