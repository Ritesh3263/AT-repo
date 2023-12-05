import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { KeyValue, KeyValuePipe } from '@angular/common';
import { Basket } from 'src/app/interfaces/basket';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceMainComponent {
  // Full Basket ( Retrieved from API)
  baskets: Basket[] = [];
  search: string = '';
  constructor(private router: Router, private basketService: BasketsService, private utilityService: UtilitiesService) {}

  ngOnInit() {
    // Get users baskets
    this.basketService.getAllBasketsForMarketplace(0, 1000, this.search).then((basket: Basket[]) => {
      this.baskets = basket;
    });
  }

  subscribeToBasket(basket: Basket) {
    this.basketService.subscribeToBasket(basket.id).then((data) => {
      if(data && data.success) {
        this.utilityService.displayInfoMessage("Subscribed to this basket!")
      }
      else {
        this.utilityService.displayInfoMessage(data.status.error, true)
      }
    })
  }
}
