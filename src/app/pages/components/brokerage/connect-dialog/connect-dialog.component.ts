import { Component, Inject } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { BrokerageService } from '../../../../services/brokerage.service'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-connect-dialog',
  templateUrl: './connect-dialog.component.html',
  styleUrls: ['./connect-dialog.component.scss']
})
export class ConnectDialogComponent {

  brokerageURl:any=null;
  constructor(private brokerage:BrokerageService,public dialogRef: MatDialogRef<ConnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
    if(data === 'ts'){
      this.redirectedUrls();
    }else{
      this.brokerageURl = null;
    }

  }


  redirectedUrls(){
    this.brokerage.getRedirectedUrl().then((data:any)=>{ 
      if(data.success) {
        this.brokerageURl = data.redirect_url;
      }
    })
  }



  // brokerageURl :string = environment.brokerageUrl;

}
