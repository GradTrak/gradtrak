import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { AsyncTypeahead, TypeaheadModel } from 'react-bootstrap-typeahead';

import Courses from '../lib/courses';
import { Course } from '../models/course.model';
import BerkeleytimeInfoDisplay from './BerkeleytimeInfoDisplay';

import './CourseSearcher.css';

// TODO Put this somewhere more reasonable
const DEPT_ALIASES = new Map<string, string[]>([
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

type CourseSearcherProps = {
  onSelectCourse: (course: Course) => void;
};

type CourseSearcherState = {
  courses: Course[];
  options: Course[];
  selected: Course;
};

class CourseSearcher extends React.Component<CourseSearcherProps, CourseSearcherState> {
  constructor(props: CourseSearcherProps) {
    super(props);

    this.state = {
      courses: null,
      options: null,
      selected: null,
    };
  }

  componentDidMount(): void {
    this.fetchCourses();
  }

  private fetchCourses = async (): Promise<void> => {
    const courses = await Courses.getCourses();
    this.setState({
      courses,
      options: [],
    });
  };

  handleSearch = async (input: string) => {
    // TODO: sort this by search rankings for relevance
    let options = [];
    if (input.length > 2) {
      options = this.searchFunction(input, this.state.courses).slice(0, 8);
      this.setState({
        options,
      });
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!this.state.selected) {
        this.setState({
          selected: this.state.options[0],
        });
      } else {
        this.handleSubmit();
      }
    }
  };

  handleSubmit = (): void => {
    if (!this.state.selected) {
      return;
    }
    this.props.onSelectCourse(this.state.selected);
    this.setState({
      selected: null,
    });
  };

  /**
   * A function which takes a list of courses and an input and finds the courses
   * that are related to that input. In particular, it's defined to be if the name
   * of the course includes the search term.
   */
  private searchFunction = (input: string, courseList: Course[]): Course[] => {
    const processedInput = input.toLowerCase().replace(/[^\w]/g, ''); // remove whitespace from input.
    const resultCourses = courseList.filter((course) => {
      const canonicalName: string = course.toString();
      const names: string[] = [canonicalName];
      const deptAlises: string[] = DEPT_ALIASES.get(course.dept);
      if (deptAlises) {
        names.push(...deptAlises.map((alias: string) => `${alias} ${course.no}`));
      }
      return names
        .map((name: string) => name.toLowerCase().replace(/[^\w]/g, ''))
        .some((name: string) => name.includes(processedInput));
    });
    return this.courseSorter(resultCourses, input);
  };

  /**
   * Given a list of courses, considers the current search param and sorts the
   * courses, returning an array which has the most relevant courses up top.
   * @param input The input of the user
   * @param courses the list of courses being sorted.
   */
  private courseSorter = (courses: Course[], input: string): Course[] => {
    /**
     * Assigns a "how closely it's matched" value from 0 to 1000, from the following
     * rules:
     * - exactly 1000 if the course number AND dept are contained. eg cs61a
     * - exactly 500 if the course number OR dept are matched exactly. eg compsci, cs, 61a
     * - 200 if the search term contains the number or dept in any way.
     * - up to 100 depending on the popularity of the course.//NOT IMPLEMENTED
     * - 10 if the course number or department contains the search term.
     * - 1 for each case of the term containing a part of the description. //NOT IMPLEMENTED
     * @param course a course to find the priority value for.
     */
    const priorityFunction = (course: Course): number => {
      const courseNum = course.no.toLowerCase();
      let sum = 0;
      const splitInput: string[] = input.toLowerCase().split(' ');
      // If it includes any of the dept aliases
      let deptAlises: string[] = DEPT_ALIASES.get(course.dept) || [];
      deptAlises = [...deptAlises]
        .concat([course.dept])
        .map((deptName) => deptName.toLowerCase().replace(/[^\w]/g, ''));
      const containsDept: boolean = deptAlises.some((dept) => splitInput.includes(dept));
      const containsNum: boolean = splitInput.includes(courseNum);
      if (containsDept && containsNum) {
        return 1000;
      }
      if (containsDept || containsNum) {
        return 500;
      } // consider making this additive to the sum.
      const blockedInput = input.toLowerCase().replace(/[^\w]/g, ''); // remove whitespace from input.
      // if any part of the search contains the courseNum or a dept alias
      if (blockedInput.includes(courseNum)) {
        sum += 200;
      }
      if (deptAlises.some((dept) => blockedInput.includes(dept))) {
        sum += 200;
      }
      if (courseNum.includes(blockedInput)) {
        sum += 10;
      }
      // There's a lot of seperate iterations, but these are "some". We can consider doing it all at once, should it be needed.
      if (deptAlises.some((dept) => dept.includes(blockedInput))) {
        sum += 10;
      }
      return sum;
    };
    return courses.sort((course1, course2) => priorityFunction(course2) - priorityFunction(course1)); // Should I make a copy of courses here?
  };

  render(): React.ReactElement {
    if (!this.state.courses) {
      return <>Loading...</>;
    }

    return (
      <div>
        <Form
          className="CourseSearcher__search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <Form.Row>
            <Col>
              {/* We use AsyncTypeahead because the search function is slow. */}
              <AsyncTypeahead<Course>
                id="course-search"
                autoFocus
                isLoading={this.state.options === null}
                selected={this.state.selected ? [this.state.selected] : []}
                open={this.state.selected ? false : undefined}
                onSearch={this.handleSearch}
                options={this.state.options}
                filterBy={() => true}
                onKeyDown={this.handleKeyDown}
                onChange={(selected) => this.setState({ selected: selected[0] || null })}
                labelKey={(course) => course.toString()}
                placeholder="Search for a class"
              />
            </Col>
            <Col xs="auto">
              <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                Add
              </Button>
            </Col>
          </Form.Row>
        </Form>
        {this.state.selected ? (
          <BerkeleytimeInfoDisplay course={this.state.selected} fields={['semesters-offered']} />
        ) : null}
      </div>
    );
  }
}

export default CourseSearcher;
