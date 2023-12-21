import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup} from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  form: FormGroup = new FormGroup('')
  roles: string[] = ["trader", "admin"]
  mode: string = 'EDIT'

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditUserComponent>, private adminService: AdminService) { }

  ngOnInit() {
    this.mode = this.data.mode

    let formFields = [{
        key: 'firstName',
        enableUpdate: false,
        required: true
      },
      {
        key: 'lastName',
        enableUpdate: false,
        required: true
      },
      {
        key: 'email',
        enableUpdate: false,
        required: true
      },
      {
        key: 'roles',
        enableUpdate: true,
        required: true,
        defalutValue: 'trader'
      },
      {
        key: 'password',
        enabled: true,
        required: false
      },
      {
        key: 'authenticationProvider',
        required: true,
        defalutValue: 'angularTrading'
      },
      {
        key: 'loginLocked',
        enableUpdate: true,
        required: false
      }
    ]

    if(this.data.user && this.data.user.roles) {
      this.data.user.roles = JSON.parse(this.data.user.roles)[0]
    }

    this.form = this.utilityService.initalizeForm(formFields, this.data.user)
  }

  showPassword() {
    let form = this.form.controls;
    return form['authenticationProvider'].getRawValue() == 'angularTrading';
  }

  getForm() {
    return this.form;
  }

  resultsHandler(results: any, extraCondition: boolean = true) {
    if(results && results.success && extraCondition) {
      this.utilityService.displayInfoMessage("User Saved!")
      this.dialogRef.close({success: true})
    }
    else {
      if(results && results.message)
        this.utilityService.displayInfoMessage(results.message, true)
      else
        this.utilityService.displayInfoMessage(JSON.stringify(results), true)
    }
  }

  async createUser() {
    let user = this.form.getRawValue()
    user.roles = [user.roles]

    if(this.data.user && this.data.user.id)
      return this.updateUser(user);

    let results = await this.adminService.createUser(user);

    this.resultsHandler(results, results.user);
  }

  async updateUser(user: any) {
    if(user['authenticationProvider']=='angularTrading' && user['password']) {
      user.password = user['password']
    }
    delete user['authenticationProvider']
    user.id = this.data.user.id

    let results = await this.adminService.updateUser(user);

    this.resultsHandler(results);
  }
}
