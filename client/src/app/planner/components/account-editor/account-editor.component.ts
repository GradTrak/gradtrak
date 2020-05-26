import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-editor',
  templateUrl: './account-editor.component.html',
  styleUrls: ['./account-editor.component.scss'],
})
export class AccountEditorComponent implements OnInit {
  isLoading: boolean;
  username: string;
  password: string;

  constructor(private userService: UserService) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.userService.getState().subscribe((state) => {
      this.isLoading = false;
      this.username = state.username;
      this.password = null;
    });
  }
}
