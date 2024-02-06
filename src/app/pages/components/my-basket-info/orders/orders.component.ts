import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { ConfirmTradeComponent } from '../confirm-trade/confirm-trade.component';
import { BrokerageService } from 'src/app/services/brokerage.service';
import { BasketsService } from 'src/app/services/baskets.service';
import { Basket } from 'src/app/interfaces/basket';


export interface PeriodicElement {
  account_id: number;
  transaction_id: number;
  transaction_type: string;
  transaction_date: string;
  order_status: string;
}

export interface InsideOrders {
  symbol: string;
  filled_qty: number;
  order_id: string;
  price_at_request: string
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', maxHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})

export class OrdersComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  pendingDataSource = new MatTableDataSource<any>();
  dataSourcePosition = new MatTableDataSource<any>();
  displayedColumnsForPositions: string[] = ['symbol', 'Quantity', 'Last', 'TotalCost', 'MarketValue'];
  columnsToDisplayConfirm = ['ACTION', 'account_id', 'transaction_id', 'transaction_type', 'transaction_execution_date', 'order_status'];
  columnsToDisplay = ['ACTION', 'account_id', 'transaction_id', 'transaction_type', 'transaction_created_date', 'order_status', 'edit'];
  columnsToDisplayInside = ['symbol', 'filled_qty', 'order_id', "price_at_request", 'transaction_type'];
  columnsToDisplayConfirmInside = ['symbol', 'filled_qty', 'order_id', "price_at_request", 'transaction_type',"message"];
  option:any=[10];
  pendingOption:any=[10];

  // columnsToDisplayPositions = ['account_id', 'POSITION_ID', 'QUANTITY', 'PRICE']
  expandedElement!: InsideOrders | null;
  getChangeStyle(STATUS: string): string {
    if (STATUS.toLowerCase() === 'confirmed') {
      return 'positive-value'; // CSS class for positive values
    } else if (STATUS.toLowerCase() === 'pending') {
      return 'negative-value'; // CSS class for negative values
    } else if (STATUS.toLowerCase() === 'sell') {
      return 'negative-value'; // CSS class for negative values
    } else if (STATUS.toLowerCase() === 'buy') {
      return 'positive-value'; // CSS class for negative values
    }else if (STATUS.toLowerCase() === 'failed') {
      return 'negative-value'; // CSS class for negative values
    } else {
      return ''; // No special style for zero values
    }
  }
  @ViewChild("paginator") paginator !:MatPaginator //pagination for executed orders
  @ViewChild("pendingPaginator") pendingPaginator !:MatPaginator //pendingPaginator for pending orders

  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatSort) pendingSort!: MatSort;

  showSpinner: boolean = false;
  user_id: any = null;
  isPosition: boolean = true;
  basketId: number = 0;
  linkedAccount: any = {}
  basket: any = {}

  constructor(public dialog: MatDialog, private basketTradeService: BasketTradeService, private userService: UserService, private utilityService: UtilitiesService, @Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, private brokerageService: BrokerageService, private basketService: BasketsService) { }

  ngAfterViewInit(id = null) {

  }
  async ngOnInit(id = null) {
    // Initialize dataSource and load data
    // this.dataSource.paginator = this.paginator.first;

    this.basketId = id || this.parentComponent.getBasketId();
    this.basket = await this.parentComponent.getBasket()
    // Get account linked to basket to get broker code
    let data = await this.basketService.getBasketAccounts(this.basketId)
    if(data && data.success && data.accounts && data.accounts.length) {
      let account = this.linkedAccount = data.accounts[0];
      if(account.brokerageAccountData && account.brokerageAccountData.Accounts && account.brokerageAccountData.Accounts.length) {
        this.account_balance = account.brokerageAccountData.Accounts[0].BuyingPower;
        this.cash_balance = account.brokerageAccountData.Accounts[0].CashBalance;
      }

    }
    else {
      // Maybe there is just no account linked, no need to show error message
      //this.utilityService.displayInfoMessage("Error retrieving account information", true)
    }

    this.getConfirmedOrder();
    this.getPendingOrder();
    this.getBrokerageAccountPosition();
    this.pendingDataSource.sort = this.sort;


  }

  // /***loadUserDetails function is used to get user information  */
  // loadUserDetails() {
  //   this.showSpinner = true;
  //   this.userService.getUserDetails().then((user:any) => {
  //     this.showSpinner = false;
  //     this.user_id = user.firstName?user.firstName:null
  //     // this.getOrderStatus();
  //   })
  // }



  async getBrokerageAccountPosition() {
    this.basketTradeService.getBrokerageAccountPosition(this.linkedAccount.broker_code, this.linkedAccount.broker_account_id).then((data) => {
      this.isPosition = false;
      if (data && data.success && data.Positions) {
        this.isPosition = true;
        this.dataSourcePosition = data.Positions
      }
    })
  }
  async getAccountBasketPosition() {
    this.basketTradeService.getAccountBasketPosition(1).then((data) => {
      if (data) {

        for (let i = 0; i < data.length; i++) {
          data[i].current_market_value = Number((data[i].price * data[i].current_shares).toFixed(2))
        }
        this.dataSourcePosition = data
        // this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
      }
    })
  }


  editOrder(ele: any) {
    let inputModelPopup = {
      ticker_id: ele.tickersymbol,
      shares: ele.shares,
      price: ele.currentprice,
      invested: ele.investaccount
    }
    this.dialog.open(EditOrderComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: inputModelPopup
    });
  }

  pendingOrders: any = [];
  confirmOrders: any = [];

  // getOrderStatus(){
  //   this.showSpinner= true;
  //   this.pendingOrders=[];
  //   this.confirmOrders=[];
  //   this.basketTradeService.getOrderStatus('ts',this.user_id,).then((data) => {
  //     this.showSpinner =false;
  //     if(data && data.success) {
  //       data.orders.forEach((ele:any)=>{
  //           if(ele.OrderStatus == 'pending'&& ele.symbol != "N/A"&& ele.Quantity!="N/A"){
  //             ele.Quantity = Number(ele.Quantity);
  //             ele.CreatedAt = ele.CreatedAt =="N/A"?null: ele.CreatedAt ;
  //             this.pendingOrders.push(ele);
  //           }else if(ele.OrderStatus == "confirmed"&& ele.symbol != "N/A"&& ele.Quantity!="N/A"){
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

  getConfirmedOrder() {
    // this.showSpinner= true;
    this.basketTradeService.getOrderByBasketId(this.linkedAccount.broker_code, this.basketId).then((data) => {
      // this.showSpinner =false;
      var executedOrders:any=[];
      this.option=[]
      if (data && data.success) {
        data.orders.forEach((ele: any) => {
          if(ele.order_status.toLowerCase()!='pending'){
            ele.symbols.forEach((eleSub: any) => {
              eleSub.price_at_request = eleSub.price_at_request?Number(eleSub.price_at_request):null;
              eleSub.filled_price = eleSub.filled_price?Number(eleSub.filled_price):null;
            })
            executedOrders.push(ele)
          }
        })
        this.dataSource = new MatTableDataSource<any>(executedOrders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pagination(executedOrders.length)
      }
    })
  }
  getPendingOrder() {
    // this.showSpinner= true;
    this.basketTradeService.getOrderByBasketId(this.linkedAccount.broker_code, this.basketId, "Pending").then((data) => {
      // this.showSpinner =false;
      if (data && data.success) {
        data.orders.forEach((ele: any) => {
          // ele.transaction_created_date = new Date(ele.transaction_created_date)
          // ele.transaction_execution_date = new Date(ele.transaction_execution_date)
          ele.symbols.forEach((elesub: any) => {
            elesub.price_at_request = Number(elesub.price_at_request);
            elesub.price = elesub.price_at_request;
            elesub.request_qty = Number(elesub.request_qty);
            elesub.new_shares = elesub.request_qty;
            elesub.new_invested = elesub.price * elesub.new_shares;
          });
        })
        this.pendingDataSource = new MatTableDataSource<any>(data.orders);
        // this.pendingDataSource.sort = this.pendingSort;
        this.pendingDataSource.paginator = this.pendingPaginator;
        this.pendingPagination(data.orders.length)


      }
    })
  }

  editRow(ele: any) {
    console.log("sjbkjavjbajakjsjka", ele)

  }
  account_balance: any;
  cash_balance: any;
  account_id: any;
  isEdit:boolean=false;
  confirmOrder(ele: any) {
    this.isEdit = true

    /**
     * getTransActionStatus service is used to edit the order
     *  if it is pending then only editable
     */
    this.basketTradeService.getTransActionStatus(this.linkedAccount.broker_code, ele.transaction_id).then((data) => {
      if (data && data.success && data.data.length > 0 && data.data[0].OrderStatus === 'Pending') {
        // this.webSocketService.closeConnection();
        let inputArray = null
        let inputModelPopup = {
          account_balance: this.account_balance,
          cash_balance: Number(this.cash_balance),
          basket_id: this.basketId,
          linkedAccount: this.linkedAccount,
          transaction_id: ele.transaction_id,
          symbols: JSON.parse(JSON.stringify(ele.symbols)),
        }

        const dialogRef = this.dialog.open(ConfirmTradeComponent, {
          panelClass: 'custom-modal',
          disableClose: true,
          width: "70%",
          data: inputModelPopup
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          this.isEdit = false;
          if (result) {
            this.getPendingOrder();
          }
        });
      } else {
        this.utilityService.displayInfoMessage('Unable to edit this order because the order is confirmed ', true);
        this.getPendingOrder();
        this.isEdit = false;
      }
    })

  }


  setInputForEdit(data: any) {

  }

  pagination(data: number) {
    // this.option = [10]
   if (data < 10) {
     this.option = [10, data]
   } else if (data <= 50) {
     this.option = [10, 25, data]
   } else if (data <= 100) {
     this.option = [10, 25, 50, data]
   } else if (100 < data) {
     this.option = [10, 25, 50, 100, data]
   }
 }
 pendingPagination(data: number) {
 if (data < 10) {
   this.pendingOption = [10, data]
 } else if (data <= 50) {
   this.pendingOption = [10, 25, data]
 } else if (data <= 100) {
   this.pendingOption = [10, 25, 50, data]
 } else if (100 < data) {
   this.pendingOption = [10, 25, 50, 100, data]
 }
}

 sortData(sort:Sort){
  if(sort.direction){
    this.dataSource.sort = this.sort;
  }

 }

}