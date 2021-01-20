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
    const requirements = proto.requirements.map((reqProto) =>
      RequirementCategory.reqFromProto(reqProto, coursesMap, tagsMap),
    );
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
    const protoClone: any = { ...proto }; // eslint-disable-line @typescript-eslint/no-explicit-any

    let requirement: Requirement;
    switch (proto.type) {
      case 'course': {
        protoClone.course = coursesMap.get(proto.courseId);
        if (!protoClone.course) {
          console.error(`No Course object found for course ID: ${proto.courseId}`);
        }
        delete protoClone.courseId;
        requirement = new CourseRequirement(protoClone);
        break;
      }

      case 'tag': {
        protoClone.tag = tagsMap.get(proto.tagId);
        if (!protoClone.tag) {
          console.error(`No Tag object found for tag ID: ${proto.tagId}`);
        }
        delete protoClone.tagId;
        requirement = new TagRequirement(protoClone);
        break;
      }

      case 'multi': {
        protoClone.requirements = proto.requirements.map((childReqProto) =>
          RequirementCategory.reqFromProto(childReqProto, coursesMap, tagsMap),
        );
        requirement = new MultiRequirement(protoClone);
        break;
      }

      case 'poly': {
        protoClone.requirements = proto.requirements.map((childReqProto) =>
          RequirementCategory.reqFromProto(childReqProto, coursesMap, tagsMap),
        );
        requirement = new PolyRequirement(protoClone);
        break;
      }

      case 'unit': {
        protoClone.requirement = RequirementCategory.reqFromProto(proto.requirement, coursesMap, tagsMap);
        requirement = new UnitRequirement(protoClone);
        break;
      }

      case 'count': {
        protoClone.requirement = RequirementCategory.reqFromProto(protoClone.requirement, coursesMap, tagsMap);
        requirement = new CountRequirement(protoClone);
        break;
      }

      case 'regex': {
        protoClone.deptRegex = new RegExp(proto.deptRegex);
        protoClone.numberRegex = new RegExp(proto.numberRegex);
        requirement = new RegexRequirement(protoClone);
        break;
      }

      default: {
        const unknownProto = proto as RequirementPrototype;
        console.error(`Requirement ${unknownProto.name} has unknown Requirement type: ${unknownProto.type}`);
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
