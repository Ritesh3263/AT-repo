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
 displayedColumns: string[]  = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
 form: FormGroup = new FormGroup(''); // FormGroup

  // displayedColumns: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'costnew', 'price', 'sharescurrent', 'sharesnew', 'investedcurrent', 'investednew', 'marketcurrent', 'marketnew', 'pl', 'plpercent'];
  // displayedColumnsOne: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];

  dataSource = new MatTableDataSource<PeriodicElement>([]);
  selection = new SelectionModel<PeriodicElement>(true, []);
  isDisplayColumn:boolean=true;
  constructor(private fb: FormBuilder,private renderer: Renderer2, public dialog: MatDialog,private basketTradeService :BasketTradeService) {
    this.getAccountBasketPosition();
    this.form = this.fb.group ({
      investmentType: new FormControl('', [Validators.required]),
      percentage: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required])
    })
  }

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
    this.dialog.open(ConfirmTradeComponent, {
      panelClass: 'custom-modal',
      disableClose: true
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
  getAccountBasketPosition(){
    this.basketTradeService.getAccountBasketPosition(1).then((data) => {
      if(data) {
        this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
        this.dataSource.data= data
        this.isDisplayColumn =false;
        console.log("svlslvnskkdnskn",data)
        // this.basket = data.basket;
        // this.dataSource = new MatTableDataSource<PeriodicElement>(this.basket.tickers);
      }
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
    console.log("hhhhh",this.dataSource.data,this.dataSource.data.reduce((acc, current:any) => acc + current[column], 0))
    // Sum the values in the column
    return this.dataSource.data.reduce((acc, current:any) => acc + current[column], 0);
  }
}
