import React from 'react';
import { Button, Form } from 'react-bootstrap';

import { RequirementSet } from '../models/requirement-set.model';
import { Semester } from '../models/semester.model';
import { UserData } from '../models/user-data.model';

import GoalSelector from './GoalSelector';

import './Initializer.css';

type InitializerProps = {
  onInitializeData: (userData: UserData) => void;
};

type InitializerState = {
  stage: 'semesters' | 'goals';
  error: string;
};

class Initializer extends React.Component<InitializerProps, InitializerState> {
  private readonly startYearRef: React.RefObject<HTMLSelectElement>;
  private readonly gradYearRef: React.RefObject<HTMLSelectElement>;
  private readonly includeSummersRef: React.RefObject<HTMLInputElement>;

  constructor(props: InitializerProps) {
    super(props);

    this.startYearRef = React.createRef<HTMLSelectElement>();
    this.gradYearRef = React.createRef<HTMLSelectElement>();
    this.includeSummersRef = React.createRef<HTMLInputElement>();

    this.state = {
      stage: 'semesters',
      error: null,
    };
  }

  setStage = (stage: 'semesters' | 'goals'): void => {
    if (stage === 'goals') {
      /* Validate semesters. */
      const startYear = parseInt(this.startYearRef.current.value, 10);
      const gradYear = parseInt(this.gradYearRef.current.value, 10);
      if (!startYear || !gradYear) {
        this.setState({
          error: 'Please fill in all required fields.',
        });
        return;
      }
      if (startYear >= gradYear) {
        this.setState({
          error: 'The start year must be before the year of graduation.',
        });
        return;
      }
    }

    this.setState({
      stage,
      error: null,
    });
  };

  handleSubmit = (goals: RequirementSet[]): void => {
    const startYear = parseInt(this.startYearRef.current.value, 10);
    const gradYear = parseInt(this.gradYearRef.current.value, 10);
    const includeSummers = this.includeSummersRef.current.checked;

    const semesters = this.initializeSemesters(startYear, gradYear, includeSummers);
    this.props.onInitializeData({
      semesters,
      goals,
      manuallyFulfilledReqs: new Map<string, Set<string>>(),
    });
  };

  private initializeSemesters(startYear: number, gradYear: number, includeSummers: boolean): Map<string, Semester[]> {
    const semesters: Map<string, Semester[]> = new Map<string, Semester[]>();
    for (let i: number = startYear; i < gradYear; i += 1) {
      const currSem: Semester[] = [];
      currSem.push(new Semester(`Fall ${i}`));
      currSem.push(new Semester(`Spring ${i + 1}`));
      if (includeSummers) {
        currSem.push(new Semester(`Summer ${i + 1}`));
      }
      semesters.set(`${i}-${i + 1}`, currSem);
    }
    return semesters;
  }

  render(): React.ReactElement {
    return (
      <div className="Initializer">
        <div style={{ display: this.state.stage === 'semesters' ? undefined : 'none' }}>
          <h4 className="gt-modal-header">Set Up</h4>
          <Form.Group controlId="Initializer__start-year">
            <Form.Label>Start Year</Form.Label>
            <Form.Control as="select" ref={this.startYearRef}>
              <option value={2015}>2015</option>
              <option value={2016}>2016</option>
              <option value={2017}>2017</option>
              <option value={2018}>2018</option>
              <option value={2019}>2019</option>
              <option value={2020}>2020</option>
              <option value={2021}>2021</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="Initializer__end-year">
            <Form.Label>Graduation Year</Form.Label>
            <Form.Control as="select" ref={this.gradYearRef}>
              <option value={2020}>2020</option>
              <option value={2021}>2021</option>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
              <option value={2029}>2029</option>
              <option value={2030}>2030</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="Initializer__include-summers">
            <Form.Check label="Include Summer Semesters?" ref={this.includeSummersRef} />
          </Form.Group>
          <Form.Group className="my-4">
            <Button variant="primary" block onClick={() => this.setStage('goals')}>
              Next
            </Button>
            <span className="Initializer__failure">{this.state.error}</span>
          </Form.Group>
        </div>
        <div style={{ display: this.state.stage === 'goals' ? undefined : 'none' }}>
          <GoalSelector initialGoals={[]} onSelectGoals={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

export default Initializer;
