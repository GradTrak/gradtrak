import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { Requirement } from '../../models/requirement.model';
import { CourseService } from '../../services/course.service';

type SortType = 'no' | 'title' | 'grade';

@Component({
  selector: 'app-requirement-display',
  templateUrl: './requirement-display.component.html',
  styleUrls: ['./requirement-display.component.scss'],
})
export class RequirementDisplayComponent implements OnInit {
  @Input() requirementInput: Requirement;

  /* Views the berkeleytime information about a course */
  sortField: SortType;
  sortDescending: boolean;
  selectedCourse: Course;

  constructor(private courseService: CourseService) {
    this.sortField = 'no';
    this.selectedCourse = null;
  }

  ngOnInit(): void {}

  getFulfillingCourses(): Observable<Course[]> {
    return this.courseService.getCourses().pipe(
      map((courses: Course[]) =>
        courses.filter((course) => {
          return this.requirementInput.canFulfill(course);
        }),
      ),
      map((coursesInput: Course[]) => {
        const courses = [...coursesInput];
        let comparator: (a: Course, b: Course) => number;
        switch (this.sortField) {
          case 'no':
            comparator = (a: Course, b: Course): number => {
              return a.getName() < b.getName() ? -1 : 1;
            };
            break;
          case 'title':
            comparator = (a: Course, b: Course): number => {
              return a.title < b.title ? -1 : 1;
            };
            break;
          case 'grade':
            comparator = (a: Course, b: Course): number => {
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
            };
            break;
        }

        /* Reverse the comparator if we are sorting descending. */
        let reversedComparator = (a, b) => -comparator(a, b);

        courses.sort(reversedComparator);
        return courses;
      }),
    );
  }

  viewCourseBerkeleytime(course: Course): void {
    this.selectedCourse = course;
  }

  /**
   * Given an input of what the user clicked, change the sorting
   * accordingly. Defaults to descending and switches the sort
   * order if you click on the same field multiple times.
   */
  changeSort(clicked: SortType): void {
    if (clicked === this.sortField) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.sortField = clicked;
      this.sortDescending = false;
    }
  }
}
