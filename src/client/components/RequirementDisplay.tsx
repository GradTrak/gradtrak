import React from 'react';
import { Modal } from 'react-bootstrap';

import Courses from '../lib/courses';
import { Course } from '../models/course.model';
import { StandaloneRequirement } from '../models/requirements/standalone-requirement.model';
import BerkeleytimeInfoDisplay from './BerkeleytimeInfoDisplay';

import './RequirementDisplay.css';

type RequirementDisplayProps = {
  requirement: StandaloneRequirement;
};

type SortType = 'no' | 'title' | 'grade';

type RequirementDisplayState = {
  courses: Course[];
  sortField: SortType;
  sortDescending: boolean;
  openCourseInfo: boolean;
  shownCourseInfo: Course;
};

class RequirementDisplay extends React.Component<RequirementDisplayProps, RequirementDisplayState> {
  constructor(props: RequirementDisplayProps) {
    super(props);

    this.state = {
      courses: null,
      sortField: 'no',
      sortDescending: false,
      openCourseInfo: false,
      shownCourseInfo: null,
    };
  }

  componentDidMount(): void {
    this.fetchCourses();
  }

  openCourseInfo = (course: Course): void => {
    this.setState({
      openCourseInfo: true,
      shownCourseInfo: course,
    });
  };

  closeCourseInfo = (): void => {
    this.setState({
      openCourseInfo: false,
    });
  };

  viewCourseBerkeleytime = (): void => {};

  /**
   * Given an input of what the user clicked, change the sorting accordingly.
   * Defaults to descending and switches the sort order if you click on the
   * same field multiple times.
   */
  changeSort = (clicked: SortType): void => {
    if (clicked === this.state.sortField) {
      this.setState({
        sortDescending: !this.state.sortDescending,
      });
    } else {
      this.setState({
        sortField: clicked,
        sortDescending: false,
      });
    }
  };

  private fetchCourses = async (): Promise<void> => {
    const courses = await Courses.getCourses();
    this.setState({
      courses,
    });
  };

  // TODO This should probably be memoimzed.
  private getFulfillingCourses = (coursesInput: Course[]): Course[] => {
    const courses = coursesInput.filter((course) => this.props.requirement.isFulfilledWith(course));
    let comparator: (a: Course, b: Course) => number;
    const courseNoComparator = (a: Course, b: Course): number => {
      if (a.dept === b.dept) {
        return a.getBareNumber() - b.getBareNumber();
      }
      return a.dept < b.dept ? -1 : 1;
    };

    switch (this.state.sortField) {
      case 'no':
        comparator = courseNoComparator;
        break;
      case 'title':
        comparator = (a: Course, b: Course): number => (a.title < b.title ? -1 : 1);
        break;
      case 'grade':
        comparator = (a: Course, b: Course): number => {
          // TODO Nullish coalescing operator should also be removed with
          // strict null checks.
          const gradeA = a.berkeleytimeData?.grade;
          const gradeB = b.berkeleytimeData?.grade;
          if (gradeA === gradeB || !(gradeA || gradeB)) {
            // Default to the course Dept and No. if equal or both null
            return courseNoComparator(a, b);
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
        throw new Error(`Invalid sort field: ${this.state.sortField}`);
    }

    /* Reverse the comparator if we are sorting descending. */
    const reversedComparator = this.state.sortDescending
      ? (a: Course, b: Course): number => -comparator(a, b)
      : comparator;

    courses.sort(reversedComparator);
    return courses;
  };

  private renderCourseRow = (course: Course): React.ReactNode => {
    return (
      <tr key={course.id} className="RequirementDisplay__course-table-row" onClick={() => this.openCourseInfo(course)}>
        <td className="RequirementDisplay__no">
          {course.dept} {course.no}
        </td>
        {/* TODO Nullish coalescing operator should be removed after strict
          null checks. */}
        <td className="RequirementDisplay__title">{course.title}</td>
        <td className="RequirementDisplay__grade">{course.berkeleytimeData?.grade || '-'}</td>
      </tr>
    );
  };

  private renderSortArrow = (): React.ReactNode => {
    return (
      <i className="material-icons RequirementDisplay__sort-arrow">
        {this.state.sortDescending ? 'arrow_drop_down' : 'arrow_drop_up'}
      </i>
    );
  };

  render(): React.ReactElement {
    if (!this.state.courses) {
      return <div className="RequirementDisplay">Loading...</div>;
    }

    return (
      <div className="RequirementDisplay">
        <h3 className="RequirementDisplay__display-title">Eligible Courses</h3>
        <table className="RequirementDisplay__course-list">
          <colgroup>
            <col className="RequirementDisplay__no-col" />
            <col className="RequirementDisplay__title-col" />
            <col className="RequirementDisplay__grade-col" />
          </colgroup>
          <thead>
            <tr>
              <th className="RequirementDisplay__course-table-sort" onClick={() => this.changeSort('no')}>
                Course No.
                {this.state.sortField === 'no' ? this.renderSortArrow() : null}
              </th>
              <th className="RequirementDisplay__course-table-sort" onClick={() => this.changeSort('title')}>
                Course Title
                {this.state.sortField === 'title' ? this.renderSortArrow() : null}
              </th>
              <th className="RequirementDisplay__course-table-sort" onClick={() => this.changeSort('grade')}>
                Avg. Grade
                {this.state.sortField === 'grade' ? this.renderSortArrow() : null}
              </th>
            </tr>
          </thead>
          <tbody>{this.getFulfillingCourses(this.state.courses).map(this.renderCourseRow)}</tbody>
        </table>
        <Modal size="xl" show={this.state.openCourseInfo} onHide={this.closeCourseInfo}>
          <Modal.Body>
            {this.state.shownCourseInfo ? <BerkeleytimeInfoDisplay course={this.state.shownCourseInfo} /> : null}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default RequirementDisplay;
