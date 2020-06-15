import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-searcher',
  templateUrl: './course-searcher.component.html',
  styleUrls: ['./course-searcher.component.scss'],
})
export class CourseSearcherComponent implements OnInit {
  @Output() courseReturned: EventEmitter<Course> = new EventEmitter<Course>();
  searchedCourse: Course;
  allCourses: Course[];

  // TODO Put this somewhere more reasonable
  private static readonly DEPT_ALIASES = new Map<string, string[]>([
    ['ASTRON', ['ASTRO']],
    ['BIO ENG', ['BIOE']],
    ['BIO PHY', ['BIO P']],
    ['BIOLOGY', ['BIO']],
    ['CHM ENG', ['CHEME']],
    ['CIV ENG', ['CIVE']],
    ['CLASSIC', ['CLASSICS']],
    ['COLWRIT', ['COLLEGE WRITING']],
    ['COM LIT', ['COMPLIT']],
    ['COMPSCI', ['CS']],
    ['CY PLAN', ['CP']],
    ['DATASCI', ['DS']],
    ['DES INV', ['DESIGN']],
    ['EL ENG', ['EE']],
    ['ENE,RES', ['ER', 'ERG']],
    ['ENGIN', ['E', 'ENGINEERING']],
    ['ENV DES', ['ED']],
    ['GEOG', ['GEOLOGY']],
    ['IND ENG', ['IE', 'IEOR']],
    ['INTEGBI', ['IB']],
    ['LINGUIS', ['LING']],
    ['M E STU', ['MIDDLE EASTERN STUDIES']],
    ['MAT SCI', ['MS', 'MSE']],
    ['MCELLBI', ['MCB']],
    ['MEC ENG', ['ME', 'MECHE']],
    ['MEDIAST', ['MEDIA']],
    ['NEUROSC', ['NEUROSCI']],
    ['NUC ENG', ['NE']],
    ['NUSCTX', ['NUTRISCI']],
    ['PHILOS', ['PHIL', 'PHILO', 'PHILOSPOHY']],
    ['PHYS ED', ['PE']],
    ['PLANTBI', ['PMB']],
    ['POL SCI', ['POLI', 'POLISCI', 'PS']],
    ['POLECON', ['POLIECON']],
    ['PSYCH', ['PSYCHOLOGY']],
    ['PUB POL', ['PP', 'PUBLIC POLICY']],
    ['STAT', ['STATS']],
    ['THEATER', ['TDPS']],
    ['UGBA', ['HAAS']],
    ['VIETNMS', ['VIETNAMESE']],
  ]);

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.allCourses = courses;
    });
  }

  searchFunction(input: string, courseList: Course[]): Course[] {
    const processedInput = input.toLowerCase().replace(/[^\w]/g, ''); //remove whitespace from input.
    const resultCourses = courseList.filter((course) => {
      const canonicalName: string = course.toString();
      const names: string[] = [canonicalName];
      const deptAlises: string[] = CourseSearcherComponent.DEPT_ALIASES.get(course.dept);
      if (deptAlises) {
        names.push(...deptAlises.map((alias: string) => `${alias} ${course.no}`));
      }
      return names
        .map((name: string) => name.toLowerCase().replace(/[^\w]/g, ''))
        .some((name: string) => name.includes(processedInput));
    });
    return this.courseSorter(resultCourses, input)
  }

  /**
   * Given a list of courses, considers the current search param and sorts the
   * courses, returning an array which has the most relevant courses up top.
   * @param input The input of the user
   * @param courses the list of courses being sorted.
   */
  courseSorter(courses: Course[], input: string): Course[] {
    /**
     * Assigns a "how closely it's matched" value from 0 to 1000, from the following
     * rules, such that each level takes prece:
     * - 1000 if the course number AND dept are contained. eg cs61a
     * - 500 if the course number OR dept are matched exactly. eg compsci, cs, 61a
     * - 100 if it contains the number or dept in any way.
     * - 10 for each case of the term containing a part of the description.
     * - 1 for something else.
     * @param course a course to find the priority value for.
     */
    const priorityFunction = (course: Course) => {
      const courseNum = course.no.toLowerCase();
      let sum = 0;
      const splitSearchTerm: string[] = input.toLowerCase().split(' ')
      //If it includes any of the dept aliases
      let deptAlises: Course[] = (CourseSearcherComponent.DEPT_ALIASES.get(course.dept) || []);
      deptAlises = [...deptAlises].concat([course.dept]).map(deptName => deptName.toLowerCase());
      const containsDept: boolean = deptAlises.some(dept => splitSearchTerm.includes(dept));
      const containsNum: boolean = splitSearchTerm.includes(courseNum);
      if (containsDept && containsNum) {return 1000;}
      if (containsDept || containsNum) {return 500;}
      return sum;
    };
    return courses.sort((course1, course2) => (priorityFunction(course1) - priorityFunction(course2))) //Should I make a copy of courses here?
  }

  /**
   * Given a string observable, return all courses that match the specification of searchFunction in the form of an
   * Observable.
   *
   * @param {Observable<string>} searchText An observable containing the text that the user has inputted.
   */
  updateAutoComplete = (searchText: Observable<string>): Observable<Course[]> => {
    return searchText.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((searchTerm) => (searchTerm.length < 2 ? [] : this.searchFunction(searchTerm, this.allCourses))),
      map((results: Course[]) => results.slice(0, 8)),
      // TODO: sort this by search rankings for relevance
    );
  };

  returnCourse(): void {
    if (this.searchedCourse instanceof Course) {
      this.courseReturned.emit(this.searchedCourse);
      this.searchedCourse = null;
    }
  }
}
