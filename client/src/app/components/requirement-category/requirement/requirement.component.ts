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
    if (req instanceof MultiRequirement) {
      return req.requirements.flatMap(this.getRequirementRows);
    }
    return [req];
  }
}
