import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'models/course.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';
import { CourseService } from 'services/course.service';

@Component({
  selector: 'app-requirement-display',
  templateUrl: './requirement-display.component.html',
  styleUrls: ['./requirement-display.component.scss'],
})
export class RequirementDisplayComponent implements OnInit {
  allCourses: Course[];
  requirementCourses: Course[];
  @Input() requirementInput: StandaloneRequirement;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.allCourses = courses;
      console.log(this.requirementInput);
      this.requirementCourses = this.allCourses.filter((course) => {
        return this.requirementInput.isFulfillableBy(course);
      });
    });
  }
}
