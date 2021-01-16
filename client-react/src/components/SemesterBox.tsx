import React from 'react';
import { Col, Container, Dropdown, OverlayTrigger, Popover, Row } from 'react-bootstrap';

import { Course } from '../models/course.model';
import { Semester } from '../models/semester.model';

import './SemesterBox.css';

type SemesterBoxProps = {
  semester: Semester;
  currentSemesters: Semester[];
  onOpenCourseAdder: () => void;
  onRemoveCourse: (course: Course) => void;
};

function SemesterBox(props: SemesterBoxProps): React.ReactElement {
  const unitCount = props.semester.courses.reduce((a, b) => a + b.units, 0);

  const renderCourse = (course: Course) => {
    const semestersWithCourse = props.currentSemesters.filter((semester) => semester.courses.includes(course));
    let duplicateCourseIcon: React.ReactElement = null;
    if (semestersWithCourse.length > 1) {
      const duplicatePopover = (
        <Popover id="semester-duplicate-popover">
          This course is duplicated in:
          <ul>
            {semestersWithCourse.map((semester) => (
              <li>{semester.name}</li>
            ))}
          </ul>
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
        {duplicateCourseIcon}
        <td className="SemesterBox__courses__name">{course.dept + ' ' + course.no + ' '}</td>
        <td className="SemesterBox__courses__title">{course.title}</td>
        <td className="SemesterBox__courses__units">{course.units}</td>
        <td className="SemesterBox__courses__button-cell">
          <Dropdown>
            <Dropdown.Toggle className="gt-button SemesterBox__courses__more" as="button"></Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-sm">
              <Dropdown.Item onClick={() => props.onRemoveCourse(course)}>Remove</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <div className="SemesterBox">
      <Container>
        <Row className="justify-content-between">
          <Col className="SemesterBox__name" xs="auto">
            {props.semester.name}
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
            <th></th>
          </tr>
          {props.semester.courses.map(renderCourse)}
        </tbody>
      </table>
      <button className="gt-button SemesterBox__course-adder" onClick={props.onOpenCourseAdder}>
        +
      </button>
    </div>
  );
}

export default SemesterBox;
