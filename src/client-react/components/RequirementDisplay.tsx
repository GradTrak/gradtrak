import React from 'react';

import Courses from '../lib/courses';
import { Course } from '../models/course.model';
import { Requirement } from '../models/requirement.model';

import './RequirementDisplay.css';

type RequirementDisplayProps = {
  requirement: Requirement;
};

type RequirementDisplayState = {
  courses: Course[];
};

class RequirementDisplay extends React.Component<RequirementDisplayProps, RequirementDisplayState> {
  constructor(props: RequirementDisplayProps) {
    super(props);

    this.state = {
      courses: null,
    };
  }

  componentDidMount(): void {
    this.fetchCourses();
  }

  private fetchCourses = async (): Promise<void> => {
    const courses = await Courses.getCourses();
    this.setState({
      courses,
    });
  };

  // TODO This should probably be memoimzed.
  private getFulfillingCourses = (req: Requirement, courses: Course[]): Course[] => {
    return courses.filter((course) => req.canFulfill(course));
  };

  render(): React.ReactElement {
    if (!this.state.courses) {
      return <>Loading...</>;
    }

    return (
      <>
        <h3>Eligible Courses</h3>
        <div className="RequirementDisplay__course-list">
          {this.getFulfillingCourses(this.props.requirement, this.state.courses).map((course) => (
            <h4 key={course.id}>{course.toString()}</h4>
          ))}
          <br />
        </div>
      </>
    );
  }
}

export default RequirementDisplay;