import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import User, { Account } from '../lib/user';

import './AccountEditor.css';

type AccountEditorProps = {
  user: Account;
  onClose: () => void;
};

type AccountEditorState = {
  isSubmitting: boolean;
  changesMade: boolean;
  error: string | null;
  isChangingPassword: boolean;
};

class AccountEditor extends React.Component<AccountEditorProps, AccountEditorState> {
  private readonly newPasswordRef: React.RefObject<HTMLInputElement>;
  private readonly currentPasswordRef: React.RefObject<HTMLInputElement>;

  constructor(props: AccountEditorProps) {
    super(props);

    this.newPasswordRef = React.createRef<HTMLInputElement>();
    this.currentPasswordRef = React.createRef<HTMLInputElement>();

    this.state = {
      isSubmitting: false,
      changesMade: false,
      error: null,
      isChangingPassword: false,
    };
  }

  showChangePassword = () => {
    this.setState({
      changesMade: true,
      isChangingPassword: true,
    });
  };

  handleSubmit = async () => {
    if (!this.currentPasswordRef.current || !this.newPasswordRef.current) {
      console.error('Tried to edit account before render finished');
      return;
    }

    const currentPassword = this.currentPasswordRef.current.value;

    this.setState({
      isSubmitting: true,
    });

    if (this.state.isChangingPassword) {
      const newPassword = this.newPasswordRef.current.value;
      const res = await User.changePassword(currentPassword, newPassword);
      if (res.error) {
        this.setState({
          isSubmitting: false,
          error: res.error,
        });
        return;
      }
    }

    this.setState({
      isSubmitting: false,
    });

    this.props.onClose();
  };

  render(): React.ReactElement {
    return (
      <>
        <h4 className="gt-modal-header">Account Settings</h4>
        <Form.Group as={Row} controlId="AccountEditor__username">
          <Col xs={6}>
            <Form.Label>Email</Form.Label>
          </Col>
          <Col xs={6}>{this.props.user.username}</Col>
        </Form.Group>
        <Form.Group as={Row} controlId="AccountEditor__new-password">
          <Col xs={6}>
            <Form.Label>Password</Form.Label>
          </Col>
          <Col xs={6}>
            {this.state.isChangingPassword ? (
              <>
                <Form.Control type="password" ref={this.newPasswordRef} />
                <Form.Text muted>Your password must be at least 6 characters.</Form.Text>
              </>
            ) : (
              <>
                ********&nbsp;
                <button
                  className="gt-button"
                  type="button"
                  disabled={this.props.user.auth !== 'local'}
                  onClick={this.showChangePassword}
                >
                  <i className="material-icons AccountEditor__edit">edit</i>
                </button>
                <br />
                {this.props.user.auth === 'google' ? (
                  <Form.Text muted>You are currently authenticated through Google.</Form.Text>
                ) : null}
              </>
            )}
          </Col>
        </Form.Group>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <Form.Group as={Row} controlId="AccountEditor__current-password">
            <Col xs={6}>
              <Form.Label>Current password:</Form.Label>
            </Col>
            <Col xs={6}>
              <Form.Control type="password" name="password" ref={this.currentPasswordRef} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col xs={12}>
              <Button
                type="submit"
                variant="primary"
                block
                disabled={!this.state.changesMade || this.state.isSubmitting}
              >
                Save Changes
              </Button>
            </Col>
          </Form.Group>
          {this.state.error ? (
            <Row>
              <Col xs={12}>
                <span className="AccountEditor__error">{this.state.error}</span>
              </Col>
            </Row>
          ) : null}
        </Form>
      </>
    );
  }
}

export default AccountEditor;
