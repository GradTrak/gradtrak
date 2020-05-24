/**
 * The Tag class represents a tag on a certain {@link Course} that represents some aspect about the course and which
 * indicates that it can fulfill a certain {@link TagRequirement},.
 */
export class Tag {
  id: string;
  name: string;

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
