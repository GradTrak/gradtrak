import { Component, OnInit } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';
import { RequirementService } from 'services/requirement.service'
import { GoalService } from 'services/goal.service'
@Component({
  selector: 'app-requirement-selector',
  templateUrl: './requirement-selector.component.html',
  styleUrls: ['./requirement-selector.component.css']
})
export class RequirementSelectorComponent implements OnInit {
  searchPrompt: string;
  searchedMajors: RequirementSet[];
  searchedMinors: RequirementSet[];
  searchedOthers: RequirementSet[];
  requirementSets: RequirementSet[];
  currentGoals: RequirementSet[];
  test: any = "xothing changed so far";
  constructor(private requirementService: RequirementService, private goalService: GoalService) { }

  ngOnInit() {
    this.requirementService.getRequirements().subscribe((requirementSets: RequirementSet[])=>{
      this.requirementSets = requirementSets;
    });


    //stuff beflow is for testing only
    this.goalService.setGoals([]);
    this.goalService.addGoals(this.requirementSets[1]);
    this.goalService.getGoals().subscribe((goalList: RequirementSet[])=>{
      this.currentGoals = goalList;
    });
  }


}
