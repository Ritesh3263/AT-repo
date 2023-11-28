import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any = {}
  constructor(private userService: UserService) {};

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('');

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userService.getUserDetails().then((user:any) => {
      this.user = user || {};
      this.firstName.setValue(this.user.firstName)
      this.lastName.setValue(this.user.lastName)
      this.phoneNumber.setValue(this.user.phoneNumber)
    })
  }
}