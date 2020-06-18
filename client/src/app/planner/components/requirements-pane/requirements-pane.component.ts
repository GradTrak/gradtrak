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
  @Input() readonly manuallyFulfilled: Map<string, Set<string>>;

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
   * Uses the {@link RequirementsPaneComponent#baseGoals} to return a list of all required requirement sets by
   * recursively looking up {@link RequirementSet#parent} until it reaches the root.
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
   * keys, mapped to the requirement-scope constraints that apply to
   * them.
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
   * Given a list of requirements and courses, recursively finds and returns
   * an array of every single possible way to arrange courses to the
   * different requirements.  Note that the time and space complexity of this
   * operation is Theta(N**M), where N is the number of courses and M is the
   * number of requirements.
   *
   * In particular, each recursive call calculates all the possibilities fron
   * i to the length of courses.
   *
   * @param {Requirement[]} reqs the complete list of requirements being looked at
   * @param {number} i the current index for the requirement that's "on deck"
   * @param {Course[]} courses
   * @param {Map<Requirement, Set<Course>>} mapping A map of requirements to courses that fulfill that requirement, used as a pruning tool.
   * @param {boolean} root Whether root requirement pruning can be performed.
   * @return {Map<Requirement, Set<Course>>[]} All possible ways of assigning courses to requirements from i to the end.
   */
  private getMappings(
    reqs: Requirement[],
    i: number,
    mapping: Map<Requirement, Set<Course>>,
    constraints: Map<Requirement, Constraint[]>,
    root: boolean,
  ): Map<Requirement, Set<Course>>[] {
    if (reqs.length === i) {
      return [new Map<Requirement, Set<Course>>()];
    }

    const req: Requirement = reqs[i];
    /*
     * If the requirement implements requirement-container, then we recursively generate fullfillment
     * status for each child requirement, adding it to the current mappings and
     * constantly pruning and checking for conflicts. Then assume we use each mapping
     * and continue to recurse through the remainder of reqs.
     */
    // TODO typeguard without violating abstraction
    if (req instanceof MultiRequirement) {
      // Process the children requirements and add it to our current map.
      const subMappings: Map<Requirement, Set<Course>>[] = this.getMappings(
        req.requirements,
        0,
        mapping,
        constraints,
        root && req.numRequired === req.requirements.length,
      );
      /* Take each submap from the result from the requirements and assumes that we are using it, setting
       * the contents of the submap to mapping and using it to find all the future possibilities.
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
          // Find the future mappings, with the assumption that we are using the current submap.
          const rest: Map<Requirement, Set<Course>>[] = this.getMappings(reqs, i + 1, mapping, constraints, root);
          // TODO may not be necessary to delete from mapping
          submap.forEach((courses: Set<Course>, subReq: Requirement) => {
            mapping.delete(subReq); // revert the edit so that we can use the mapping later to prune properly.
          });
          mapping.delete(req);
          // take the potential results and add the current possibilities to them.
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
      /* The filter prunes the combination. Takes the course combinations of each course,
       * adds it to the current mapping, and then tests to see if the new mapping is still valid with the constraint.
       */
      let combinations: Set<Course>[] = req.getCourseCombinations(this.courses);
      if (constraints.get(req).length === 0) {
        /* With 0 constraints, it does not matter which combination is taken,
         * so take a fulfilling one if one is present and any other one
         * otherwise. */
        const taken: Set<Course> = combinations.find((combination: Set<Course>) =>
          req.isFulfilledWith(Array.from(combination), null),
        );
        combinations = [taken || combinations[0]];
      } else {
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
          /* Prune possibilities that don't fulfill a necessary course requirement if we can */
          if (req instanceof CourseRequirement) {
            combinations = combinations.filter((combination: Set<Course>) => {
              return req.isFulfilledWith(Array.from(combination), null);
            });
            if (combinations.length === 0) {
              combinations = [new Set<Course>()];
            }
          }
          /* Prune unnecessary unit requirement possibilities if we can */
          if (req instanceof UnitRequirement) {
            // FIXME Fix unit requirement checking logic (prune combinations where removing a course would still be enough)
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

      /* for each possible combination of courses, which are to be used to fulfill the requirement, take the
       * list of possible mappings that are generated from the recursive call, add the possible combination
       * to each of those possible mappings.
       */
      const finalMappings: Map<Requirement, Set<Course>>[] = combinations.flatMap((combination: Set<Course>) => {
        mapping.set(req, combination);
        const rest: Map<Requirement, Set<Course>>[] = this.getMappings(reqs, i + 1, mapping, constraints, root);
        mapping.delete(req);
        rest.forEach((restCombination: Map<Requirement, Set<Course>>) => {
          restCombination.set(req, combination);
        });
        return rest;
      });
      return finalMappings;
    }
  }

  /**
   * Returns a map containing each requirement as the key mapped to its
   * fulfillment status.
   *
   * @return {Map<Requirement, FulfillmentType>} The
   * fulfillment statuses of every requirement.
   */
  processRequirements(): Map<Requirement, FulfillmentType> {
    // combines all constraints and pools them into a single array
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
    const reqs: Requirement[] = this.getRequiredSets()
      .flatMap((reqSet: RequirementSet) => {
        return reqSet.requirementCategories;
      })
      .flatMap((reqCategory: RequirementCategory) => {
        return reqCategory.requirements;
      });
    reqs.sort((a: Requirement, b: Requirement) => {
      return RequirementsPaneComponent.getReqPriority(a) - RequirementsPaneComponent.getReqPriority(b);
    });

    const mappings: Map<Requirement, Set<Course>>[] = this.getMappings(
      reqs,
      0,
      new Map<Requirement, Set<Course>>(),
      constraints,
      true,
    );
    const mappingFulfillmentCounts: Map<Map<Requirement, Set<Course>>, number> = new Map<
      Map<Requirement, Set<Course>>,
      number
    >(
      mappings.map((mapping: Map<Requirement, Set<Course>>) => [
        mapping,
        reqs.filter((req: Requirement) => req.isFulfilledWith(Array.from(mapping.get(req)), null)).length,
      ]),
    );
    const maxFulfilled: number = Math.max(...mappingFulfillmentCounts.values());
    const maxMappings: Map<Requirement, Set<Course>>[] = mappings.filter(
      (mapping: Map<Requirement, Set<Course>>) => mappingFulfillmentCounts.get(mapping) === maxFulfilled,
    );

    const fulfillmentMapping: Map<Requirement, FulfillmentType> = new Map<Requirement, FulfillmentType>(
      reqs.map((req: Requirement) => {
        if (
          maxMappings.every((mapping: Map<Requirement, Set<Course>>) =>
            req.isFulfilledWith(Array.from(mapping.get(req)), null),
          )
        ) {
          return [req, 'fulfilled'];
        }
        if (
          maxMappings.some((mapping: Map<Requirement, Set<Course>>) =>
            req.isFulfilledWith(Array.from(mapping.get(req)), null),
          )
        ) {
          return [req, 'possible'];
        }
        return [req, 'unfulfilled'];
      }),
    );
    console.log(fulfillmentMapping);
    return fulfillmentMapping;
  }
}
