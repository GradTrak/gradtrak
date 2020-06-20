import { Component, Input, OnChanges, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constraint } from '../../models/constraint.model';
import { Course } from '../../models/course.model';
import { Requirement } from '../../models/requirement.model';
import { RequirementSet } from '../../models/requirement-set.model';
import { RequirementCategory } from '../../models/requirement-category.model';
import { CourseRequirement } from '../../models/requirements/course-requirement.model';
import { MultiRequirement } from '../../models/requirements/multi-requirement.model';
import { PolyRequirement } from '../../models/requirements/poly-requirement.model';
import { TagRequirement } from '../../models/requirements/tag-requirement.model';
import { UnitRequirement } from '../../models/requirements/unit-requirement.model';
import { RequirementService } from '../../services/requirement.service';
import { UserService } from '../../services/user.service';

export type FulfillmentType = 'fulfilled' | 'unfulfilled' | 'possible';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.scss'],
})
export class RequirementsPaneComponent implements OnChanges, OnInit {
  @Input() readonly goals: RequirementSet[];
  @Input() readonly courses: Course[];
  @Input() readonly manuallyFulfilled: Map<string, Set<string>>; //Maps from a requirementSet id to a list of requirement ids.

  fulfillmentMap: Map<Requirement, FulfillmentType>;

  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private requirementService: RequirementService,
    private userService: UserService,
  ) {
    this.fulfillmentMap = new Map<Requirement, FulfillmentType>();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.fulfillmentMap = this.processRequirements();
  }

  openSelector(): void {
    this.modalInstance = this.modalService.open(this.goalSelectorTemplate, { size: 'lg' });
  }

  closeSelector(): void {
    if (this.modalInstance) {
      this.modalInstance.close();
    }
  }

  /**
   * Uses the {@link RequirementsPaneComponent#baseGoals} to return a list of
   * all required requirement sets by recursively looking up {@link
   * RequirementSet#parent} until it reaches the root.
   *
   * @return {RequirementSet[]} An array of all required requirement sets.
   */
  getRequiredSets(): RequirementSet[] {
    const required: RequirementSet[] = [];
    this.goals.forEach((baseGoal: RequirementSet) => {
      const path = [];
      let current: RequirementSet = baseGoal;
      while (current !== null && !required.includes(current)) {
        path.push(current);
        current = current.parent;
      }

      path.reverse();
      required.push(...path);
    });
    return required;
  }

  setGoals(goals: RequirementSet[]): void {
    this.userService.updateGoals(goals);
  }

  /**
   * Returns a map containing the requirement and any child requirement as
   * keys, mapped to the requirement-scope constraints that apply to them.
   *
   * @param {Requirement} req The requirement whose constraints to fetch.
   * @return {Map<Requirement, Constraints[]>} The map containing the
   * requirement and its potential children mapped to the requirement-scope
   * constraints.
   */
  private static fetchReqConstraints(req: Requirement): Map<Requirement, Constraint[]> {
    const mapping: Map<Requirement, Constraint[]> = new Map<Requirement, Constraint[]>();
    mapping.set(req, req.getConstraints());

    // TODO Fix type guard for RequirementContainer
    if (req instanceof MultiRequirement) {
      req.requirements.forEach((childReq: Requirement) => {
        RequirementsPaneComponent.fetchReqConstraints(childReq).forEach((value: Constraint[], key: Requirement) => {
          mapping.set(key, [...req.getConstraints(), ...value]);
        });
      });
    }

    return mapping;
  }

  private static getReqPriority(req: Requirement): number {
    if (req instanceof CourseRequirement) {
      return 0;
    }
    if (req instanceof TagRequirement) {
      return 1;
    }
    if (req instanceof PolyRequirement) {
      return 2;
    }
    if (req instanceof MultiRequirement) {
      return 3;
    }
    if (req instanceof UnitRequirement) {
      return 4;
    }
    return 5;
  }

  /**
   * Given a list of requirements and courses, recursively finds and returns an
   * array of every single reasonable possible way to arrange courses to the different
   * requirements.  Note that the time and space complexity of this operation
   * is Theta(N**M), where N is the number of courses and M is the number of
   * requirements. Will assume that base level course requirements are fullfilled immediately,
   * and always attempts to take the map with the highest number of fullfilled requirements.
   *
   * In particular, each recursive call calculates all the possibilities from i
   * to the length of courses.
   *
   * @param {Requirement[]} reqs The complete list of requirements being looked
   * at.
   * @param {Map<Requirement, Set<Course>>} mapping A map of requirements to
   * courses that fulfill that requirement, used as a pruning tool.
   * @param {boolean} root Whether root requirement pruning can be performed.
   * @param {number} i The current index for the requirement that's "on deck"
   * @param {number} numFulfilled The number of requirements that are
   * fulfilled with the given mapping.
   * @param {number} alpha The lower bound on how many requirements are
   * fulfilled for returned course mappings, used for efficient pruning.
   * @return {Map<Requirement, Set<Course>>[]} All possible ways of assigning
   * courses to requirements from i to the end.
   */
  private getMappings(
    reqs: Requirement[],
    constraints: Map<Requirement, Constraint[]>,
    root: boolean = true,
    mapping: Map<Requirement, Set<Course>> = new Map<Requirement, Set<Course>>(),
    numFulfilled: number = 0,
    alpha: number = 0,
    i: number = 0,
  ): Map<Requirement, Set<Course>>[] {

    /*
     * If, assuming all remaining requirements are fulfilled, we still aren’t
     * able to reach alpha, or if we managed to fulfill every single
     * requirement, prune.
     */
    const numRemaining: number = reqs.length - i;
    if (numFulfilled + numRemaining < alpha || alpha === reqs.length) {
      return [new Map<Requirement, Set<Course>>(reqs.slice(i).map((req: Requirement) => [req, new Set<Course>()]))];
    }

    /* Base case */
    if (reqs.length === i) {
      return [new Map<Requirement, Set<Course>>()];
    }

    const req: Requirement = reqs[i];
    /*
     * If the requirement implements requirement-container, then we recursively
     * generate fullfillment status for each child requirement, adding it to
     * the current mappings and constantly pruning and checking for conflicts.
     * Then assume we use each mapping and continue to recurse through the
     * remainder of reqs.
     */
    // TODO typeguard without violating abstraction
    if (req instanceof MultiRequirement) {
      /* Process the children requirements and add it to our current map. */
      const subMappings: Map<Requirement, Set<Course>>[] = this.getMappings(
        req.requirements,
        constraints,
        root && req.numRequired === req.requirements.length,
        mapping,
      );
      /*
       * Take each submap from the result from the requirements and assumes
       * that we are using it, setting the contents of the submap to mapping
       * and using it to find all the future possibilities.
       */
      const finalMappings: Map<Requirement, Set<Course>>[] = subMappings.flatMap(
        (submap: Map<Requirement, Set<Course>>) => {
          const union: Set<Course> = new Set<Course>();
          submap.forEach((courses: Set<Course>) => {
            courses.forEach((course: Course) => {
              union.add(course);
            });
          });
          submap.forEach((courses: Set<Course>, subReq: Requirement) => {
            mapping.set(subReq, courses);
          });
          mapping.set(req, union);
          /*
           * Find the future mappings, with the assumption that we are using
           * the current submap.
           */
          const rest: Map<Requirement, Set<Course>>[] = this.getMappings(
            reqs,
            constraints,
            root,
            mapping,
            numFulfilled,
            alpha,
            i + 1,
          );
          submap.forEach((courses: Set<Course>, subReq: Requirement) => {
            /* Revert so that we can use the mapping later to prune properly. */
            mapping.delete(subReq);
          });
          mapping.delete(req);
          /* Take the potential results and add the current combination. */
          rest.forEach((restCombination: Map<Requirement, Set<Course>>) => {
            submap.forEach((courses: Set<Course>, subReq: Requirement) => {
              restCombination.set(subReq, courses);
            });
            restCombination.set(req, union);
          });
          return rest;
        },
      );
      return finalMappings;
    } else {
      /*
       * The filter prunes the combination. Takes the course combinations of
       * each course, adds it to the current mapping, and then tests to see if
       * the new mapping is still valid with the constraint.
       */
      let combinations: Set<Course>[] = req.getCourseCombinations(this.courses);
      /* Prune invalid mappings */
      combinations = combinations.filter((combination: Set<Course>) => {
        mapping.set(req, combination);
        const valid: boolean = constraints
          .get(req)
          .every((constraint: Constraint) => constraint.isValidMapping(mapping));
        mapping.delete(req);
        return valid;
      });
      if (root) {
        /* Prune possibilities that don't fulfill a necessary course
         * requirement if we can. */
        if (req instanceof CourseRequirement) {
          combinations = combinations.filter((combination: Set<Course>) => {
            return req.isFulfilledWith(Array.from(combination));
          });
          if (combinations.length === 0) {
            combinations = [new Set<Course>()];
          }
        }
        /* Prune unnecessary unit requirement possibilities if we can. */
        if (req instanceof UnitRequirement) {
          // FIXME Fix unit requirement checking logic (prune combinations
          // where removing a course would still be enough)
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

      /*
       * For each possible combination of courses, which are to be used to
       * fulfill the requirement, take the list of possible mappings that are
       * generated from the recursive call, add the possible combination to
       * each of those possible mappings.
       */

      const finalMappings: Map<Requirement, Set<Course>>[] = [];
      let nextAlpha: number = alpha;

      combinations.forEach((combination: Set<Course>) => {
        const fulfillsReq: boolean = req.isFulfilledWith(Array.from(combination));
        const nextNumFulfilled: number = fulfillsReq ? numFulfilled + 1 : numFulfilled;

        /* Recurse */
        mapping.set(req, combination);
        const restMappings: Map<Requirement, Set<Course>>[] = this.getMappings(
          reqs,
          constraints,
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
            (restMapping: Map<Requirement, Set<Course>>) =>
              nextNumFulfilled +
              Array.from(restMapping.keys()).filter((req: Requirement) =>
                req.isFulfilledWith(Array.from(restMapping.get(req))),
              ).length,
          ),
        );

        /* Edit resulting mappings to include current requirement */
        restMappings.forEach((restMapping: Map<Requirement, Set<Course>>) => {
          restMapping.set(req, combination);
        });

        finalMappings.push(...restMappings);
      });

      return finalMappings;
    }
  }

  /**
   * Derives the fulfillment statuses of requirements from a mapping of
   * requirements to possible course combinations and assigns them to the given
   * map.
   *
   * @param {Requirement} baseReqs The requirements that count towards overall
   * goal progress.
   * @param {Map<Requirement, Set<Course>>[]} mappings The possible course
   * mappings.
   * @param {Map<Requirement, FulfillmentType} fulfillment The map to which we
   * assign the derived fulfillment statuses.
   */
  private static deriveFulfillment(
    baseReqs: Requirement[],
    reqToCourseMappings: Map<Requirement, Set<Course>>[],
    fulfillment: Map<Requirement, FulfillmentType>,
    manualFulfillment: Set<Requirement>
  ): void {
    const mappingFulfillmentCounts: Map<Map<Requirement, Set<Course>>, number> = new Map<
      Map<Requirement, Set<Course>>,
      number
    >( //A mapping of each requirement-to-course map to the number of requirements it fulfills.
      reqToCourseMappings.map((reqToCourseMapping: Map<Requirement, Set<Course>>) => [
        reqToCourseMapping,
        baseReqs.filter((req: Requirement) => req.isFulfilledWith(Array.from(reqToCourseMapping.get(req)))).length,
      ]),
    );
    const maxFulfilled: number = Math.max(...mappingFulfillmentCounts.values());
    const maxMappings: Map<Requirement, Set<Course>>[] = reqToCourseMappings.filter(
      (reqToCourseMapping: Map<Requirement, Set<Course>>) => mappingFulfillmentCounts.get(reqToCourseMapping) === maxFulfilled,
    );
    baseReqs.forEach((req: Requirement) => {
      if (manualFulfillment.has(req)) {
        fullfillment.set(req, 'manual');
      } else if (
        maxMappings.every((mapping: Map<Requirement, Set<Course>>) => req.isFulfilledWith(Array.from(mapping.get(req))))
      ) {
        fulfillment.set(req, 'fulfilled');
      } else if (
        maxMappings.some((mapping: Map<Requirement, Set<Course>>) => req.isFulfilledWith(Array.from(mapping.get(req))))
      ) {
        fulfillment.set(req, 'possible');
      } else {
        fulfillment.set(req, 'unfulfilled');
      }
    });
  }

  /**
   * Returns a map containing each requirement as the key mapped to its
   * fulfillment status.
   *
   * @return {Map<Requirement, FulfillmentType>} The
   * fulfillment statuses of every requirement.
   */
  processRequirements(): Map<Requirement, FulfillmentType> {
    //pool constraints into a map.
    const constraints: Map<Requirement, Constraint[]> = new Map<Requirement, Constraint[]>();
    this.getRequiredSets().forEach((reqSet: RequirementSet) => {
      const setConstraints: Constraint[] = reqSet.getConstraints();
      reqSet.requirementCategories.forEach((reqCategory: RequirementCategory) => {
        const categoryConstraints: Constraint[] = reqCategory.getConstraints();
        reqCategory.requirements.forEach((req: Requirement) => {
          const reqConstraints: Map<Requirement, Constraint[]> = RequirementsPaneComponent.fetchReqConstraints(req);
          reqConstraints.forEach((value: Constraint[], key: Requirement) => {
            constraints.set(key, [...setConstraints, ...categoryConstraints, ...value]);
          });
        });
      });
    });

    const fulfillment: Map<Requirement, FulfillmentType> = new Map();

    this.getRequiredSets().forEach((reqSet: RequirementSet) => {
      const unfulfilledReqSet = reqSet.requirementCategories.map(reqCateg => {//Filter each group to only have non manually-fulfilled requirements.
        {
          ...reqCateg,
          requirements: reqCateg.requirements.filter(req: Requirement => !(manuallyFulfilled.get(reqSet.id).has(req.id)))
        }
      });
      Object.assign(unfulfilledReqSet, RequirementSet)
      const setConstraints: Constraint[] = unfulfilledReqSet.getConstraints();
      if (setConstraints.length === 0) {
        /* If a set has no constraints, we can derive fulfillment at the level
         * of a category. */
        unfulfilledReqSet.requirementCategories.forEach((reqCategory: RequirementCategory) => {
          const categoryConstraints: Constraint[] = reqCategory.getConstraints();
          if (categoryConstraints.length === 0) {
            /* If a category has no constraints, we can derive fulfillment at
             * the level of a requirement. */
            reqCategory.requirements.forEach((req: Requirement) => {
              const reqMappings: Map<Requirement, Set<Course>>[] = this.getMappings([req], constraints);
              RequirementsPaneComponent.deriveFulfillment([req], reqMappings, fulfillment);
            });
          } else {
            const categoryMappings: Map<Requirement, Set<Course>>[] = this.getMappings(
              reqCategory.requirements,
              constraints,
            );
            RequirementsPaneComponent.deriveFulfillment(reqCategory.requirements, categoryMappings, fulfillment);
          }
        });
      } else {
        const setReqs: Requirement[] = unfulfilledReqSet.getRequirements();
        const setMappings: Map<Requirement, Set<Course>>[] = this.getMappings(setReqs, constraints);
        const manualReqs: Set<Requirement> = new Set<Requirement>;
        this.getRequiredSets.forEach(reqSet: RequirementSet => {
          const manualReqIds = this.manuallyFulfilled.get(reqSet.id);
          const manuallyFulfilledInReqSet = reqSet.getRequirements.filter(req: Requirement => manualReqIds.has(req.id));
          manuallyFulfilledInReqSet.forEach(requirement: Requirement => {
            manualReqs.add(requirement)
          });
        });
        RequirementsPaneComponent.deriveFulfillment(setReqs, setMappings, fulfillment, manualReqs);
      }
    });

    console.log(fulfillment);
    return fulfillment;
  }
}
