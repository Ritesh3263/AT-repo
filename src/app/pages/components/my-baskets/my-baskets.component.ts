import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateBasketComponent } from '../create-basket/create-basket.component';

import { KeyValue, KeyValuePipe } from '@angular/common';
import { Basket } from 'src/app/interfaces/basket';
import { BasketsService } from 'src/app/services/baskets.service';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
  Object = Object;
  // Current User
  user: any = {};
  // Full Basket ( Retrieved from API)
  basket: any[] = [];
  favoriteBaskets: Basket[] = [];
  // Filtered Basket for In-Memory Searching, Sorting, Ordering etc.
  filteredBasket: Basket[] = [];

  // User Controls for Searching, Sorting, Ordering etc.
  sorting: string = 'Newest';

  // Linked Account Filter Set
  accountFilter: any = {
    'All': (item:any) => { return true; },
    'Unlinked': (item:any) => { return (item.account == null ) }
  }
  // Private / Public Visibility Filter Set
  visibilityFilter: any = {
    'All': (item:any) => { return true; },
    'Public (Pulished to Marketplace)': (item:any) => { return item.public && item.is_owner },
    'Private': (item:any) => { return item.public == false },
    'Subscribed': (item:any) => { return item.public && !item.is_owner }
  }
  // Chain all the filters together
  filterChain:any = {
    accountFilter: this.accountFilter['All'],
    visibilityFilter: this.visibilityFilter['All']
  }

  constructor(public dialog: MatDialog, private basketService: BasketsService, private userService: UserService, private utilityService: UtilitiesService) {}

  createBasket() {
    let dialogRef = this.dialog.open(CreateBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success && result.id) {
        this.utilityService.navigate(`/baskets/${result.id}/basket`);
      }
    });
  }

  openOwnerProfile(basket: Basket) {
    this.utilityService.navigate(`owner-profile/${basket.created_by_user}`);
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

  ngOnInit() {
    // Get users baskets
    this.basketService.getAllBaskets().then((data) => {
      if(data.error || !data.baskets) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.basket = data.baskets;
        this.filteredBasket = data.baskets;//this.getActiveBaskets();
        this.getAllLinkedAccounts();
      }

    });
    // Get current user
    this.userService.getUserDetails().then((user:any) => {
      this.user = user || {};
    })

    this.basketService.getFavoriteBaskets().then((data) => {
      if(data.error || !data.baskets) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.favoriteBaskets = data.baskets;
      }

    });
  }

  getAllLinkedAccounts() {
    for(let i:number = 0; i < this.basket.length; i++) {
      if(this.basket[i].account) {
        this.accountFilter[this.basket[i].account] = (item:any) => { return (item.account == this.basket[i].account ) }
      }
    }
  }

  filterFunction(filter: any, filterConfig: any, value: any) {
    // Set this filter function into the filter chain
    this.filterChain[filterConfig] = filter[value];

    this.filteredBasket = this.basket; // Reset the filters
    for(let key in this.filterChain) { // Loop through re-applying all filter functions
      this.filteredBasket = this.filteredBasket.filter(this.filterChain[key])
    }

    this.sortBaskets(this.sorting);
  }

  sortBaskets(sorting:string) {
    this.sorting = sorting;
    switch(sorting) {
      case 'Newest':
        this.filteredBasket = this.filteredBasket.sort((a,b) => {
          if(a.created_date < b.created_date) return -1;
          else if(a.created_date > b.created_date) return 1;
          return 0;
        });
        break;
      case 'Oldest':
        this.filteredBasket = this.filteredBasket.sort((a,b) => {
          if(a.created_date < b.created_date) return 1;
          else if(a.created_date > b.created_date) return -1;
          return 0;
        });
        break;
    }
  }

  // Order by ascending property value
  valueAscOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    if(a.key.toString() == 'Any') return -1;
    if(a.key.toString() == 'Unlinked') return 0;
    return 1;
  }

  getBasketPeformanceClass(basket: Basket) {
    return basket.percent_change < 0 ? "trade-down" : (basket.percent_change == 0 ? "trade-stable" : "trade-up");
  }

  navigate(basket: Basket, path: string) {
    this.utilityService.navigate(`/baskets/${basket.id}/${path}`)
  }

  removeFromBasket(baskets: Basket[], basket: Basket, extraCondition:boolean = true) {
    for(let i = 0; i < baskets.length; i++) {
      if(baskets[i].id == basket.id && extraCondition) {
        baskets.splice(i,1);
      }
    }
  }

  setFavoriteBasket(basket: Basket) {
    basket.is_favorite = !basket.is_favorite;
    this.basketService.setFavoriteBasket(basket.id, basket.is_favorite ? 'PUT' : 'DELETE').then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage(basket.is_favorite ? "Basket added to favorites" : "Basket removed from favorites");
        if(!basket.is_favorite) {
          // Remove this basket from in-memory array
          this.removeFromBasket(this.favoriteBaskets, basket);
          this.removeFromBasket(this.basket, basket, !basket.is_subscribed);
        }
      }
    })
  }

  updateSubscription(basket: Basket) {
    // Subscribe to basket
    basket.is_subscribed  = !basket.is_subscribed;
    this.basketService.subscribeToBasket(basket.id, basket.is_subscribed ? 'PUT' : 'DELETE').then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage("Error subscribing to basket.", true)
      }
      else {
        this.utilityService.displayInfoMessage(basket.is_subscribed ? "Subscribed to basket." : "Unsubscribed from basket.")
        if(!basket.is_subscribed) {
          // Remove this basket from in-memory array
          this.removeFromBasket(this.basket, basket, !basket.is_favorite);
        }
      }
    })
  }
}
