import { RequirementCategoryPrototype } from './requirement-category.prototype';

export interface RequirementSetPrototype {
  id: string;
  name: string;
  parentId: string;
  type: string;
  requirementCategories: RequirementCategoryPrototype[];
}
