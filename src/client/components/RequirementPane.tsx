import React from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';

import processRequirements from '../lib/process-requirements';
import { Course } from '../models/course.model';
import { Requirement } from '../models/requirement.model';
import { RequirementSet } from '../models/requirement-set.model';

import GoalSelector from './GoalSelector';
import RequirementSetComponent from './RequirementSetComponent';

import './RequirementPane.css';

type RequirementPaneProps = {
  goals: RequirementSet[];
  courses: Course[];
  manuallyFulfilled: {
    [reqSetId: string]: string[];
  };
  onManualFulfill: (req: Requirement, reqSet: RequirementSet) => void;
  onManualUnfulfill: (req: Requirement, reqSet: RequirementSet) => void;
  onChangeGoals: (goals: RequirementSet[]) => void;
};

type RequirementPaneState = {
  showGoalSelector: boolean;
};

class RequirementPane extends React.Component<RequirementPaneProps, RequirementPaneState> {
  constructor(props: RequirementPaneProps) {
    super(props);

    this.state = {
      showGoalSelector: false,
    };
  }

  openGoalSelector = (): void => {
    this.setState({
      showGoalSelector: true,
    });
  };

  closeGoalSelector = (): void => {
    this.setState({
      showGoalSelector: false,
    });
  };

  handleChangeGoals = (goals: RequirementSet[]): void => {
    this.closeGoalSelector();
    this.props.onChangeGoals(goals);
  };

  render(): React.ReactElement {
    /**
     * Uses the goals to return a list of all required requirement sets by
     * recursively looking up {@link RequirementSet#parent} until it reaches the
     * root.
     *
     * @return {RequirementSet[]} An array of all required requirement sets.
     */
    const getRequiredSets = (): RequirementSet[] => {
      const required: RequirementSet[] = [];
      this.props.goals.forEach((baseGoal) => {
        const path = [];
        let current: RequirementSet | null = baseGoal;
        while (current !== null && !required.includes(current)) {
          if (current === undefined) {
            console.error('A selected goal was not found.');
            break;
          }
          path.push(current);
          current = current.parent;
        }

        path.reverse();
        required.push(...path);
      });
      return required;
    };

    const requiredSets = getRequiredSets();

    return (
      <Container className="RequirementPane px-4 py-3">
        <Row className="justify-content-center">
          <Col className="my-4" xs={10}>
            <button
              className="gt-button gt-button-primary RequirementPane__goal-editor"
              type="button"
              onClick={this.openGoalSelector}
            >
              Edit Majors
            </button>
          </Col>
        </Row>
        {requiredSets.map((reqSet) => (
          <RequirementSetComponent
            key={reqSet.id}
            requirementSet={reqSet}
            fulfillmentMap={processRequirements(requiredSets, this.props.courses, this.props.manuallyFulfilled)}
            onManualFulfill={(req) => this.props.onManualFulfill(req, reqSet)}
            onManualUnfulfill={(req) => this.props.onManualUnfulfill(req, reqSet)}
          />
        ))}
        <Modal size="lg" show={this.state.showGoalSelector} onHide={this.closeGoalSelector}>
          <Modal.Body>
            <GoalSelector initialGoals={this.props.goals} onSelectGoals={this.handleChangeGoals} />
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
}

export default RequirementPane;
