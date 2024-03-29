import { ConstraintPrototype } from '../../common/prototypes/constraint.prototype';
import { RequirementSetPrototype } from '../../common/prototypes/requirement-set.prototype';
import { RequirementCategory } from './requirement-category.model';
import { Constraint, Requirement } from './requirement.model';
import { MultiRequirement } from './requirements/multi-requirement.model';
import { MutexConstraint } from './constraints/mutex-constraint.model';
import { Course } from './course.model';
import { Tag } from './tag.model';

/**
 * The RequirementSet class represents a set of cohesive requirements composed of {@link RequirementCategory}s such as
 * the overarching requirements for a university or requirements for a specific major.
 */
export class RequirementSet {
  id: string;
  name: string;
  parent: RequirementSet | null;
  type: string;
  requirementCategories: RequirementCategory[];
  universalConstraints: Constraint[];
  selfConstraints: Constraint[];

  constructor(
    id: string,
    name: string,
    parent: RequirementSet | null,
    type: string,
    requirementCategories: RequirementCategory[],
    universalConstraints: Constraint[] = [],
    selfConstraints: Constraint[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.type = type;
    this.requirementCategories = requirementCategories;
    this.universalConstraints = universalConstraints;
    this.selfConstraints = selfConstraints;
  }

  static fromProto(
    proto: RequirementSetPrototype,
    reqSetMap: Map<string, RequirementSet>,
    coursesMap: Map<string, Course>,
    tagsMap: Map<string, Tag>,
  ): RequirementSet {
    let parent: RequirementSet | null;
    if (proto.parentId) {
      if (!reqSetMap.has(proto.parentId)) {
        console.error(`Parent RequirementSet not yet instantiated or nonexistent: ${proto.parentId}`);
        parent = null;
      } else {
        parent = reqSetMap.get(proto.parentId)!;
      }
    } else {
      parent = null;
    }

    const reqCategories = proto.requirementCategories.map((reqCategoryProto) =>
      RequirementCategory.fromProto(reqCategoryProto, coursesMap, tagsMap),
    );
    const reqMap = new Map<string, Requirement>();

    const addReqToMap = (req: Requirement): void => {
      reqMap.set(req.id, req);
      // TODO Type guard
      if (req instanceof MultiRequirement) {
        req.requirements.forEach(addReqToMap);
      }
    };
    reqCategories.flatMap((reqCategory) => reqCategory.requirements).forEach(addReqToMap);

    const universalConstraints = proto.universalConstraints
      ? proto.universalConstraints.map((universalConstraintProto: ConstraintPrototype) => {
          switch (universalConstraintProto.type) {
            case 'mutex':
              return MutexConstraint.fromProto(universalConstraintProto, reqMap);
            default:
              throw new Error(`Unknown constraint type: ${universalConstraintProto.type}`);
          }
        })
      : [];
    const selfConstraints = proto.selfConstraints
      ? proto.selfConstraints.map((selfConstraintProto) => {
          switch (selfConstraintProto.type) {
            case 'mutex':
              return MutexConstraint.fromProto(selfConstraintProto, reqMap);
            default:
              throw new Error(`Unknown constraint type: ${selfConstraintProto.type}`);
          }
        })
      : [];

    return new RequirementSet(
      proto.id,
      proto.name,
      parent,
      proto.type,
      reqCategories,
      universalConstraints,
      selfConstraints,
    );
  }

  getRequirements(): Requirement[] {
    return this.requirementCategories.flatMap((reqCategory) => reqCategory.requirements);
  }

  getConstraints(): Constraint[] {
    const selfConstraints = this.selfConstraints ? this.selfConstraints : [];
    const universalConstraints = this.universalConstraints ? this.universalConstraints : [];
    const constraints = [...selfConstraints, ...universalConstraints];
    let curr = this.parent;
    while (curr) {
      constraints.push(...(curr.universalConstraints ? curr.universalConstraints : []));
      curr = curr.parent;
    }
    return constraints;
  }
}
