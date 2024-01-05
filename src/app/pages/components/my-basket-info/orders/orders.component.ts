import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';

export interface PeriodicElement {
  Symbol: string;
  Quantity: number;
  UpdatedAt: string;
  OrderID: string;
}
// export interface PeriodicElement {
//   Symbol: string;
//   Quantity: number;
//   UpdatedAt: string;
// }
const ELEMENT_DATA: PeriodicElement[] = [
  { Symbol: 'TSLA', Quantity: 1734, UpdatedAt: '19660',OrderID:'AAA'},
  { Symbol: 'DCTH', Quantity: 1500, UpdatedAt: '100',OrderID:"AAAA"},
  { Symbol: 'KC', Quantity: 500, UpdatedAt: '200',OrderID:'OrderIDOrderID'}];

const CONFIRMELEMENT_DATA: PeriodicElement[] = [
  { Symbol: 'META', Quantity: 2000, UpdatedAt: '200',OrderID:"AAA"},
  { Symbol: 'GOOG', Quantity: 3000, UpdatedAt: '300',OrderID:"AAA"},
  { Symbol: 'IBM', Quantity: 1000, UpdatedAt: '100' ,OrderID:"AAA"},
];

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent {

  displayedColumns: string[] = ['Symbol', 'Quantity', 'UpdatedAt','OrderID','status'];
  displayedColumnsForPositions: string[] = ['Symbol', 'Quantity', 'Last', 'TotalCost','MarketValue'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSourceConfirm = new MatTableDataSource<PeriodicElement>(CONFIRMELEMENT_DATA);
  dataSourcePosition = new MatTableDataSource<{}>([])
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showSpinner:boolean=true;
  user_id:any=null;
  isPosition:boolean=true;
  basketId:number=0;

  constructor(public dialog: MatDialog,private basketTradeService :BasketTradeService,private userService: UserService,private utilityService: UtilitiesService,@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent) {}

  ngAfterViewInit(id=null) {
    this.dataSource.paginator = this.paginator;
    // this.getAccountBasketPosition();
    this.loadUserDetails();
    this.basketId = id || this.parentComponent.getBasketId();

  }

/***loadUserDetails function is used to get user information  */
loadUserDetails() {
  this.showSpinner = true;
  this.userService.getUserDetails().then((user:any) => {
    this.showSpinner = false;
    this.user_id = user.firstName?user.firstName:null
    this.getBrokerageAccountPosition();
    // this.getOrderStatus();
    this.getOrder();
  })
}



  async getBrokerageAccountPosition(){
      this.basketTradeService.getBrokerageAccountPosition('ts',this.user_id,'SIM1213784M').then((data) => {
        this.isPosition=false;
        if(data&&data.success && data.Positions) {
          this.isPosition=true;
          this.dataSourcePosition = new MatTableDataSource<any>(data.Positions)
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

    pendingOrders:any=[];
    confirmOrders:any=[];

    // getOrderStatus(){
    //   this.showSpinner= true;
    //   this.pendingOrders=[];
    //   this.confirmOrders=[];
    //   this.basketTradeService.getOrderStatus('ts',this.user_id,).then((data) => {
    //     this.showSpinner =false;
    //     if(data && data.success) {
    //       data.orders.forEach((ele:any)=>{
    //           if(ele.OrderStatus == 'pending'&& ele.Symbol != "N/A"&& ele.Quantity!="N/A"){
    //             ele.Quantity = Number(ele.Quantity);
    //             ele.CreatedAt = ele.CreatedAt =="N/A"?null: ele.CreatedAt ;
    //             this.pendingOrders.push(ele);
    //           }else if(ele.OrderStatus == "confirmed"&& ele.Symbol != "N/A"&& ele.Quantity!="N/A"){
    //             ele.Quantity = Number(ele.Quantity);
    //             ele.UpdatedAt = ele.UpdatedAt =="N/A"?null: ele.UpdatedAt ;
    //             this.confirmOrders.push(ele);
    //           }
    //       })
    //       this.dataSourceConfirm =this.confirmOrders;
    //       this.dataSource = this.pendingOrders;
    //     }
    //     // }else{
    //     //   this.utilityService.displayInfoMessage(data.error, true)
    //     // }
    //   })
    // }

    getOrder(){
      this.showSpinner= true;
      this.pendingOrders=[];
      this.confirmOrders=[];
      this.basketTradeService.getOrderByBasketId('ts',this.user_id,this.basketId).then((data) => {
        this.showSpinner =false;
        if(data && data.success) {
          data.orders.forEach((ele:any)=>{
              if(ele.OrderStatus == 'pending'&& ele.Symbol != "N/A"&& ele.Quantity!="N/A"){
                ele.Quantity = Number(ele.Quantity);
                ele.CreatedAt = ele.CreatedAt =="N/A"?null: ele.CreatedAt ;
                this.pendingOrders.push(ele);
              }else if(ele.OrderStatus == "confirmed"&& ele.Symbol != "N/A"&& ele.Quantity!="N/A"){
                ele.Quantity = Number(ele.Quantity);
                ele.UpdatedAt = ele.UpdatedAt =="N/A"?null: ele.UpdatedAt ;
                this.confirmOrders.push(ele);
              }
          })
          this.dataSourceConfirm =this.confirmOrders;
          this.dataSource = this.pendingOrders;
        }
        // }else{
        //   this.utilityService.displayInfoMessage(data.error, true)
        // }
      })
    }
}
