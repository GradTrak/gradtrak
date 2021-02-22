import { BerkeleytimeData } from '../../common/prototypes/berkeleytime-data';
import { CoursePrototype } from '../../common/prototypes/course.prototype';
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
  private _equiv?: Course[];

  constructor(
    id: string,
    dept: string,
    no: string,
    title: string,
    units: number,
    berkeleytimeData: BerkeleytimeData,
    tags: Tag[],
  ) {
    this.id = id;
    this.dept = dept;
    this.no = no;
    this.title = title;
    this.units = units;
    this.berkeleytimeData = berkeleytimeData;
    this.tags = tags;
  }

  static fromProto(proto: CoursePrototype, tagMap: Map<string, Tag>): Course {
    return new Course(
      proto.id,
      proto.dept,
      proto.no,
      proto.title,
      proto.units,
      proto.berkeleytimeData,
      proto.tagIds.filter((tagId) => tagMap.has(tagId)).map((tagId) => tagMap.get(tagId)!),
    );
  }

  get equiv(): Course[] {
    if (!this._equiv) {
      throw new Error('Tried to get equivalent courses before initialized');
    }
    return this._equiv;
  }

  set equiv(equiv: Course[]) {
    if (this._equiv) {
      throw new Error('Tried to double-initialize equivalent courses');
    }
    this._equiv = equiv;
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
}
