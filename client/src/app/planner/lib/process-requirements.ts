import memoize from 'memoizee';

import { Course } from '../models/course.model';
import { FulfillmentType} from '../models/fulfillment-type.model';
import { Constraint, Requirement } from '../models/requirement.model';
import { RequirementSet } from '../models/requirement-set.model';
import { RequirementCategory } from '../models/requirement-category.model';
import { CourseRequirement } from '../models/requirements/course-requirement.model';
import { MultiRequirement } from '../models/requirements/multi-requirement.model';
import { UnitRequirement } from '../models/requirements/unit-requirement.model';
import { CountRequirement } from '../models/requirements/count-requirement.model';

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

const reqIsFulfilledWithMapping = memoize(
  (req: Requirement, reqToCourseMapping: Map<Requirement, Set<Course> | boolean>) => {
    if (!reqToCourseMapping.has(req)) {
      return false;
    }

    const courses: Set<Course> | boolean = reqToCourseMapping.get(req);

    if (typeof courses === 'boolean') {
      return courses;
    }

    if (!(req instanceof MultiRequirement)) {
      return req.isFulfilledWith(Array.from(courses));
    }

    const childrenFulfilled: boolean[] = req.requirements.map((childReq: Requirement) =>
      reqIsFulfilledWithMapping(childReq, reqToCourseMapping),
    );
    const numFulfilled: number = childrenFulfilled.filter((childFulfilled: boolean) => childFulfilled).length;
    return numFulfilled >= req.numRequired;
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
 * @param {Map<Requirement, Set<Course> | boolean>} mapping A map of
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
  mapping: Map<Requirement, Set<Course> | boolean> = new Map<Requirement, Set<Course> | boolean>(),
  numFulfilled: number = 0,
  alpha: number = 0,
  i: number = 0,
): Map<Requirement, Set<Course> | boolean>[] {
  /* If, assuming all remaining requirements are fulfilled, we still aren't
   * able to reach alpha, or if we managed to fulfill every single requirement,
   * prune. */
  const numRemaining: number = reqs.length - i;
  if (numFulfilled + numRemaining < alpha || alpha === reqs.length) {
    return [
      new Map<Requirement, Set<Course> | boolean>(reqs.slice(i).map((req: Requirement) => [req, new Set<Course>()])),
    ];
  }

  /* Base case */
  if (reqs.length === i) {
    return [new Map<Requirement, Set<Course> | boolean>()];
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
    const subMappings: Map<Requirement, Set<Course> | boolean>[] = getMappings(
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
    const finalMappings: Map<Requirement, Set<Course> | boolean>[] = subMappings.flatMap(
      (submap: Map<Requirement, Set<Course> | boolean>) => {
        const union: Set<Course> = new Set<Course>();
        submap.forEach((subReqCourses: Set<Course> | boolean) => {
          if (typeof subReqCourses === 'boolean') {
            return;
          }
          subReqCourses.forEach((course: Course) => {
            union.add(course);
          });
        });
        submap.forEach((subReqCourses: Set<Course> | boolean, subReq: Requirement) => {
          mapping.set(subReq, subReqCourses);
        });
        mapping.set(req, union);
        /* Find the future mappings, with the assumption that we are using the
         * current submap */
        const rest: Map<Requirement, Set<Course> | boolean>[] = getMappings(
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
        submap.forEach((subReqCourses: Set<Course> | boolean, subReq: Requirement) => {
          /* Revert so that we can use the mapping later to prune properly */
          mapping.delete(subReq);
        });
        mapping.delete(req);
        /* Take the potential results and add the current combination */
        rest.forEach((restCombination: Map<Requirement, Set<Course> | boolean>) => {
          submap.forEach((subReqCourses: Set<Course> | boolean, subReq: Requirement) => {
            restCombination.set(subReq, subReqCourses);
          });
          restCombination.set(req, union);
        });
        return rest;
      },
    );
    return finalMappings;
  }

  let combinations: (Set<Course> | boolean)[];
  if (manuallyFulfilled.has(req)) {
    combinations = [true];
  } else {
    /* The filter prunes the combination. Takes the course combinations of each
     * course, adds it to the current mapping, and then tests to see if the new
     * mapping is still valid with the constraint. */
    combinations = req.getCourseCombinations(courses);
    /* Prune invalid mappings */
    combinations = combinations.filter((combination: Set<Course>) => {
      mapping.set(req, combination);
      const valid: boolean = constraints.get(req).every((constraint: Constraint) => constraint.isValidMapping(mapping));
      mapping.delete(req);
      return valid;
    });
    if (root) {
      /* Prune possibilities that don't fulfill a necessary course requirement
       * if we can */
      if (req instanceof CourseRequirement) {
        combinations = combinations.filter((combination: Set<Course>) => {
          return req.isFulfilledWith(Array.from(combination));
        });
        if (combinations.length === 0) {
          combinations = [new Set<Course>()];
        }
      }
      /* Prune unnecessary unit requirement possibilities if we can */
      if (req instanceof UnitRequirement) {
        // FIXME Fix unit requirement checking logic (prune combinations where
        // removing a course would still be enough)
        const unitsPerCombination: Map<Set<Course>, number> = new Map<Set<Course>, number>();
        combinations.forEach((combination: Set<Course>) => {
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
        combinations = combinations.filter(
          (combination: Set<Course>) => unitsPerCombination.get(combination) === unitTarget,
        );
      }
    }
  }

  /* For each possible combination of courses, which are to be used to fulfill
   * the requirement, take the list of possible mappings that are generated
   * from the recursive call, add the possible combination to each of those
   * possible mappings. */

  const finalMappings: Map<Requirement, Set<Course> | boolean>[] = [];
  let nextAlpha: number = alpha;

  combinations.forEach((combination: Set<Course> | boolean) => {
    const fulfillsReq: boolean =
      typeof combination === 'boolean' ? combination : req.isFulfilledWith(Array.from(combination));
    const nextNumFulfilled: number = fulfillsReq ? numFulfilled + 1 : numFulfilled;

    /* Recurse */
    mapping.set(req, combination);
    const restMappings: Map<Requirement, Set<Course> | boolean>[] = getMappings(
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
        (restMapping: Map<Requirement, Set<Course> | boolean>) =>
          nextNumFulfilled +
          Array.from(restMapping.keys()).filter((restReq: Requirement) =>
            reqIsFulfilledWithMapping(restReq, restMapping),
          ).length,
      ),
    );

    /* Edit resulting mappings to include current requirement */
    restMappings.forEach((restMapping: Map<Requirement, Set<Course> | boolean>) => {
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
 * @param {Map<Requirement, Set<Course> | boolean>[]} bestMappings The mappings
 * to be considered.
 * @param {Map<Requirement, FulfillmentType>} fulfillment The map to which we
 * assign the derived fulfillment statuses.
 */
function deriveReqFulfillment(
  req: Requirement,
  bestMappings: Map<Requirement, Set<Course> | boolean>[],
  fulfillments: Map<Requirement, FulfillmentType>,
): void {
  // TODO type guard
  if (fulfillments.get(req).reqFulfillment) {
    return;
  }
  if (req instanceof MultiRequirement) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const optimalMapping = findOptimalMapping(req.requirements, bestMappings);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    processOptimalMapping(req.requirements, optimalMapping, fulfillments);
    const childFulfillments: FulfillmentType[] = req.requirements.map((childReq: Requirement) =>
      fulfillments.get(childReq),
    );
    const numFulfilled: number = childFulfillments.filter(
      (childFulfillment: FulfillmentType) => childFulfillment.reqFulfillment === 'fulfilled',
    ).length;
    // note: this assumes that requirements with child reqs are not course pool
    // Requirements, which are set to null.
    const fulfillment: FulfillmentType = {
      reqFulfillment: numFulfilled >= req.numRequired ? 'fulfilled' : 'unfulfilled', 
    }
    fulfillments.set(req, fulfillment);
  } else if (
    bestMappings.every((reqToCourseMapping: Map<Requirement, Set<Course> | boolean>) =>
      reqIsFulfilledWithMapping(req, reqToCourseMapping),
    )
  ) {
    // All of these assume that there is already an object as the fulfillmenttype!
    fulfillments.get(req).reqFulfillment = 'fulfilled';
  } else if (
    bestMappings.some((reqToCourseMapping: Map<Requirement, Set<Course> | boolean>) =>
      reqIsFulfilledWithMapping(req, reqToCourseMapping),
    )
  ) {
    fulfillments.get(req).reqFulfillment = 'possible';
  } else {
    fulfillments.get(req).reqFulfillment = 'unfulfilled';
  }
}
/**
 * Removes suboptimal course assignments and returns the best
 * available possible req to course mappings, as determined by 
 * the number of requirements fulfilled.
 * 
 * @param {Requirement} baseReqs The requirements that count towards overall
 * goal progress.
 * @param {Map<Requirement, Set<Course> | boolean>[]} mappings The possible
 * course mappings.
 * @return {Map<Requirement, Set<Course> | boolean>[]} mappings The 
 * non-suboptimal mappings which should be considered.
 */
function findOptimalMapping(
  baseReqs: Requirement[],
  reqToCourseMappings: Map<Requirement, Set<Course> | boolean>[],
): Map<Requirement, Set<Course> | boolean>[] {
  /* A mapping of each requirement-to-course map to the number of requirements
   * it fulfills */
  const mappingFulfillmentCounts: Map<Map<Requirement, Set<Course> | boolean>, number> = new Map<
    Map<Requirement, Set<Course> | boolean>,
    number
  >(
    reqToCourseMappings.map((reqToCourseMapping: Map<Requirement, Set<Course> | boolean>) => [
      reqToCourseMapping,
      baseReqs.filter((req: Requirement) => reqIsFulfilledWithMapping(req, reqToCourseMapping)).length,
    ]),
  );
  const maxFulfilled: number = Math.max(...mappingFulfillmentCounts.values());
  const maxMappings: Map<Requirement, Set<Course> | boolean>[] = reqToCourseMappings.filter(
    (reqToCourseMapping: Map<Requirement, Set<Course> | boolean>) =>
      mappingFulfillmentCounts.get(reqToCourseMapping) === maxFulfilled,
  );
   return maxMappings;
}


/**
 * Removes a requirement from a fulfillment map and 
 * returns a copy of the map without booleans
 * @param {Map<Requirement, Set<Course>|boolean} withBool the mapping 
 * with booleans to be removed. 
 * @return {Map<Requirement, Set<Course>} the mapping without the booleans or 
 * the requirements they were linked to. 
 */
function filterBooleanFromMapping(withBool: Map<Requirement, Set<Course>|boolean>) {
  const ret = new Map<Requirement, Set<Course>>();
  withBool.forEach((value: Set<Course>|boolean, key: Requirement) => {
    if (typeof value === 'boolean') {
      return;
    }
    ret.set(key, value);
  });
  return ret;
}

/**
 * Filters requirements into a list of "course pool" requirements, such as unit or 
 * count, and populates the course pool fulfillment with an array of a set of 
 * courses, for each possible combination.
 * @param {Requirement[]} reqs A list of course pool requirements. This does get filtered, though.
 * @param {Map<Requirement, boolean|Set<Course>>[]} reqToCourseMappings All the "good" possible assignments of 
 * course to each requirement. 
 * @param {Map<Requirement, FulfillmentType} The fulfillmentType to which we update the 
 * possible course fulfillments for a coursePool Requirement.
 */
function coursePoolReqFulfillments (reqs: Requirement[], reqToCourseMappings: Map<Requirement, Set<Course>>[], fulfillments: Map<Requirement, FulfillmentType>): void {
   const coursePoolReqs: Requirement[] = reqs.filter((requirement) => {
      return requirement instanceof UnitRequirement || requirement instanceof CountRequirement;
      // There are isUnit and isCount functions but they remain in requirement. Possibly move to Utils?
      // isCoursePool is probably useful too.
    });

  reqs.forEach((req: Requirement) => {
      fulfillments.get(req).courseFulfillment = [];
  });
  reqToCourseMappings.forEach((reqToCourseMapping: Map<Requirement, Set<Course>>): void => {
    reqs.forEach((req: Requirement): void => {
      // Save every possible combination of Set of courses that we've found so far into fulfillments.
      fulfillments.get(req).courseFulfillment.push(reqToCourseMapping.get(req));
    });
  })
}

/**
 * Handles the optimal mapping by identifying 
 * requirement fulfillment status and identifying course pool
 * fulfillment statuses. Wrapper for multiple other functions
 * which do the heavy-duty processing. 
 *
 * @param {Requirement[]} reqs A list of requirements in consideration.
 * @param {Map<Requirement, Set<Course> | boolean>>[]} optimalMapping
 * @param {Map<Requirement, FulfillmentType>} the map which will be written to
 * The ideal mapping for which the other functions can be executed as
 */
function processOptimalMapping(reqs: Requirement[], optimalMapping: Map<Requirement, Set<Course> | boolean>[], fulfillments: Map<Requirement, FulfillmentType>): void {
  reqs.forEach((req: Requirement) => {
    fulfillments.set(req, fulfillments.get(req) || {reqFulfillment: null});
    deriveReqFulfillment(req, optimalMapping, fulfillments);
  })
  coursePoolReqFulfillments(reqs, optimalMapping.map(filterBooleanFromMapping), fulfillments)
}

/**
 * Returns a map containing each requirement as the key mapped to its
 * fulfillment status and writes to COUNTUNITMAPPING the status of 
 * in how it fulfills the requirement.
 *
 * @param {RequirementSet[]} reqSets The requirement sets being processed.
 * @param {Course[]} courses The courses used to fulfill requirements.
 * @param {Map<string, Set<string>>} manuallyFulfilled The map mapping
 * requirement set IDs to the IDs of manually fulfilled within those sets.
 * @return {Map<Requirement, FulfillmentType>} The fulfillment statuses of
 * every requirement.
 */
export function processRequirements(
  reqSets: RequirementSet[],
  courses: Course[],
  manuallyFulfilled: Map<string, Set<string>>,
): Map<Requirement, FulfillmentType> {
  /* Precompute applicable constraints */
  const constraints: Map<Requirement, Constraint[]> = new Map<Requirement, Constraint[]>();
  reqSets.forEach((reqSet: RequirementSet) => {
    const setConstraints: Constraint[] = reqSet.getConstraints();
    reqSet.requirementCategories.forEach((reqCategory: RequirementCategory) => {
      const categoryConstraints: Constraint[] = reqCategory.getConstraints();
      reqCategory.requirements.forEach((req: Requirement) => {
        const reqConstraints: Map<Requirement, Constraint[]> = fetchReqConstraints(req);
        reqConstraints.forEach((value: Constraint[], key: Requirement) => {
          constraints.set(key, [...setConstraints, ...categoryConstraints, ...value]);
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

  const fulfillments: Map<Requirement, FulfillmentType> = new Map();
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
            const reqMappings: Map<Requirement, Set<Course> | boolean>[] = getMappings(
              [req],
              courses,
              constraints,
              manualReqs,
            );
            const optimalMapping = findOptimalMapping([req], reqMappings);
            processOptimalMapping([req], optimalMapping, fulfillments);
          });
        } else {
          const categoryMappings: Map<Requirement, Set<Course> | boolean>[] = getMappings(
            reqCategory.requirements,
            courses,
            constraints,
            manualReqs,
          );
          const optimalMapping = findOptimalMapping(reqCategory.requirements, categoryMappings);
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          processOptimalMapping(reqCategory.requirements, optimalMapping, fulfillments);
        }
      });
    } else {
      const setReqs: Requirement[] = reqSet.getRequirements();
      const setMappings: Map<Requirement, Set<Course> | boolean>[] = getMappings(
        setReqs,
        courses,
        constraints,
        manualReqs,
      );
      const optimalMapping = findOptimalMapping(setReqs, setMappings);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      processOptimalMapping(setReqs, optimalMapping, fulfillments);
    }
  });
  manualReqs.forEach((req: Requirement) => {
    fulfillments.get(req).reqFulfillment = 'fulfilled';
  });
  reqIsFulfilledWithMapping.clear();
  return fulfillments;
}

