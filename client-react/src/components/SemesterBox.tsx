import React from 'react';
import { Col, Container, Dropdown, OverlayTrigger, Popover, Row } from 'react-bootstrap';

import { Course } from '../models/course.model';
import { Semester } from '../models/semester.model';

type SemesterBoxProps = {
  semester: Semester;
  currentSemesters: Semester[];
  onOpenCourseAdder: () => void;
  onRemoveCourse: (course: Course) => void;
};

function SemesterBox(props: SemesterBoxProps): React.ReactElement {
  const unitCount = props.semester.courses.reduce((a: number, b: Course): number => a + b.units, 0);

  const renderCourse = (course: Course) => {
    const semestersWithCourse = props.currentSemesters.filter((semester) => semester.courses.includes(course));
    let duplicateCourseIcon: React.ReactElement = null;
    if (semestersWithCourse.length > 1) {
      const duplicatePopover = (
        <Popover id="semester-popover">
          This course is duplicated in:
          <ul>
            {semestersWithCourse.map((semester) => (
              <li>{semester.name}</li>
            ))}
          </ul>
        </Popover>
      );
      duplicateCourseIcon = (
        <OverlayTrigger trigger="hover" overlay={duplicatePopover}>
          <i className="material-icons">error_outline</i>
        </OverlayTrigger>
      );
    }

    return (
      <tr className="course">
        {duplicateCourseIcon}
        <td className="name">{course.dept + ' ' + course.no + ' '}</td>
        <td className="title">{course.title}</td>
        <td className="units">{course.units}</td>
        <td className="button-cell">
          <Dropdown>
            <Dropdown.Toggle>
              <button className="gt-button course-more-button"></button>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-sm">
              <Dropdown.Item>
                <button onClick={() => props.onRemoveCourse(course)}>Remove</button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Container>
        <Row className="justify-content-between">
          <Col className="semester-name" xs="auto">
            {props.semester.name}
          </Col>
          <Col className="unit-count" xs="auto">
            {unitCount} units
          </Col>
        </Row>
      </Container>
      <hr />
      <table className="courses">
        <colgroup>
          <col className="name" />
          <col className="title" />
          <col className="units" />
          <col className="button-cell" />
        </colgroup>
        <tbody>
          <tr className="table-header">
            <td>Class</td>
            <td>Title</td>
            <td>Units</td>
            <td></td>
          </tr>
          {props.semester.courses.map(renderCourse)}
        </tbody>
      </table>
      <button className="gt-button course-adder" onClick={props.onOpenCourseAdder}>
        +
      </button>
    </>
  );
}

export default SemesterBox;
