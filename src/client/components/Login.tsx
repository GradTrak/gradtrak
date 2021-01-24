import React from 'react';
import { Button, Form } from 'react-bootstrap';

import { validateEmail } from '../lib/utils';

import GoogleSigninButton from '../assets/google-signin.svg';
import './Login.css';

type LoginProps = {
  onLogin: (username: string, password: string) => Promise<string | null>;
  onRegister: (username: string, password: string, userTesting: boolean) => Promise<string | null>;
  onDismiss: () => void;
};

type LoginState = {
  loading: boolean;
  registering: boolean;
  error: string | null;
};

class Login extends React.Component<LoginProps, LoginState> {
  private static validPassword(password: string): boolean {
    return password.length >= 6;
  }

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
    if (!this.usernameRef.current || !this.passwordRef.current) {
      console.error('Tried to log in before render finished');
      return;
    }

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
    if (
      !this.usernameRef.current ||
      !this.passwordRef.current ||
      !this.password2Ref.current ||
      !this.regUserTestingRef.current
    ) {
      console.error('Tried to register before render finished');
      return;
    }

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

  private renderRegistration = (): React.ReactElement => {
    return (
      <>
        <h4 className="gt-modal-header">Register</h4>
        <div className="row Login__google-signin">
          <div className="col">
            <a href="/login/google">
              <GoogleSigninButton />
            </a>
          </div>
        </div>
        <hr className="Login__or" />
        <Form
          className="Login__login"
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmitRegistration();
          }}
        >
          <Form.Group controlId="Register__username">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="username" ref={this.usernameRef} />
          </Form.Group>
          <Form.Group controlId="Register__password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" ref={this.passwordRef} />
          </Form.Group>
          <Form.Group controlId="Register__password2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" name="password2" ref={this.password2Ref} />
            <Form.Text muted>Your password must be at least 6 characters.</Form.Text>
          </Form.Group>
          <Form.Group controlId="Register__user-testing">
            <Form.Check type="checkbox" label="I'd like to help with user testing!" ref={this.regUserTestingRef} />
          </Form.Group>
          <div className="my-4 Login__failure">{this.state.error}</div>
          <Form.Group className="my-4">
            <Button variant="primary" block type="submit" disabled={this.state.loading}>
              Register
            </Button>
            <Form.Text className="my-2 px-3 Register__disclaimer" muted>
              By clicking Register, I agree to receiving updates on what&rsquo;s new as well as GradTrak&lsquo;s{' '}
              <a href="https://gradtrak.me/terms/" target="_blank" rel="noopener">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="https://gradtrak.me/privacy/" target="_blank">
                Privacy Policy
              </a>
              .
            </Form.Text>
          </Form.Group>
        </Form>
        <div className="Login__register">
          Have an account?{' '}
          <Button variant="link" onClick={this.showLogin}>
            Log In
          </Button>
        </div>
        <hr className="Login__or" />
        <div className="Login__skip">
          <Button variant="link" onClick={this.props.onDismiss}>
            Continue as guest
          </Button>
        </div>
      </>
    );
  };

  private renderLogin = (): React.ReactElement => {
    return (
      <>
        <h4 className="gt-modal-header">Login</h4>
        <div className="row Login__google-signin">
          <div className="col">
            <a href="/login/google">
              <GoogleSigninButton />
            </a>
          </div>
        </div>
        <hr className="Login__or" />
        <Form
          className="Login__login"
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmitLogin();
          }}
        >
          <Form.Group controlId="Login__username">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="username" ref={this.usernameRef} />
          </Form.Group>
          <Form.Group controlId="Login__password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" ref={this.passwordRef} />
          </Form.Group>
          <div className="my-4 Login__failure">{this.state.error}</div>
          <Form.Group className="my-4">
            <Button variant="primary" block type="submit" disabled={this.state.loading}>
              Login
            </Button>
          </Form.Group>
        </Form>
        <div className="Login__register">
          Don&rsquo;t have an account?{' '}
          <Button variant="link" onClick={this.showRegistration}>
            Register
          </Button>
        </div>
        <hr className="Login__or" />
        <div className="Login__skip">
          <Button variant="link" onClick={this.props.onDismiss}>
            Continue as guest
          </Button>
        </div>
      </>
    );
  };

  render(): React.ReactElement {
    if (!this.state.registering) {
      return this.renderLogin();
    } else {
      return this.renderRegistration();
    }
  }
}

export default Login;
