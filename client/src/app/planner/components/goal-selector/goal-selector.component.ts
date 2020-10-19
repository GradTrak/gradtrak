import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequirementSet } from '../../models/requirement-set.model';
import { RequirementService } from '../../services/requirement.service';

import { GoalSelectionState } from './selection-state';

@Component({
  selector: 'app-goal-selector',
  templateUrl: './goal-selector.component.html',
  styleUrls: ['./goal-selector.component.scss'],
})
export class GoalSelectorComponent implements OnInit {
  private static DUMMY_GOAL_TYPES = ['major']; // TODO Make this dynamic based on school

  @Input() readonly initialGoals: RequirementSet[]; // Optional
  @Output() selectGoals: EventEmitter<RequirementSet[]>;

  requirementSets: RequirementSet[];

  searchPrompt: string;

  selectionStates: GoalSelectionState[];

  constructor(private requirementService: RequirementService) {
    this.selectGoals = new EventEmitter<RequirementSet[]>();
    this.searchPrompt = '';
  }

  /**
   * For each of the goal types, create a state that tracks whether anything has been selected by the user and then
   * import any goals that have been selected previously.
   */
  ngOnInit(): void {
    this.selectionStates = [];
    GoalSelectorComponent.DUMMY_GOAL_TYPES.forEach((goalType: string) => {
      const state = new GoalSelectionState(goalType);
      this.selectionStates.push(state);

      if (this.initialGoals) {
        // Add initial goals to each chosen goals state
        state.chosenGoals = new Set<RequirementSet>(
          this.initialGoals.filter((initialGoal: RequirementSet) => initialGoal && initialGoal.type === goalType),
        );
      }
    });

    this.requirementService.getRequirements().subscribe((requirementSets: RequirementSet[]) => {
      requirementSets.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.requirementSets = requirementSets;
      this.updateGoalSearch();
    });
  }

  /**
   * Updates {@link GoalSelectionState#searchedGoals} for each state so that it contains only goals that match the
   * specifications of {@link GoalSelectorComponent#searchFunction}.
   */
  updateGoalSearch(): void {
    this.selectionStates.forEach((state: GoalSelectionState) => {
      state.searchedGoals = this.requirementSets.filter(
        (goal: RequirementSet) =>
          goal.type === state.type && this.searchFunction(this.searchPrompt, goal) && !state.chosenGoals.has(goal),
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
