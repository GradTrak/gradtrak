import { RequirementPrototype } from './requirement.prototype';
import { ConstraintPrototype } from './constraint.prototype';

export type RequirementCategoryPrototype = {
  name: string;
  requirements: RequirementPrototype[];
  constraints?: ConstraintPrototype[];
};
