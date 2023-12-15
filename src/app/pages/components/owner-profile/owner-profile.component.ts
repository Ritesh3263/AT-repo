import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TraderService } from 'src/app/services/trader.service';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Basket } from 'src/app/interfaces/basket';

@Component({
  selector: 'app-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.scss']
})
export class OwnerProfileComponent {
  trader: any = {};
  traderUserId!: string;
  baskets: Basket[] = [];
  constructor(private traderService: TraderService, private utilityService: UtilitiesService, private basketService: BasketsService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.forEach((param) => {
      for(let key in param) {
        if(key == 'id') {
          this.traderUserId = param[key];
        }
      }
    })
  };

  ngOnInit() {
    this.loadTraders();
  }

  loadTraders() {
    this.traderService.getPublisherProfile(this.traderUserId).then((trader:any) => {
      if(trader && trader.trader && trader.success) {
        this.trader = trader.trader;
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(trader), true);
      }
    })
    this.traderService.getBaskets(this.traderUserId).then((baskets:any) => {
      if(baskets && baskets.baskets && baskets.success) {
        this.baskets = baskets.baskets;
        console.log(this.baskets)
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(baskets), true);
      }
    })
  }

  getBasketPeformanceClass(basket: Basket) {
    return basket.percent_change < 0 ? "trade-down" : (basket.percent_change == 0 ? "trade-stable" : "trade-up");
  }

  openTraderProfile(trader: any) {
    this.utilityService.navigate(`owner-profile/${trader.id}`)
  }

  follow() {
    this.traderService.follow(this.trader.id, 'PUT').then((results:any) => {
      if(results && results.success) {
        this.utilityService.displayInfoMessage("Trader followed!  You will receive notifications when this trader publishes any changes")
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(results), true);
      }
    })
  }

  navigate(basket: Basket, path: string) {
    this.utilityService.navigate(`/my-basket-info/${basket.id}/${path}`)
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

        }
      }
    })
  }
}
