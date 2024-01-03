import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private _snackBar: MatSnackBar, private _router: Router, private fb: FormBuilder) { }

  displayInfoMessage(message: string, error = false, duration = 5000) {
    this._snackBar.open(message, 'Dismiss', {
      duration: duration,
      panelClass: error ? ['warn-snackbar'] : ['primary-snackbar']
    });
  }

  navigate(route: string) {
    this._router.navigateByUrl(route);
  }

  getErrorMessage(form: FormGroup, value: string, email:boolean = false) {
    let errors = form.controls[value].errors;
    if(errors) {
      if (errors['required']) {
        return 'You must enter a value'
      }
      if(errors['pattern']) {
        return `Password must be at least 8 characters and contain one number, one upper case character, one lower case character, and one special character`
      }
      else if(errors['email']) {
        return 'Not a valid email'
      }
    }

    return ''
  }

  isControlValid(form: FormGroup, field: string) {
    return !(form.controls[field].touched && (form.controls[field].errors?.['required'] || form.controls[field].errors?.['email'] || form.controls[field].errors?.['pattern']))
  }

  isFormValid(form: FormGroup) {
   return form.valid;
  }

  initalizeForm(formFields: any[], formData: any = {}) {
    let form: any = {}

    for(let i = 0; i < formFields.length; i++) {
      let validators: any = [];
      if(formFields[i].required)
        validators.push(Validators.required)

      if(formFields[i].type == 'email')
        validators.push(Validators.email)
      else if(formFields[i].type == 'password')
        validators.push(Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/))

      form[formFields[i].key] = new FormControl({value: formData[formFields[i].key] ? formData[formFields[i].key].toString() : (formFields[i].defalutValue ? formFields[i].defalutValue : ''), disabled: (formData[formFields[i].key] && !formFields[i].enableUpdate)}, validators)
    }

    return this.fb.group(form)
  }

}
