import { Injectable } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class GoalServiceService {
  selectedGoals: Observable<RequirementSet[]>;
  //Note that selectedGoals only has the Child selected goal.
  //it will deliver the parents when needed
  constructor() { }
  setGoals(goals: RequirementSet[]):void{
    this.selectedGoals = of(goals).share();
  }
  getGoals(): Observable<RequirementSet[]> {
    return this.selectedGoals;
  }
  addGoals(newGoal:RequirementSet):void{
    this.selectedGoals = this.selectedGoals.pipe((goals: RequirementSet[])=>{
      goals.push(newGoal);
    },
    share());
  }

}
