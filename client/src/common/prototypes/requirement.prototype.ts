import { ConstraintPrototype } from './constraint.prototype';

export interface RequirementPrototype {
  id: string;
  type: string;
  name: string;
  universalConstraints: ConstraintPrototype[];
  selfConstraints: ConstraintPrototype[];
}
