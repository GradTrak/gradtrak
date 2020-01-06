import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';
import { RequirementService } from 'services/requirement.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.css'],
})
export class RequirementsPaneComponent implements OnInit {
  private baseGoals: RequirementSet[];

  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(private modalService: NgbModal, private requirementService: RequirementService) {
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

  getRequiredSets(): RequirementSet[] {
    const required: RequirementSet[] = [];
    this.baseGoals.forEach((baseGoal: RequirementSet) => {
      let current: RequirementSet = baseGoal;
      while (current !== null && !required.includes(current)) {
        required.push(current);
        current = current.parent;
      }
    });
    required.reverse();
    return required;
  }

  setBaseGoals(baseGoals: RequirementSet[]): void {
    this.baseGoals = baseGoals;
  }
}
