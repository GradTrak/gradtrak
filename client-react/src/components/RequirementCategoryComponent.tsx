import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { ProcessedFulfillmentType } from '../lib/process-requirements';
import { Course } from '../models/course.model';
import { Requirement } from '../models/requirement.model';
import { RequirementCategory } from '../models/requirement-category.model';

import RequirementComponent from './RequirementComponent';

type RequirementCategoryComponentProps = {
  requirementCategory: RequirementCategory;
  courses: Course[];
  manuallyFulfilled: Set<string>;
  fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
  onOpenGoalSelector: () => void;
  onOpenRequirementDisplay: (req: Requirement) => void;
  onManualFulfill: (req: Requirement) => void;
  onManualUnfulfill: (req: Requirement) => void;
};

type RequirementCategoryComponentState = {
  collapsed: boolean;
};

class RequirementCategoryComponent extends React.Component<
  RequirementCategoryComponentProps,
  RequirementCategoryComponentState
> {
  constructor(props: RequirementCategoryComponentProps) {
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
      <div className={this.state.collapsed ? 'collapsed' : null}>
        <Row className="name">
          <Col className="px-1" xs="auto">
            <i className="dropdown-arrow material-icons" onClick={this.handleToggleCollapsed}>
              arrow_drop_down
            </i>
          </Col>
          <Col className="px-1">{this.props.requirementCategory.name}</Col>
        </Row>
        <div className="requirements">
          {this.props.requirementCategory.requirements.map((req) => (
            <RequirementComponent
              key={req.id}
              requirement={req}
              courses={this.props.courses}
              manuallyFulfilled={this.props.manuallyFulfilled}
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

export default RequirementCategoryComponent;
