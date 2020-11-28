import memoize from 'memoizee';

import { Course } from '../models/course.model';
import { CourseFulfillmentMethodType, FulfillmentMethodType, FulfillmentType } from '../models/fulfillment-type';
import { Constraint, Requirement } from '../models/requirement.model';
import { DoubleMajorConstraint } from '../models/constraints/double-major-constraint.model';
import { MajorMinorConstraint } from '../models/constraints/major-minor-constraint.model';
import { RequirementSet } from '../models/requirement-set.model';
import { RequirementCategory } from '../models/requirement-category.model';
import { CourseRequirement } from '../models/requirements/course-requirement.model';
import { MultiRequirement } from '../models/requirements/multi-requirement.model';
import { UnitRequirement } from '../models/requirements/unit-requirement.model';

export type ProcessedFulfillmentType = {
  status: FulfillmentType;
} & FulfillmentMethodType;

/**
 * Returns a map containing the requirement and any child requirement as keys,
 * mapped to the requirement-scope constraints that apply to them.
 *
 * @param {Requirement} req The requirement whose constraints to fetch.
 * @return {Map<Requirement, Constraints[]>} The map containing the requirement
 * and its potential children mapped to the requirement-scope constraints.
 */
function fetchReqConstraints(req: Requirement): Map<Requirement, Constraint[]> {
  const mapping: Map<Requirement, Constraint[]> = new Map<Requirement, Constraint[]>();
  mapping.set(req, req.getConstraints());

  // TODO Fix type guard for RequirementContainer
  if (req instanceof MultiRequirement) {
    req.requirements.forEach((childReq: Requirement) => {
      fetchReqConstraints(childReq).forEach((value: Constraint[], key: Requirement) => {
        mapping.set(key, [...req.getConstraints(), ...value]);
      });
    });
  }

  return mapping;
}

/**
 * Given an array of requirementSets, reqturn a list of constraints
 * which account for double major and minor overlap policies.
 */
export function generateOverlapConstraints(reqSets: RequirementSet[]): Map<RequirementSet, Constraint[]> {
  const ret = new Map<RequirementSet, Constraint[]>();
  for (let i = 0; i < reqSets.length; i++) {
    for (let j = i+1; j < reqSets.length; j++) {
      const reqSetA: RequirementSet = reqSets[i];
      const reqSetB: RequirementSet = reqSets[j];
      if (!ret.has(reqSetA)) {
        ret.set(reqSetA, []);
      }
      if (!ret.has(reqSetB)) {
        ret.set(reqSetB, []);
      }
      if (!(reqSetA.type === 'major' || reqSetB.type === 'major')) {
        // Overlap rules only defined for majors
        continue;
      } else if (reqSetA.type === 'major' && reqSetB.type === 'major') {
        const constraint = new DoubleMajorConstraint(reqSetA, reqSetB);
        ret.get(reqSetA).push(constraint);
        ret.get(reqSetB).push(constraint);
      } else if (reqSetA.type === 'minor' || reqSetB.type === 'minor') {
        const constraint = new MajorMinorConstraint(reqSetA, reqSetB);
        ret.get(reqSetA).push(constraint);
        ret.get(reqSetB).push(constraint);
      }
      // We don't support overlaps for things like certificates and whatnot for now.
    }
  }
  return new Map();
}
const reqIsFulfilledWithMapping = memoize(
  (req: Requirement, reqToCourseMapping: Map<Requirement, FulfillmentMethodType>) => {
    if (!reqToCourseMapping.has(req)) {
      return false;
    }

    const fulfillmentMethod: FulfillmentMethodType = reqToCourseMapping.get(req);

    if (fulfillmentMethod.method === 'manual') {
      return true;
    } else if (fulfillmentMethod.method === 'courses') {
      if (req instanceof MultiRequirement) {
        const childrenFulfilled: boolean[] = req.requirements.map((childReq: Requirement) =>
          reqIsFulfilledWithMapping(childReq, reqToCourseMapping),
        );
        const numFulfilled: number = childrenFulfilled.filter((childFulfilled: boolean) => childFulfilled).length;
        return numFulfilled >= req.numRequired;
      } else {
        return req.isFulfilledWith(Array.from(fulfillmentMethod.coursesUsed));
      }
    } else {
      /* Not reached. */
      throw new Error('Unknown fulfillment method type');
    }
  },
);

/**
 * Given a list of requirements and courses, recursively finds and returns an
 * array of every single reasonable possible way to arrange courses to the
 * different requirements.  Note that the time and space complexity of this
 * operation is Theta(N**M), where N is the number of courses and M is the
 * number of requirements. Will assume that base level course requirements are
 * fullfilled immediately, and always attempts to take the map with the highest
 * number of fullfilled requirements.
 *
 * In particular, each recursive call calculates all the possibilities from i
 * to the length of courses.
 *
 * @param {Requirement[]} reqs The complete list of requirements being looked
 * at.
 * @param {Map<Requirement, FulfillmentMethodType>} mapping A map of
 * requirements to courses that fulfill that requirement, used as a pruning
 * tool.
 * @param {boolean} root Whether root requirement pruning can be performed.
 * @param {number} i The current index for the requirement that's "on deck"
 * @param {number} numFulfilled The number of requirements that are fulfilled
 * with the given mapping.
 * @param {number} alpha The lower bound on how many requirements are fulfilled
 * for returned course mappings, used for efficient pruning.
 * @return {Map<Requirement, Set<Course>>[]} All possible ways of assigning
 * courses to requirements from i to the end.
 */
function getMappings(
  reqs: Requirement[],
  courses: Course[],
  constraints: Map<Requirement, Constraint[]>,
  manuallyFulfilled: Set<Requirement>,
  root: boolean = true,
  mapping: Map<Requirement, FulfillmentMethodType> = new Map<Requirement, FulfillmentMethodType>(),
  numFulfilled: number = 0,
  alpha: number = 0,
  i: number = 0,
): Map<Requirement, FulfillmentMethodType>[] {
  /* If, assuming all remaining requirements are fulfilled, we still aren't
   * able to reach alpha, or if we managed to fulfill every single requirement,
   * prune. */
  const numRemaining: number = reqs.length - i;
  if (numFulfilled + numRemaining < alpha || alpha === reqs.length) {
    return [
      new Map<Requirement, FulfillmentMethodType>(
        reqs.slice(i).map((req: Requirement) => [
          req,
          {
            method: 'courses',
            coursesUsed: new Set<Course>(),
          },
        ]),
      ),
    ];
  }

  /* Base case */
  if (reqs.length === i) {
    return [new Map<Requirement, FulfillmentMethodType>()];
  }

  const req: Requirement = reqs[i];
  /* If the requirement implements requirement-container, then we recursively
   * generate fullfillment status for each child requirement, adding it to the
   * current mappings and constantly pruning and checking for conflicts. Then
   * assume we use each mapping and continue to recurse through the remainder
   * of reqs. */
  /* We need to check RequirementContainers first because we always need to
   * process sub-requirements, even if the container itself is manually
   * fulfilled. */
  // TODO typeguard without violating abstraction
  if (req instanceof MultiRequirement) {
    /* Process the children requirements and add it to our current map. */
    const subMappings: Map<Requirement, FulfillmentMethodType>[] = getMappings(
      req.requirements,
      courses,
      constraints,
      manuallyFulfilled,
      root && req.numRequired === req.requirements.length,
      mapping,
    );
    /* Take each submap from the result from the requirements and assumes that
     * we are using it, setting the contents of the submap to mapping and using
     * it to find all the future possibilities */
    const finalMappings: Map<Requirement, FulfillmentMethodType>[] = subMappings.flatMap(
      (submap: Map<Requirement, FulfillmentMethodType>) => {
        const union: Set<Course> = new Set<Course>();
        submap.forEach((subReqFulfillment: FulfillmentMethodType) => {
          if (subReqFulfillment.method === 'courses') {
            subReqFulfillment.coursesUsed.forEach((course: Course) => {
              union.add(course);
            });
          }
        });
        submap.forEach((subReqCourses: FulfillmentMethodType, subReq: Requirement) => {
          mapping.set(subReq, subReqCourses);
        });
        mapping.set(req, {
          method: 'courses',
          coursesUsed: union,
        });
        /* Find the future mappings, with the assumption that we are using the
         * current submap */
        const rest: Map<Requirement, FulfillmentMethodType>[] = getMappings(
          reqs,
          courses,
          constraints,
          manuallyFulfilled,
          root,
          mapping,
          numFulfilled,
          alpha,
          i + 1,
        );
        submap.forEach((subReqCourses: FulfillmentMethodType, subReq: Requirement) => {
          /* Revert so that we can use the mapping later to prune properly */
          mapping.delete(subReq);
        });
        mapping.delete(req);
        /* Take the potential results and add the current combination */
        rest.forEach((restCombination: Map<Requirement, FulfillmentMethodType>) => {
          submap.forEach((subReqCourses: FulfillmentMethodType, subReq: Requirement) => {
            restCombination.set(subReq, subReqCourses);
          });
          restCombination.set(req, {
            method: 'courses',
            coursesUsed: union,
          });
        });
        return rest;
      },
    );
    return finalMappings;
  }

  let combinations: FulfillmentMethodType[];
  if (manuallyFulfilled.has(req)) {
    combinations = [
      {
        method: 'manual',
      },
    ];
  } else {
    /* The filter prunes the combination. Takes the course combinations of each
     * course, adds it to the current mapping, and then tests to see if the new
     * mapping is still valid with the constraint. */
    let courseCombinations: Set<Course>[] = req.getCourseCombinations(courses);
    /* Prune invalid mappings */
    courseCombinations = courseCombinations.filter((combination: Set<Course>) => {
      mapping.set(req, {
        method: 'courses',
        coursesUsed: combination,
      });
      const valid: boolean = constraints.get(req).every((constraint: Constraint) => constraint.isValidMapping(mapping));
      mapping.delete(req);
      return valid;
    });
    if (root) {
      /* Prune possibilities that don't fulfill a necessary course requirement
       * if we can */
      if (req instanceof CourseRequirement) {
        courseCombinations = courseCombinations.filter((combination: Set<Course>) => {
          return req.isFulfilledWith(Array.from(combination));
        });
        if (courseCombinations.length === 0) {
          courseCombinations = [new Set<Course>()];
        }
      }
      /* Prune unnecessary unit requirement possibilities if we can */
      if (req instanceof UnitRequirement) {
        // FIXME Fix unit requirement checking logic (prune courseCombinations where
        // removing a course would still be enough)
        const unitsPerCombination: Map<Set<Course>, number> = new Map<Set<Course>, number>();
        courseCombinations.forEach((combination: Set<Course>) => {
          unitsPerCombination.set(
            combination,
            Array.from(combination)
              .map((course: Course) => course.units)
              .reduce((accum: number, curr: number) => accum + curr, 0),
          );
        });
        const maxUnits: number = Math.max(...unitsPerCombination.values());
        let unitTarget: number;
        if (maxUnits >= req.units) {
          unitTarget = Math.min(
            ...Array.from(unitsPerCombination.values()).filter((unit: number) => unit >= req.units),
          );
        } else {
          unitTarget = maxUnits;
        }
        courseCombinations = courseCombinations.filter(
          (combination: Set<Course>) => unitsPerCombination.get(combination) === unitTarget,
        );
      }
    }

    combinations = courseCombinations.map((combination: Set<Course>) => ({
      method: 'courses',
      coursesUsed: combination,
    }));
  }

  /* For each possible combination of courses, which are to be used to fulfill
   * the requirement, take the list of possible mappings that are generated
   * from the recursive call, add the possible combination to each of those
   * possible mappings. */

  const finalMappings: Map<Requirement, FulfillmentMethodType>[] = [];
  let nextAlpha: number = alpha;

  combinations.forEach((combination: FulfillmentMethodType) => {
    const fulfillsReq: boolean =
      combination.method === 'manual' || req.isFulfilledWith(Array.from(combination.coursesUsed));
    const nextNumFulfilled: number = fulfillsReq ? numFulfilled + 1 : numFulfilled;

    /* Recurse */
    mapping.set(req, combination);
    const restMappings: Map<Requirement, FulfillmentMethodType>[] = getMappings(
      reqs,
      courses,
      constraints,
      manuallyFulfilled,
      root,
      mapping,
      nextNumFulfilled,
      nextAlpha,
      i + 1,
    );
    mapping.delete(req);

    /* Update alpha */
    nextAlpha = Math.max(
      nextAlpha,
      ...restMappings.map(
        (restMapping: Map<Requirement, FulfillmentMethodType>) =>
          nextNumFulfilled +
          Array.from(restMapping.keys()).filter((restReq: Requirement) =>
            reqIsFulfilledWithMapping(restReq, restMapping),
          ).length,
      ),
    );

    /* Edit resulting mappings to include current requirement */
    restMappings.forEach((restMapping: Map<Requirement, FulfillmentMethodType>) => {
      restMapping.set(req, combination);
    });

    finalMappings.push(...restMappings);
  });

  return finalMappings;
}

/**
 * Derives the fulfillment statuses of requirements from a mapping of
 * requirements to fulfillmentTypes (to take care of special cases for multi
 * requirements).
 *
 * @param {Requirement} req The requirement whose fulfillment status to derive.
 * @param {Map<Requirement, FulfillmentMethodType>[]} bestMappings The mappings
 * to be considered.
 * @param {Map<Requirement, ProcessedFulfillmentType>} fulfillment The map to which we
 * assign the derived fulfillment statuses.
 */
function deriveReqFulfillment(
  req: Requirement,
  bestMappings: Map<Requirement, FulfillmentMethodType>[],
  fulfillment: Map<Requirement, ProcessedFulfillmentType>,
): void {
  // TODO type guard
  if (fulfillment.has(req)) {
    return;
  }
  if (req instanceof MultiRequirement) {
    /* Handle MultiRequirements by recursing down its children */
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    deriveFulfillment(req.requirements, bestMappings, fulfillment);
    const childFulfillments: ProcessedFulfillmentType[] = req.requirements.map((childReq: Requirement) =>
      fulfillment.get(childReq),
    );
    const coursesUsed: Set<Course> = new Set<Course>();
    /* Union all courses used from children */
    childFulfillments.forEach((childFulfillment: ProcessedFulfillmentType) => {
      if (childFulfillment.method === 'courses') {
        childFulfillment.coursesUsed.forEach((course: Course) => {
          coursesUsed.add(course);
        });
      }
    });
    const numFulfilled: number = childFulfillments.filter(
      (childFulfillment: ProcessedFulfillmentType) => childFulfillment.status === 'fulfilled',
    ).length;
    const reqFulfillment: ProcessedFulfillmentType = {
      status: numFulfilled >= req.numRequired ? 'fulfilled' : 'unfulfilled',
      method: 'courses',
      coursesUsed,
    };
    fulfillment.set(req, reqFulfillment);
  } else {
    const chosenMapping: Map<Requirement, FulfillmentMethodType> = bestMappings[0];
    const fulfillmentMethod: FulfillmentMethodType = chosenMapping.get(req);
    let status: FulfillmentType;
    if (
      bestMappings.every((reqToCourseMapping: Map<Requirement, FulfillmentMethodType>) =>
        reqIsFulfilledWithMapping(req, reqToCourseMapping),
      )
    ) {
      /* Requirement is fulfilled */
      status = 'fulfilled';
    } else if (
      bestMappings.some((reqToCourseMapping: Map<Requirement, FulfillmentMethodType>) =>
        reqIsFulfilledWithMapping(req, reqToCourseMapping),
      )
    ) {
      /* Requirement is possibly fulfilled */
      status = 'possible';
    } else {
      /* Requirement is unfulfilled */
      status = 'unfulfilled';
    }
    fulfillment.set(req, {
      status,
      ...fulfillmentMethod,
    });
  }
}

/**
 * Derives the fulfillment statuses of requirements from a mapping of
 * requirements to possible course combinations and assigns them to the given
 * map.
 *
 * @param {Requirement} baseReqs The requirements that count towards overall
 * goal progress.
 * @param {Map<Requirement, FulfillmentMethodType>[]} mappings The possible
 * course mappings.
 * @param {Map<Requirement, ProcessedFulfillmentType} fulfillment The map to which we
 * assign the derived fulfillment statuses.
 */
function deriveFulfillment(
  baseReqs: Requirement[],
  reqToCourseMappings: Map<Requirement, FulfillmentMethodType>[],
  fulfillment: Map<Requirement, ProcessedFulfillmentType>,
): void {
  let bestMappings: Map<Requirement, FulfillmentMethodType>[] = reqToCourseMappings;

  /* Filter whichever mappings have the most fulfillment requirements */
  /* A mapping of each requirement-to-course map to the number of requirements
   * it fulfills */
  const mappingFulfillmentCounts: Map<Map<Requirement, FulfillmentMethodType>, number> = new Map<
    Map<Requirement, FulfillmentMethodType>,
    number
  >(
    reqToCourseMappings.map((reqToCourseMapping: Map<Requirement, FulfillmentMethodType>) => [
      reqToCourseMapping,
      baseReqs.filter((req: Requirement) => reqIsFulfilledWithMapping(req, reqToCourseMapping)).length,
    ]),
  );
  const maxFulfilled: number = Math.max(...mappingFulfillmentCounts.values());
  bestMappings = bestMappings.filter(
    (reqToCourseMapping: Map<Requirement, FulfillmentMethodType>) =>
      mappingFulfillmentCounts.get(reqToCourseMapping) === maxFulfilled,
  );

  /* Filter remaining mappings which use the most courses */
  /* A mapping of each requirement-to-course map to the number of courses used */
  const mappingCourseCounts: Map<Map<Requirement, FulfillmentMethodType>, number> = new Map<
    Map<Requirement, FulfillmentMethodType>,
    number
  >(
    bestMappings.map((reqToCourseMapping: Map<Requirement, FulfillmentMethodType>) => [
      reqToCourseMapping,
      new Set(
        Array.from(reqToCourseMapping.values())
          .filter((fulfillmentMethod: FulfillmentMethodType) => fulfillmentMethod.method === 'courses')
          .map((fulfillmentMethod: CourseFulfillmentMethodType) => Array.from(fulfillmentMethod.coursesUsed))
          .flat(),
      ).size,
    ]),
  );
  const maxCourses: number = Math.max(...mappingCourseCounts.values());
  bestMappings = bestMappings.filter(
    (reqToCourseMapping: Map<Requirement, FulfillmentMethodType>) =>
      mappingCourseCounts.get(reqToCourseMapping) === maxCourses,
  );

  baseReqs.forEach((req: Requirement) => {
    deriveReqFulfillment(req, bestMappings, fulfillment);
  });
}

/**
 * Returns a map containing each requirement as the key mapped to its
 * fulfillment status.
 *
 * @param {RequirementSet[]} reqSets The requirement sets being processed.
 * @param {Course[]} courses The courses used to fulfill requirements.
 * @param {Map<string, Set<string>>} manuallyFulfilled The map mapping
 * requirement set IDs to the IDs of manually fulfilled within those sets.
 * @return {Map<Requirement, ProcessedFulfillmentType>} The fulfillment statuses of
 * every requirement.
 */
export function processRequirements(
  reqSets: RequirementSet[],
  courses: Course[],
  manuallyFulfilled: Map<string, Set<string>>,
): Map<Requirement, ProcessedFulfillmentType> {
  /* Precompute applicable constraints */
  const constraints: Map<Requirement, Constraint[]> = new Map<Requirement, Constraint[]>();
  const MultiGoalConstraints = generateOverlapConstraints(reqSets);
  reqSets.forEach((reqSet: RequirementSet) => {
    const setConstraints: Constraint[] = reqSet.getConstraints();
    reqSet.requirementCategories.forEach((reqCategory: RequirementCategory) => {
      const categoryConstraints: Constraint[] = reqCategory.getConstraints();
      reqCategory.requirements.forEach((req: Requirement) => {
        const reqConstraints: Map<Requirement, Constraint[]> = fetchReqConstraints(req);
        reqConstraints.forEach((value: Constraint[], key: Requirement) => {
          constraints.set(key, [...setConstraints, ...categoryConstraints, ...value, ...MultiGoalConstraints.get(reqSet)]);
        });
      });
    });
  });

  /* Find Requirement instances of manually fulfillled reqs */
  const manualReqs: Set<Requirement> = new Set<Requirement>();
  reqSets.forEach((reqSet: RequirementSet) => {
    if (manuallyFulfilled.has(reqSet.id)) {
      const manualReqIds: Set<string> = manuallyFulfilled.get(reqSet.id);
      const addManualReq: (Requirement) => void = (req: Requirement) => {
        if (manualReqIds.has(req.id)) {
          manualReqs.add(req);
        }
        // TODO Type guard
        if (req instanceof MultiRequirement) {
          req.requirements.forEach(addManualReq);
        }
      };
      reqSet.getRequirements().forEach(addManualReq);
    }
  });

  const fulfillment: Map<Requirement, ProcessedFulfillmentType> = new Map();
  reqSets.forEach((reqSet: RequirementSet): void => {
    const setConstraints: Constraint[] = reqSet.getConstraints();
    if (setConstraints.length === 0) {
      /* If a set has no constraints, we can derive fulfillment at the level
       * of a category */
      reqSet.requirementCategories.forEach((reqCategory: RequirementCategory) => {
        const categoryConstraints: Constraint[] = reqCategory.getConstraints();
        if (categoryConstraints.length === 0) {
          /* If a category has no constraints, we can derive fulfillment at
           * the level of a requirement */
          reqCategory.requirements.forEach((req: Requirement) => {
            const reqMappings: Map<Requirement, FulfillmentMethodType>[] = getMappings(
              [req],
              courses,
              constraints,
              manualReqs,
            );
            deriveFulfillment([req], reqMappings, fulfillment);
          });
        } else {
          const categoryMappings: Map<Requirement, FulfillmentMethodType>[] = getMappings(
            reqCategory.requirements,
            courses,
            constraints,
            manualReqs,
          );
          deriveFulfillment(reqCategory.requirements, categoryMappings, fulfillment);
        }
      });
    } else {
      const setReqs: Requirement[] = reqSet.getRequirements();
      const setMappings: Map<Requirement, FulfillmentMethodType>[] = getMappings(
        setReqs,
        courses,
        constraints,
        manualReqs,
      );
      deriveFulfillment(setReqs, setMappings, fulfillment);
    }
  });
  manualReqs.forEach((req: Requirement) => {
    fulfillment.set(req, {
      status: 'fulfilled',
      method: 'manual',
    });
  });

  reqIsFulfilledWithMapping.clear();

  return fulfillment;
}
