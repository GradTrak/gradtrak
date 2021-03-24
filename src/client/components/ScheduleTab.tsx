import React from 'react';
import { Dropdown } from 'react-bootstrap';

import ConfirmDialog from './ConfirmDialog';

import './ScheduleTab.css';

type ScheduleTabProps = {
  scheduleName: string;
  active: boolean;
  onSetActive: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
};

type ScheduleTabState = {
  modal: 'rename' | 'delete' | null;
};

class ScheduleTab extends React.Component<ScheduleTabProps, ScheduleTabState> {
  constructor(props: ScheduleTabProps) {
    super(props);

    this.state = {
      modal: null,
    };
  }

  private handleDeleteConfirm = (): void => {
    this.setState({
      modal: null,
    });
    this.props.onDelete();
  };

  private handleDeleteCancel = (): void => {
    this.setState({
      modal: null,
    });
  };

  render(): React.ReactElement {
    return (
      <span className={`ScheduleTab ${this.props.active ? 'ScheduleTab--active' : ''}`}>
        <button key={this.props.scheduleName} className="gt-button" type="button" onClick={this.props.onSetActive}>
          {this.props.scheduleName}
        </button>
        <Dropdown className="dropdown-sm" as="span">
          <Dropdown.Toggle className="gt-button" as="button"></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Rename</Dropdown.Item>
            <Dropdown.Item onClick={() => this.setState({ modal: 'delete' })}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <ConfirmDialog
          show={this.state.modal === 'delete'}
          onConfirm={this.handleDeleteConfirm}
          onCancel={this.handleDeleteCancel}
        >
          Are you sure you want to delete the schedule{' '}
          <span className="ScheduleTab__schedule-name">{this.props.scheduleName}</span>? This action cannot be undone.
        </ConfirmDialog>
      </span>
    );
  }
}

export default ScheduleTab;
