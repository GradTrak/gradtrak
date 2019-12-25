import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';

@Component({
  selector: '[app-requirement]',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css', '../requirement-category.component.css'],
})
export class RequirementComponent implements OnInit {
  @Input() requirement: Requirement;
  @Input() courses: Course[];

  constructor() {}

  ngOnInit(): void {}

  getRequirementRows(req: Requirement): Requirement[] {
    if (req instanceof MultiRequirement && !req.hidden) {
      return req.requirements.flatMap(this.getRequirementRows);
    }
    return [req];
  }

  // TODO TSX?
  getAnnotation(req: Requirement): string {
    // FIXME Remove check for getAnnotation
    if (req.getAnnotation) {
      let annotation: string = req.getAnnotation();
      if (annotation) {
        annotation = annotation.replace(/\n/g, '<br />');
      }
      return annotation;
    }
    return null;
  }
}
