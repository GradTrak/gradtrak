import React, { FormEvent } from 'react';
import { Button, Col, Form } from 'react-bootstrap';

import './NewScheduleDialog.css';

type NewScheduleDialogProps = {
  existingScheduleNames?: string[];
  onCreate: (name: string, createFrom: string | null) => void;
};

type NewScheduleDialogState = {
  name: string;
  createAs: 'blank' | 'copy';
  createFrom: string | null;
  error: string | null;
};

class NewScheduleDialog extends React.Component<NewScheduleDialogProps, NewScheduleDialogState> {
  constructor(props: NewScheduleDialogProps) {
    super(props);
    this.state = {
      name: '',
      createAs: 'blank',
      createFrom: (props.existingScheduleNames && props.existingScheduleNames[0]) || null,
      error: null,
    };
  }

  private handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (this.state.name.length === 0) {
      this.setState({
        error: 'Schedule name is empty',
      });
      return;
    }
    if (this.props.existingScheduleNames?.includes(this.state.name)) {
      this.setState({
        error: 'Schedule name already exists',
      });
      return;
    }
    this.props.onCreate(this.state.name, this.state.createAs === 'copy' ? this.state.createFrom : null);
  };

  render(): React.ReactElement {
    return (
      <div className="NewScheduleDialog">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Form.Row}>
            <Form.Label xs={3} column>
              Name
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </Col>
          </Form.Group>
          {this.props.existingScheduleNames?.length ? (
            <>
              <Form.Group as={Form.Row}>
                <Form.Label xs={3} column>
                  Create as
                </Form.Label>
                <Col>
                  <Form.Check
                    id="NewScheduleDialog__blank"
                    type="radio"
                    value="blank"
                    label="Blank"
                    checked={this.state.createAs === 'blank'}
                    onChange={(e) => this.setState({ createAs: 'blank' })}
                  />
                  <Form.Check
                    id="NewScheduleDialog__copy"
                    type="radio"
                    value="copy"
                    label="Copy from..."
                    checked={this.state.createAs === 'copy'}
                    onChange={(e) => this.setState({ createAs: 'copy' })}
                  />
                </Col>
              </Form.Group>
              {this.state.createAs === 'copy' ? (
                <Form.Group as={Form.Row}>
                  <Form.Label xs={3} column>
                    Copy from
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      value={this.state.createFrom!}
                      onChange={(e) => this.setState({ createFrom: e.target.value })}
                    >
                      {this.props.existingScheduleNames.map((scheduleName) => (
                        <option key={scheduleName} value={scheduleName}>
                          {scheduleName}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Form.Group>
              ) : null}
            </>
          ) : null}
          <Form.Group>
            <Button block type="submit">
              Create
            </Button>
            {this.state.error ? <span className="NewScheduleDialog__error">{this.state.error}</span> : null}
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default NewScheduleDialog;
