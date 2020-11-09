import { ConstraintPrototype } from './constraint.prototype';

type BaseRequirementPrototype = {
  id: string;
  name: string;
  constraints?: ConstraintPrototype[];
};

export type CourseRequirementPrototype = {
  type: 'course';
  courseId: string;
} & BaseRequirementPrototype;

export type TagRequirementPrototype = {
  type: 'tag';
  tagId: string;
} & BaseRequirementPrototype;

export type MultiRequirementPrototype = {
  type: 'multi';
  numRequired: number;
  hidden: boolean;
  requirements: RequirementPrototype[];
} & BaseRequirementPrototype;

export type PolyRequirementPrototype = {
  type: 'poly';
  numRequired: number;
  hidden: boolean;
  requirements: StandaloneRequirementPrototype[];
} & BaseRequirementPrototype;

export type UnitRequirementPrototype = {
  type: 'unit';
  numRequired: number;
  requirement: StandaloneRequirementPrototype;
} & BaseRequirementPrototype;

export type CountRequirementPrototype = {
  type: 'count';
  numRequired: number;
  requirement: StandaloneRequirementPrototype;
} & BaseRequirementPrototype;


export type StandaloneRequirementPrototype = CourseRequirementPrototype | TagRequirementPrototype;
export type RequirementPrototype =
  | CourseRequirementPrototype
  | MultiRequirementPrototype
  | PolyRequirementPrototype
  | TagRequirementPrototype
  | UnitRequirementPrototype
  | CountRequirementPrototype;
