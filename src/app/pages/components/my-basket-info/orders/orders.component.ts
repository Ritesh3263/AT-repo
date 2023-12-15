import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { UserService } from 'src/app/services/user.service';

export interface PeriodicElement {
  tickersymbol: string;
  shares: number;
  currentprice: number;
  investaccount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { tickersymbol: 'TSLA', shares: 1734, currentprice: 19660, investaccount: 34090.440 },
  { tickersymbol: 'DCTH', shares: 1500, currentprice: 100, investaccount: 150000 },
  { tickersymbol: 'KC', shares: 500, currentprice: 200, investaccount: 100000 },


];

const CONFIRMELEMENT_DATA: PeriodicElement[] = [
  { tickersymbol: 'META', shares: 2000, currentprice: 200, investaccount: 400000 },
  { tickersymbol: 'GOOG', shares: 3000, currentprice: 300, investaccount: 900000 },
  { tickersymbol: 'IBM', shares: 1000, currentprice: 100, investaccount: 100000 },


];
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent {

  displayedColumns: string[] = ['tickersymbol', 'shares', 'currentprice', 'investaccount','status'];
  displayedColumnsForPositions: string[] = ['Symbol', 'Quantity', 'Last', 'TotalCost','MarketValue'];

  // displayedColumns2: string[] = ['empty', 'empty', 'title', 'amount'];
  // displayedColumns3: string[] = ['empty2', 'empty2', 'title2', 'amount2'];
  // displayedColumns4: string[] = ['empty3', 'empty3', 'title3', 'amount3'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSourceConfirm = new MatTableDataSource<PeriodicElement>(CONFIRMELEMENT_DATA);
  dataSourcePosition = new MatTableDataSource<{}>([])
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showSpinner:boolean=false;
  user_id:any=null;
  constructor(public dialog: MatDialog,private basketTradeService :BasketTradeService,private userService: UserService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.getAccountBasketPosition();
    this.loadUserDetails();
  }

/***loadUserDetails function is used to get user information  */
loadUserDetails() {
  this.showSpinner = true;
  this.userService.getUserDetails().then((user:any) => {
    this.showSpinner = false;
    this.user_id = user.firstName?user.firstName:null
    this.getBrokerageAccountPosition();
  })
}



  async getBrokerageAccountPosition(){
    this.showSpinner= true;
      this.basketTradeService.getBrokerageAccountPosition('ts',this.user_id,'SIM1213784M').then((data) => {
        this.showSpinner =false;
        if(data&&data.Positions) {
          this.dataSourcePosition =data.Positions
        }
      })
    }
  async getAccountBasketPosition(){
      this.basketTradeService.getAccountBasketPosition(1).then((data) => {
        if(data) {

          for(let i=0;i<data.length;i++){
            data[i].current_market_value =Number((data[i].price*data[i].current_shares).toFixed(2))
          }
          this.dataSourcePosition =data
          // this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
        }
      })
    }


    editOrder(ele:any) {
      let inputModelPopup={
        ticker_id:ele.tickersymbol,
        shares:ele.shares,
        price : ele.currentprice,
        invested :ele.investaccount
       }
      this.dialog.open(EditOrderComponent, {
        panelClass: 'custom-modal',
        disableClose: true,
        data:inputModelPopup
      });
    }

}
