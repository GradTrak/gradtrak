import { Component, OnInit, Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

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
})
export class BerkeleytimeInfoComponent implements OnInit {
  @Input() berkeleytimeData: {
    berkeleytimeId: string;
    grade: string;
    semestersOffered: string[];
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  /*
   * Generates the grade url for the selected course, assuming there
   * is a valid one. Does not check for whether the course actually exists
   * in berkeleytime or whether the course is valid in terms of
   * amount of grading information we have.
   */
  getBerkeleytimeGradeUrl(): string {
    // TODO fix the tslint stuff with the "any"
    const defaultUrl = 'https://berkeleytime.com/grades';
    if (!this.berkeleytimeData.berkeleytimeId) {
      return defaultUrl;
    }
    const url = `https://berkeleytime.com/grades/0-${this.berkeleytimeData.berkeleytimeId}-all-all`;
    return url;
  }
}
