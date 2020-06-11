import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constraint } from '../../models/constraint.model';
import { Course } from '../../models/course.model';
import { Requirement } from '../../models/requirement.model';
import { RequirementSet } from '../../models/requirement-set.model';
import { RequirementCategory } from '../../models/requirement-category.model';
import { RequirementService } from '../../services/requirement.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.scss'],
})
export class RequirementsPaneComponent implements OnInit {
  @Input() readonly goals: RequirementSet[];
  @Input() readonly courses: Course[];
  @Input() readonly manuallyFulfilled: Map<string, Set<string>>;

  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private requirementService: RequirementService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {}

  openSelector(): void {
    this.modalInstance = this.modalService.open(this.goalSelectorTemplate, { size: 'xl' });
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
   * Takes in a list of courses, processes all the children requirementSets,
   * and returns a mapping of all the possibilities of partitioning the list of
   * courses that satisies the constraints between the children requiremenetSets.
   * @param courses a list of couses that the user has chosen
   * @return a list of maps, each of which indicate a possible mapping of courses.
   */
  processRequirements(courses: Course[], setIndex: number, categoryIndex: number, reqIndex: number): object {
    // combines all constraints and pools them into a single array
    const constraints: Map<Requirement, Constraint[]> = new Map<Requirement, Constraint[]>();
    this.getRequiredSets().forEach((reqSet: RequirementSet) => {
      const setConstraints: Constraint[] = reqSet.getConstraints();
      reqSet.requirementCategories.forEach((reqCategory: RequirementCategory) => {
        const categoryConstraints: Constraint[] = reqCategory.getConstraints();
        reqCategory.requirements.forEach((req: Requirement) => {
          const reqConstraints: Constraint[] = req.getConstraints();
          constraints.set(req, [...setConstraints, ...categoryConstraints, ...reqConstraints]);
        });
      });
    });
    const reqs = this.getRequiredSets()
      .flatMap((reqSet: RequirementSet) => {
        return reqSet.requirementCategories;
      })
      .flatMap((reqCategory: RequirementCategory) => {
        return reqCategory.requirements;
      });
    /**
     * Given a list of requirements and courses, recursively finds and returns an
     * array of every single possible way to arrange courses to the different requirements.
     * Note that the time and space complexity of this operation is Theta(N**M), where N is the
     * number of courses and M is the number of requirements.
     * @param {Requirement[]} reqs the complete list of requirements being looked at
     * @param {number} i the current index for the requirement that's "on deck"
     * @param {Course[]} courses
     * @param {Map<Requirement, Course[]>} mapping A map of requirements to courses that fulfill that requirement
     * @param {Map<Requirement, Constraint[]>}
     *
     */
    const getMappings = (
      // I have no idea if a doc comment like this is allowed, but I think this is complicated enough to justify.
      reqs: Requirement[],
      i: number,
      courses: Course[],
      mapping: Map<Requirement, Set<Course>>,
      constraints: Map<Requirement, Constraint[]>,
    ) => {
      if (reqs.length === i) {
        return [new Map<Requirement, Set<Course>>()];
      }

      const req: Requirement = reqs[i];
      const combinations: Set<Course>[] = req.getCourseCombinations(courses).filter((combination: Set<Course>) => {
        mapping.set(req, combination);
        const valid: boolean = constraints
          .get(req)
          .every((constraint: Constraint) => constraint.isValidMapping(mapping));
        mapping.delete(req);
        return valid;
      });

      return combinations.flatMap((combination: Set<Course>) => {
        mapping.set(req, combination);
        const rest: Map<Requirement, Set<Course>>[] = getMappings(reqs, i + 1, courses, mapping, constraints);
        mapping.delete(req);
        rest.forEach((restCombinations: Map<Requirement, Set<Course>>) => {
          restCombinations.set(req, combination);
        });
        return rest;
      });

      /**
       * Given a list of courses,returns the powerset, or all possible combination, of the courses.
       * source: https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript.
       * Unknown runtimes, however It's probably exponential.
       * @param allCourses courses whose combinations are being found
       * @return a powerset of the courses
       */
      /*const generateCombinations = (allCourses: Course[]): Course[][] =>
        allCourses.reduce((subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])), [[]]);
      const possibilites: Course[][] = generateCombinations(courses.filter((course) => reqs[i].canFulfill(course)));
      possibilites.forEach((possibility: Course[]) => {
        mapping.set(reqs[i], possibility);
        getMappings(reqs, i + 1, courses, mapping, constraints); //FIXME do something with this map.
      });
      return new Map(mapping);*/
    };
    const possibilityArray = getMappings(reqs, 0, courses, new Map<Requirement, Set<Course>>(), constraints);
    return null;
  }
}
