import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthType } from '../../models/state.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-editor',
  templateUrl: './account-editor.component.html',
  styleUrls: ['./account-editor.component.scss'],
})
export class AccountEditorComponent implements OnInit {
  @Output() onClose: EventEmitter<void>;

  isLoading: boolean;
  isSubmitting: boolean;
  changesMade: boolean;
  user: {
    username: string;
    auth: AuthType;
  };

  isChangingPassword: boolean;
  newPassword: string;
  currentPassword: string;
  error: string;

  constructor(private userService: UserService) {
    this.onClose = new EventEmitter<void>();

    this.isLoading = true;
    this.isSubmitting = false;
    this.changesMade = false;
    this.user = null;
    this.isChangingPassword = false;
    this.newPassword = '';
    this.currentPassword = '';
    this.error = null;
  }

  ngOnInit(): void {
    this.userService.getState().subscribe((state) => {
      this.isLoading = false;
      this.user = state.user;
    });
  }

  changePassword(): void {
    this.isChangingPassword = true;
    this.changesMade = true;
  }

  submit(): void {
    if (this.isChangingPassword) {
      this.userService.changePassword(this.currentPassword, this.newPassword).subscribe((err: string) => {
        if (err) {
          this.error = err;
        } else {
          this.onClose.emit();
        }
        this.isSubmitting = false;
      });
      this.isSubmitting = true;
    }
  }
}
