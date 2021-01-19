import React from 'react';
import { Col, Container, Dropdown, Modal, OverlayTrigger, Popover, Row } from 'react-bootstrap';

import { Course } from '../models/course.model';
import { Semester } from '../models/semester.model';
import BerkeleytimeInfoDisplay from './BerkeleytimeInfoDisplay';

import './SemesterBox.css';

type SemesterBoxProps = {
  semester: Semester;
  currentSemesters: Semester[];
  onOpenCourseAdder: () => void;
  onRemoveCourse: (course: Course) => void;
};

type SemesterBoxState = {
  showCourseInfo: boolean;
  shownCourseInfo: Course;
};

class SemesterBox extends React.Component<SemesterBoxProps, SemesterBoxState> {
  constructor(props: SemesterBoxProps) {
    super(props);

    this.state = {
      showCourseInfo: false,
      shownCourseInfo: null,
    };
  }

  showCourseInfo = (course: Course): void => {
    this.setState({
      showCourseInfo: true,
      shownCourseInfo: course,
    });
  };

  hideCourseInfo = (): void => {
    this.setState({
      showCourseInfo: false,
    });
  };

  private renderCourse = (course: Course): React.ReactNode => {
    const semestersWithCourse = this.props.currentSemesters.filter((semester) => semester.courses.includes(course));
    let duplicateCourseIcon: React.ReactElement = null;
    if (semestersWithCourse.length > 1) {
      const duplicatePopover = (
        <Popover id="semester-duplicate-popover">
          <Popover.Content>
            This course is duplicated in:
            <ul>
              {semestersWithCourse.map((semester) => (
                <li key={semester.name}>{semester.name}</li>
              ))}
            </ul>
          </Popover.Content>
        </Popover>
      );
      duplicateCourseIcon = (
        <OverlayTrigger trigger={['hover', 'focus']} overlay={duplicatePopover}>
          <i className="material-icons SemesterBox__duplicate">error_outline</i>
        </OverlayTrigger>
      );
    }

    return (
      <tr key={course.id} className="SemesterBox__courses__course">
        <td className="SemesterBox__courses__name">
          {duplicateCourseIcon}
          {course.dept} {course.no}
        </td>
        <td className="SemesterBox__courses__title">{course.title}</td>
        <td className="SemesterBox__courses__units">{course.units}</td>
        <td className="SemesterBox__courses__button-cell">
          <Dropdown>
            <Dropdown.Toggle className="gt-button SemesterBox__courses__more" as="button" />
            <Dropdown.Menu className="dropdown-sm">
              <Dropdown.Item onClick={() => this.showCourseInfo(course)}>Course Info</Dropdown.Item>
              <Dropdown.Item onClick={() => this.props.onRemoveCourse(course)}>Remove</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  render(): React.ReactElement {
    const unitCount = this.props.semester.courses.reduce((a, b) => a + b.units, 0);

    return (
      <div className="SemesterBox">
        <Container>
          <Row className="justify-content-between">
            <Col className="SemesterBox__name" xs="auto">
              {this.props.semester.name}
            </Col>
            <Col className="SemesterBox__unit-count" xs="auto">
              {unitCount} units
            </Col>
          </Row>
        </Container>
        <hr />
        <table className="SemesterBox__courses">
          <colgroup>
            <col className="SemesterBox__courses__name-col" />
            <col className="SemesterBox__courses__title-col" />
            <col className="SemesterBox__courses__units-col" />
            <col className="SemesterBox__courses__button-cell-col" />
          </colgroup>
          <tbody>
            <tr>
              <th>Class</th>
              <th>Title</th>
              <th>Units</th>
            </tr>
            {this.props.semester.courses.map(this.renderCourse)}
          </tbody>
        </table>
        <button className="gt-button SemesterBox__course-adder" type="button" onClick={this.props.onOpenCourseAdder}>
          +
        </button>
        <Modal size="xl" show={Boolean(this.state.showCourseInfo)} onHide={this.hideCourseInfo}>
          <Modal.Body>
            {this.state.shownCourseInfo ? <BerkeleytimeInfoDisplay course={this.state.shownCourseInfo} /> : null}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default SemesterBox;
