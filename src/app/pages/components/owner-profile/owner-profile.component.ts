import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.scss']
})
export class OwnerProfileComponent {
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
      console.log("jbjkbkb",this.user)
      this.firstName.setValue(this.user.firstName)
      this.lastName.setValue(this.user.lastName)
      this.phoneNumber.setValue(this.user.phoneNumber)
    })
  }
}
