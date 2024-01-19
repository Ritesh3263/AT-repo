import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TraderService } from 'src/app/services/trader.service';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserService } from 'src/app/services/user.service';
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
  currentUser: any = {}
  constructor(private traderService: TraderService, private utilityService: UtilitiesService, private basketService: BasketsService, private userService: UserService, private activatedRoute: ActivatedRoute) {
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
    this.userService.getUserDetails().then((user:any) => {
      this.currentUser = user || {};
    })
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
    this.trader.is_followed = !this.trader.is_followed;
    this.traderService.follow(this.trader.id, this.trader.is_followed ? 'PUT' : 'DELETE').then((results:any) => {
      if(results && results.success) {
        this.utilityService.displayInfoMessage(this.trader.is_followed ? "Trader followed!  You will receive notifications when this trader publishes any changes." :
          "Trader unfollowed!  You will no longer receive notifications when this trader publishes any changes.")
        this.trader.followers += this.trader.is_followed ? 1 : -1;
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
        this.utilityService.displayInfoMessage(basket.is_favorite ? "Basket added to favorites" : "Basket removed from favorites")
        basket.basket_favorites += basket.is_favorite ? 1 : -1;
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
        basket.basket_subscribers += basket.is_subscribed ? 1 : -1;
      }
    })
  }
}
