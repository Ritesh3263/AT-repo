import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBasketComponent } from '../create-basket/create-basket.component';

@Component({
  selector: 'app-my-baskets',
  templateUrl: './my-baskets.component.html',
  styleUrls: ['./my-baskets.component.scss']
})
export class MyBasketsComponent {
  constructor(public dialog: MatDialog) {}

  createBasket() {
    this.dialog.open(CreateBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }
}
