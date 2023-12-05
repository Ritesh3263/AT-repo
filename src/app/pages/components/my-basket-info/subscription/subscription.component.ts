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
  subscribed: boolean = false;

  constructor(@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, private basketService: BasketsService, private utilityService: UtilitiesService) {
    this.basket = {}
  }

  ngOnInit() {
    this.basketId = this.parentComponent.getBasketId();
    this.basketService.getBasketDetails(this.basketId).then((data) => {
      if(data && data.basket) {
        this.basket = data.basket;
        if(!this.basket.is_owner)
          this.subscribed = true;
      }
    })
  }

  onToggleChange() {
    this.toggleText = this.subscribed ? 'ON' : 'OFF';

    this.updateSubscription();
  }

  updateSubscription() {
    if(this.subscribed) {
      // Subscribe to basket
      this.basketService.subscribeToBasket(this.basket.id).then((data) => {
        if(data.error || !data.success) {
          this.utilityService.displayInfoMessage("Error subscribing to basket.", true)
        }
        else {
          this.utilityService.displayInfoMessage("Subscribed to basket.")
        }
      })
    }
    else {
      // Unsubscribe from basket
      this.basketService.unsubscribeFromBasket(this.basket.id).then((data) => {
        if(data.error || !data.success) {
          this.utilityService.displayInfoMessage("Error unsubscribing from basket.", true)
        }
        else {
          this.utilityService.displayInfoMessage("Unsubscribed from basket.")
          this.utilityService.navigate('/my-basket')
        }
      })
    }
  }
}
