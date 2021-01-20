import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import Requirements from '../lib/requirements';
import { RequirementSet } from '../models/requirement-set.model';

import './GoalSelector.css';

type GoalSelectorProps = {
  initialGoals: RequirementSet[];
  onSelectGoals: (goals: RequirementSet[]) => void;
};

type GoalSelectorState = {
  requirementsMap: Map<string, RequirementSet>;
  searchTerm: string;
  selections: {
    [goalType: string]: {
      selected: RequirementSet;
      goals: RequirementSet[];
    };
  };
};

const GOAL_TYPES = ['major'];

class GoalSelector extends React.Component<GoalSelectorProps, GoalSelectorState> {
  private readonly goalRefs: Map<string, React.RefObject<HTMLSelectElement>>;

  constructor(props: GoalSelectorProps) {
    super(props);

    this.goalRefs = new Map<string, React.RefObject<HTMLSelectElement>>(
      GOAL_TYPES.map((goalType) => [goalType, React.createRef<HTMLSelectElement>()]),
    );

    this.state = {
      requirementsMap: null,
      searchTerm: '',
      selections: Object.fromEntries(
        GOAL_TYPES.map((goalType) => [
          goalType,
          {
            selected: null,
            goals: this.props.initialGoals.filter((goal) => goal.type === goalType),
          },
        ]),
      ),
    };
  }

  componentDidMount(): void {
    this.fetchRequirements();
  }

  private fetchRequirements = async (): Promise<void> => {
    const requirementsMap = await Requirements.getRequirementsMap();
    this.setState({
      requirementsMap,
    });
  };

  handleSelectChange = (): void => {
    this.setState({
      selections: Object.fromEntries(
        Object.entries(this.state.selections).map(([goalType, selection]) => [
          goalType,
          {
            ...selection,
            selected: this.state.requirementsMap.get(this.goalRefs.get(goalType).current.value),
          },
        ]),
      ),
    });
  };

  handleAddGoal = (): void => {
    this.setState({
      selections: Object.fromEntries(
        Object.entries(this.state.selections).map(([goalType, selection]) => [
          goalType,
          selection.selected ? { selected: null, goals: [...selection.goals, selection.selected] } : selection,
        ]),
      ),
    });
  };

  handleRemoveGoal = (goal: RequirementSet): void => {
    this.setState({
      selections: {
        ...this.state.selections,
        [goal.type]: {
          ...this.state.selections[goal.type],
          goals: this.state.selections[goal.type].goals.filter((g) => g !== goal),
        },
      },
    });
  };

  handleSubmit = (): void => {
    this.props.onSelectGoals(
      Object.values(this.state.selections)
        .map((selection) => selection.goals)
        .flat(),
    );
  };

  // TODO This should probably be memoized.
  private getGoalsForType = (goalType: string, requirementSets: Map<string, RequirementSet>): RequirementSet[] => {
    return Array.from(requirementSets.values()).filter((reqSet) => reqSet.type === goalType);
  };

  private searchFunction = (goal: RequirementSet): boolean => {
    /* Hide goals that are already selected. */
    if (!this.state.selections[goal.type] || this.state.selections[goal.type].goals.includes(goal)) {
      return false;
    }
    return goal
      ? goal.id.includes(this.state.searchTerm) ||
          goal.name.includes(this.state.searchTerm) ||
          this.searchFunction(goal.parent)
      : false;
  };

  render(): React.ReactElement {
    if (!this.state.requirementsMap) {
      return <>Loading...</>;
    }

    return (
      <Row>
        <Col className="GoalSelector__search">
          <Form.Group as={Row}>
            <Col>
              <Form.Control
                type="text"
                placeholder="Search for a major"
                onChange={(e) => this.setState({ searchTerm: e.target.value })}
              />
            </Col>
          </Form.Group>
          <Row>
            {GOAL_TYPES.map((goalType) => (
              <Form.Group key={goalType} as={Col}>
                {GOAL_TYPES.length > 1 ? <h4>{goalType}</h4> : null}
                <Form.Group>
                  <Form.Control
                    as="select"
                    htmlSize={8}
                    onChange={this.handleSelectChange}
                    ref={this.goalRefs.get(goalType)}
                  >
                    {this.getGoalsForType(goalType, this.state.requirementsMap)
                      .filter(this.searchFunction)
                      .map((goal) => (
                        <option key={goal.id} value={goal.id}>
                          {goal.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    block
                    onClick={this.handleAddGoal}
                    disabled={!this.state.selections[goalType].selected}
                  >
                    Add
                  </Button>
                  <span className="GoalSelector__request-major">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLScWm1kJjcBs5eX-j_HejtM_9iV3CgP4VlgoVz4hm1PX8u9vww/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Don&rsquo;t see your major?
                    </a>
                  </span>
                </Form.Group>
              </Form.Group>
            ))}
          </Row>
        </Col>
        <Col xs="auto">
          <div className="GoalSelector__line" />
        </Col>
        <Col>
          <h4 className="gt-modal-header">Selected Goals</h4>
          {GOAL_TYPES.map((goalType) => (
            <div key={goalType}>
              {GOAL_TYPES.length > 1 ? <h4>{goalType}</h4> : null}
              <hr />
              {this.state.selections[goalType].goals.map((goal) => (
                <div key={goal.id}>
                  <i className="material-icons GoalSelector__remove" onClick={() => this.handleRemoveGoal(goal)}>
                    close
                  </i>
                  <span className="GoalSelector__goal">{goal.name}</span>
                  <hr />
                </div>
              ))}
            </div>
          ))}
          <Button variant="primary" size="sm" block onClick={this.handleSubmit}>
            Confirm
          </Button>
        </Col>
      </Row>
    );
  }
}

export default GoalSelector;
