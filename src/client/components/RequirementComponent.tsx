import React from 'react';
import { Dropdown, Modal, OverlayTrigger, Popover } from 'react-bootstrap';

import { ProcessedFulfillmentType } from '../lib/process-requirements';
import { Requirement } from '../models/requirement.model';
import { CountRequirement } from '../models/requirements/count-requirement.model';
import { MultiRequirement } from '../models/requirements/multi-requirement.model';
import { PolyRequirement } from '../models/requirements/poly-requirement.model';
import { StandaloneRequirement } from '../models/requirements/standalone-requirement.model';
import { UnitRequirement } from '../models/requirements/unit-requirement.model';
import RequirementDisplay from './RequirementDisplay';

import './RequirementComponent.css';

type RequirementComponentProps = {
  requirement: Requirement;
  fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
  onManualFulfill: (req: Requirement) => void;
  onManualUnfulfill: (req: Requirement) => void;
};

type RequirementComponentState = {
  showDisplay: boolean;
};

class RequirementComponent extends React.Component<RequirementComponentProps, RequirementComponentState> {
  constructor(props: RequirementComponentProps) {
    super(props);

    this.state = {
      showDisplay: false,
    };
  }

  openDisplay = (): void => {
    this.setState({
      showDisplay: true,
    });
  };

  closeDisplay = (): void => {
    this.setState({
      showDisplay: false,
    });
  };

  private getDisplayRequirement = (): StandaloneRequirement => {
    /* Courses can be displayed for standalone, unit, and count requirements. */
    if (this.props.requirement instanceof StandaloneRequirement) {
      return this.props.requirement;
    } else if (
      this.props.requirement instanceof UnitRequirement ||
      this.props.requirement instanceof CountRequirement
    ) {
      return this.props.requirement.requirement;
    }
    return null;
  };

  private renderReqElem = (): React.ReactNode => {
    // TODO These probably belong in separate files.
    const fulfillment = this.props.fulfillmentMap.get(this.props.requirement);

    if (
      (this.props.requirement instanceof MultiRequirement || this.props.requirement instanceof PolyRequirement) &&
      !this.props.requirement.hidden
    ) {
      /* Multi-requirement display, showing nested requirements underneath.
       * Hidden requirements do not show this. */
      const numFulfilled = this.props.requirement.requirements.filter(
        (childReq) => this.props.fulfillmentMap.get(childReq).status === 'fulfilled',
      ).length;
      let numRequiredText: React.ReactNode;
      switch (this.props.requirement.numRequired) {
        case 1:
          numRequiredText = 'One of';
          break;
        case this.props.requirement.requirements.length:
          numRequiredText = 'All of';
          break;
        default:
          numRequiredText = `${numFulfilled}/${this.props.requirement.numRequired} of`;
          break;
      }
      return (
        <>
          {numRequiredText}
          {(this.props.requirement.requirements as Requirement[]).map((childReq) => (
            <RequirementComponent
              key={childReq.id}
              requirement={childReq}
              fulfillmentMap={this.props.fulfillmentMap}
              onManualFulfill={this.props.onManualFulfill}
              onManualUnfulfill={this.props.onManualUnfulfill}
            />
          ))}
        </>
      );
    } else if (this.props.requirement instanceof UnitRequirement) {
      const fulfillingCourses = fulfillment.method === 'courses' ? Array.from(fulfillment.coursesUsed) : [];
      const fulfilledUnits = fulfillingCourses.map((course) => course.units).reduce((a, b) => a + b, 0);
      return (
        <>
          {fulfilledUnits}/{this.props.requirement.units} units of {this.props.requirement.name}
          {fulfillingCourses.map((course) => (
            <div key={course.id} className="Requirement Requirement__course">
              {course.getName()}
            </div>
          ))}
        </>
      );
    } else if (this.props.requirement instanceof CountRequirement) {
      const fulfillingCourses = fulfillment.method === 'courses' ? Array.from(fulfillment.coursesUsed) : [];
      return (
        <>
          {this.props.requirement.name}
          {fulfillingCourses.map((course) => (
            <div key={course.id} className="Requirement Requirement__fulfilled">
              {course.getName()}
            </div>
          ))}
          {new Array(this.props.requirement.numRequired - fulfillingCourses.length).fill(null).map((value, index) => (
            <div key={index} className="Requirement Requirement__unfulfilled">
              {this.props.requirement.name}
            </div>
          ))}
        </>
      );
    } else {
      /* Standard requirement. */
      return this.props.requirement.name;
    }
  };

  render(): React.ReactElement {
    const fulfillment = this.props.fulfillmentMap.get(this.props.requirement);
    const manuallyFulfilled = fulfillment.method === 'manual';

    /* Fulfillment CSS classes. */
    const fulfillments: string[] = [`Requirement__${fulfillment.status}`];
    if (fulfillment.method === 'manual') {
      fulfillments.push('Requirement__manual');
    }

    let rendered = (
      <div className={`Requirement ${fulfillments.join(' ')}`}>
        <Dropdown className="Requirement__more">
          <Dropdown.Toggle className="gt-button" as="button" bsPrefix="unused">
            <i className="material-icons">more_horiz</i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {this.getDisplayRequirement() ? (
              <Dropdown.Item onClick={this.openDisplay}>Show Fulfilling Courses</Dropdown.Item>
            ) : null}
            <Dropdown.Item
              onClick={
                !manuallyFulfilled
                  ? () => this.props.onManualFulfill(this.props.requirement)
                  : () => this.props.onManualUnfulfill(this.props.requirement)
              }
            >
              Mark as {!manuallyFulfilled ? 'Fulfilled' : 'Unfulfilled'}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {this.renderReqElem()}
        <Modal size="lg" show={this.state.showDisplay} onHide={this.closeDisplay}>
          <Modal.Body>
            {this.getDisplayRequirement() ? <RequirementDisplay requirement={this.getDisplayRequirement()} /> : null}
          </Modal.Body>
        </Modal>
      </div>
    );

    // Annotations removed in v0.2.0 for now.
    ///* Annotation popover. */
    //const annotationText = this.props.requirement.getAnnotation();
    //if (annotationText) {
    //  const annotation = (
    //    <Popover id="requirement-annotation">
    //      <Popover.Content>{annotationText}</Popover.Content>
    //    </Popover>
    //  );
    //  rendered = (
    //    <OverlayTrigger trigger={['hover', 'focus']} overlay={annotation}>
    //      {rendered}
    //    </OverlayTrigger>
    //  );
    //}

    return rendered;
  }
}

export default RequirementComponent;
