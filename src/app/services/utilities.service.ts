import { Injectable } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private _snackBar: MatSnackBar, private _router: Router) { }

  displayInfoMessage(message: string, error = false, duration = 5000) {
    this._snackBar.open(message, 'Dismiss', {
      duration: duration,
      panelClass: error ? ['warn-snackbar'] : ['primary-snackbar']
    });
  }

  navigate(route: string) {
    this._router.navigateByUrl(route);
  }

  getErrorMessage(form: FormGroup, value: string) {
    if (form.controls[value].hasError('required')) {
      return 'You must enter a value';
    }
    return ''
  }

  isControlValid(form: FormGroup, field: string) {
    return form.controls[field].touched && form.controls[field].errors?.['required']
  }

  isFormValid(form: FormGroup) {
   return form.valid;
  }

}
