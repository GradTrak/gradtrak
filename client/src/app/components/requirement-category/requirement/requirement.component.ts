import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { MutexRequirement } from 'models/requirements/mutex-requirement.model';
import { UnitRequirement } from 'models/requirements/unit-requirement.model';

@Component({
  selector: '[app-requirement]',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.scss', '../requirement-category.component.scss'],
})
export class RequirementComponent implements OnInit {
  @Input() readonly requirement: Requirement;
  @Input() readonly courses: Course[];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('standardReq', { static: true }) private standardReq: TemplateRef<any>;
  @ViewChild('multiReqOne', { static: true }) private multiReqOne: TemplateRef<any>;
  @ViewChild('multiReqSome', { static: true }) private multiReqSome: TemplateRef<any>;
  @ViewChild('multiReqAll', { static: true }) private multiReqAll: TemplateRef<any>;
  @ViewChild('unitReq', { static: true }) private unitReq: TemplateRef<any>;
  @ViewChild('mutexReq', { static: true }) private mutexReq: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor() {}

  ngOnInit(): void {}

  isMulti(): boolean {
    return this.requirement instanceof MultiRequirement && !this.requirement.hidden;
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

  /**
   * Returns the CSS class name based on the fulfillment status of sub-requirements of a {@link MutexRequirement}, which
   * can be fulfilled, potentially fulfilled, or unfullfilled.
   *
   * @param object reqFulfillment An object containing each requirement and its fulfillment status.
   * @return string A CSS class based on the fulfillment status of the requirement.
   */
  getMutexFulfillment(reqFulfillment: { requirement: Requirement; fulfillment: number }): string {
    switch (reqFulfillment.fulfillment) {
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
      const multiReq = this.getMulti();
      if (multiReq.numRequired === multiReq.requirements.length) {
        return this.multiReqAll;
      }
      if (multiReq.numRequired === 1) {
        return this.multiReqOne;
      }
      return this.multiReqSome;
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
}
