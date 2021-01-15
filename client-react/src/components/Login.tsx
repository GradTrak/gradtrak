import React from 'react';
import { Button, Form } from 'react-bootstrap';

import { validateEmail } from '../lib/utils';

import googleSigninButton from '../assets/google-signin.svg';

type LoginProps = {
  onLogin: (username: string, password: string) => Promise<string>;
  onRegister: (username: string, password: string, userTesting: boolean) => Promise<string>;
  onDismiss: () => void;
};

type LoginState = {
  loading: boolean;
  registering: boolean;
  error: string;
};

class Login extends React.Component<LoginProps, LoginState> {
  private readonly usernameRef: React.RefObject<HTMLInputElement>;
  private readonly passwordRef: React.RefObject<HTMLInputElement>;
  private readonly password2Ref: React.RefObject<HTMLInputElement>;
  private readonly regUserTestingRef: React.RefObject<HTMLInputElement>;

  constructor(props: LoginProps) {
    super(props);

    this.usernameRef = React.createRef<HTMLInputElement>();
    this.passwordRef = React.createRef<HTMLInputElement>();
    this.password2Ref = React.createRef<HTMLInputElement>();
    this.regUserTestingRef = React.createRef<HTMLInputElement>();

    this.state = {
      loading: false,
      registering: false,
      error: null,
    };
  }

  showLogin = () => {
    this.setState({
      registering: false,
      error: null,
    });
  };

  showRegistration = () => {
    this.setState({
      registering: true,
      error: null,
    });
  };

  handleSubmitLogin = async () => {
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;

    if (!validateEmail(username) || !Login.validPassword(password)) {
      this.setState({
        error: 'Invalid username or password',
      });
      return;
    }

    this.setState({
      loading: true,
    });

    const err = await this.props.onLogin(username, password);

    if (err) {
      this.setState({
        error: err,
      });
    }

    this.setState({
      loading: false,
    });
  };

  handleSubmitRegistration = async () => {
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;
    const password2 = this.password2Ref.current.value;
    const userTesting = this.regUserTestingRef.current.checked;

    if (!validateEmail(username)) {
      this.setState({
        error: 'Invalid email address',
      });
      return;
    }
    if (password !== password2) {
      this.setState({
        error: "Password and confirm password fields don't match!",
      });
      return;
    }
    if (!Login.validPassword(password)) {
      this.setState({
        error: 'Invalid password',
      });
      return;
    }

    this.setState({
      loading: true,
    });

    const err = await this.props.onRegister(username, password, userTesting);

    if (err) {
      this.setState({
        error: err,
      });
    }

    this.setState({
      loading: false,
    });
  };

  private static validPassword(password: string): boolean {
    return password.length >= 6;
  }

  render(): React.ReactElement {
    if (!this.state.registering) {
      return (
        <>
          <h4 className="gt-modal-header">Login</h4>
          <div className="row text-center">
            <div className="col">
              <a href="/login/google">
                <img src={googleSigninButton} />
              </a>
            </div>
          </div>
          <hr className="or" />
          <Form className="login" onSubmit={this.handleSubmitLogin}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="username" ref={this.usernameRef} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" ref={this.passwordRef} />
            </Form.Group>
            <div className="my-4 failure">{this.state.error}</div>
            <Form.Group className="my-4">
              {' '}
              <Button variant="primary" block type="submit" disabled={this.state.loading}>
                Login
              </Button>
            </Form.Group>
          </Form>
          <div className="register">
            Don't have an account?
            <a href="#" onClick={this.showRegistration}>
              Register
            </a>
          </div>
          <hr className="or" />
          <div className="skip">
            <a href="#" onClick={this.props.onDismiss}>
              Continue as guest
            </a>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h4 className="gt-modal-header">Register</h4>
          <div className="row text-center">
            <div className="col">
              <a href="/login/google">
                <img src={googleSigninButton} />
              </a>
            </div>
          </div>
          <hr className="or" />
          <Form className="login" onSubmit={this.handleSubmitLogin}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="username" ref={this.usernameRef} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" ref={this.passwordRef} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="password2" ref={this.password2Ref} />
              <Form.Text muted>Your password must be at least 6 characters.</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Check type="checkbox" label="I'd like to help with user testing!" ref={this.regUserTestingRef} />
            </Form.Group>
            <div className="my-4 failure">{this.state.error}</div>
            <Form.Group className="my-4">
              <Button variant="primary" block type="submit" disabled={this.state.loading}>
                Register
              </Button>
              <Form.Text className="text-center my-2 px-3" muted>
                By clicking Register, I agree to receiving updates on what's new as well as GradTrak&lsquo;s
                <a href="https://gradtrak.me/terms/" target="_blank">
                  Terms of Service
                </a>{' '}
                and
                <a href="https://gradtrak.me/privacy/" target="_blank">
                  Privacy Policy
                </a>
                .
              </Form.Text>
            </Form.Group>
          </Form>
          <div className="register">
            Have an account?
            <a href="#" onClick={this.showLogin}>
              Log In
            </a>
          </div>
          <hr className="or" />
          <div className="skip">
            <a href="#" onClick={this.props.onDismiss}>
              Continue as guest
            </a>
          </div>
        </>
      );
    }
  }
}

export default Login;
