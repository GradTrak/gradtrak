import React from 'react';
import { Dropdown, OverlayTrigger, Popover } from 'react-bootstrap';

import { ProcessedFulfillmentType } from '../lib/process-requirements';
import { Requirement } from '../models/requirement.model';
import { CountRequirement } from '../models/requirements/count-requirement.model';
import { MultiRequirement } from '../models/requirements/multi-requirement.model';
import { PolyRequirement } from '../models/requirements/poly-requirement.model';
import { StandaloneRequirement } from '../models/requirements/standalone-requirement.model';
import { UnitRequirement } from '../models/requirements/unit-requirement.model';

import './RequirementComponent.css';

type RequirementComponentProps = {
  requirement: Requirement;
  fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
  onOpenGoalSelector: () => void;
  onOpenRequirementDisplay: (req: StandaloneRequirement) => void;
  onManualFulfill: (req: Requirement) => void;
  onManualUnfulfill: (req: Requirement) => void;
};

function RequirementComponent(props: RequirementComponentProps): React.ReactElement {
  const fulfillment = props.fulfillmentMap.get(props.requirement);
  const manuallyFulfilled = fulfillment.method === 'manual';

  /* Fulfillment CSS classes. */
  const fulfillments: string[] = [`Requirement__${fulfillment.status}`];
  if (fulfillment.method === 'manual') {
    fulfillments.push('Requirement__manual');
  }

  /* Courses can be displayed for standalone, unit, and count requirements. */
  let displayRequirement: StandaloneRequirement = null;
  if (props.requirement instanceof StandaloneRequirement) {
    displayRequirement = props.requirement;
  } else if (props.requirement instanceof UnitRequirement || props.requirement instanceof CountRequirement) {
    displayRequirement = props.requirement.requirement;
  }

  /* Requirement element based on the requirement type. */
  // TODO This probably belongs in separate files.
  let reqElem: React.ReactElement = null;
  if (
    (props.requirement instanceof MultiRequirement || props.requirement instanceof PolyRequirement) &&
    !props.requirement.hidden
  ) {
    /* Multi-requirement display, showing nested requirements underneath.
     * Hidden requirements do not show this. */
    const numFulfilled = props.requirement.requirements.filter(
      (childReq) => this.props.fulfillmentMap.get(childReq).status === 'fulfilled',
    ).length;
    let numRequiredText: React.ReactNode;
    switch (props.requirement.numRequired) {
      case 1:
        numRequiredText = 'One of';
        break;
      case props.requirement.requirements.length:
        numRequiredText = 'All of';
        break;
      default:
        numRequiredText = `${numFulfilled}/${props.requirement.numRequired} of`;
        break;
    }
    reqElem = (
      <>
        {numRequiredText}
        {(props.requirement.requirements as Requirement[]).map((childReq) => (
          <RequirementComponent
            key={childReq.id}
            requirement={childReq}
            fulfillmentMap={props.fulfillmentMap}
            onOpenGoalSelector={props.onOpenGoalSelector}
            onOpenRequirementDisplay={props.onOpenRequirementDisplay}
            onManualFulfill={props.onManualFulfill}
            onManualUnfulfill={props.onManualUnfulfill}
          />
        ))}
      </>
    );
  } else if (props.requirement instanceof UnitRequirement) {
    const fulfillingCourses = fulfillment.method === 'courses' ? Array.from(fulfillment.coursesUsed) : [];
    const fulfilledUnits = fulfillingCourses.map((course) => course.units).reduce((a, b) => a + b, 0);
    reqElem = (
      <>
        {fulfilledUnits}/{props.requirement.units} units of {props.requirement.name}
        {fulfillingCourses.map((course) => (
          <div key={course.id} className="Requirement Requirement__course">
            {course.getName()}
          </div>
        ))}
      </>
    );
  } else if (props.requirement instanceof CountRequirement) {
    const fulfillingCourses = fulfillment.method === 'courses' ? Array.from(fulfillment.coursesUsed) : [];
    reqElem = (
      <>
        {props.requirement.name}
        {fulfillingCourses.map((course) => (
          <div key={course.id} className="Requirement Requirement__fulfilled">
            {course.getName()}
          </div>
        ))}
        {new Array(props.requirement.numRequired - fulfillingCourses.length).fill(null).map((value, index) => (
          <div key={index} className="Requirement Requirement__unfulfilled">
            {props.requirement.name}
          </div>
        ))}
      </>
    );
  } else {
    /* Standard requirement. */
    reqElem = <>{props.requirement.name}</>;
  }

  let rendered = (
    <div className={`Requirement ${fulfillments.join(' ')}`}>
      <Dropdown className="Requirement__more">
        <Dropdown.Toggle className="gt-button" as="button" bsPrefix="unused">
          <i className="material-icons">more_horiz</i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {displayRequirement ? (
            <Dropdown.Item onClick={() => props.onOpenRequirementDisplay(displayRequirement)}>
              Show Fulfilling Courses
            </Dropdown.Item>
          ) : null}
          <Dropdown.Item
            onClick={
              !manuallyFulfilled
                ? () => props.onManualFulfill(props.requirement)
                : () => props.onManualUnfulfill(props.requirement)
            }
          >
            Mark as {!manuallyFulfilled ? 'Fulfilled' : 'Unfulfilled'}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {reqElem}
    </div>
  );

  /* Annotation popover. */
  const annotationText = props.requirement.getAnnotation();
  if (annotationText) {
    const annotation = (
      <Popover id="requirement-annotation">
        <Popover.Content>{annotationText}</Popover.Content>
      </Popover>
    );
    rendered = (
      <OverlayTrigger trigger={['hover', 'focus']} overlay={annotation}>
        {rendered}
      </OverlayTrigger>
    );
  }

  return rendered;
}

export default RequirementComponent;
