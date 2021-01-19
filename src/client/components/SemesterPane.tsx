import React from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';

import { Course } from '../models/course.model';
import { Semester } from '../models/semester.model';

import SemesterBox from './SemesterBox';
import SemesterChanger from './SemesterChanger';

import './SemesterPane.css';

type SemesterPaneProps = {
  semesters: Map<string, Semester[]>;
  onAddCourse: (semester: Semester, course: Course) => void;
  onRemoveCourse: (semester: Semester, course: Course) => void;
  onChangeSemesters: (semesters: Map<string, Semester[]>) => void;
};

type SemesterPaneState = {
  showChanger: boolean;
};

class SemesterPane extends React.Component<SemesterPaneProps, SemesterPaneState> {
  constructor(props: SemesterPaneProps) {
    super(props);

    this.state = {
      showChanger: false,
    };
  }

  openChanger = (): void => {
    this.setState({
      showChanger: true,
    });
  };

  closeChanger = (): void => {
    this.setState({
      showChanger: false,
    });
  };

  render(): React.ReactElement {
    /* Concat all semester-per-year arrays and remove the null ones. */
    const semesterArr = Array.from(this.props.semesters.keys())
      .sort()
      .map((year) => this.props.semesters.get(year))
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
              onClick={this.openChanger}
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
                onAddCourse={(course) => this.props.onAddCourse(semester, course)}
                onRemoveCourse={(course) => this.props.onRemoveCourse(semester, course)}
              />
            </Col>
          ))}
        </Row>
        <Modal size="lg" show={this.state.showChanger} onHide={this.closeChanger}>
          <Modal.Body>
            <SemesterChanger initialSemesters={this.props.semesters} onChangeSemesters={this.props.onChangeSemesters} />
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
}

export default SemesterPane;
