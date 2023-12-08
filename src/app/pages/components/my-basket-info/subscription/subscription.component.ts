import { Component, Inject } from '@angular/core';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  toggleValue = true;
  toggleText = 'ON';
  basket: any = {};
  basketId!: number;

  constructor(@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, private basketService: BasketsService, private utilityService: UtilitiesService) {
    this.basket = {}
  }

  ngOnInit() {
    this.basketId = this.parentComponent.getBasketId();
    this.basketService.getBasketDetails(this.basketId).then((data) => {
      if(data && data.basket) {
        this.basket = data.basket;
      }
    })
  }

  updateSubscription() {
    // Subscribe to basket
    this.basket.is_subscribed  = !this.basket.is_subscribed;
    this.basketService.subscribeToBasket(this.basket.id, this.basket.is_subscribed ? 'PUT' : 'DELETE').then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage("Error subscribing to basket.", true)
      }
      else {
        this.utilityService.displayInfoMessage(this.basket.is_subscribed ? "Subscribed to basket." : "Unsubscribed from basket.")
      }
    })
  }
}
