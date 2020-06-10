import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

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

  regError: string;
  regEmailMarketing: boolean;
  regUserTesting: boolean;

  loading: boolean;
  failed: boolean;
  registering: boolean;

  constructor(private userService: UserService) {
    this.login = new EventEmitter<void>();
    this.register = new EventEmitter<void>();
    this.dismissEvent = new EventEmitter<void>();
    this.loading = false;
    this.failed = false;
    this.registering = false;
    this.username = '';
    this.password = '';
    this.password2 = '';
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
    this.loading = true;

    this.userService.login(this.username, this.password).subscribe((success: boolean) => {
      if (success) {
        this.login.emit();
      } else {
        this.failed = true;
      }
      this.loading = false;
    });
  }

  submitRegistration(): void {
    this.loading = true;
    if(this.password !== this.password2) {
      this.regError = 'Password and confirm password fields don\'t match!';
      this.loading = false;
      return;
    }

    this.userService
      .register(this.username, this.password, this.password2, this.regEmailMarketing, this.regUserTesting)
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
}
