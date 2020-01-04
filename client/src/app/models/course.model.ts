import { Tag } from 'models/tag.model';

/**
 * The Course class represents a course you can take in a {@link Semester} and that fulfills certain {@link Requirement}s.
 */
export class Course {
  id: string;
  dept: string;
  no: string;
  title: string;
  units: number;
  tags: Tag[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  toString(): string {
    return `${this.dept} ${this.no}`;
  }
}
