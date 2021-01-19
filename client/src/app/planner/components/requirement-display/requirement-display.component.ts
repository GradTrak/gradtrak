import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { StandaloneRequirement } from '../../models/requirements/standalone-requirement.model';
import { CourseService } from '../../services/course.service';

type SortType = 'no' | 'title' | 'grade';

@Component({
  selector: 'app-requirement-display',
  templateUrl: './requirement-display.component.html',
  styleUrls: ['./requirement-display.component.scss'],
})
export class RequirementDisplayComponent implements OnInit {
  @Input() requirementInput: StandaloneRequirement;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('courseInfo', { static: true }) private readonly courseInfoTemplate: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  /* Views the berkeleytime information about a course */
  sortField: SortType;
  sortDescending: boolean;
  selectedCourse: Course;
  courseInfoModal: NgbModalRef;

  constructor(private modalService: NgbModal, private courseService: CourseService) {
    this.sortField = 'no';
    this.selectedCourse = null;
    this.courseInfoModal = null;
  }

  ngOnInit(): void {}

  getFulfillingCourses(): Observable<Course[]> {
    return this.courseService.getCourses().pipe(
      map((courses: Course[]) =>
        courses.filter((course) => {
          return this.requirementInput.isFulfilledWith(course);
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
              // TODO Nullish coalescing operator please. Should also be removed with strict null checks.
              const gradeA = a.berkeleytimeData && a.berkeleytimeData.grade;
              const gradeB = b.berkeleytimeData && b.berkeleytimeData.grade;
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
          default:
            throw new Error(`Invalid sort field: ${this.sortField}`);
        }

        /* Reverse the comparator if we are sorting descending. */
        const reversedComparator = this.sortDescending
          ? (a: Course, b: Course): number => -comparator(a, b)
          : comparator;

        courses.sort(reversedComparator);
        return courses;
      }),
    );
  }

  viewCourseBerkeleytime(course: Course): void {
    this.selectedCourse = course;
    this.courseInfoModal = this.modalService.open(this.courseInfoTemplate, { size: 'xl' });
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
