import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { MutexRequirement } from 'models/requirements/mutex-requirement.model';
import { UnitRequirement } from 'models/requirements/unit-requirement.model';
import { TagRequirement } from 'models/requirements/tag-requirement.model';
import { CourseService } from 'services/course.service';

@Component({
  selector: 'app-requirement-display',
  templateUrl: './requirement-display.component.html',
  styleUrls: ['./requirement-display.component.scss'],
})
export class RequirementDisplayComponent implements OnInit {
  allCourses: Course[];
  requirementCourses: Course[];
  @Input() requirementInput: Requirement;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.allCourses = courses;
      this.requirementCourses = this.allCourses.filter((course) => {
        if (this.requirementInput instanceof TagRequirement) {
          return this.requirementInput.isFulfillableBy(course);
        }
        if (this.requirementInput instanceof UnitRequirement) {
          return this.requirementInput.requirement.isFulfillableBy(course);
        }
        if (this.requirementInput instanceof MutexRequirement) {
          return this.requirementInput.requirements.filter((requirement) => {
            requirement.isFulfillableBy(course);
          });
        }
      });
    });
  }
}
