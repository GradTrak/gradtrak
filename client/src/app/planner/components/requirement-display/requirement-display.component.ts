import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { Requirement } from '../../models/requirement.model';
import { CourseService } from '../../services/course.service';
import { BerkeleytimeService } from '../../services/berkeleytime.service';

@Component({
  selector: 'app-requirement-display',
  templateUrl: './requirement-display.component.html',
  styleUrls: ['./requirement-display.component.scss'],
})
export class RequirementDisplayComponent implements OnInit {
  @Input() requirementInput: Requirement;
  /* Views the berkeleytime information about a course */
  @Output() berkeleytimeViewed: EventEmitter<Course> = new EventEmitter<Course>();

  constructor(private courseService: CourseService, private berkeleytimeService: BerkeleytimeService) {}

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

  viewCourseBerkeleytime(course: Course): void {
    this.berkeleytimeViewed.emit(course);
  }
}
