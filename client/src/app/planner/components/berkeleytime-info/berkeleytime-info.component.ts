import { Component, OnInit, Input, ViewChild, SecurityContext, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BerkeleytimeData } from 'common/prototypes/berkeleytime-data';

@Component({
  selector: 'app-berkeleytime-info',
  templateUrl: './berkeleytime-info.component.html',
  styleUrls: ['./berkeleytime-info.component.scss'],
})
export class BerkeleytimeInfoComponent implements OnInit {
  @Input() berkeleytimeData: BerkeleytimeData;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('berkeleytimeIframe', { static: true }) private iframeTemplate: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private iframeModal: NgbModalRef;

  constructor(public sanitizer: DomSanitizer, private modalService: NgbModal) {
    this.iframeModal = null;
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
    if (!this.berkeleytimeData.berkeleytimeId) {
      return defaultUrl;
    }
    const url = `https://berkeleytime.com/grades/0-${this.berkeleytimeData.berkeleytimeId}-all-all`;
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  /**
   * Emit event to open berkeleytime modal
   */
  showBerkeleytimeDistribution(): void {
    if (this.iframeModal) {
      this.iframeModal.close();
    }
    this.iframeModal = this.modalService.open(this.iframeTemplate);
  }

  isAvailable(): boolean {
    if (this.berkeleytimeData.berkeleytimeId === null || this.berkeleytimeData.berkeleytimeId === undefined) {
      return false;
    }
    let badBerkeleytime = !this.berkeleytimeData.grade;
    badBerkeleytime =
      badBerkeleytime &&
      !(Array.isArray(this.berkeleytimeData.semestersOffered) && this.berkeleytimeData.semestersOffered.length);
    if (badBerkeleytime) {
      // If berkeleytime returns poop...
      return false;
    }
    return true;
  }

  /**
   * What to display for the semester
   */
  getSemesterText(): string[] {
    if (!Array.isArray(this.berkeleytimeData.semestersOffered)) {
      return ['unavailable'];
    }
    return this.berkeleytimeData.semestersOffered.length ? this.berkeleytimeData.semestersOffered : ['unavailable'];
  }
}
