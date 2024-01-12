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
import { MatSort } from '@angular/material/sort';
// export interface PeriodicElement {
//   symbol: string;
//   Quantity: number;
//   UpdatedAt: string;
//   OrderID: string;
// }

export interface PeriodicElement {
  account_id : number;
  transaction_id : number;
  transaction_type: string;
  transaction_date : string;
  order_status : string;
}

export interface InsideOrders {
  symbol : string;
  filled_qty : number;
  order_id : string;
  price_at_request:string
}

export interface PositionOrders {
  account_id : number;
  POSITION_ID : number;
  QUANTITY : number;
  PRICE : number;
}



let ELEMENT_DATA: PeriodicElement[] = [
  
  {
    account_id: 4546564878,
    transaction_id: 9965564878,
    transaction_type: "4382",
    transaction_date :  '2022-08-29',
    order_status : "Confirmed",
  },
//   {
//     account_id: 9846564878,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-09',
//     order_status : "Pending",
//   },
//   {
//     account_id: 8879954662,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-19',
//     order_status : "Pending",
//   },
//   {
//     account_id: 6685244332,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-29',
//     order_status : "Confirmed",
//   },
//   {
//     account_id: 5562242488,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-29',
//     order_status : "Confirmed",
//   },
//   {
//     account_id: 56632485131,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-09',
//     order_status : "Pending",
//   },
//   {
//     account_id: 77521235785,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-19',
//     order_status : "Confirmed",
//   },
//   {
//     account_id: 6568234232,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-29',
//     order_status : "Pending",
//   },
//   {
//     account_id: 7756219998,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-29',
//     order_status : "Confirmed",
//   },
//   {
//     account_id: 77561324551,
//     transaction_id: 4546564878,
//     transaction_type: 4382,
//     transaction_date :  '2022-08-29',
//     order_status : "Confirmed",
//   },
 ];

const ELEMENT_DATA2: InsideOrders[] = [
  {
    symbol : 'TSLA',
    filled_qty: 4382,
    order_id : "Confirmed",
    price_at_request:"222"
  },
  {
    symbol : 'TSLA',
    filled_qty: 4382,
    order_id : "Pending",
    price_at_request:"222"

  },
  {
    symbol : 'TSLA',
    filled_qty: 4382,
    order_id : "Pending",
    price_at_request:"222"

  },

  {
    symbol : 'TSLA',
    filled_qty: 4382,
    order_id : "Confirmed",
    price_at_request:"222"

  },
  {
    symbol : 'TSLA',
    filled_qty: 4382,
    order_id : "Confirmed",
    price_at_request:"222"

  },
];

const ELEMENT_DATA_POSITION: PositionOrders[] = [ 
  {
    account_id : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    account_id : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    account_id : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    account_id : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    account_id : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    account_id : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },

]

// export interface PeriodicElement {
//   symbol: string;
//   Quantity: number;
//   UpdatedAt: string;
// }
// const ELEMENT_DATA: PeriodicElement[] = [
//   { symbol: 'TSLA', Quantity: 1734, UpdatedAt: '19660',OrderID:'AAA'},
//   { symbol: 'DCTH', Quantity: 1500, UpdatedAt: '100',OrderID:"AAAA"},
//   { symbol: 'KC', Quantity: 500, UpdatedAt: '200',OrderID:'OrderIDOrderID'}];

// const CONFIRMELEMENT_DATA: PeriodicElement[] = [
//   { symbol: 'META', Quantity: 2000, UpdatedAt: '200',OrderID:"AAA"},
//   { symbol: 'GOOG', Quantity: 3000, UpdatedAt: '300',OrderID:"AAA"},
//   { symbol: 'IBM', Quantity: 1000, UpdatedAt: '100' ,OrderID:"AAA"},
// ];

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
  displayedColumnsForPositions: string[] = ['symbol', 'Quantity', 'Last', 'TotalCost','MarketValue'];
  columnsToDisplay = ['ACTION','account_id', 'transaction_id', 'transaction_type', 'transaction_date', 'order_status'];
  columnsToDisplayInside = ['symbol', 'filled_qty', 'order_id',"price_at_request",'transaction_type'];
  // columnsToDisplayPositions = ['account_id', 'POSITION_ID', 'QUANTITY', 'PRICE']
  expandedElement!: InsideOrders | null;
  getChangeStyle(STATUS: string): string {
    if (STATUS === 'confirmed') {
      return 'positive-value'; // CSS class for positive values
    } else if (STATUS === 'pending') {
      return 'negative-value'; // CSS class for negative values
    }else if (STATUS === 'SELL') {
      return 'negative-value'; // CSS class for negative values
    } else if (STATUS === 'BUY') {
      return 'positive-value'; // CSS class for negative values
    }else {
      return ''; // No special style for zero values
    }
  }
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>;
  @ViewChild(MatSort) sort = {} as MatSort;

  // displayedColumns: string[] = ['symbol', 'Quantity', 'UpdatedAt','OrderID','status'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // dataSourceConfirm = new MatTableDataSource<PeriodicElement>(CONFIRMELEMENT_DATA);
  // dataSourcePosition = new MatTableDataSource<{}>([])
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  showSpinner:boolean=true;
  user_id:any=null;
  isPosition:boolean=true;
  basketId:number=0;

  constructor(public dialog: MatDialog,private basketTradeService :BasketTradeService,private userService: UserService,private utilityService: UtilitiesService,@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent) {}

  ngAfterViewInit(id=null) {

  }
  ngOnInit(id=null) {
    // Initialize dataSource and load data
    this.dataSource.paginator = this.paginator.first;
    this.basketId = id || this.parentComponent.getBasketId();
    this.getConfirmedOrder();
    this.getPendingOrder();
    this.getBrokerageAccountPosition();


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



  async getBrokerageAccountPosition(){
      this.basketTradeService.getBrokerageAccountPosition('ts','SIM2568116M').then((data) => {
        this.isPosition=false;
        if(data&&data.success && data.Positions) {
          this.isPosition=true;
          this.dataSourcePosition = data.Positions
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

    getConfirmedOrder(){
      this.showSpinner= true;
      this.basketTradeService.getOrderByBasketId('ts',this.basketId,"confirmed").then((data) => {
        this.showSpinner =false;
        if(data && data.success) {
          data.orders.forEach((ele:any)=>{
            ele.symbols.forEach((elesub:any)=>{
              elesub.price_at_request = Number(elesub.filled_price);
            })
          })
          this.dataSource =data.orders;
        }
      })
    }
    getPendingOrder(){
      this.showSpinner= true;
      this.basketTradeService.getOrderByBasketId('ts',this.basketId,"pending").then((data) => {
        this.showSpinner =false;
        if(data && data.success) {
          data.orders.forEach((ele:any)=>{
            ele.symbols.forEach((elesub:any)=>{
              
              elesub.price_at_request = Number(elesub.price_at_request);

              // elesub.price_at_request = Number(elesub.price_at_request);
            })
          })
          this.pendingDataSource =data.orders;
        }
      })
    }
}
