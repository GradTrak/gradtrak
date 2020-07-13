import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

import { validateEmail } from '../../lib/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output('login') private login: EventEmitter<void>;
  @Output('register') private register: EventEmitter<void>;
  @Output('dismiss') private dismissEvent: EventEmitter<void>;

  username: string;
  // FIXME Look into how to securely handle passwords in JS/Angular
  password: string;
  password2: string;

  loginError: string;

  regError: string;
  regEmailMarketing: boolean;
  regUserTesting: boolean;

  loading: boolean;
  registering: boolean;

  constructor(private userService: UserService) {
    this.login = new EventEmitter<void>();
    this.register = new EventEmitter<void>();
    this.dismissEvent = new EventEmitter<void>();
    this.loading = false;
    this.registering = false;
    this.username = '';
    this.password = '';
    this.password2 = '';
    this.loginError = null;
    this.regError = null;
    this.regEmailMarketing = true;
    this.regUserTesting = false;
  }

  ngOnInit(): void {}

  dismiss(): void {
    this.dismissEvent.emit();
  }

  switchMode(): void {
    this.registering = !this.registering;
  }

  submitLogin(): void {
    if (!validateEmail(this.username) || !LoginComponent.validPassword(this.password)) {
      this.loginError = 'Invalid username or password';
      return;
    }

    this.loading = true;

    this.userService.login(this.username, this.password).subscribe((error: string) => {
      if (error) {
        this.loginError = error;
      } else {
        this.login.emit();
      }
      this.loading = false;
    });
  }

  submitRegistration(): void {
    if (!validateEmail(this.username)) {
      this.regError = 'Invalid email address';
      return;
    }
    if (this.password !== this.password2) {
      this.regError = "Password and confirm password fields don't match!";
      return;
    }
    if (!LoginComponent.validPassword(this.password)) {
      this.regError = 'Invalid password';
      return;
    }

    this.loading = true;
    this.regEmailMarketing = true;

    this.userService
      .register(this.username, this.password, this.regEmailMarketing, this.regUserTesting)
      .subscribe((error: string) => {
        if (error) {
          this.regError = error;
          this.loading = false;
        } else {
          this.userService.queryWhoami().subscribe(() => {
            this.register.emit();
            this.loading = false;
          });
        }
      });
  }

  private static validPassword(password: string): boolean {
    return password.length >= 6;
  }
}
