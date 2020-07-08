import { RequirementPrototype } from 'common/prototypes/requirement.prototype';
import { RequirementCategoryPrototype } from 'common/prototypes/requirement-category.prototype';
import { ConstraintPrototype } from 'common/prototypes/constraint.prototype';
import { Course } from './course.model';
import { Constraint, Requirement } from './requirement.model';
import { CourseRequirement } from './requirements/course-requirement.model';
import { MutexConstraint } from './constraints/mutex-constraint.model';
import { MultiRequirement } from './requirements/multi-requirement.model';
import { PolyRequirement } from './requirements/poly-requirement.model';
import { TagRequirement } from './requirements/tag-requirement.model';
import { UnitRequirement } from './requirements/unit-requirement.model';
import { Tag } from './tag.model';

/**
 * The RequirementCategory class describes a subset of a {@link RequirementSet} and composed of {@link Requirement}s
 * representing categories such as upper-division courses or breadth requirements of a college.
 */
export class RequirementCategory {
  name: string;
  requirements: Requirement[];
  constraints: Constraint[];

  constructor(name: string, requirements: Requirement[], constraints?: Constraint[]) {
    this.name = name;
    this.requirements = requirements;
    this.constraints = constraints || [];
  }

  static fromProto(
    proto: RequirementCategoryPrototype,
    coursesMap: Map<string, Course>,
    tagsMap: Map<string, Tag>,
  ): RequirementCategory {
    const requirements: Requirement[] = proto.requirements.map((reqProto: RequirementPrototype) =>
      RequirementCategory.reqFromProto(reqProto, coursesMap, tagsMap),
    );
    const reqMap: Map<string, Requirement> = new Map<string, Requirement>();

    const addReqToMap: (Requirement) => void = (req: Requirement) => {
      reqMap.set(req.id, req);
      // TODO Type guard
      if (req instanceof MultiRequirement) {
        req.requirements.forEach(addReqToMap);
      }
    };
    requirements.forEach(addReqToMap);

    const constraints: Constraint[] = proto.constraints
      ? proto.constraints.map((constraintProto: ConstraintPrototype) => {
          switch (constraintProto.type) {
            case 'mutex':
              return MutexConstraint.fromProto(constraintProto, reqMap);
            default:
              throw new Error(`Unknown constraint type: ${constraintProto.type}`);
          }
        })
      : [];

    return new RequirementCategory(proto.name, requirements, constraints);
  }

  /* This is placed here to avoid circular dependencies. */
  static reqFromProto(
    proto: RequirementPrototype,
    coursesMap: Map<string, Course>,
    tagsMap: Map<string, Tag>,
  ): Requirement {
    const protoClone: any = { ...proto }; // eslint-disable-line @typescript-eslint/no-explicit-any

    let requirement: Requirement;
    switch (protoClone.type) {
      case 'course': {
        protoClone.course = coursesMap.get(protoClone.courseId);
        if (!protoClone.course) {
          console.error(`No Course object found for course ID: ${protoClone.courseId}`);
        }
        delete protoClone.courseId;
        requirement = new CourseRequirement(protoClone);
        break;
      }

      case 'tag': {
        protoClone.tag = tagsMap.get(protoClone.tagId);
        if (!protoClone.tag) {
          console.error(`No Tag object found for tag ID: ${protoClone.tagId}`);
        }
        delete protoClone.tagId;
        requirement = new TagRequirement(protoClone);
        break;
      }

      case 'multi':
      case 'poly': {
        protoClone.requirements = protoClone.requirements.map((childReqProto: RequirementPrototype) =>
          RequirementCategory.reqFromProto(childReqProto, coursesMap, tagsMap),
        );
        switch (protoClone.type) {
          case 'multi':
            requirement = new MultiRequirement(protoClone);
            break;

          case 'poly':
            requirement = new PolyRequirement(protoClone);
            break;

          default:
            // Do nothing
            break;
        }
        break;
      }

      case 'unit': {
        protoClone.requirement = RequirementCategory.reqFromProto(protoClone.requirement, coursesMap, tagsMap);
        requirement = new UnitRequirement(protoClone);
        break;
      }

      default: {
        console.error(`Requirement ${protoClone.name} has unknown Requirement type: ${protoClone.type}`);
        break;
      }
    }

    const reqMap: Map<string, Requirement> = new Map<string, Requirement>();
    const addReqToMap: (Requirement) => void = (req: Requirement) => {
      reqMap.set(req.id, req);
      // TODO Type guard
      if (req instanceof MultiRequirement) {
        req.requirements.forEach(addReqToMap);
      }
    };
    addReqToMap(requirement);
    requirement.constraints = proto.constraints
      ? proto.constraints.map((constraintProto: ConstraintPrototype) => {
          switch (constraintProto.type) {
            case 'mutex':
              return MutexConstraint.fromProto(constraintProto, reqMap);
            default:
              throw new Error(`Unknown constraint type: ${constraintProto.type}`);
          }
        })
      : [];

    return requirement;
  }

  getConstraints(): Constraint[] {
    return this.constraints ? this.constraints : [];
  }
}
