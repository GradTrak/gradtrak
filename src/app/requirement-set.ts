import { RequirementCategory } from './requirement-category';

export class RequirementSet {
  id: string;
  name: string;
  parent: RequirementSet;
  requirementCategories: RequirementCategory[];
}
