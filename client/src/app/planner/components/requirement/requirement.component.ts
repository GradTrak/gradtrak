import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../models/course.model';
import { FulfillmentType } from '../../models/fulfillment-type.model';
import { Requirement } from '../../models/requirement.model';
import { MultiRequirement } from '../../models/requirements/multi-requirement.model';
import { MutexRequirement } from '../../models/requirements/mutex-requirement.model';
import { UnitRequirement } from '../../models/requirements/unit-requirement.model';
import { PolyRequirement } from '../../models/requirements/poly-requirement.model';
import { StandaloneRequirement } from '../../models/requirements/standalone-requirement.model';
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
  @Input() readonly fulfillmentMap: Map<Requirement, FulfillmentType>;
  @Output() readonly onManualFulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();
  @Output() readonly onManualUnfulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();

  displayedRequirement: Requirement;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('standardReq', { static: true }) private standardReq: TemplateRef<any>;
  @ViewChild('multiReq', { static: true }) private multiReq: TemplateRef<any>;
  @ViewChild('unitReq', { static: true }) private unitReq: TemplateRef<any>;
  @ViewChild('mutexReq', { static: true }) private mutexReq: TemplateRef<any>;
  @ViewChild('tagReq', { static: true }) private tagReq: TemplateRef<any>;
  @ViewChild('requirementDisplayTemplate', { static: false }) private requirementDisplayTemplate: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private requirementDisplayModalReference: NgbModalRef;

  constructor(private modalService: NgbModal) {}

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

  isMutex(): boolean {
    return this.requirement instanceof MutexRequirement;
  }

  getMutex(): MutexRequirement {
    if (!this.isMutex()) {
      throw new Error('Attempted to retreive non-MutexRequirement as MutexRequirement');
    }
    return this.requirement as MutexRequirement;
  }

  getFulfillment(): string[] {
    const fulfillments: string[] = [];
    const fulfillment: string = this.fulfillmentMap.get(this.requirement);
    if (fulfillment === 'manual') {
      fulfillments.push('fulfilled');
    }
    fulfillments.push(fulfillment);
    return fulfillments;
  }

  /**
   * Returns the CSS class name based on the fulfillment status of sub-requirements of a {@link MutexRequirement}, which
   * can be fulfilled, potentially fulfilled, or unfullfilled.
   *
   * @param number reqFulfillment A fulfillment status as output by {@link MutexRequirement#getFulfillment}.
   * @return string A CSS class based on the fulfillment status of the requirement.
   */
  getMutexFulfillment(reqFulfillment: number): string {
    switch (reqFulfillment) {
      case MutexRequirement.FULFILLED:
        return 'fulfilled';
      case MutexRequirement.POTENTIAL:
        return 'potential';
      default:
        return 'unfulfilled';
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
    if (this.isMutex()) {
      return this.mutexReq;
    }
    if (this.isUnit()) {
      return this.unitReq;
    }
    return this.standardReq;
  }

  getAnnotation(): string {
    // FIXME Remove check for getAnnotation
    if (this.requirement.getAnnotation) {
      let annotation: string = this.requirement.getAnnotation();
      if (annotation) {
        annotation = annotation.replace(/\n/g, '<br />');
      }
      return annotation;
    }
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

  openRequirementDisplay(requirement: Requirement): void {
    this.displayedRequirement = requirement;
    this.requirementDisplayModalReference = this.modalService.open(this.requirementDisplayTemplate, { size: 'lg' });
  }

  closeRequirementDisplay(): void {
    this.requirementDisplayModalReference.close();
  }
}
