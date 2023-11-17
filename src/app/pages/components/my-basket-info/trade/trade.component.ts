import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmTradeComponent } from '../confirm-trade/confirm-trade.component';
import { CalculateDialogComponent } from '../calculate-dialog/calculate-dialog.component';

export interface PeriodicElement {
  symbol: string;
  costcurrent: number;
  costnew: number;
  sharescurrent: number;
  sharesnew: number;
  purchasedate: string,
  price: number,
  investedcurrent: number,
  investednew: number,
  marketcurrent: number,
  marketnew: number,
  pl: number,
  plpercent: number
}

const ELEMENT_DATA: PeriodicElement[] = [
  {symbol: 'TSLA', purchasedate: '2023/10/18', costcurrent: 0.000, costnew: 19600, price: 19600, sharescurrent: 0, sharesnew: +443, investedcurrent: 0.000, investednew: +8512.780, marketcurrent: 0.000, marketnew: +8512.780, pl: 0.000, plpercent: 0.000},
  {symbol: 'AAPL', purchasedate: '2023/10/18', costcurrent: 0.000, costnew: 19600, price: 19600, sharescurrent: 0, sharesnew: +443, investedcurrent: 0.000, investednew: +8512.780, marketcurrent: 0.000, marketnew: +8512.780, pl: 0.000, plpercent: 0.000},
];

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'costnew', 'price', 'sharescurrent', 'sharesnew', 'investedcurrent', 'investednew', 'marketcurrent', 'marketnew', 'pl', 'plpercent'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(private renderer: Renderer2, public dialog: MatDialog) {}

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.costcurrent + 1}`;
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
    this.dialog.open(CalculateDialogComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }
}
