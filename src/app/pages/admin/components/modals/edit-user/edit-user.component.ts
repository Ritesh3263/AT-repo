import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { InputTextComponent } from 'src/app/layouts/forms/input-text/input-text.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditUserComponent>, private adminService: AdminService) { }

  ngOnInit() {
    this.mode = this.data.mode
    if(this.data.user) {
      console.log(this.data.user)
      this.form = this.fb.group ({
        firstName: new FormControl({value: this.data.user.firstName, disabled: true}, [Validators.required]),
        lastName: new FormControl({value: this.data.user.lastName, disabled: true}, [Validators.required]),
        email: new FormControl({value: this.data.user.email, disabled: true}, [Validators.required]),
        roles: new FormControl(JSON.parse(this.data.user.roles)[0]),
        password: new FormControl(),
        authenticationProvider: new FormControl({value: this.data.user.authenticationProvider, disabled: true}),
        loginLocked: new FormControl(this.data.user.loginLocked)
      })
    }
    else {
      this.form = this.fb.group ({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        roles: new FormControl('trader'),
        password: new FormControl(),
        authenticationProvider: new FormControl('angularTrading')
      })
    }
  }

  showPassword() {
    let form = this.form.controls;
    return form['authenticationProvider'].getRawValue() == 'angularTrading';
  }

  getForm() {
    return this.form;
  }

  createUser() {
    if(this.data.user && this.data.user.id)
      return this.updateUser();

    let form = this.form.controls;
    let user = {
      firstName: form['firstName'].getRawValue(),
      lastName: form['lastName'].getRawValue(),
      email: form['email'].getRawValue(),
      roles: [ form['roles'].getRawValue() ],
      authenticationProvider: form['authenticationProvider'].getRawValue()
    }

    this.adminService.createUser(user).then((results) => {
      if(results && results.success && results.user) {
        this.utilityService.displayInfoMessage("User created!")
        this.dialogRef.close({success: true})
      }
      else {
        if(results && results.message)
          this.utilityService.displayInfoMessage(results.message, true)
        else
          this.utilityService.displayInfoMessage(JSON.stringify(results), true)
      }
    })
  }

  updateUser() {
    let form = this.form.controls;
    let user: any = {
      id: this.data.user.id,
      phoneNumber: this.data.user.phoneNumber,
      profilePhoto: this.data.user.profilePhoto,
      firstName: form['firstName'].getRawValue(),
      lastName: form['lastName'].getRawValue(),
      email: form['email'].getRawValue(),
      roles: [ form['roles'].getRawValue() ],
      //authenticationProvider: form['authenticationProvider'].getRawValue(),
      loginLocked: form['loginLocked'].getRawValue()
    }

    if(form['authenticationProvider'].getRawValue() =='angularTrading' && form['password'].getRawValue()) {
      user.password = form['password'].getRawValue()
    }

    this.adminService.updateUser(user).then((results) => {
      if(results && results.success) {
        this.utilityService.displayInfoMessage("User updated!")
        this.dialogRef.close({success: true})
      }
      else {
        if(results && results.message)
          this.utilityService.displayInfoMessage(results.message, true)
        else
          this.utilityService.displayInfoMessage(JSON.stringify(results), true)
      }
    })
  }
}
