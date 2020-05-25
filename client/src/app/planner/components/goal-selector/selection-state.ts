import { RequirementSet } from '../../models/requirement-set.model';

export class GoalSelectionState {
  type: string;
  searchedGoals: RequirementSet[];
  chosenGoals: Set<RequirementSet>;
  selectedSearchedGoal: RequirementSet;
  selectedChosenGoal: RequirementSet;

  constructor(type: string) {
    this.type = type;
    this.searchedGoals = [];
    this.chosenGoals = new Set<RequirementSet>();
    this.selectedSearchedGoal = null;
    this.selectedChosenGoal = null;
  }
}
