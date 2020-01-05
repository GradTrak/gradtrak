import { Injectable } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class GoalService {
  selectedGoals: Observable<RequirementSet[]>;
  //Note that selectedGoals only has the Child selected goal.
  //it will deliver the parents when needed
  constructor() { }
  setGoals(goals: RequirementSet[]):void{
    this.selectedGoals = of(goals);
  }
  getGoals(): any {
    return this.selectedGoals;
  }
  addGoals(newGoal:RequirementSet):void{
    this.selectedGoals = this.selectedGoals.pipe(map((goals: RequirementSet[])=>{
      goals.push(newGoal);
      return goals
    }),
    share());
  }
  //todo: still gotta remove goals as well!
}
