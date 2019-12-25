export class Course {
  id: string;
  dept: string;
  no: string;
  title: string;
  units: number;
  tags: string[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  toString(): string {
    return `${this.dept} ${this.no}`;
  }
}
