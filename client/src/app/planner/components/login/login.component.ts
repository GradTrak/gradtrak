import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() private success: EventEmitter<void>;
  @Output() private dismiss: EventEmitter<void>;

  username: string;
  // FIXME Look into how to securely handle passwords in JS/Angular
  password: string;
  password2: string;

  loading: boolean;
  failed: boolean;
  registering: boolean;

  constructor(private userService: UserService) {
    this.success = new EventEmitter<void>();
    this.dismiss = new EventEmitter<void>();
    this.loading = false;
    this.failed = false;
    this.registering = false;
    this.username = "";
    this.password = "";
    this.password2 = "";
  }

  ngOnInit(): void {}

  onSignUp(): void {
    this.registering = true;
  }

  submitLogin(): void {
    this.loading = true;

    this.userService.login(this.username, this.password).subscribe((success: boolean) => {
      if (success) {
        this.success.emit();
      } else {
        this.failed = true;
      }
      this.loading = false;
    });
  }
}
