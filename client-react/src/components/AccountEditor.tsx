import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import User, { Account } from '../lib/user';

type AccountEditorProps = {
  onClose: () => void;
};

type AccountEditorState = {
  user: Account;
  isSubmitting: boolean;
  changesMade: boolean;
  currentPassword: string;
  error: string;
} & (
  | {
      isChangingPassword: true;
      newPassword: string;
    }
  | {
      isChangingPassword: false;
      newPassword: null;
    }
);

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
      currentPassword: '',
      error: null,
      isChangingPassword: false,
      newPassword: null,
    };

    this.queryWhoami();
  }

  private queryWhoami = async (): Promise<void> => {
    const res = await User.whoami();
    this.setState({
      user: res.user,
    });
  }

  showChangePassword = () => {
    this.setState({
      changesMade: true,
      isChangingPassword: true,
      newPassword: '',
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
      return <>Loading...</>;
    }

    return (
      <>
        <h4 className="gt-modal-header">Account Settings</h4>
        <div className="form-group">
          <div className="row">
            <div className="col-6">
              <label>Email</label>
            </div>
            <div className="col-6">{this.state.user.username}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <label>Password</label>
            </div>
            <div className="col-6">
              {this.state.isChangingPassword ? (
                <>
                  <input className="form-control" type="password" ref={this.newPasswordRef} />
                  <small className="form-text text-muted">Your password must be at least 6 characters.</small>
                </>
              ) : (
                <>
                  ********&nbsp;
                  <button
                    className="gt-button"
                    disabled={this.state.user.auth !== 'local'}
                    onClick={this.showChangePassword}
                  >
                    <i className="material-icons">edit</i>
                  </button>
                  <br />
                  {this.state.user.auth === 'google' ? (
                    <small className="form-text text-muted">You are currently authenticated through Google.</small>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Row>
              <Col xs={6}>
                <label>Current password:</label>
              </Col>
              <Col xs={6}>
                <input className="form-control" type="password" name="password" ref={this.currentPasswordRef} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
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
            </Row>
            {this.state.error ? (
              <Row>
                <Col className="error" xs={12}>
                  {this.state.error}
                </Col>
              </Row>
            ) : null}
          </Form.Group>
        </Form>
      </>
    );
  }
}

export default AccountEditor;
