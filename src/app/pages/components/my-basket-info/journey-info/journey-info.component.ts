import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-journey-info',
  templateUrl: './journey-info.component.html',
  styleUrls: ['./journey-info.component.scss']
})
export class JourneyInfoComponent {
  basketId: number = 0;
  public basket : any = {
    public: false
  };
  isLoading: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private basketService: BasketsService, private utilityService: UtilitiesService) {
    this.activatedRoute.params.forEach((param) => {
      for(let key in param) {
        if(key == 'id') {
          this.basketId = param[key];
        }
      }
    })
  }

  async ngOnInit() {
    await this.getBasket();
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({})
      }, ms)
    })
  }

  public async getBasket() {
    while(this.isLoading) {
      await this.wait(10)
    }

    this.isLoading = true;

    if(this.basket && this.basket.id) {
      this.isLoading = false;
      return this.basket;
    }

    let data = await this.basketService.getBasketDetails(this.basketId)
    this.isLoading = false;
    if(data.error || !data.basket) {
      this.utilityService.displayInfoMessage(data.error, true)
    }
    else {
      this.basket = data.basket;
    }

    return this.basket;
  }

  public getBasketId() {
    return this.basketId;
  }
}
