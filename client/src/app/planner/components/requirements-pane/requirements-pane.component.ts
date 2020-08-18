import { Component, Input, OnChanges, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../models/course.model';
import { FulfillmentType, CourseFulfillmentType } from '../../models/fulfillment-type.model';
import { Requirement } from '../../models/requirement.model';
import { RequirementSet } from '../../models/requirement-set.model';
import { RequirementService } from '../../services/requirement.service';
import { UserService } from '../../services/user.service';

import { processRequirements } from '../../lib/process-requirements';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.scss'],
})
export class RequirementsPaneComponent implements OnChanges, OnInit {
  @Input() readonly goals: RequirementSet[];
  @Input() readonly courses: Course[];
  @Input() readonly manuallyFulfilled: Map<string, Set<string>>; // Maps from a requirementSet id to a list of requirement ids.

  fulfillmentMap: Map<Requirement, FulfillmentType>;
  coursePoolMap: Map<Requirement, Map<Course, CourseFulfillmentType>>;

  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private requirementService: RequirementService,
    private userService: UserService,
  ) {
    this.fulfillmentMap = new Map<Requirement, FulfillmentType>();
    this.coursePoolMap = new Map<Requirement, Map<Course, CourseFulfillmentType>>();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    // processRequirements also updates coursePoolMap as an impure function
    this.fulfillmentMap = processRequirements(this.getRequiredSets(), this.courses, this.manuallyFulfilled, this.coursePoolMap);
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
        if (current === undefined) {
          console.error('A selected goal was not found.');
          break;
        }
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
}
