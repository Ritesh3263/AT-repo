import { Component } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Basket } from 'src/app/interfaces/basket';
import { BasketsService } from 'src/app/services/baskets.service';

@Component({
  selector: 'app-create-basket',
  templateUrl: './create-basket.component.html',
  styleUrls: ['./create-basket.component.scss']
})
export class CreateBasketComponent {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  selectedOption: string = '';
  form: FormGroup = new FormGroup(''); // FormGroup
  baskets: Basket[] = []

  constructor(private fb: FormBuilder, public dialog: MatDialog, private basketService: BasketsService, private dialogRef: MatDialogRef<CreateBasketComponent>, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.form = this.fb.group ({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      action: new FormControl('', [Validators.required])
    })
    this.basketService.getAllBaskets(true).then((basket: Basket[]) => {
      this.baskets = basket;
    });
  }

  getErrorMessage(value: string) {
    if (this.form.controls[value].hasError('required')) {
      return 'You must enter a value';
    }
    return ''
  }

  isControlValid(field: string) {
    return this.form.controls[field].touched && this.form.controls[field].errors?.['required']
  }

  isFormValid() {
   return this.form.valid;
  }

  displayInfoMessage(message: string, error = false) {
    this._snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: error ? ['warn-snackbar'] : ['primary-snackbar']
    });
  }

  createBasket() {
    let form = this.form.controls;
    // Deepcopy the basket object before sending to API to avoid altering FormControl data
    let basket = { name: form['name'].getRawValue(),
      description: form['description'].getRawValue(),
      action: form['action'].getRawValue()
    }

    this.basketService.createBasket(basket).then((data) => {
      if(!(data && data.status.id)) {
        this.displayInfoMessage("Error Creating Basket: " + JSON.stringify(data,null,2));
      }
      else {
        this.displayInfoMessage(`${basket.name} created!`);
        this.dialogRef.close({success: true, id: data.status.id});
      }
    })
  }
}