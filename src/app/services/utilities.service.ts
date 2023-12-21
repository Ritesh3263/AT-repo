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
    if (form.controls[value].hasError('required')) {
      return 'You must enter a value';
    }
    else if(email)
      return form.controls[value].hasError('email') ? 'Not a valid email' : '';

    return ''
  }

  isControlValid(form: FormGroup, field: string) {
    return form.controls[field].touched && form.controls[field].errors?.['required']
  }

  isFormValid(form: FormGroup) {
   return form.valid;
  }

  initalizeForm(formFields: any[], formData: any = {}) {
    let form: any = {}

    for(let i = 0; i < formFields.length; i++) {
      form[formFields[i].key] = new FormControl({value: formData[formFields[i].key] ? formData[formFields[i].key].toString() : (formFields[i].defalutValue ? formFields[i].defalutValue : ''), disabled: (formData[formFields[i].key] && !formFields[i].enableUpdate)}, formFields[i].required ? [Validators.required] : null)
    }

    return this.fb.group(form)
  }

}
