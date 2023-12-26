import { Component,Inject } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent {
  form: FormGroup = new FormGroup(''); // FormGroup
constructor(private fb: FormBuilder,public dialog: MatDialog, public dialogRef: MatDialogRef<EditOrderComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any){
  this.form = this.fb.group ({
    ticker_id: new FormControl(data.ticker_id, [Validators.required]),
    shares: new FormControl(data.shares, [Validators.required]),
    price: new FormControl(data.price, [Validators.required]),
    invested: new FormControl(data.invested, [Validators.required])

  })
}
}
