import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type RenameDialogProps = {
  children: React.ReactNode;
  show: boolean;
  onRename: (name: string) => void;
  onCancel: () => void;
};

type RenameDialogState = {
  newName: string;
};

class RenameDialog extends React.Component<RenameDialogProps, RenameDialogState> {
  constructor(props: RenameDialogProps) {
    super(props);

    this.state = {
      newName: '',
    };
  }

  private handleRename = (): void => {
    this.props.onRename(this.state.newName);
  };

  render(): React.ReactElement {
    return (
      <Modal show={this.props.show} onHide={this.props.onCancel}>
        <Modal.Body>
          <div className="ConfirmDialog">
            {this.props.children}
            <Form.Control
              type="text"
              value={this.state.newName}
              onChange={(e) => this.setState({ newName: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" onClick={this.handleRename}>
            Confirm
          </Button>
          <Button variant="danger" size="sm" onClick={this.props.onCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RenameDialog;
