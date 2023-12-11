import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class ConfirmTradeComponent {
  showSpinner:boolean=false;
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<ConfirmTradeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private basketTradeService:BasketTradeService,private matSnackBar:MatSnackBar) {
  }

  displayedColumns: string[] = ['tickersymbol', 'shares', 'currentprice', 'investaccount'];
  displayedColumns2: string[] = ['empty','empty','title', 'amount'];
  displayedColumns3: string[] = ['empty2','empty2','title2', 'amount2'];
  displayedColumns4: string[] = ['empty3','empty3','title3', 'amount3'];
  dataSource = this.data.symbols;


  confirmOrder(){
    

    let input = {
      AccountID: "SIM1213784M",
      Symbol: this.data.symbols[0].ticker_id,
      Quantity: JSON.stringify(this.data.symbols[0].new_shares),
      OrderType: "Market",
      TradeAction: "BUY",
      TimeInForce: {
        Duration: "DAY"
        },
      Route: "Intelligent"
    }
    console.log("this.data.symbols",input)
    this.showSpinner=true;
    this.basketTradeService.setOrders(input,'wences','ts').then((data) => {
      this.showSpinner =false;
      if(data && data.Orders&& data.Orders[0].Error === 'FAILED'){
        this.dialogRef.close();
        console.log("response",data.Orders,data.Orders[0])
        this.matSnackBar.open(data.Orders[0].Message, 'Close', {
          duration: 5000, // Duration in milliseconds
          panelClass: ['custom-snack-bar'], 
        });
        // this.toastrService.error('Marker closed, Order Failed', 'Error');
      }else{

      }

    })
  }





}
