import { Component, OnInit } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';
import { RequirementService } from 'services/requirement.service';

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.css'],
})
export class RequirementsPaneComponent implements OnInit {
  private requirementSets: RequirementSet[];
  majorRequirementSets: RequirementSet[];
  selectableMajors: RequirementSet[];

  updateMajorRequirements(baseReqSet: RequirementSet): RequirementSet[]{
    const selected: RequirementSet[] = [baseReqSet];
    let current: RequirementSet = baseReqSet;
    while (current.parent !== null){
      current = current.parent;
      selected.push(current)
    }
    selected.reverse();
    this.majorRequirementSets = selected;
    return selected;
  }

  constructor(private requirementService: RequirementService) {}

  ngOnInit(): void {
    this.requirementService.getRequirements().subscribe((requirementSets) => {
      this.requirementSets = requirementSets;
      this.selectableMajors = requirementSets.filter((requirementSet: RequirementSet)=>requirementSet.selectable);
      });
  }
}
