import { TagPrototype } from 'common/prototypes/tag.prototype';

/**
 * The Tag class represents a tag on a certain {@link Course} that represents some aspect about the course and which
 * indicates that it can fulfill a certain {@link TagRequirement},.
 */
export class Tag {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromProto(proto: TagPrototype): Tag {
    return new Tag(proto.id, proto.name);
  }
}
