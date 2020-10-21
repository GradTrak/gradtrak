import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { Requirement } from '../../models/requirement.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-requirement-display',
  templateUrl: './requirement-display.component.html',
  styleUrls: ['./requirement-display.component.scss'],
})
export class RequirementDisplayComponent implements OnInit {
  @Input() requirementInput: Requirement;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {}

  getFulfillingCourses(): Observable<Course[]> {
    return this.courseService.getCourses().pipe(
      map((courses: Course[]) =>
        courses.filter((course) => {
          return this.requirementInput.canFulfill(course);
        }),
      ),
    );
  }
}
