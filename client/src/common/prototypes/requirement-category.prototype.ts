import { RequirementPrototype } from './requirement.prototype';

export interface RequirementCategoryPrototype {
  id: string;
  name: string;
  requirements: RequirementPrototype[];
}
