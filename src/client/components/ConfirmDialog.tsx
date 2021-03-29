import React from 'react';
import { Button, Modal } from 'react-bootstrap';

type ConfirmDialogProps = {
  children: React.ReactNode;
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmDialog(props: ConfirmDialogProps): React.ReactElement {
  return (
    <Modal show={props.show} onHide={props.onCancel}>
      <Modal.Body>
        <div className="ConfirmDialog">{props.children}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" size="sm" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={props.onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDialog;
