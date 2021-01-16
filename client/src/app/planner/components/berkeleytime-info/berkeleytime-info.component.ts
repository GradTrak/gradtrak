import { Component, OnInit, Directive, Input, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BerkeleytimeData } from '../../models/course.model';

/**
 * Without the directive, the iframe will
 * refresh everything the src function is called,
 * even if it's the same function. This results in refreshing
 * the iframe when focus is lost and whatnot. This cache
 * addresses it by only changing when the source changes
 * source: https://stackoverflow.com/questions/48306443/stop-angular-reloading-iframes-when-changing-components
 */
@Directive({
  selector: 'iframe',
})
export class CachedSrcDirective {
  @Input()
  public get cachedSrc(): string {
    return this.elRef.nativeElement.src;
  }

  public set cachedSrc(src: string) {
    if (this.elRef.nativeElement.src !== src) {
      this.renderer.setAttribute(this.elRef.nativeElement, 'src', src);
    }
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}

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

  constructor(private modalService: NgbModal) {
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
    return url;
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
