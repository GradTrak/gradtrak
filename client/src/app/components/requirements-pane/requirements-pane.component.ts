import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { RequirementService } from 'services/requirement.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.scss'],
})
export class RequirementsPaneComponent implements OnInit {
  @Input() goals: RequirementSet[];
  @Input() courses: Course[];
  @Output() updateGoals: EventEmitter<RequirementSet[]>;

  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(private modalService: NgbModal, private requirementService: RequirementService) {
    this.updateGoals = new EventEmitter<RequirementSet[]>();
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
  passEventToParent(baseGoals: RequirementSet[]): void{
    this.updateGoals.emit(baseGoals);
  }
}
