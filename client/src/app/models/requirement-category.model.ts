import { Requirement } from 'models/requirement.model';

export class RequirementCategory {
  id: string;
  name: string;
  requirements: Requirement[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
