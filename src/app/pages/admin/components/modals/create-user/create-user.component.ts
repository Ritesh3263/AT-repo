import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { InputTextComponent } from 'src/app/layouts/forms/input-text/input-text.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  form: FormGroup = new FormGroup(''); // FormGroup
  roles = ["trader", "admin"]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public utilityService: UtilitiesService, private dialogRef: MatDialogRef<CreateUserComponent>, private adminService: AdminService) { }

  ngOnInit() {
    this.form = this.fb.group ({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      roles: new FormControl('trader'),
      authenticationProvider: new FormControl('angularTrading')
    })
  }

  getForm() {
    return this.form;
  }

  createUser() {
    let form = this.form.controls;
    let user = {
      firstName: form['firstName'].getRawValue(),
      lastName: form['lastName'].getRawValue(),
      email: form['email'].getRawValue(),
      roles: [ form['roles'].getRawValue() ],
      authenticationProvider: form['authenticationProvider'].getRawValue()
    }

    this.adminService.createUser(user).then((results) => {
      console.log(JSON.stringify(results,null,2))
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
}
