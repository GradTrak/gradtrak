import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Typeahead, TypeaheadModel } from 'react-bootstrap-typeahead';

import Courses from '../lib/courses';
import { Course } from '../models/course.model';

type CourseSearcherProps = {
  onSelectCourse: (course: Course) => void;
};

type CourseSearcherState = {
  courses: Course[];
  selected: Course;
};

class CourseSearcher extends React.Component<CourseSearcherProps, CourseSearcherState> {
  constructor(props: CourseSearcherProps) {
    super(props);

    this.state = {
      courses: null,
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
    });
  }

  handleSubmit = (): void => {
    const course = this.state.selected as Course;
    this.props.onSelectCourse(course);
  };

  render(): React.ReactElement {
    if (!this.state.courses) {
      return <>Loading...</>;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group as={Row}>
          <Col>
            <Typeahead<Course>
              selected={[this.state.selected]}
              onChange={(selected) => this.setState({ selected: selected[0] || null })}
              placeholder="Search for a class"
              options={this.state.courses}
              labelKey="id"
            />
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              Add
            </Button>
          </Col>
        </Form.Group>
      </Form>
    );
  }
}

export default CourseSearcher;
