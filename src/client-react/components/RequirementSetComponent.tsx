import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { ProcessedFulfillmentType } from '../lib/process-requirements';
import { Course } from '../models/course.model';
import { Requirement } from '../models/requirement.model';
import { RequirementSet } from '../models/requirement-set.model';

import RequirementCategoryComponent from './RequirementCategoryComponent';

import './RequirementSetComponent.css';

type RequirementSetComponentProps = {
  requirementSet: RequirementSet;
  courses: Course[];
  manuallyFulfilled: Map<string, Set<string>>;
  fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
  onOpenGoalSelector: () => void;
  onOpenRequirementDisplay: (req: Requirement) => void;
  onManualFulfill: (req: Requirement) => void;
  onManualUnfulfill: (req: Requirement) => void;
};

type RequirementSetComponentState = {
  collapsed: boolean;
};

class RequirementSetComponent extends React.Component<RequirementSetComponentProps, RequirementSetComponentState> {
  constructor(props: RequirementSetComponentProps) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  handleToggleCollapsed = (): void => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render(): React.ReactElement {
    return (
      <div className={`RequirementSet ${this.state.collapsed ? 'RequirementSet--collapsed' : ''}`}>
        <Row className="RequirementSet__name">
          <Col className="px-1" xs="auto">
            <i className="material-icons RequirementSet__dropdown-arrow" onClick={this.handleToggleCollapsed}>
              arrow_drop_down
            </i>
          </Col>
          <Col className="px-1">{this.props.requirementSet.name}</Col>
        </Row>
        <div className="RequirementSet__requirement-categories">
          {this.props.requirementSet.requirementCategories.map((reqCategory) => (
            <RequirementCategoryComponent
              key={reqCategory.name}
              requirementCategory={reqCategory}
              courses={this.props.courses}
              manuallyFulfilled={this.props.manuallyFulfilled.get(this.props.requirementSet.id) || new Set<string>()}
              fulfillmentMap={this.props.fulfillmentMap}
              onOpenGoalSelector={this.props.onOpenGoalSelector}
              onOpenRequirementDisplay={this.props.onOpenRequirementDisplay}
              onManualFulfill={this.props.onManualFulfill}
              onManualUnfulfill={this.props.onManualUnfulfill}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default RequirementSetComponent;
