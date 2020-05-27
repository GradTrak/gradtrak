import { RequirementPrototype } from './requirement.prototype';
import { RequirementSetPrototype } from './requirement-set.prototype';
import { RequirementCategoryPrototype } from './requirement-category.prototype';

export interface ConstraintPrototype {
  requirements: Set<RequirementPrototype>;
  requirementSets: Set<RequirementSetPrototype>;
  requirementCategories: Set<RequirementCategoryPrototype>;
}
