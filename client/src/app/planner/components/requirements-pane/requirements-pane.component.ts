import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../models/course.model';
import { FulfillmentType } from '../../models/fulfillment-type.model';
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
  @Output() openGoalSelector: EventEmitter<void>;

  fulfillmentMap: Map<Requirement, FulfillmentType>;

  private modalInstance: NgbModalRef;

  constructor() {
    this.fulfillmentMap = new Map<Requirement, FulfillmentType>();
    this.openGoalSelector = new EventEmitter<void>();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.fulfillmentMap = processRequirements(this.getRequiredSets(), this.courses, this.manuallyFulfilled);
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
}
