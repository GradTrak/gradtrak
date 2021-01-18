import { BerkeleytimeData } from 'common/prototypes/berkeleytime-data';
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
  berkeleytimeData: BerkeleytimeData;
  tags: Tag[];
  equivIds: string[];
  equiv: Course[];

  constructor(
    id: string,
    dept: string,
    no: string,
    title: string,
    units: number,
    berkeleytimeData: BerkeleytimeData,
    tags?: Tag[],
    equivIds?: string[],
  ) {
    this.id = id;
    this.dept = dept;
    this.no = no;
    this.title = title;
    this.units = units;
    this.berkeleytimeData = berkeleytimeData;
    this.tags = tags;
    this.equivIds = equivIds;
    this.equiv = null;
  }

  static fromProto(proto: CoursePrototype, tagMap: Map<string, Tag>): Course {
    return new Course(
      proto.id,
      proto.dept,
      proto.no,
      proto.title,
      proto.units,
      proto.berkeleytimeData,
      proto.tagIds.map((tagId: string) => tagMap.get(tagId)),
      proto.equivIds,
    );
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
