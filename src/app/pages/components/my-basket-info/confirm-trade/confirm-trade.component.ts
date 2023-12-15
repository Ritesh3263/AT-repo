import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebsocketService } from 'src/app/services/websocket.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from 'src/app/services/user.service';

export interface PeriodicElement {
  tickersymbol: string;
  shares: number;
  currentprice: number;
  investaccount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { tickersymbol: 'Amazon', shares: 1734, currentprice: 19660, investaccount: 34090.440 },
];

const enterTransition = transition(':enter', [
  style({
    opacity: 0
  }),
  animate('1s ease-in', style({
    opacity: 1
  }))
]);

const leaveTrans = transition(':leave', [
  style({
    backgroundColor: 'red',

  }),
  animate('1s ease-out', style({
    backgroundColor: 'red',
  }))
])

const fadeIn = trigger('fadeIn', [
  enterTransition
]);

const fadeOut = trigger('fadeOut', [
  leaveTrans
]);
@Component({
  selector: 'app-confirm-trade',
  templateUrl: './confirm-trade.component.html',
  animations: [
    trigger('fadeInOut', [
      // state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ backgroundColor: 'lightgreen', }),
        animate(10000)
      ]),
      // transition(':leave',
      //   animate(3000, style({ backgroundColor: 'red', })))
    ]),
  ],
  styleUrls: ['./confirm-trade.component.scss']
})
export class ConfirmTradeComponent implements OnInit, OnDestroy {
  private messageSubscription: any;
  showSpinner: boolean = false;
  investedAmount: any = null;
  netInvestedAmount: any = null;
  avalibleCashBalance: any = null;
  originalData: any = []
  private subscription: any;
  inputForSymbolPrice: any = [];
  tableBackgroundColor:any='';
  user_id:any=null;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ConfirmTradeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private basketTradeService: BasketTradeService, private matSnackBar: MatSnackBar, private webSocketService: WebsocketService,private userService: UserService) {

      this.loadUserDetails();
      if (this.data && this.data.symbols) {
      this.originalData = JSON.parse(JSON.stringify([...this.data.symbols]));

      this.data.symbols.forEach((element: any) => {
        this.investedAmount = this.investedAmount + element.new_invested;
        this.netInvestedAmount = this.netInvestedAmount + element.new_invested
        this.avalibleCashBalance = this.data.cash_balance - this.investedAmount
        this.inputForSymbolPrice.push(element.ticker_id)
      });
    }
    /** set symbols for price */
    this.setSymbolsForBrokeragePrice(this.inputForSymbolPrice, true)
  }

  displayedColumns: string[] = ['tickersymbol', 'shares', 'currentprice', 'investaccount'];
  displayedColumns2: string[] = ['empty', 'empty', 'title', 'amount'];
  displayedColumns3: string[] = ['empty2', 'empty2', 'title2', 'amount2'];
  displayedColumns4: string[] = ['empty3', 'empty3', 'title3', 'amount3'];
  dataSource = this.data.symbols;


/***loadUserDetails function is used to get user information  */
loadUserDetails() {
  this.userService.getUserDetails().then((user:any) => {
    this.user_id = user.firstName?user.firstName:null
  })
}
  confirmOrder() {
    if (this.data && this.data.symbols) {
      let input: { Type: string, Orders: object[] } = { "Type": "NORMAL", Orders: [] };
      let object = {
        AccountID: "SIM1213784M",
        Symbol: "null",
        Quantity: "null",
        OrderType: "Market",
        TradeAction: "BUY",
        TimeInForce: {
          Duration: "DAY"
        },
        Route: "Intelligent"
      }

      for (let i = 0; i < this.data.symbols.length; i++) {
        object.Symbol = this.data.symbols[i].ticker_id;
        object.Quantity = JSON.stringify(this.data.symbols[i].new_shares);
        input.Orders.push(object)
      }
      /**
       * if symbols length is 1 the single order submit 
       * else bulkOrder submits
       */

      this.showSpinner = true;
      this.basketTradeService.setOrders(input, this.user_id, 'ts').then((data) => {
        this.showSpinner = false;
        if (data && data.Orders && data.Orders[0].Error === 'FAILED') {
          this.dialogRef.close();
          this.matSnackBar.open(data.Orders[0].Message, 'Close', {
            duration: 5000, // Duration in milliseconds
            panelClass: ['custom-snack-bar'],
          });
        } else {
          this.matSnackBar.open(data.Orders[0].Message, 'Close', {
            duration: 5000, // Duration in milliseconds
            panelClass: ['custom-snack-bar'],
          });
        }

      })








      // if (this.data.symbols.length == 1) {
      // object.Symbol = this.data.symbols[0].ticker_id;
      // object.Quantity = JSON.stringify(this.data.symbols[0].new_shares);

      // } else {
      //   for (let i = 0; i < this.data.symbols.length; i++) {
      //     object.Symbol = this.data.symbols[i].ticker_id;
      //     object.Quantity = JSON.stringify(this.data.symbols[i].new_shares);
      //     input.Orders.push(object)
      //   }
      //   this.showSpinner = true;
      //   this.basketTradeService.setBulkOrders(input, 'nikhil', 'ts').then((data) => {
      //     this.showSpinner = false;
      //     if (data && data.Orders && data.Orders[0].Error === 'FAILED') {
      //       this.dialogRef.close();
      //       this.matSnackBar.open(data.Orders[0].Message, 'Close', {
      //         duration: 5000, // Duration in milliseconds
      //         panelClass: ['custom-snack-bar'],
      //       });
      //       // this.toastrService.error('Marker closed, Order Failed', 'Error');
      //     } else {
      //       this.matSnackBar.open(data.Orders[0].Message, 'Close', {
      //         duration: 5000, // Duration in milliseconds
      //         panelClass: ['custom-snack-bar'],
      //       });
      //     }

      //   })
      // }
    }
    /** Remove symbols from price list */
    this.setSymbolsForBrokeragePrice(this.inputForSymbolPrice, false)
    this.ngOnDestroy();
  }
  async ngOnInit() {
    /**connecting webSocket and activating listener*/
    await this.webSocketService.connect();
    await this.webSocketService.receiveMessages()
    /**continues receiving response from websocket*/
    this.messageSubscription = this.webSocketService.getMessages().subscribe((message: any) => {
      let priceData = JSON.parse(message)[0];
      this.data.symbols.forEach((ele: any) => {
        if (ele.ticker_id == priceData.Symbol && priceData.Close) {
          ele.price = priceData.Close
        }
      })
    });



    // this.subscription = timer(5000, 5000)
    // .pipe(takeUntil(this.dialogRef.afterClosed()))
    // .subscribe(() =>{
    // this.data.symbols[0].price =this.data.symbols[0].price + 5;
    // this.data.symbols[2].price =this.data.symbols[2].price + 5;
    // this.data.symbols[4].price =this.data.symbols[4].price + 5;})


  }

  getColor(price: any) {
    let a = null
    for (let i = 0; i < this.originalData.length; i++) {
      if (this.originalData[i].ticker_id == price.ticker_id && this.originalData[i].price != price.price) {
    return "lightgreen"
      }
    }
    // setTimeout(() => {
    //   for (let i = 0; i < this.originalData.length; i++) {
    //     if (this.originalData[i].ticker_id == price.ticker_id && this.originalData[i].price != price.price) {
    //       return ""
    //     }
    //   }
    // }, 1000);
    return a;
  }

  // timeout(){
  //   setTimeout(() => {
  //     this.tableBackgroundColor='';
  //     console.log("timeout successfully")
  //   }, 5000);
  // }



  /**
  * setSymbolsForBrokeragePrice function is used for set symbols for price or remove symbols from price list
  * track is true set symbol for price 
  * track is false remove symbol for price list
  */
  setSymbolsForBrokeragePrice(symbols: any, track: boolean) {
    this.basketTradeService.setSymbolsForBrokeragePrice({ symbols: symbols, track: track }).then((data) => { })
  }
  cancel() {

    /** Remove symbols from price list */
    this.setSymbolsForBrokeragePrice(this.inputForSymbolPrice, false);
    this.ngOnDestroy();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.webSocketService.closeConnection();
  }
}
