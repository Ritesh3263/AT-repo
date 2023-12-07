import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  displayedColumns: string[] = ['tickersymbol', 'shares', 'currentprice', 'investaccount'];
  displayedColumns2: string[] = ['empty','empty','title', 'amount'];
  displayedColumns3: string[] = ['empty2','empty2','title2', 'amount2'];
  displayedColumns4: string[] = ['empty3','empty3','title3', 'amount3'];
  dataSource = this.data.symbols;
}
