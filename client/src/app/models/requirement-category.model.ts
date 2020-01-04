import { Requirement } from 'models/requirement.model';

/**
 * The RequirementCategory class describes a subset of a {@link RequirementSet} and composed of {@link Requirement}s
 * representing categories such as upper-division courses or breadth requirements of a college.
 */
export class RequirementCategory {
  id: string;
  name: string;
  requirements: Requirement[];
}
