import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateBasketComponent } from '../create-basket/create-basket.component';

interface Account {
  value: string;
  viewValue: string;
}

interface AccountGroup {
  disabled?: boolean;
  name: string;
  account: Account[];
}

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

  openOwnerProfile() {
    this.router.navigateByUrl('/owner-profile');
  }

  trackGroup(index: number, group: any): string {
    return group.name; // Use a unique identifier for the group
  }

  trackAccount(index: number, account: any): string {
    return account.value; // Use a unique identifier for the pokemon
  }
  accountControl = new FormControl('');
  accountGroups: AccountGroup[] = [
    {
      name: 'Linked Baskets',
      account: [
        {value: '1234', viewValue: '1234'},
        {value: '7890', viewValue: '7890'},
      ],
    },
  ];
}
