import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ConnectDialogComponent } from './connect-dialog/connect-dialog.component';
import { BrokerageService } from '../../../services/brokerage.service'
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import {BrokerService} from "../../../services/broker.service";
import {TableComponent} from "../../../layouts/table/table.component";

@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.scss']
})
export class BrokerageComponent {
  showSpinner: boolean = true;
  selectedBroker!: number
  activeBrokerages :any=null;
  brokerage_type = new FormControl('ts', [Validators.required]);
   state:any;
   tokenForRetrieveAccounts :any=null;
   brokerMaster: any = null
  @ViewChild(TableComponent) table!:TableComponent;
  columnDetails = [
    {
      label: 'Account ID',
      key: 'AccountID',
      type: 'text'
    },
    {
      label: 'Account Type',
      key: 'AccountType',
      type: 'text'
    },
    {
      label: 'Cash Balance',
      key: 'CashBalance',
      type: 'currency'
    },

    {
      label: 'Buying Power',
      key: 'BuyingPower',
      type: 'currency'
    },
    {
      label: 'Equity',
      key: 'Equity',
      type: 'currency'
    },
    {
      label: 'MarketValue',
      key: 'MarketValue',
      type: 'currency'
    },
    {
      label: 'Overnight Buying Power',
      key: 'OvernightBuyingPower',
      type: 'currency'
    },
    {
      label: 'Open Status',
      key: 'Status',
      type: 'text'
    }
  ]

  constructor(public dialog: MatDialog,private brokerageService:BrokerageService,private route: ActivatedRoute,private location:LocationStrategy,private userService: UserService,
              private utilityService: UtilitiesService, private brokerService: BrokerService) {
    /* getting access code from tradeStation */
    this.state = this.location.getState();
    if(this.state && this.state.code){
      this.steAccessToken(this.state.code, this.state.user.firstName) // WHY are we still using firstName here?
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  async ngOnInit() {
    // Get all active brokers and connected accounts done async to avoid blocking
    let data = await this.brokerageService.getAllBrokerageAccounts()
    if(!data.brokers) {
      this.utilityService.displayInfoMessage("Error retrieving broker list: ", true)
    }
    this.brokerMaster = data.brokers;
    this.showSpinner = false;
  }

  async getAccounts(pageNumber:any, pageSize:any, sortColumn:any, sortMode:any, search:any, optionalParam:any, self:any) {
    if(!self.selectedBroker) {
      return {Accounts: []}
    }
    if(!self.brokerMaster) {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(self.getAccounts(null, null, null, null, null, null, self))
        },50)
      })
    }
    return self.brokerMaster[1].accounts
  }

  selectBroker() {
    this.table.getData()
  }

  connectDialog(brokerage_type:any) {
    this.dialog.open(ConnectDialogComponent, {
      panelClass: 'custom-modal',
      data:brokerage_type,
      disableClose: true
    });
  }

  /***getBrokerageAccount function is used to send brokerage code for generating access token*/
  steAccessToken(inputCode:any,inputUser:any){
    this.showSpinner = true;
    let input = {
      code:inputCode,
      user_id:inputUser
    }
    this.brokerageService.setAccessToken(input).then((data) => {
      this.showSpinner=false;
      if(data && data.success){
        //this.isDisableAccounts = true;
      }
    })
  }
  disConnect(index:number){
    // Shouldn't this call an API to delink the brokerage?
    this.brokerMaster[index].is_connected = false;

  }
}
