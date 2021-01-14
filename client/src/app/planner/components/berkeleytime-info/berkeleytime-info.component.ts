import { Component, EventEmitter, OnInit, Output, Directive, Input, ElementRef, Renderer2, NgModule } from '@angular/core';

import { DomSanitizer } from "@angular/platform-browser";
import { Course } from '../../models/course.model';

@Directive({
  selector: 'iframe'
})

@Component({
  selector: 'app-berkeleytime-info',
  templateUrl: './berkeleytime-info.component.html',
})


export class BerkeleytimeInfoComponent implements OnInit {
  readonly BERKELEYTIME_UNAVAILABLE_NO_COURSE_SELECTED = 0;
  readonly BERKELEYTIME_UNAVAILABLE_COURSE_SELECTED = 1;
  readonly BERKELEYTIME_AVAILABLE = 2;
  @Input() searchedCourse: Course;

  constructor(private sanitizer: DomSanitizer) {}


  ngOnInit(): void {

  }

  berkeleytimeStatus(): number {
    if (!(this.searchedCourse instanceof Course)) {
      return this.BERKELEYTIME_UNAVAILABLE_NO_COURSE_SELECTED;
    }
    if (!this.searchedCourse.berkeleytimeData.berkeleytimeId) {
      return this.BERKELEYTIME_UNAVAILABLE_COURSE_SELECTED;
    }
    return this.BERKELEYTIME_AVAILABLE;
  }

  /*
   * Generates the grade url for the selected course, assuming there 
   * is a valid one. Does not check for whether the course actually exists 
   * in berkeleytime or whether the course is valid in terms of 
   * amount of grading information we have.
   */
  getBerkeleytimeGradeUrl(): string {
    // TODO fix the tslint stuff with the "any"
    const defaultUrl = 'https://berkeleytime.com/grades';
    if (!this.searchedCourse) {
      return defaultUrl;
    }
    if (!this.searchedCourse.berkeleytimeData.berkeleytimeId) {
      // TODO handle these cases
      return defaultUrl;
    }
    const url = `https://berkeleytime.com/grades/0-${this.searchedCourse.berkeleytimeData.berkeleytimeId}-all-all`;
    return url;
  }
}
