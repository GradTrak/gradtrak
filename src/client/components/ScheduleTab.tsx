import React from 'react';
import { Dropdown } from 'react-bootstrap';

import ConfirmDialog from './ConfirmDialog';
import RenameDialog from './RenameDialog';

import './ScheduleTab.css';

type ScheduleTabProps = {
  scheduleName: string;
  active: boolean;
  onSetActive: () => void;
  onRename: (newName: string) => void;
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

  private handleRenameConfirm = (newName: string): void => {
    this.closeModal();
    this.props.onRename(newName);
  };

  private handleDeleteConfirm = (): void => {
    this.closeModal();
    this.props.onDelete();
  };

  private closeModal = (): void => {
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
          <Dropdown.Toggle className="gt-button" as="button" />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => this.setState({ modal: 'rename' })}>Rename</Dropdown.Item>
            <Dropdown.Item onClick={() => this.setState({ modal: 'delete' })}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <RenameDialog
          show={this.state.modal === 'rename'}
          onRename={this.handleRenameConfirm}
          onCancel={this.closeModal}
        >
          New name for schedule <span className="ScheduleTab__schedule-name">{this.props.scheduleName}</span>:
        </RenameDialog>
        <ConfirmDialog
          show={this.state.modal === 'delete'}
          onConfirm={this.handleDeleteConfirm}
          onCancel={this.closeModal}
        >
          Are you sure you want to delete the schedule{' '}
          <span className="ScheduleTab__schedule-name">{this.props.scheduleName}</span>? This action cannot be undone.
        </ConfirmDialog>
      </span>
    );
  }
}

export default ScheduleTab;
