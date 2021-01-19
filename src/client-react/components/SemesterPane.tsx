import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { Course } from '../models/course.model';
import { Semester } from '../models/semester.model';

import SemesterBox from './SemesterBox';

import './SemesterPane.css';

type SemesterPaneProps = {
  semesters: Map<string, Semester[]>;
  onOpenSemesterChanger: () => void;
  onOpenCourseAdder: (semester: Semester) => void;
  onRemoveCourse: (semester: Semester, course: Course) => void;
};

function SemesterPane(props: SemesterPaneProps): React.ReactElement {
  /* Concat all semester-per-year arrays and remove the null ones. */
  const semesterArr = Array.from(props.semesters.keys())
    .sort()
    .map((year) => props.semesters.get(year))
    .flat()
    .filter((semester) => semester);
  // a temporary fix because we haven't implemented view by year functionality yet.

  return (
    // TODO Restore spacing from Angular.
    <Container className="px-4 py-3">
      <Row className="justify-content-center">
        <Col className="my-4" xs={8}>
          <button
            className="gt-button gt-button-primary SemesterPane__semester-changer"
            type="button"
            onClick={props.onOpenSemesterChanger}
          >
            Edit Semesters
          </button>
        </Col>
      </Row>
      <Row>
        {semesterArr.map((semester) => (
          <Col key={semester.name} className="SemesterPane__semester" xs={6}>
            <SemesterBox
              semester={semester}
              currentSemesters={semesterArr}
              onOpenCourseAdder={() => props.onOpenCourseAdder(semester)}
              onRemoveCourse={(course) => props.onRemoveCourse(semester, course)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SemesterPane;
