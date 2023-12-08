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
    this.getBaskets();
  }

  getBaskets() {
    // Get users baskets
    this.basketService.getAllBasketsForMarketplace(0, 1000, this.search).then((data) => {
      if(data.error || !data.baskets) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.baskets = data.baskets;
      }
    });
  }

  subscribeToBasket(basket: Basket) {
    this.basketService.subscribeToBasket(basket.id).then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage("Subscribed to this basket!")
      }
    })
  }

  setFavoriteBasket(basket: Basket) {
    if(basket.is_owner)
      return;
    basket.is_favorite = !basket.is_favorite;
    this.basketService.setFavoriteBasket(basket.id, basket.is_favorite ? 'PUT' : 'DELETE').then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage(basket.is_favorite ? "Basket added to favorites" : "Basket removed from favorites")
        basket.basket_favorites += basket.is_favorite ? 1 : -1;
      }
    })
  }
}
