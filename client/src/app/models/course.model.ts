import { Tag } from 'models/tag.model';

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
