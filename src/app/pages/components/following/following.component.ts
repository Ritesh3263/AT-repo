import { Component } from '@angular/core';
import { TraderService } from 'src/app/services/trader.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent {
  traders: any[] = [];
  constructor(private traderService: TraderService, private utilityService: UtilitiesService) {};

  ngOnInit() {
    this.loadTraders();
  }

  loadTraders() {
    this.traderService.getPublishersFollowed().then((traders:any) => {
      if(traders && traders.success) {
        this.traders = traders.results;
        console.log(this.traders)
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(traders), true);
      }
    })
  }

  openTraderProfile(trader: any) {
    this.utilityService.navigate(`owner-profile/${trader.id}`)
  }

  removeFromTraders(trader: any) {
    for(let i = 0; i < this.traders.length; i++) {
      if(this.traders[i].id == trader.id) {
        this.traders.splice(i,1);
      }
    }
  }

  unfollow(trader: any) {
    this.traderService.follow(trader.id, 'DELETE').then((results:any) => {
      if(results && results.success) {
        this.removeFromTraders(trader);
        this.utilityService.displayInfoMessage("Trader unfollowed!  You will no longer receive notifications when this trader publishes any changes.")
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(results), true);
      }
    })
  }
}
