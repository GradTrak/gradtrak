import React from 'react';
import { Col, Row } from 'react-bootstrap';

import { ProcessedFulfillmentType } from '../lib/process-requirements';
import { Requirement } from '../models/requirement.model';
import { RequirementSet } from '../models/requirement-set.model';

import RequirementCategoryComponent from './RequirementCategoryComponent';

import './RequirementSetComponent.css';

type RequirementSetComponentProps = {
  requirementSet: RequirementSet;
  fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
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
              fulfillmentMap={this.props.fulfillmentMap}
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
