import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { BrokerageService } from '../../../../services/brokerage.service'

@Component({
  selector: 'app-connect-dialog',
  templateUrl: './connect-dialog.component.html',
  styleUrls: ['./connect-dialog.component.scss']
})
export class ConnectDialogComponent {

  brokerageURl:any=null;
  constructor(private brokerage:BrokerageService){

    this.redirectedUrls();

  }


  redirectedUrls(){
    this.brokerage.getRedirectedUrl().then((data:any)=>{      
      this.brokerageURl = data.redirect_url;
    })
  }



  // brokerageURl :string = environment.brokerageUrl;

}
