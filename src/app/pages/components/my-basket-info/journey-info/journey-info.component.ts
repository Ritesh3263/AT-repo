import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BasketsService } from 'src/app/services/baskets.service';

@Component({
  selector: 'app-journey-info',
  templateUrl: './journey-info.component.html',
  styleUrls: ['./journey-info.component.scss']
})
export class JourneyInfoComponent {
  basketId: number = 0;
  basket : any = {
    public: false
  };
  constructor(private activatedRoute: ActivatedRoute, private basketService: BasketsService) {
    this.activatedRoute.params.forEach((param) => {
      for(let key in param) {
        if(key == 'id') {
          this.basketId = param[key];
        }
      }
    })
  }

  ngOnInit() {
    this.getBasket();
  }

  public getBasket() {
    this.basketService.getBasketDetails(this.basketId).then((data) => {
      if(data.error || !data.basket) {
        //this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.basket = data.basket;
      }
    })
  }

  public getBasketId() {
    return this.basketId;
  }
}
