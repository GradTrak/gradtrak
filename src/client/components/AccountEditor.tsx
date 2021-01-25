import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import User, { Account } from '../lib/user';

import './AccountEditor.css';

type AccountEditorProps = {
  onClose: () => void;
};

type AccountEditorState = {
  user: Account;
  isSubmitting: boolean;
  changesMade: boolean;
  error: string;
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
      user: null,
      isSubmitting: false,
      changesMade: false,
      error: null,
      isChangingPassword: false,
    };
  }

  componentDidMount(): void {
    this.queryWhoami();
  }

  private queryWhoami = async (): Promise<void> => {
    const res = await User.whoami();
    this.setState({
      user: res.user,
    });
  };

  showChangePassword = () => {
    this.setState({
      changesMade: true,
      isChangingPassword: true,
    });
  };

  handleSubmit = async () => {
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
    if (!this.state.user) {
      return <div className="AccountEditor">Loading...</div>;
    }

    return (
      <div className="AccountEditor">
        <h4 className="gt-modal-header">Account Settings</h4>
        <Form.Group as={Row} controlId="AccountEditor__username">
          <Col xs={6}>
            <Form.Label>Email</Form.Label>
          </Col>
          <Col xs={6}>{this.state.user.username}</Col>
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
                  disabled={this.state.user.auth !== 'local'}
                  onClick={this.showChangePassword}
                >
                  <i className="material-icons AccountEditor__edit">edit</i>
                </button>
                <br />
                {this.state.user.auth === 'google' ? (
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
      </div>
    );
  }
}

export default AccountEditor;
