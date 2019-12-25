import { Component, OnInit } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';
import { RequirementService } from 'services/requirement.service';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.css'],
})
export class RequirementsPaneComponent implements OnInit {
  requirementSets: RequirementSet[];
  majorRequirementSets: RequirementSet[];
  selectableMajors: RequirementSet[];

  updateMajorRequirements(baseReqSet: RequirementSet): RequirementSet[]{
    let selected: RequirementSet[] = [baseReqSet];
    let current: RequirementSet = baseReqSet;
    while (baseReqSet.parent !== null){
      baseReqSet = baseReqSet.parent;
      selected.push(baseReqSet)
    }
    selected.reverse();
    this.majorRequirementSets = selected;
    return selected;
  }

  constructor(private requirementService: RequirementService) {}

  ngOnInit(): void {
    this.requirementService.getRequirements().subscribe((requirementSets) => {
      this.requirementSets = requirementSets;
      //define selectableMajors. Maybe this should be moved to a service???
      let selectableMajors: RequirementSet[] = [];
      this.selectableMajors = requirementSets.filter((requirementSet)=>requirementSet.isMajor);
      });
  }
}
