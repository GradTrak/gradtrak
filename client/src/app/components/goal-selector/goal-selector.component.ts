import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';
import { RequirementService } from 'services/requirement.service';

import { GoalSelectionState } from './selection-state';

@Component({
  selector: 'app-goal-selector',
  templateUrl: './goal-selector.component.html',
  styleUrls: ['./goal-selector.component.css'],
})
export class GoalSelectorComponent implements OnInit {
  private static DUMMY_GOAL_TYPES = ['major', 'minor', 'other']; // TODO Make this dynamic based on school

  @Output() selectGoals: EventEmitter<RequirementSet[]>;

  requirementSets: RequirementSet[];

  searchPrompt: string;

  selectionStates: GoalSelectionState[];

  constructor(private requirementService: RequirementService) {
    this.selectGoals = new EventEmitter<RequirementSet[]>();
    this.searchPrompt = '';
  }

  ngOnInit(): void {
    this.selectionStates = [];
    GoalSelectorComponent.DUMMY_GOAL_TYPES.forEach((goalType: string) => {
      this.selectionStates.push(new GoalSelectionState(goalType));
    });

    this.requirementService.getRequirements().subscribe((requirementSets: RequirementSet[]) => {
      this.requirementSets = requirementSets;
    });

    this.updateGoalSearch();
  }

  updateGoalSearch(): void {
    this.selectionStates.forEach((state: GoalSelectionState) => {
      state.searchedGoals = this.requirementSets.filter(
        (goal: RequirementSet) =>
          goal.type === state.type && this.searchFunction(this.searchPrompt, goal) && !state.chosenGoals.has(goal)
      );
    });
    // might make more sense to do the major minor sorting onInit only once and store it
  }

  addGoal(goal: RequirementSet, state: GoalSelectionState): void {
    state.chosenGoals.add(goal);
    state.selectedSearchedGoal = null;
    this.updateGoalSearch();
  }

  removeGoal(goal: RequirementSet, state: GoalSelectionState): void {
    state.chosenGoals.delete(goal);
    state.selectedChosenGoal = null;
    this.updateGoalSearch();
  }

  emitGoals(): void {
    this.selectGoals.emit(this.selectionStates.flatMap((state: GoalSelectionState) => Array.from(state.chosenGoals)));
  }

  private searchFunction(prompt: string, goal: RequirementSet): boolean {
    return goal
      ? goal.id.includes(prompt) || goal.name.includes(prompt) || this.searchFunction(prompt, goal.parent)
      : false;
  }
}
