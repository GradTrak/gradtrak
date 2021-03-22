import { RequirementPrototype } from '../../common/prototypes/requirement.prototype';
import { RequirementCategoryPrototype } from '../../common/prototypes/requirement-category.prototype';
import { Course } from './course.model';
import { Constraint, Requirement } from './requirement.model';
import { CourseRequirement } from './requirements/course-requirement.model';
import { MutexConstraint } from './constraints/mutex-constraint.model';
import { MultiRequirement } from './requirements/multi-requirement.model';
import { PolyRequirement } from './requirements/poly-requirement.model';
import { TagRequirement } from './requirements/tag-requirement.model';
import { UnitRequirement } from './requirements/unit-requirement.model';
import { CountRequirement } from './requirements/count-requirement.model';
import { RegexRequirement } from './requirements/regex-requirement.model';
import { StandaloneRequirement } from './requirements/standalone-requirement.model';
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
    const requirements = proto.requirements
      .map((reqProto) => {
        try {
          const req = RequirementCategory.reqFromProto(reqProto, coursesMap, tagsMap);
          return req;
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err.message);
          } else {
            console.error(err);
          }
          return undefined;
        }
      })
      .filter((req) => req) as Requirement[];
    const reqMap = new Map<string, Requirement>();

    const addReqToMap = (req: Requirement): void => {
      reqMap.set(req.id, req);
      // TODO Type guard
      if (req instanceof MultiRequirement) {
        req.requirements.forEach(addReqToMap);
      }
    };
    requirements.forEach(addReqToMap);

    const constraints = proto.constraints
      ? proto.constraints.map((constraintProto) => {
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
    let requirement: Requirement;
    switch (proto.type) {
      case 'course': {
        if (!coursesMap.has(proto.courseId)) {
          throw new Error(`No Course object found for course ID: ${proto.courseId}`);
        }
        const course = coursesMap.get(proto.courseId)!;
        requirement = new CourseRequirement(proto.id, proto.name, course);
        break;
      }

      case 'tag': {
        if (!tagsMap.has(proto.tagId)) {
          throw new Error(`No Tag object found for tag ID: ${proto.tagId}`);
        }
        const tag = tagsMap.get(proto.tagId)!;
        requirement = new TagRequirement(proto.id, proto.name, tag);
        break;
      }

      case 'multi': {
        const childReqs = proto.requirements.map((childReqProto) =>
          RequirementCategory.reqFromProto(childReqProto, coursesMap, tagsMap),
        );
        requirement = new MultiRequirement(proto.id, proto.name, childReqs, proto.numRequired, proto.hidden);
        break;
      }

      case 'poly': {
        const childReqs = proto.requirements
          .map((childReqProto) => RequirementCategory.reqFromProto(childReqProto, coursesMap, tagsMap))
          .filter((childReq) => {
            if (!(childReq instanceof StandaloneRequirement)) {
              throw new Error(`PolyRequirement ${proto.id} contains non-StandaloneRequirement`);
              return false;
            }
            return true;
          }) as StandaloneRequirement[];
        requirement = new PolyRequirement(proto.id, proto.name, childReqs, proto.numRequired, proto.hidden);
        break;
      }

      case 'unit': {
        const req = RequirementCategory.reqFromProto(proto.requirement, coursesMap, tagsMap);
        if (!(req instanceof StandaloneRequirement)) {
          throw new Error(`UnitRequirement ${proto.id} is based on non-StandaloneRequirement`);
        }
        requirement = new UnitRequirement(proto.id, proto.name, proto.units, req);
        break;
      }

      case 'count': {
        const req = RequirementCategory.reqFromProto(proto.requirement, coursesMap, tagsMap);
        if (!(req instanceof StandaloneRequirement)) {
          throw new Error(`CountRequirement ${proto.id} is based on non-StandaloneRequirement`);
        }
        requirement = new CountRequirement(proto.id, proto.name, proto.numRequired, req);
        break;
      }

      case 'regex': {
        const deptRegex = new RegExp(proto.deptRegex);
        const numberRegex = new RegExp(proto.numberRegex);
        requirement = new RegexRequirement(proto.id, proto.name, deptRegex, numberRegex);
        break;
      }

      default: {
        const unknownProto = proto as RequirementPrototype;
        throw new Error(`Requirement ${unknownProto.name} has unknown Requirement type: ${unknownProto.type}`);
        break;
      }
    }

    const reqMap = new Map<string, Requirement>();
    const addReqToMap = (req: Requirement): void => {
      reqMap.set(req.id, req);
      // TODO Type guard
      if (req instanceof MultiRequirement) {
        req.requirements.forEach(addReqToMap);
      }
    };
    addReqToMap(requirement);
    requirement.constraints = proto.constraints
      ? proto.constraints.map((constraintProto) => {
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
