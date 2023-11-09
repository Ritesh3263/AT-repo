import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateBasketComponent } from '../create-basket/create-basket.component';

@Component({
  selector: 'app-my-baskets',
  templateUrl: './my-baskets.component.html',
  styleUrls: ['./my-baskets.component.scss']
})
export class MyBasketsComponent {
  constructor(public dialog: MatDialog, private router: Router) {}

  createBasket() {
    this.dialog.open(CreateBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  myBasketInfo() {
    this.router.navigateByUrl('/my-basket-info');
  }
}
