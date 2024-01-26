import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any = {}
  showSpinner: boolean = false;
  isLoading: boolean = false;
  form: FormGroup = new FormGroup('')
  formSchema = [
    { key: 'email',  required: true, type: 'email' },
    { key: 'firstName',  required: true, enableUpdate: true },
    { key: 'lastName',  required: true, enableUpdate: true },
    { key: 'phoneNumber', enableUpdate: true },
    { key: 'jobRole', enableUpdate: true  },
    { key: 'industry', enableUpdate: true  },
    { key: 'tradingFullTime', enableUpdate: true  }
  ]
  initialized: boolean = false;
  selectedFile!: File;
  selectedFileURL: any

  jobRoles: string[] = [
    'Cloud infrastructure architect',
    'Enterprise architect',
    'Solutions architect',
    'Technical architect',
    'Computer systems manager',
    'Network architect',
    'Systems analyst',
    'IT coordinator',
    'Network administrator',
    'Network engineer',
    'Platform engineer',
    'Release manager',
    'Reliability engineer',
    'Software engineer',
    'Software quality assurance analyst',
    'UI (user interface) designer',
    'UX (user experience) designer'
  ]

  industries: string[] =[
    'Cybersecurity',
    'Software',
    'Hardware and equipment',
    'Artificial intelligence',
    'Education and training'
  ]

  constructor(private userService: UserService, private utilityService: UtilitiesService) { };

  async ngOnInit() {
    await this.loadUserDetails();
    this.initialized = true;
  }

  async loadUserDetails(invalidateCache:boolean = false) {
    this.user = await this.userService.getUserDetails(invalidateCache)
    if(this.user.id && typeof this.user.tradingFullTime == 'number') {
      this.user.tradingFullTime = this.user.tradingFullTime.toString() // for radio checkbox
    }
    this.form = this.utilityService.initalizeForm(this.formSchema, this.user)
  }

  async updateProfile() {
    this.showSpinner = this.isLoading = true;

    let results = await this.userService.updateProfile(this.form.getRawValue(), this.selectedFile)
    await this.loadUserDetails(true);
    this.utilityService.displayInfoMessage(results && results.success ? 'Profile updated successfully' : 'Unable to update profile, please try again.', !(results && results.success))

    this.showSpinner = this.isLoading = false;
  }

  async onFileSelected(event: any) {
    const file:File = event.target.files[0];
    const self = this
    const reader = new FileReader();
    this.selectedFile = file

    reader.onloadend = function() {
      self.selectedFileURL = reader.result
    }
    reader.readAsDataURL(file);
  }

  async selectFile() {
    document.getElementById('fileInput')?.click();
  }
}
