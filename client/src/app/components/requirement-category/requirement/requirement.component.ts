import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { MutexRequirement } from 'models/requirements/mutex-requirement.model';
import { UnitRequirement } from 'models/requirements/unit-requirement.model';
import { PolyRequirement } from 'models/requirements/poly-requirement.model';
import { TagRequirement } from 'models/requirements/tag-requirement.model';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.scss', '../requirement-category.component.scss'],
})
export class RequirementComponent implements OnInit {
  @Input() readonly requirement: Requirement;
  @Input() readonly courses: Course[];
  @Input() readonly override: string;
  @Input() readonly manuallyFulfilled: string[];

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

  isMulti(): boolean {
    return this.requirement instanceof MultiRequirement;
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

  getFulfillment(): string {
    if (this.override) {
      return this.override;
    } else if (this.requirement.isFulfilled(this.courses, this.manuallyFulfilled)) {
      return 'fulfilled';
    } else {
      return 'unfulfilled';
    }
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

  isTag(): boolean {
    return this.requirement instanceof TagRequirement;
  }

  getTag(): TagRequirement {
    if (!this.isTag()) {
      throw new Error('Attempted to retreive non-TagRequirement as TagRequirement');
    }
    return this.requirement as TagRequirement;
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
    if (this.isTag()) {
      return this.tagReq;
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

  isManuallyFulfilled(requirement: Requirement): boolean {
    return this.manuallyFulfilled && this.manuallyFulfilled.includes(requirement.id);
  }

  openRequirementDisplay(requirement: Requirement): void {
    this.displayedRequirement = requirement;
    this.requirementDisplayModalReference = this.modalService.open(this.requirementDisplayTemplate, { size: 'lg' });
  }

  closeRequirementDisplay(): void {
    this.requirementDisplayModalReference.close();
  }
}
