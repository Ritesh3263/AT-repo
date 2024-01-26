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

  updateSubscription(basket: Basket) {
    // Subscribe to basket
    basket.is_subscribed  = !basket.is_subscribed;
    this.basketService.subscribeToBasket(basket.id, basket.is_subscribed ? 'PUT' : 'DELETE').then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage("Error subscribing to basket.", true)
      }
      else {
        this.utilityService.displayInfoMessage(basket.is_subscribed ? "Subscribed to basket." : "Unsubscribed from basket.")
        basket.basket_subscribers += basket.is_subscribed ? 1 : -1;
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

  getBasketPeformanceClass(basket: Basket) {
    return basket.percent_change < 0 ? "trade-down" : (basket.percent_change == 0 ? "trade-stable" : "trade-up");
  }

  navigate(basket: Basket, path: string) {
    this.utilityService.navigate(`/baskets/${basket.id}/${path}`)
  }

  openOwnerProfile(basket: Basket) {
    this.utilityService.navigate(`owner-profile/${basket.created_by_user}`);
  }
}
