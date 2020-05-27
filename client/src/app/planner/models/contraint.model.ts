import { ConstraintPrototype } from 'common/prototypes/constraint.prototype';
import { RequirementPrototype } from './requirement.prototype';
import { RequirementSetPrototype } from './requirement-set.prototype';
import { RequirementCategoryPrototype } from './requirement-category.prototype';

/**
 * The Constraint class represents contraintson a {@link Requirement}s or {@link Requirement-Set}s or {@link Requirement-Category}s.
 */
export class Constraint {
  requirements: Set<RequirementPrototype>;
  requirementSets: Set<RequirementSetPrototype>;
  requirementCategories: Set<RequirementCategoryPrototype>;

  constructor(proto: ConstraintPrototype) {
    this.requirements = proto.requirements;
    this.requirementSets = proto.requirementSets;
    this.requirementCategories = proto.requirementCategories;
  }

  getRequirement(): Set<RequirementPrototype> {
    return this.requirements;
  }

  isApplicable(candidate: Object): boolean {
    return (this.requirements.contains(candidate) ||
    this.requirementSets.contains(candidate)||
    this.requirementCategories.contains(candidate));
  }

  /**
  * Given a list of requirements, requirementSets, or requirementCategories
  * to which this constraint might apply, determines if the specific case given will
  */
  checkConstraint(course, requirement: Requirement, RequirementSet, or RequirementCategory, mapping): boolean {




    return
  }
}


/*
mapping {
  bioe: cs189, bio134, bioe133
  eecs: cs170, ...
}
course = cs189
'if mapping.bioe.includes(course){
  return calculateOverlap(bioe, eecs) > 5
}'

*/
