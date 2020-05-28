import { RequirementPrototype } from 'common/prototypes/requirement.prototype';
import { RequirementCategoryPrototype } from 'common/prototypes/requirement-category.prototype';
import { ConstraintPrototype } from 'common/prototypes/constraint.prototype';
import { Constraint } from './constraint.model';
import { Course } from './course.model';
import { Requirement } from './requirement.model';
import { PolyRequirement } from './requirements/poly-requirement.model';
import { CourseRequirement } from './requirements/course-requirement.model';
import { MutexConstraint } from './constraints/mutex-constraint.model';
import { MultiRequirement } from './requirements/multi-requirement.model';
import { MutexRequirement } from './requirements/mutex-requirement.model';
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
  universalConstraints: Constraint[];
  selfConstraints: Constraint[];

  constructor(proto: RequirementCategoryPrototype, coursesMap: Map<string, Course>, tagsMap: Map<string, Tag>) {
    this.name = proto.name;
    this.requirements = proto.requirements.map((reqProto: RequirementPrototype) =>
      RequirementCategory.getRequirementObjectFromPrototype(reqProto, coursesMap, tagsMap),
    );
    this.universalConstraints = proto.universalConstraints.map((universalConstraintProto: ConstraintPrototype) => {
      switch (universalConstraintProto.type) {
        case 'mutex':
          return new MutexConstraint(universalConstraintProto);
          break;
      }
    });
    this.selfConstraints = proto.selfConstraints.map((selfConstraintProto: ConstraintPrototype) => {
      switch (selfConstraintProto.type) {
        case 'mutex':
          return new MutexConstraint(selfConstraintProto);
          break;
      }
    });
  }

  private static getRequirementObjectFromPrototype(
    reqProto: RequirementPrototype,
    coursesMap: Map<string, Course>,
    tagsMap: Map<string, Tag>,
  ): Requirement {
    let requirement: any = { ...reqProto }; // eslint-disable-line @typescript-eslint/no-explicit-any

    switch (requirement.type) {
      case 'course': {
        requirement.course = coursesMap.get(requirement.courseId);
        if (!requirement.course) {
          console.error(`No Course object found for course ID: ${requirement.courseId}`);
        }
        delete requirement.courseId;
        requirement = new CourseRequirement(requirement);
        break;
      }

      case 'tag': {
        requirement.tag = tagsMap.get(requirement.tagId);
        if (!requirement.tag) {
          console.error(`No Tag object found for tag ID: ${requirement.tagId}`);
        }
        delete requirement.tagId;
        requirement = new TagRequirement(requirement);
        break;
      }

      case 'multi':
      case 'poly': {
        requirement.requirements = requirement.requirements.map((childReqProto: RequirementPrototype) =>
          RequirementCategory.getRequirementObjectFromPrototype(childReqProto, coursesMap, tagsMap),
        );
        switch (requirement.type) {
          case 'multi':
            requirement = new MultiRequirement(requirement);
            break;

          case 'poly':
            requirement = new PolyRequirement(requirement);
            break;

          default:
            // Do nothing
            break;
        }
        break;
      }

      case 'mutex': {
        requirement.requirements = requirement.requirements.map((childReqProto: RequirementPrototype) =>
          RequirementCategory.getRequirementObjectFromPrototype(childReqProto, coursesMap, tagsMap),
        );
        requirement = new MutexRequirement(requirement);
        break;
      }

      case 'unit': {
        requirement.requirement = RequirementCategory.getRequirementObjectFromPrototype(
          requirement.requirement,
          coursesMap,
          tagsMap,
        );
        requirement = new UnitRequirement(requirement);
        break;
      }

      default: {
        console.error(`Requirement ${requirement.name} has unknown Requirement type: ${requirement.type}`);
        break;
      }
    }

    return requirement;
  }
}
