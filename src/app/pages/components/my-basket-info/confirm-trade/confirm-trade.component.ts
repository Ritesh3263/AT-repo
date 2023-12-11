import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface PeriodicElement {
  tickersymbol: string;
  shares: number;
  currentprice: number;
  investaccount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {tickersymbol: 'Amazon', shares: 1734, currentprice: 19660, investaccount: 34090.440},
];

@Component({
  selector: 'app-confirm-trade',
  templateUrl: './confirm-trade.component.html',
  styleUrls: ['./confirm-trade.component.scss']
})
export class ConfirmTradeComponent implements OnInit {
  showSpinner:boolean=false;
  investedAmount:any=null;
  netInvestedAmount:any=null;
  avalibleCashBalance: any=null;
  originalData:any=[]
  private subscription: any;


  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<ConfirmTradeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private basketTradeService:BasketTradeService,private matSnackBar:MatSnackBar) {
      if(this.data && this.data.symbols){
        this.data.symbols.forEach((element:any) => {
          this.investedAmount = this.investedAmount+element.new_invested;
          this.netInvestedAmount = this.netInvestedAmount+element.new_invested
          this.avalibleCashBalance = this.data.cash_balance - this.investedAmount

        });
      }
  }

  displayedColumns: string[] = ['tickersymbol', 'shares', 'currentprice', 'investaccount'];
  displayedColumns2: string[] = ['empty','empty','title', 'amount'];
  displayedColumns3: string[] = ['empty2','empty2','title2', 'amount2'];
  displayedColumns4: string[] = ['empty3','empty3','title3', 'amount3'];
  dataSource = this.data.symbols;


  confirmOrder(){
    if(this.data && this.data.symbols){
    let input:{Type :string , Orders:object[]} = {"Type":"NORMAL",Orders:[]};
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
 /**
  * if symbols length is 1 the single order submit 
  * else bulkOrder submits
  */
    if(this.data.symbols.length==1){
      object.Symbol= this.data.symbols[0].ticker_id;
      object.Quantity= JSON.stringify(this.data.symbols[0].new_shares);
      this.showSpinner=true;
      this.basketTradeService.setOrders(object,'nikhil','ts').then((data) => {
        this.showSpinner =false;
        if(data && data.Orders&& data.Orders[0].Error === 'FAILED'){
          this.dialogRef.close();
          this.matSnackBar.open(data.Orders[0].Message, 'Close', {
            duration: 5000, // Duration in milliseconds
            panelClass: ['custom-snack-bar'], 
          });
        }else{
          this.matSnackBar.open(data.Orders[0].Message, 'Close', {
            duration: 5000, // Duration in milliseconds
            panelClass: ['custom-snack-bar'], 
          });
        }
  
      })
    }else{
    for(let i =0; i<this.data.symbols.length;i++){
      object.Symbol= this.data.symbols[i].ticker_id;
      object.Quantity= JSON.stringify(this.data.symbols[i].new_shares);
      input.Orders.push(object)
    }
    this.showSpinner=true;
    this.basketTradeService.setBulkOrders(input,'nikhil','ts').then((data) => {
      this.showSpinner =false;
      if(data && data.Orders&& data.Orders[0].Error === 'FAILED'){
        this.dialogRef.close();
        this.matSnackBar.open(data.Orders[0].Message, 'Close', {
          duration: 5000, // Duration in milliseconds
          panelClass: ['custom-snack-bar'], 
        });
        // this.toastrService.error('Marker closed, Order Failed', 'Error');
      }else{
        this.matSnackBar.open(data.Orders[0].Message, 'Close', {
          duration: 5000, // Duration in milliseconds
          panelClass: ['custom-snack-bar'], 
        });
      }

    })
  }
  }
  }
  ngOnInit() {
  //   this.originalData = this.data.symbols;

  // this.subscription = timer(5000, 5000)
  // .pipe(takeUntil(this.dialogRef.afterClosed()))
  // .subscribe(() =>
  // this.data.symbols[0].price =this.data.symbols[0].price + 5,
  // this.data.symbols[3].price = this.data.symbols[3].price + 10);
}

//   getColor(price:any){
//      let a =null
// for(let i =0;i<this.originalData.length;i++){
//   console.log(this.originalData[i].ticker_id,price.ticker_id ,this.originalData[i].price , price.price,"jdfvjsvksk")
//   if(this.originalData[i].ticker_id == price.ticker_id && this.originalData[i].price != price.price){
//     return "green"
//   }
// }
    
  //   return a;
  // }


}
