import React from 'react';
import { Col, Row } from 'react-bootstrap';

import { ProcessedFulfillmentType } from '../lib/process-requirements';
import { Requirement } from '../models/requirement.model';
import { StandaloneRequirement } from '../models/requirements/standalone-requirement.model';
import { RequirementCategory } from '../models/requirement-category.model';

import RequirementComponent from './RequirementComponent';

import './RequirementCategoryComponent.css';

type RequirementCategoryComponentProps = {
  requirementCategory: RequirementCategory;
  fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
  onOpenGoalSelector: () => void;
  onOpenRequirementDisplay: (req: StandaloneRequirement) => void;
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
      <div className={`RequirementCategory ${this.state.collapsed ? 'RequirementCategory--collapsed' : ''}`}>
        <Row className="RequirementCategory__name">
          <Col className="px-1" xs="auto">
            <i className="material-icons RequirementCategory__dropdown-arrow" onClick={this.handleToggleCollapsed}>
              arrow_drop_down
            </i>
          </Col>
          <Col className="px-1">{this.props.requirementCategory.name}</Col>
        </Row>
        <div className="RequirementCategory__requirements">
          {this.props.requirementCategory.requirements.map((req) => (
            <RequirementComponent
              key={req.id}
              requirement={req}
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
