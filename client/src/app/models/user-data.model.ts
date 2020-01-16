import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';

export interface UserData {
  semesters: Semester[];
  goals: RequirementSet[];
}
