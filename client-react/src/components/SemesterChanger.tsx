import React from 'react';
import { Button, Col, Form, Row, Modal } from 'react-bootstrap';

import { Semester } from '../models/semester.model';

type SemesterChangerProps = {
  initialSemesters: Map<string, Semester[]>;
  onChangeSemesters: (semesters: Map<string, Semester[]>) => void;
};

type SemesterChangerState = {
  semesters: Map<string, Semester[]>;
  semesterAdderOpen: boolean;
  error: string;
};

const TERM_INDEX = {
  Fall: 0,
  Spring: 1,
  Summer: 2,
};

class SemesterChanger extends React.Component<SemesterChangerProps, SemesterChangerState> {
  private readonly termRef: React.RefObject<HTMLSelectElement>;
  private readonly yearRef: React.RefObject<HTMLInputElement>;

  constructor(props: SemesterChangerProps) {
    super(props);

    this.termRef = React.createRef<HTMLSelectElement>();
    this.yearRef = React.createRef<HTMLInputElement>();

    this.state = {
      /* Clone map and inner arrays, keeping individual semester references the
       * same. */
      semesters: new Map<string, Semester[]>(
        Array.from(this.props.initialSemesters.entries()).map(([year, sems]) => [year, Array.from(sems)]),
      ),
      semesterAdderOpen: false,
      error: null,
    };
  }

  openSemesterAdder = () => {
    this.setState({
      semesterAdderOpen: true,
    });
  };

  closeSemesterAdder = () => {
    this.setState({
      semesterAdderOpen: false,
    });
  };

  /**
   * Adds the currently requested semester to the current list of semesters.
   *
   * @param {string} semesterName The intended name of the new semester object
   * being initialized. Must be formatted "term YYYY".
   */
  addSemester = (): void => {
    const term = this.termRef.current.value;
    const yearNum = parseInt(this.termRef.current.value);

    if (!(term && yearNum) || yearNum < 2000 || yearNum > 2050) {
      this.setState({
        error: 'Please select a term and a valid year.',
      });
      return;
    }
    const semesterName: string = `${term} ${yearNum}`;
    if (this.getSemArr().some((semester: Semester) => semester.name === semesterName)) {
      this.setState({
        error: 'This semester is already in your schedule!',
      });
      return;
    }
    const semesters = new Map<string, Semester[]>(this.state.semesters);
    const newSemester = new Semester(semesterName);
    const academicYearName = this.getAcademicYearName(newSemester);
    const semArr = semesterName.split(' ');
    const index = TERM_INDEX[semArr[0]];
    let year: Semester[];
    if (semesters.has(academicYearName)) {
      year = Array.from(semesters.get(academicYearName));
    } else {
      year = [null, null, null];
    }
    year[index] = newSemester;
    semesters.set(academicYearName, year);
    this.setState({
      semesters,
    });
    this.closeSemesterAdder();
  };

  removeSemester = (semester: Semester): void => {
    const semesters = new Map<string, Semester[]>(this.state.semesters);
    const yearName = this.getAcademicYearName(semester);
    const semesterArr = semester.name.split(' ');
    const index = TERM_INDEX[semesterArr[0]];
    const year = Array.from(this.state.semesters.get(yearName));
    year[index] = null;
    if (year.every((yearSem: Semester) => !yearSem)) {
      semesters.delete(yearName);
    } else {
      semesters.set(yearName, year);
    }
    this.setState({
      semesters,
    });
    // an undo button would be nice here. Or an "are you sure".
    // just in case they delete a semester that's important.
  };

  handleSubmit = (): void => {
    this.props.onChangeSemesters(this.state.semesters);
  };

  /**
   * Turns a map of semesters into an array of semesters.
   *
   * @return {Semester[]} An array of all the semestsers in the values of the map
   */
  private getSemArr = (): Semester[] => {
    return Array.from(this.state.semesters.keys())
      .sort()
      .map((key) => this.state.semesters.get(key))
      .flat()
      .filter((a) => a);
  };

  /**
   * Given a semester, retunrs the string of its academic year in the form of
   * 'YYYY-YYYY'
   *
   * @param {string} A semester for which you want the year. Name is in 'term
   * YYYY' format.
   */
  private getAcademicYearName = (semester: Semester): string => {
    const semArr = semester.name.split(' ');
    const semesterYear = parseInt(semArr[1], 10) - (semArr[0] !== 'Fall' ? 1 : 0); // this feels so incredibly clunky.
    return `${semesterYear.toString()}-${(semesterYear + 1).toString()}`; // eg '2019-2020'
  };

  render(): React.ReactElement {
    return (
      <>
        <h4 className="gt-modal-header">Edit Semesters</h4>
        <div className="table">
          {this.getSemArr().map((semester) => (
            <h4>
              <i className="material-icons" onClick={() => this.removeSemester(semester)}>
                close
              </i>
              {semester.name}
            </h4>
          ))}
          <Button variant="primary" size="sm" onClick={this.openSemesterAdder}>
            Add a Semester
          </Button>
        </div>
        <Button variant="primary" onClick={this.handleSubmit}>
          Confirm
        </Button>
        <Modal>
          <Modal.Body>
            <h4 className="gt-modal-header">Add a semester</h4>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                this.addSemester();
              }}
            >
              <Form.Group as={Row}>
                <Col>
                  <Form.Label>Semester</Form.Label>
                </Col>
                <Col>
                  <Form.Control as="select" ref={this.termRef}>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col>
                  <Form.Label>Year</Form.Label>
                </Col>
                <Col>
                  <Form.Control className="year-name" type="number" min="2010" max="2030" ref={this.yearRef} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="justify-content-center">
                <Col xs={6}>
                  <Button variant="primary" block type="submit">
                    Add
                  </Button>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col className="error">{this.state.error}</Col>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default SemesterChanger;
