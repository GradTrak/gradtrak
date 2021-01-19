import { Component, OnInit, Input, ViewChild, SecurityContext, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../models/course.model';

/* Make sure you modify hasAllFields below. */
type FieldType = 'grade' | 'semesters-offered' | 'grade-distribution';

@Component({
  selector: 'app-berkeleytime-info',
  templateUrl: './berkeleytime-info.component.html',
  styleUrls: ['./berkeleytime-info.component.scss'],
})
export class BerkeleytimeInfoComponent implements OnInit {
  @Input() readonly course: Course;
  @Input() readonly fields: FieldType[];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('allInfo', { static: true }) private allInfoTemplate: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private allInfoModal: NgbModalRef;

  constructor(public sanitizer: DomSanitizer, private modalService: NgbModal) {
    this.allInfoModal = null;
  }

  ngOnInit(): void {}

  /*
   * Generates the grade url for the selected course, assuming there
   * is a valid one. Does not check for whether the course actually exists
   * in berkeleytime or whether the course is valid in terms of
   * amount of grading information we have.
   */
  getBerkeleytimeGradeUrl(): string {
    const defaultUrl = 'https://berkeleytime.com/grades';
    if (!this.course.berkeleytimeData.berkeleytimeId) {
      return defaultUrl;
    }
    const url = `https://berkeleytime.com/grades/0-${this.course.berkeleytimeData.berkeleytimeId}-all-all`;
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  isAvailable(): boolean {
    // TODO These checks need to be re-worked after we enable strict typing.
    if (
      !this.course.berkeleytimeData ||
      this.course.berkeleytimeData.berkeleytimeId === null ||
      this.course.berkeleytimeData.berkeleytimeId === undefined
    ) {
      return false;
    }
    let badBerkeleytime = !this.course.berkeleytimeData.grade;
    badBerkeleytime =
      badBerkeleytime &&
      !(
        Array.isArray(this.course.berkeleytimeData.semestersOffered) &&
        this.course.berkeleytimeData.semestersOffered.length
      );
    if (badBerkeleytime) {
      // If berkeleytime returns poop...
      return false;
    }
    return true;
  }

  /**
   * What to display for the semester
   */
  getSemesterText(): string {
    if (
      !Array.isArray(this.course.berkeleytimeData.semestersOffered) ||
      this.course.berkeleytimeData.semestersOffered.length === 0
    ) {
      return 'Unavailable';
    }
    return this.course.berkeleytimeData.semestersOffered.slice(0, 5).join(', ');
  }

  /**
   * Returns whether the component has the given field.
   *
   * @param {FieldType} The field.
   * @return {boolean} Whether the component has the field.
   */
  hasField(field: FieldType): boolean {
    return !this.fields || this.fields.includes(field);
  }

  /**
   * Returns whether all fields are present.
   *
   * @return {boolean} Whether all fields are present.
   */
  hasAllFields(): boolean {
    return (
      !this.fields ||
      (this.fields.includes('grade') &&
        this.fields.includes('semesters-offered') &&
        this.fields.includes('grade-distribution'))
    );
  }

  /**
   * Opens a modal with all info displayed.
   */
  openAllInfo(): void {
    this.allInfoModal = this.modalService.open(this.allInfoTemplate, { size: 'xl' });
  }
}
