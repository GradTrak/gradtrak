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
  private requirementSets: RequirementSet[];
  selectedRequirementSets: RequirementSet[];
  selectableRequirementSets: RequirementSet[];
  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  openSelector():void{
    this.modalInstance = this.modalService.open(this.goalSelectorTemplate, { size: 'lg' })
  }
  closeSelector():void{
    if (this.modalInstance){
      this.modalInstance.close();}
  }

  updateSelectedRequirements(baseReqSet: RequirementSet): RequirementSet[] {
    const selected: RequirementSet[] = [baseReqSet];
    let current: RequirementSet = baseReqSet;
    while (current.parent !== null) {
      current = current.parent;
      selected.push(current);
    }
    selected.reverse();
    this.selectedRequirementSets = selected;
    return selected;
  }

  constructor(private modalService: NgbModal, private requirementService: RequirementService) {}

  ngOnInit(): void {
    this.requirementService.getRequirements().subscribe((requirementSets) => {
      this.requirementSets = requirementSets;
      this.selectableRequirementSets = requirementSets.filter((requirementSet: RequirementSet) => requirementSet.type !== "unselectable");
    });
  }
}
