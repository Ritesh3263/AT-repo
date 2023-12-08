import { Component } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Basket } from 'src/app/interfaces/basket';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

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

  constructor(private fb: FormBuilder, public dialog: MatDialog, private basketService: BasketsService, private dialogRef: MatDialogRef<CreateBasketComponent>, private utilityService: UtilitiesService) {}

  ngOnInit() {
    this.form = this.fb.group ({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      action: new FormControl('', [Validators.required]),
      sourceBasketId: new FormControl('')
    })
    this.basketService.getAllBaskets(1, 1).then((data: any) => {
      if(data.error || !data.baskets) {
        this.utilityService.displayInfoMessage("Error Loading Basket List: " + data.error, true);
      }
      else {
        this.baskets = data.baskets;
      }
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

  createBasket() {
    let form = this.form.controls;
    // Deepcopy the basket object before sending to API to avoid altering FormControl data
    let basket = { name: form['name'].getRawValue(),
      description: form['description'].getRawValue(),
      action: form['action'].getRawValue(),
      sourceBasketId: form['sourceBasketId'].getRawValue()
    }

    this.basketService.createBasket(basket).then((data) => {
      if(data.error || !data.id) {
        this.utilityService.displayInfoMessage("Error Creating Basket: " + data.error, true);
      }
      else {
        this.utilityService.displayInfoMessage(`${basket.name} created!`);
        this.dialogRef.close({success: true, id: data.id});
      }
    })
  }
}