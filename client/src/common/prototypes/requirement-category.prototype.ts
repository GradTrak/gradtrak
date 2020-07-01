import { RequirementPrototype } from './requirement.prototype';
import { ConstraintPrototype } from './constraint.prototype';

export interface RequirementCategoryPrototype {
  name: string;
  requirements: RequirementPrototype[];
  constraints: ConstraintPrototype[];
}
