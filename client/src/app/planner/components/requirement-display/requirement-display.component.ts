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
  sortDescending: boolean = false;
  sortField: 'no' | 'name' | 'grade' = 'no';

  constructor(private courseService: CourseService, private berkeleytimeService: BerkeleytimeService) {}

  ngOnInit(): void {}

  getFulfillingCourses(): Observable<Course[]> {
    return this.courseService.getCourses().pipe(
      map((courses: Course[]) =>
        courses.filter((course) => {
          return this.requirementInput.canFulfill(course);
        }),
      ),
      map((courses: Course[]) => {
        const sortByNo = (a: Course, b: Course) => {
          if (a.dept === b.dept) {
            return parseInt(a.no.replace(/\D/g,''), 10) - parseInt(b.no.replace(/\D/g,''), 10)
              || a.no < b.no? 1: -1;
              // First sort by number, if numbers are the same then by the string
          }
          return a.dept < b.dept? 1: -1;
        }
        switch (this.sortField) {
          case 'no':
            courses.sort(sortByNo);
            break;
          case 'name':
            courses.sort((a: Course, b: Course) => {
              return a.getName() < b.getName()? 1: -1;
            })
            break;
          case 'grade':
            courses.sort((a: Course, b: Course) => {
              const gradeA = this.berkeleytimeService.getGrade(a);
              const gradeB = this.berkeleytimeService.getGrade(b);
              if (gradeA === gradeB) {
                return sortByNo(a, b)
              }
              if (gradeA[0] === gradeB[0]) {
                let score = 0;
                score += +(gradeA[1] === '-') - +(gradeA[1] === '+');
                score -= +(gradeB[1] === '-') - +(gradeB[1] === '+');
                // + is "smaller" since we default to ascending and 
                // It's natural to sort by highest grade.
                return score;
              }
              return gradeA[0] < gradeB[0]? -1: 1;
            });
            break;
          default: 
            console.error(`Invalid field to sort by. Got ${this.sortField}`);
        }
        if (this.sortDescending) {
          courses.reverse();
        }
        return courses;
      })
    );
  }

  viewCourseBerkeleytime(course: Course): void {
    this.berkeleytimeViewed.emit(course);
  }
}
