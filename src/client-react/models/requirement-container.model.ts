import { Requirement } from './requirement.model';
/**
 * An interface for anything with multiple requirements in it.
 */
export interface RequirementContainer {
  requirements: Requirement[];
}
