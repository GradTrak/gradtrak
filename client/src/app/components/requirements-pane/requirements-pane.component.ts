import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { RequirementService } from 'services/requirement.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.css'],
})
export class RequirementsPaneComponent implements OnInit {
  baseGoals: RequirementSet[];
  @Input() readonly courses: Course[];

  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(private modalService: NgbModal) {
    this.baseGoals = [];
  }

  ngOnInit(): void {}

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
    this.baseGoals.forEach((baseGoal: RequirementSet) => {
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

  setBaseGoals(baseGoals: RequirementSet[]): void {
    this.baseGoals = baseGoals;
  }
}
