import { LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { BrokerageService } from 'src/app/services/brokerage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  state:any;
constructor(private basketTradeService:BasketTradeService,private location:LocationStrategy,private brokerageService:BrokerageService){
 /* user details through route */
 this.state = this.location.getState();
 if(this.state && this.state.user){
  /***getBrokerages service is used to get brokerage types related to user*/
  this.brokerageService.getBrokerages(this.state.user.firstName).then((data: any) => {
    if(data.success && data.brokerages){
        /***getSync service is used for sync position,accounts and orders*/
    this.brokerageService.getSync(data.brokerages[0].active_brokerage_key,this.state.user.firstName).then((data: any) => {}); //  (TODO--Multiple brokerage handling) 
    }
  })
}

}



}
