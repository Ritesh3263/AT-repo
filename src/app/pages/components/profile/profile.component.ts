import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any = {}
  constructor(private userService: UserService, private utilityService: UtilitiesService) {};

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('');

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails(invalidateCache:boolean = false) {
    this.userService.getUserDetails(invalidateCache).then((user:any) => {
      this.user = user || {};
      this.firstName.setValue(this.user.firstName)
      this.lastName.setValue(this.user.lastName)
      this.phoneNumber.setValue(this.user.phoneNumber)
    })
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];

    this.userService.uploadProfilePhoto(file).then((data) => {
      this.loadUserDetails(true);
      this.utilityService.displayInfoMessage("Profile photo updated!")
    })
  }
}