import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Course } from '../../models/course.model';
import { Requirement } from '../../models/requirement.model';
import { MultiRequirement } from '../../models/requirements/multi-requirement.model';
import { UnitRequirement } from '../../models/requirements/unit-requirement.model';
import { PolyRequirement } from '../../models/requirements/poly-requirement.model';
import { StandaloneRequirement } from '../../models/requirements/standalone-requirement.model';
import { CountRequirement } from '../../models/requirements/count-requirement.model';
import { RegexRequirement } from '../../models/requirements/regex-requirement.model';

import { ProcessedFulfillmentType } from '../../lib/process-requirements';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.scss'],
})
export class RequirementComponent implements OnInit {
  @Input() readonly requirement: Requirement;
  @Input() readonly courses: Course[];
  @Input() readonly override: string;
  @Input() readonly manuallyFulfilled: Set<string>;
  @Input() readonly fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
  @Output() readonly onManualFulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();
  @Output() readonly onManualUnfulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();
  @Output() readonly openRequirementDisplay: EventEmitter<Requirement> = new EventEmitter<Requirement>();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('standardReq', { static: true }) private standardReq: TemplateRef<any>;
  @ViewChild('multiReq', { static: true }) private multiReq: TemplateRef<any>;
  @ViewChild('unitReq', { static: true }) private unitReq: TemplateRef<any>;
  @ViewChild('tagReq', { static: true }) private tagReq: TemplateRef<any>;
  @ViewChild('countReq', { static: true }) private countReq: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  ngOnInit(): void {}

  isStandalone(): boolean {
    return this.requirement instanceof StandaloneRequirement;
  }

  getStandalone(): StandaloneRequirement {
    if (!this.isStandalone()) {
      throw new Error('Attempted to retreive non-StandaloneRequirement as StandaloneRequirement');
    }
    return this.requirement as StandaloneRequirement;
  }

  isMulti(): boolean {
    return this.requirement instanceof MultiRequirement || this.isPoly();
  }

  isPoly(): boolean {
    return this.requirement instanceof PolyRequirement;
  }

  getMulti(): MultiRequirement {
    if (!this.isMulti()) {
      throw new Error('Attempted to retreive non-MultiRequirement as MultiRequirement');
    }
    return this.requirement as MultiRequirement;
  }

  /**
   * Standalone requirements and unit requirements can show requirement display.
   */
  hasDisplay(): boolean {
    return this.isStandalone() || this.isUnit() || this.isCount();
  }

  getFulfillment(): string[] {
    const fulfillments: string[] = [];
    fulfillments.push(this.fulfillmentMap.get(this.requirement).status);
    if (this.isManuallyFulfilled()) {
      fulfillments.push('manual');
    }
    return fulfillments;
  }

  getFulfillingCourses(): string[] {
    const fulfillment: ProcessedFulfillmentType = this.fulfillmentMap.get(this.requirement);
    if (fulfillment.method === 'courses') {
      return Array.from(fulfillment.coursesUsed).map((course: Course) => course.getName());
    } else {
      return [];
    }
  }

  isUnit(): boolean {
    return this.requirement instanceof UnitRequirement;
  }

  getUnit(): UnitRequirement {
    if (!this.isUnit()) {
      throw new Error('Attempted to retreive non-UnitRequirement as UnitRequirement');
    }
    return this.requirement as UnitRequirement;
  }

  isCount(): boolean {
    return this.requirement instanceof CountRequirement;
  }

  getCount(): CountRequirement {
    if (!this.isCount()) {
      throw new Error('Attempted to retrieve non-CountRequirement as CountRequirement');
    }
    return this.requirement as CountRequirement;
  }

  isRegex(): boolean {
    return this.requirement instanceof RegexRequirement;
  }

  getRegex(): RegexRequirement {
    if (!this.isRegex()) {
      throw new Error('Attempted to retrieve non-RegexRequirement as RegexRequirement');
    }
    return this.requirement as RegexRequirement;
  }

  /**
   * Returns the HTML template of the requirement based on its type.
   *
   * @return {TemplateRef<any>} The template of the requirement.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getReqTemplate(): TemplateRef<any> {
    if (this.isMulti()) {
      return this.multiReq;
    }
    if (this.isUnit()) {
      return this.unitReq;
    }
    if (this.isCount()) {
      return this.countReq;
    }
    return this.standardReq;
  }

  getAnnotation(): string {
    /* let annotation: string = this.requirement.getAnnotation();
    if (annotation) {
      annotation = annotation.replace(/\n/g, '<br />');
    }
    return annotation; */
    // TODO Custom annotations system
    return null;
  }

  isManuallyFulfilled(): boolean {
    return this.manuallyFulfilled && this.manuallyFulfilled.has(this.requirement.id);
  }

  manuallyFulfill(requirement: Requirement): void {
    this.onManualFulfill.emit(requirement);
  }

  manuallyUnfulfill(requirement: Requirement): void {
    this.onManualUnfulfill.emit(requirement);
  }
}
