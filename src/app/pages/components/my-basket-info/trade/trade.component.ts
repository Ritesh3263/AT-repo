import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmTradeComponent } from '../confirm-trade/confirm-trade.component';
import { CalculateDialogComponent } from '../calculate-dialog/calculate-dialog.component';
import {  BasketTradeService } from '../../../../services/basket-trade.service';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';

export interface PeriodicElement {
  ticker_id: string;
  current_cost: number;
  new_cost: number;
  current_shares: number;
  new_shares: number;
  purchase_date: string,
  price: number,
  current_invested: number,
  new_invested: number,
  current_market_value: number,
  new_market_value: number,
  p_l_amount: number,
  p_l_percent: number
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {ticker_id: 'TSLA', purchase_date: '2023/10/18', current_cost: 300.000, new_cost: 25, price: 350.00, current_shares: 10, new_shares: 10, current_invested: 3000.000, new_invested: +3500.00, current_market_value: 3500.000, new_market_value: +3500, p_l_amount: 0.000, p_l_percent: 0.000},
//   {ticker_id: 'AAPL', purchase_date: '2023/10/18', current_cost: 200.000, new_cost: 0, price: 250.00, current_shares: 15, new_shares: 10, current_invested: 2500.000, new_invested: +2500.00, current_market_value: 3750.000, new_market_value: +2500.00, p_l_amount: 0.000, p_l_percent: 0.000},
// ];

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements AfterViewInit {
  isPositions:boolean=false;
  showSpinner:boolean = false;
 displayedColumns: string[]  = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
 form: FormGroup = new FormGroup(''); // FormGroup
 dropDownDetails = ["Equal Distribution","Investment Per stock","Scale Up","Scale Down"]
  // displayedColumns: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'costnew', 'price', 'sharescurrent', 'sharesnew', 'investedcurrent', 'investednew', 'marketcurrent', 'marketnew', 'pl', 'plpercent'];
  // displayedColumnsOne: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
  cash_balance :any= 55530.00;
  account_balance :any = 100000.00;
  invested:any=0.00;
  market_value:any = 0.00;
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  selection = new SelectionModel<PeriodicElement>(true, []);
  isDisplayColumn:boolean=true;
  constructor(private fb: FormBuilder,private renderer: Renderer2, public dialog: MatDialog,private basketTradeService :BasketTradeService) {
    this.getAccountBasketPosition();
    this.getBrokerageAccountPosition();
    this.form = this.fb.group ({
      investmentType: new FormControl('', [Validators.required]),
      percent: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required])
    })
  }
  symbolInput:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
   
    
    
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.current_cost + 1}`;
  }

  getChangeStyle(costnew: number): string {
    if (costnew > 0) {
      return 'positive-value'; // CSS class for positive values
    } else if (costnew < 0) {
      return 'negative-value'; // CSS class for negative values
    } else {
      return ''; // No special style for zero values
    }
  }

  confirmTrade() {

    let inputModelPopup={
     account_balance:this.cash_balance+this.market_value,
     cash_balance : this.cash_balance,
     symbols :this.selection.selected
    }
    this.dialog.open(ConfirmTradeComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data:inputModelPopup
    });
  }

  calculateDialog() {
    this.isDisplayColumn = true;
      this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'costnew', 'price', 'sharescurrent', 'sharesnew', 'investedcurrent', 'investednew', 'marketcurrent', 'marketnew', 'pl', 'plpercent'];

    // this.dialog.open(CalculateDialogComponent, {
    //   panelClass: 'custom-modal',
    //   disableClose: true
    // });
  }
 async getAccountBasketPosition(){
  this.showSpinner= true;
    this.basketTradeService.getAccountBasketPosition(1).then((data) => {
      this.showSpinner =false;
      if(data) {
        this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
        for(let i=0;i<data.length;i++){
          data[i].current_market_value =Number((data[i].price*data[i].current_shares).toFixed(2))
          // if(i==0){
          //   this.symbolInput = data[i].ticker_id;
          // }else{
          //   this.symbolInput = this.symbolInput+','+data[i].ticker_id;
          // }
          this.isPositions=true
          this.dataSource.data= data
          this.isDisplayColumn =false;
        }
        // this.getSymbolPrice();
        // this.basket = data.basket;
        // this.dataSource = new MatTableDataSource<PeriodicElement>(this.basket.tickers);
      }
    })
  }

  async getBrokerageAccountPosition(){
    this.showSpinner= true;
      this.basketTradeService.getBrokerageAccountPosition('ts','Sreekanth','SIM1213784M').then((data) => {
        this.showSpinner =false;
        console.log("hhhh",data)
        // if(data) {
        //   this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
        //   for(let i=0;i<data.length;i++){
        //     data[i].current_market_value =Number((data[i].price*data[i].current_shares).toFixed(2))
        //     // if(i==0){
        //     //   this.symbolInput = data[i].ticker_id;
        //     // }else{
        //     //   this.symbolInput = this.symbolInput+','+data[i].ticker_id;
        //     // }
        //     this.isPositions=true
        //     this.dataSource.data= data
        //     this.isDisplayColumn =false;
        //   }
        //   // this.getSymbolPrice();
        //   // this.basket = data.basket;
        //   // this.dataSource = new MatTableDataSource<PeriodicElement>(this.basket.tickers);
        // }
      })
    }
  cancel(){
    this.form.reset(); // Reset to initial form values
    // this.form.get("investmentType")?.setErrors(null)
    // this.form.get("percentage")?.setErrors(null)
    // this.form.get("amount")?.setErrors(null)
    this.isDisplayColumn = false;
    this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];




  }

  getErrorMessage(value: string) {
    if (this.form.controls[value].hasError('required')) {
      return 'You must enter a value';
    }
    return ''
  }

  isControlValid(field: string) {
    return this.form.controls[field].touched && this.form.controls[field].errors?.['required']
  }

  isFormValid() {
   return this.form.valid;
  }

  calculateTotal(column: string): number {
    let total:number = this.dataSource.data.reduce((acc, current:any) => acc + current[column], 0)
    if(column == 'current_market_value'){
      this.market_value = total
    }else if(column == 'current_invested'){
      this.invested = total
    }
    // Sum the values in the column
    return Number(total);
  }

/****
 * on selected investmentment type onSelectInvestmentType function is called 
 */
  onSelectInvestmentType(investmentType:any){
    this.form.controls['percent'].setValue(null);
    this.form.controls['amount'].setValue(null);
  }

/****
 * on entering percent value onChangePercent function is called 
 */
  onChangePercent(percent:any){
    percent = Number(percent);
      /**convert string to number **/
      if (0 < percent && percent <= 100) {
          var selectedPosition = this.selection.selected;
          let totalAmount = 0;
          for (let i = 0; i < selectedPosition.length; i++) {
              if ((this.form.controls['investmentType'].value == 'Equal Distribution') || (this.form.controls['investmentType'].value == 'Investment Per stock')) {
                  let Amount = ((percent * this.cash_balance) / 100).toFixed(3);
                  this.form.controls['amount'].setValue(Number(Amount));
                  let total = this.form.controls['investmentType'].value == 'Equal Distribution' ? this.form.controls['amount'].value / selectedPosition.length : this.form.controls['amount'].value;
                  selectedPosition[i].new_shares = ~~(total / selectedPosition[i].price);

                  if (selectedPosition[i].new_shares != 0) {
                      selectedPosition[i].new_invested = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3));
                      selectedPosition[i].new_market_value = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3))
                      selectedPosition[i].new_cost = Number((((selectedPosition[i].current_invested + Number(selectedPosition[i].new_invested)) / (selectedPosition[i].new_shares + selectedPosition[i].current_shares)) - selectedPosition[i].current_cost).toFixed(3));
                  }
              }
              else {
                  for(let i=0;i<selectedPosition.length;i++){
                  selectedPosition[i].new_shares = selectedPosition[i].current_shares == 0 ? 0 : ~~((selectedPosition[i].current_shares * percent) / 100);
                  selectedPosition[i].new_invested = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3));
                  selectedPosition[i].new_market_value = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3));
                  totalAmount = totalAmount + Number(selectedPosition[i].new_shares * selectedPosition[i].price);
                  if (selectedPosition.length - 1 == i) {
                      this.form.controls['amount'].setValue(totalAmount.toFixed(3))
                  }
                  if (this.form.controls['investmentType'].value == 'Scale Down' && selectedPosition[i].current_shares != 0 && selectedPosition[i].new_shares != 0) {
                        selectedPosition[i].new_cost = Number(((selectedPosition[i].current_shares - selectedPosition[i].new_shares) <= 0 ? (selectedPosition[i].price - selectedPosition[i].current_cost) : ((selectedPosition[i].current_invested - selectedPosition[i].new_invested) / (selectedPosition[i].current_shares - selectedPosition[i].new_shares)) - selectedPosition[i].current_cost).toFixed(3));
                      selectedPosition[i].new_shares = -1 *  selectedPosition[i].new_shares;
                      selectedPosition[i].new_invested = -1 *  selectedPosition[i].new_invested;
                      selectedPosition[i].new_market_value = -1 * selectedPosition[i].new_market_value;
                  } else if (this.form.controls['investmentType'].value == 'Scale Up' && selectedPosition[i].new_shares != 0) {
                     selectedPosition[i].new_cost =Number((((selectedPosition[i].current_invested + selectedPosition[i].new_invested) / (selectedPosition[i].current_shares + selectedPosition[i].new_shares)) - selectedPosition[i].current_cost).toFixed(3));
                  }


              }
          }
        }
      } else {
          this.form.controls['amount'].setValue(0);

      }

  }

onChangeAmount(amount:any){
  amount = Number(amount);
  /**convert string to number **/
  if (0 < amount) {

      var selectedTickers = this.selection.selected;
      /***
       * mValue is selected tickers sum of market value, Used for calculating the percent
       * 
       */
      var mValue = selectedTickers.reduce(function (total:any, currentValue:any) {
          return total + currentValue.current_market_value; // Add the value of the 'value' key to the total
      }, 0);

      for (let i = 0; i < selectedTickers.length; i++) {
          if ((this.form.controls['investmentType'].value == 'Equal Distribution') || (this.form.controls['investmentType'].value == 'Investment Per stock')) {
              if (selectedTickers.length - 1 == i) {
                  let percent = ((amount / this.cash_balance) * 100).toFixed(2);
                  this.form.controls['percent'].setValue(Number(percent));
              }
              let total = this.form.controls['investmentType'].value == 'Equal Distribution' ? this.form.controls['amount'].value / selectedTickers.length : this.form.controls['amount'].value;
              selectedTickers[i].new_shares = ~~(total / selectedTickers[i].price);
              if (selectedTickers[i].new_shares != 0) {
                  selectedTickers[i].new_invested = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
                  selectedTickers[i].new_market_value = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
                  selectedTickers[i].new_cost = Number((((selectedTickers[i].current_invested + Number(selectedTickers[i].new_invested)) / (selectedTickers[i].new_shares + selectedTickers[i].current_shares)) - selectedTickers[i].current_cost).toFixed(3));
                }
            
          }
          else {
              let percent = Number(((amount * 100) / mValue).toFixed(2));
              selectedTickers[i].new_shares = selectedTickers[i].current_shares == 0 ? 0 : ~~((selectedTickers[i].current_shares * percent) / 100);
              selectedTickers[i].new_invested = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
              selectedTickers[i].new_market_value = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
              if (selectedTickers.length - 1 == i) {
                  this.form.controls['percent'].setValue(percent)
              }
              if (this.form.controls['investmentType'].value == 'Scale Down' && selectedTickers[i].current_shares != 0 && selectedTickers[i].new_shares != 0) {
                  selectedTickers[i].new_cost = Number(((selectedTickers[i].current_shares - selectedTickers[i].new_shares) <= 0 ? (selectedTickers[i].price - selectedTickers[i].current_cost) : ((selectedTickers[i].current_invested - selectedTickers[i].new_invested) / (selectedTickers[i].current_shares - selectedTickers[i].new_shares)) - selectedTickers[i].current_cost).toFixed(3));
                  selectedTickers[i].new_shares = -1 *  selectedTickers[i].new_shares;
                  selectedTickers[i].new_invested = -1 *  selectedTickers[i].new_invested;
                  selectedTickers[i].new_market_value = -1 * selectedTickers[i].new_market_value;
              } else if (this.form.controls['investmentType'].value == 'Scale up' && selectedTickers[i].new_shares != 0) {
                  selectedTickers[i].new_cost = Number((((selectedTickers[i].current_invested + selectedTickers[i].new_invested) / (selectedTickers[i].current_shares + selectedTickers[i].new_shares)) - selectedTickers[i].current_cost).toFixed(3));
                  // selectedTickers[i].transaction_type = 'Buy';
                  
              } 
          }
      }

  } else {
      this.form.controls['percent'].setValue(0);

  }
}

closeAllPositions(){
  this.calculateDialog();
 var selectedPosition = this.selection.selected;
 for(let i =0;i<selectedPosition.length;i++){
  selectedPosition[i].new_shares = -1 * selectedPosition[i].current_shares
  selectedPosition[i].new_invested =-1 * Number((selectedPosition[i].current_shares * selectedPosition[i].price).toFixed(3))
  selectedPosition[i].new_market_value = -1 *Number((selectedPosition[i].current_shares * selectedPosition[i].price).toFixed(3))
  selectedPosition[i].new_cost = Number((selectedPosition[i].price - selectedPosition[i].current_cost).toFixed(3));

 }


}

getSymbolPrice(){
  this.basketTradeService.getSymbolPrice(this.symbolInput).then((data) => {
    console.log("hello,data",data)
  });
}
}
