import { Requirement } from './requirement'

export class RequirementSet {
  id: string;
  name: string;
  parent: RequirementSet;
  requirements: Requirement[];
}
