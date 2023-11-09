import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddSymbolsComponent } from '../my-basket-info/add-symbols/add-symbols.component';
import { DeleteSymbolsComponent } from '../my-basket-info/delete-symbols/delete-symbols.component';

@Component({
  selector: 'app-create-basket',
  templateUrl: './create-basket.component.html',
  styleUrls: ['./create-basket.component.scss']
})
export class CreateBasketComponent {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];

  constructor(public dialog: MatDialog) {}

  addSymbols() {
    this.dialog.open(AddSymbolsComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  deleteSymbols() {
    this.dialog.open(DeleteSymbolsComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }
}