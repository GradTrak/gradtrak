import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import processRequirements, { ProcessedFulfillmentType } from '../lib/process-requirements';
import { Course } from '../models/course.model';
import { Requirement } from '../models/requirement.model';
import { RequirementSet } from '../models/requirement-set.model';

import RequirementSetComponent from './RequirementSetComponent';

import './RequirementPane.css';

type RequirementPaneProps = {
  goals: RequirementSet[];
  courses: Course[];
  manuallyFulfilled: Map<string, Set<string>>;
  onOpenGoalSelector: () => void;
  onOpenRequirementDisplay: (req: Requirement) => void;
  onManualFulfill: (req: Requirement, reqSet: RequirementSet) => void;
  onManualUnfulfill: (req: Requirement, reqSet: RequirementSet) => void;
};

function RequirementPane(props: RequirementPaneProps): React.ReactElement {
  /**
   * Uses the goals to return a list of all required requirement sets by
   * recursively looking up {@link RequirementSet#parent} until it reaches the
   * root.
   *
   * @return {RequirementSet[]} An array of all required requirement sets.
   */
  const getRequiredSets = (): RequirementSet[] => {
    const required: RequirementSet[] = [];
    props.goals.forEach((baseGoal: RequirementSet) => {
      const path = [];
      let current: RequirementSet = baseGoal;
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
    <Container className="px-4 py-3">
      <Row className="justify-content-center">
        <Col className="my-4" xs={10}>
          <button className="gt-button gt-button-primary RequirementPane__goal-editor" onClick={props.onOpenGoalSelector}>
            Edit Majors
          </button>
        </Col>
      </Row>
      {requiredSets.map((reqSet) => (
        <RequirementSetComponent
          key={reqSet.id}
          requirementSet={reqSet}
          courses={props.courses}
          manuallyFulfilled={props.manuallyFulfilled}
          fulfillmentMap={processRequirements(requiredSets, props.courses, props.manuallyFulfilled)}
          onOpenGoalSelector={props.onOpenGoalSelector}
          onOpenRequirementDisplay={props.onOpenRequirementDisplay}
          onManualFulfill={(req) => props.onManualFulfill(req, reqSet)}
          onManualUnfulfill={(req) => props.onManualUnfulfill(req, reqSet)}
        />
      ))}
    </Container>
  );
}

export default RequirementPane;
