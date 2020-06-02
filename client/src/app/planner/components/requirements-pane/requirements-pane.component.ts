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
    //combines all constraints and pools them into a single array
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
      * @param reqs the complete list of requirements being looked at
      * @param i the current index for the requirement that's "on deck"
      * @param mapping A map of requirements to courses that fulfill that requirement
      */
    const getMappings = (
       //I have no idea if a doc comment like this is allowed, but I think this is complicated enough to justify.
      reqs: Requirement[],
      i: number,
      courses: Course[],
      mapping: Map<Requirement, Course[]>,
      constraints: Map<Requirement, Constraint[]>,
    ) => {
      if (reqs.length === i) {
        return [];
      }
      /**
      * Given a list of courses,returns the powerset, or all possible combination, of the courses.
      * source: https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript.
      * Unknown runtimes, however It's probably exponential.
      * @param allCourses courses whose combinations are being found
      * @return a powerset of the courses
      */
      const generatePermutations = (allCourses: Course[]): Course[][] => allCourses.reduce(
        (subsets, value) => subsets.concat(
         subsets.map(set => [value,...set])
        ),
        [[]]
      );
      /* For Connie and Nicholas to discuss on 6/02: Finds all combinations that can fullfill the requirement. Note that I've done this because I think this pruning will
      help the runtime, but the act of pruning the permutations of courses itself is also exponential time. I think it's a
      much smaller exponential time, though, compared to having a much larger powerset of EVERY single course of every requriement.

      The next step would be to prune even further by checking the constraints immediately, in this function. That would add a
      factor of n to the runtime, but is probably worth it. Otherwise, you'll note that nowhere in the function do we actually
      use the CONSTRAINTS variable.

      It's really late, and I have work tomorrow, but the last thing I'll say is that we need to create copies of the
      map at every single recursive call to avoid mutability issues. And also, we need to contatenate the mapping,
      because that's what getmapping returns. Probably just create a variable returnMaps and appent getMappings to it.
      Currently we are returning a single map. But really we need to return a list of maps, each of which map a requirement
      to its corresponding list of courses. 
      */
      const possibilites: Course[][] = generatePermutations(courses.filter(course => req[i].getsContributed(course)));
      possibilites.forEach((possibility: Course[]) => {
        mapping.set(reqs[i], possibility);
        getMappings(reqs, i + 1, courses, mapping, constraints); //FIXME do something with this map.
      });
      return new Map(mapping);
    };
    const possibilityArray = getMappings(reqs, 0, courses, new Map<Requirement, Course[]>(), constraints);
    return null;
  }
}
