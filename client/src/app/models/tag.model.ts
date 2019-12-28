export class Tag {
  id: string;
  name: string;

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
