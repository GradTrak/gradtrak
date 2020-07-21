import { RequirementCategoryPrototype } from './requirement-category.prototype';
import { ConstraintPrototype } from './constraint.prototype';

export interface RequirementSetPrototype {
  id: string;
  name: string;
  parentId: string;
  type: string;
  requirementCategories: RequirementCategoryPrototype[];
  universalConstraints?: ConstraintPrototype[];
  selfConstraints?: ConstraintPrototype[];
}
