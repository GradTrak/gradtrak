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
  searchedMajors: RequirementSet[];//feels like a lot of repeated code but again doesn't warrant a new component :(
  searchedMinors: RequirementSet[];
  searchedOthers: RequirementSet[];
  selectedMajor: RequirementSet;
  selectedMinor: RequirementSet;
  selectedOther: RequirementSet;
  requirementSets: RequirementSet[];
  currentGoals: RequirementSet[];
  constructor(private requirementService: RequirementService, private goalService: GoalService) { }

  ngOnInit() {
    this.requirementService.getRequirements().subscribe((requirementSets: RequirementSet[])=>{
      this.requirementSets = requirementSets.filter((requirementSet: RequirementSet) =>(requirementSet.type !== "unselectable"));
    });


    //stuff beflow is for testing only
    this.goalService.setGoals([]);
    this.goalService.addGoals(this.requirementSets[1]);
    this.updateCurrentGoals()
    this.updateCurrentGoals()

  }
  private updateCurrentGoals():void{
    alert(this.currentGoals)
    this.goalService.getGoals()
    alert(this.currentGoals)
    this.goalService.getGoals().subscribe((goalList: RequirementSet[])=>{
      alert(this.currentGoals)
      alert(goalList)
      alert("setting current goals now")
      this.currentGoals = goalList;
      alert(this.currentGoals)
      alert(goalList)
      alert ("end update")
    });
  }

  private searchFunction(prompt: string, goal: RequirementSet): boolean{
    return goal?(goal.id.includes(prompt)||
    goal.name.includes(prompt)||
    this.searchFunction(prompt, goal.parent)):false;
  }
  // idle thought, but why nt just maje a Goal class that interits RequirementSet?
  // maybe even a major and minot class that inherits from Goal. IsInstance makes
  // sense that way.
  updateGoalSearch(): void{
    this.searchedMajors = this.requirementSets.filter(
      (potentialMajor: RequirementSet)=>(potentialMajor.type == 'major'&&
      this.searchFunction(this.searchPrompt, potentialMajor)))
    this.searchedMinors = this.requirementSets.filter((potentialMinor: RequirementSet)=>(potentialMinor.type === 'minor'&&
    this.searchFunction(this.searchPrompt, potentialMinor)))
    this.searchedOthers = this.requirementSets.filter((potentialOther: RequirementSet)=>(potentialOther.type === 'other'&&
    this.searchFunction(this.searchPrompt, potentialOther)))
    //might make more sense to do the major minor sorting onInit only once and store it
  }

  addSelectedGoals(): void{
    alert(this.currentGoals[0].id);
    this.updateCurrentGoals()
    alert(1)
    alert(this.currentGoals[1].id);
    this.selectedMajor?this.goalService.addGoals(this.selectedMajor):alert("major did not get added");
    this.selectedMinor?this.goalService.addGoals(this.selectedMinor):alert("minor did not get added");
    this.selectedOther?this.goalService.addGoals(this.selectedOther):alert("other did not get added");
    this.updateCurrentGoals()
    alert(this.currentGoals[0].id)
    alert(this.currentGoals[1].id)
    alert(this.currentGoals[2].id)
  }

}
