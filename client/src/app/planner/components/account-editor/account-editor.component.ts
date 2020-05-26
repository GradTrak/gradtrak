import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-editor',
  templateUrl: './account-editor.component.html',
  styleUrls: ['./account-editor.component.scss'],
})
export class AccountEditorComponent implements OnInit {
  isLoading: boolean;
  isSubmitting: boolean;
  isChangingPassword: boolean;
  email: string;
  newPassword: string;
  currentPassword: string;
  error: string;

  constructor(private userService: UserService) {
    this.isLoading = true;
    this.isSubmitting = false;
    this.isChangingPassword = false;
    this.email = null;
    this.newPassword = '';
    this.currentPassword = '';
    this.error = null;
  }

  ngOnInit(): void {
    this.userService.getState().subscribe((state) => {
      this.isLoading = false;
      this.email = state.username;
    });
  }

  submit(): void {
    if (this.isChangingPassword) {
      this.userService.changePassword(this.currentPassword, this.newPassword).subscribe((err: string) => {
        this.error = err;
        this.isSubmitting = false;
      });
      this.isSubmitting = true;
    }
  }
}
