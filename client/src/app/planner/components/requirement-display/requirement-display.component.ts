import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  /* Views the berkeleytime information about a course */
  @Output() openBerkeleytime: EventEmitter<Course> = new EventEmitter<Course>();
  sortDescending: boolean = false;
  // TODO: use this.NO and whatnot? instead of fixed strings?
  sortField: 'no' | 'title' | 'grade' = 'no';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {}

  getFulfillingCourses(): Observable<Course[]> {
    return this.courseService.getCourses().pipe(
      map((courses: Course[]) =>
        courses.filter((course) => {
          return this.requirementInput.canFulfill(course);
        }),
      ),
      map((courses: Course[]) => {
        switch (this.sortField) {
          case 'no':
            courses.sort((a: Course, b: Course) => {
              return a.getName() < b.getName() ? -1 : 1;
            });
            break;
          case 'title':
            courses.sort((a: Course, b: Course) => {
              return a.title < b.title ? -1 : 1;
            });
            break;
          case 'grade':
            courses.sort((a: Course, b: Course) => {
              const gradeA = a.berkeleytimeData.grade;
              const gradeB = b.berkeleytimeData.grade;
              if (gradeA === gradeB || !(gradeA || gradeB)) {
                // Default to the course Dept and No. if equal or both null
                return a.getName() < b.getName() ? 1 : -1;
              }
              if (!gradeA !== !gradeB) {
                // if one is truthy and the other isn't
                if (!gradeA) {
                  // If grade A is null but b isn't
                  return 1;
                }
                if (!gradeB) {
                  // If grade B is null but A isn't
                  return -1;
                }
              }
              if (gradeA[0] === gradeB[0]) {
                let score = 0;
                score += +(gradeA[1] === '-') - +(gradeA[1] === '+');
                score -= +(gradeB[1] === '-') - +(gradeB[1] === '+');
                // + is "smaller" since we default to ascending and
                // It's natural to sort by highest grade.
                return score;
              }
              return gradeA[0] < gradeB[0] ? -1 : 1;
            });
            break;
          default:
            console.error(`Invalid field to sort by. Got ${this.sortField}`);
        }
        if (this.sortDescending) {
          courses.reverse();
        }
        return courses;
      }),
    );
  }

  viewCourseBerkeleytime(course: Course): void {
    this.openBerkeleytime.emit(course);
  }

  /**
   * Given an input of what the user clicked, change the sorting
   * accordingly. Defaults to descending and switches the sort
   * order if you click on the same field multiple times.
   */
  changeSort(clicked: 'no' | 'title' | 'grade'): void {
    if (clicked === this.sortField) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.sortField = clicked;
      this.sortDescending = false;
    }
  }
}
