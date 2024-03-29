import React from 'react';
import { Button, Col, Form, Row, Modal } from 'react-bootstrap';

import { Semester } from '../models/semester.model';

import './SemesterChanger.css';

type SemesterChangerProps = {
  initialSemesters: Map<string, (Semester | null)[]>;
  onChangeSemesters: (semesters: Map<string, (Semester | null)[]>) => void;
};

type SemesterChangerState = {
  semesters: Map<string, (Semester | null)[]>;
  term: string;
  year: number;
  semesterAdderOpen: boolean;
  error: string | null;
};

const TERM_INDEX: { [term: string]: number } = {
  Fall: 0,
  Spring: 1,
  Summer: 2,
};

class SemesterChanger extends React.Component<SemesterChangerProps, SemesterChangerState> {
  constructor(props: SemesterChangerProps) {
    super(props);

    this.state = {
      /* Clone map and inner arrays, keeping individual semester references the
       * same. */
      semesters: new Map<string, (Semester | null)[]>(
        Array.from(this.props.initialSemesters.entries()).map(([year, sems]) => [year, Array.from(sems)]),
      ),
      term: 'Fall',
      year: 2021, // TODO Dynamically get this and below options from date.
      semesterAdderOpen: false,
      error: null,
    };
  }

  showSemesterAdder = () => {
    this.setState({
      semesterAdderOpen: true,
    });
  };

  hideSemesterAdder = () => {
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
    if (this.state.year < 2000 || this.state.year > 2050) {
      this.setState({
        error: 'Please select a term and a valid year.',
      });
      return;
    }
    const semesterName = `${this.state.term} ${this.state.year}`;
    if (this.getSemArr().some((semester) => semester.name === semesterName)) {
      this.setState({
        error: 'This semester is already in your schedule!',
      });
      return;
    }
    const semesters = new Map<string, (Semester | null)[]>(this.state.semesters);
    const newSemester = new Semester(semesterName);
    const academicYearName = this.getAcademicYearName(newSemester);
    const semArr = semesterName.split(' ');
    const index = TERM_INDEX[semArr[0]];
    let year: (Semester | null)[];
    if (semesters.has(academicYearName)) {
      year = Array.from(semesters.get(academicYearName)!);
    } else {
      year = [null, null, null];
    }
    year[index] = newSemester;
    semesters.set(academicYearName, year);
    this.setState({
      semesters,
      error: null,
    });
    this.hideSemesterAdder();
  };

  removeSemester = (semester: Semester): void => {
    const yearName = this.getAcademicYearName(semester);

    if (!this.state.semesters.has(yearName)) {
      return;
    }

    const semesters = new Map<string, (Semester | null)[]>(this.state.semesters);
    const semesterArr = semester.name.split(' ');
    const index: number = TERM_INDEX[semesterArr[0]];
    const year: (Semester | null)[] = Array.from(this.state.semesters.get(yearName)!);
    year[index] = null;
    if (year.every((yearSem) => !yearSem)) {
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
      .filter((a) => a) as Semester[];
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
      <div className="SemesterChanger">
        <h4 className="gt-modal-header">Edit Semesters</h4>
        <div className="SemesterChanger__table">
          {this.getSemArr().map((semester) => (
            <h4 key={semester.name}>
              <i className="material-icons SemesterChanger__remove" onClick={() => this.removeSemester(semester)}>
                close
              </i>
              {semester.name}
            </h4>
          ))}
          <Button variant="primary" size="sm" onClick={this.showSemesterAdder}>
            Add a Semester
          </Button>
        </div>
        <Button variant="primary" onClick={this.handleSubmit}>
          Confirm
        </Button>
        <Modal size="sm" show={this.state.semesterAdderOpen} onHide={this.hideSemesterAdder}>
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
                  <Form.Control
                    as="select"
                    value={this.state.term}
                    onChange={(e) => this.setState({ term: e.target.value })}
                  >
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
                  <Form.Control
                    type="number"
                    min="2010"
                    max="2030"
                    value={this.state.year}
                    onChange={(e) => this.setState({ year: parseInt(e.target.value, 10) })}
                  />
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
                <Col className="SemesterChanger__error">{this.state.error}</Col>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default SemesterChanger;
