import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export interface SingleRequirement extends Requirement {
  isFulfillableBy(course: Course): boolean;
}
