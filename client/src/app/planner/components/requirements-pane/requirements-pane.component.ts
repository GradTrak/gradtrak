import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../models/course.model';
import { RequirementSet } from '../../models/requirement-set.model';
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
  processRequirements(courses : Course[], setIndex: number, categoryIndex: number, reqIndex: number): Object { //mapping? Maybe we should use an actual map
    const constraints: Map<Requirement, Constraint[]> = new Map<Requirement, Constraint[]>();
    this.getRequiredSets().forEach((reqSet: RequirementSet) => {
      const setConstraints: Constraint[] = reqSet.getConstraints();
      reqSet.requiremnetCategories.forEach((reqCategory: RequirementCategory) => {
        const categoryConstraints: Constraint[] = reqCategory.getConstraints();
        reqCategory.requirements.forEach((req: Requirement) => {
          const reqConstraints: Constraint[] = req.getConstraints();
          constraints.set(req, [...setConstraints, ...categoryConstraints, ...reqConstraints]);
        });
      });
    });

    processRequirements(reqs: Requirement[], i: number, courses: Course[], prev: Map<Requirement, Course[]>, constraints: Map<Requirement, Constraint[]>) {
      if (reqs.length === i) {
        return [];
      }
      const possibilites: Courses[][]; // [[], ['cs61a']]
      possibilites.forEach((possibility: Course[]) => {
        prev.set(reqs[0], possibility);
        this.processRequirements(reqs, i + 1, courses, prev);
      });
    }

    const emptyMap: Map<Requirement, Set<Course>> = {};

    permutation(maps: Map<>[], courses: Course[]) {

    }

    [{
      "eecs": [course1, course2]
      "bioe2": [course1, course3] //partition the courses for the next level
    }]
    examplereqSet.process(myMapList) =>

    [{
      "eecs upper div": [...]
      "eecs technical elect": [...]
      "bioe tech topic": [...]
      "bioecs61a": [...]
      "selected": false
    }] //it processes it and returns it to us at the most granular level

    constraints[0].isValida(Map<>) //we process that through our constraints.

  }
  constraintSet (requirementSet)
  ConstraintCategory (requirementCategory:requirementCategory)
  ConstraintRequirement
}
