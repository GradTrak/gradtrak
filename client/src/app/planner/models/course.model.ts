import { CoursePrototype } from 'common/prototypes/course.prototype';
import { Tag } from './tag.model';

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
  equivIds: string[];
  equiv: Course[];

  constructor(proto: CoursePrototype, tagMap: Map<string, Tag>) {
    this.id = proto.id;
    this.dept = proto.dept;
    this.no = proto.no;
    this.title = proto.title;
    this.units = proto.units;
    this.tags = proto.tagIds.map((tagId: string) => tagMap.get(tagId));
    this.equivIds = proto.equivIds;
    this.equiv = null;
  }

  getName(): string {
    return `${this.dept} ${this.no}`;
  }

  toString(): string {
    return `${this.getName()}: ${this.title}`;
  }

  getBareNumber(): number {
    return parseInt(this.no.replace(/[^\d]/g, ''), 10);
  }

  mapEquiv(map: Map<string, Course>): void {
    this.equiv = this.equivIds
      .filter((id: string) => {
        if (!map.has(id)) {
          console.error(`No equivalent course with ID ${id} found for course ${this.id}`);
          return false;
        }
        return true;
      })
      .map((id: string) => map.get(id));
  }
}
