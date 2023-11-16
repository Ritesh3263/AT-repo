import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CloneBasketComponent } from '../clone-basket/clone-basket.component';
import { DeleteBasketComponent } from '../delete-basket/delete-basket.component';
import { AddSymbolsComponent } from '../add-symbols/add-symbols.component';
import { DeleteSymbolsComponent } from '../delete-symbols/delete-symbols.component';
import { WidgetDialogComponent } from '../widget-dialog/widget-dialog.component';

export interface PeriodicElement {
  tickersymbol: string;
  tickername: string;
  price: string;
  change: number;
  changepercent: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {tickersymbol: 'AAPL', tickername: 'Apple,Inc', price: '$170,872', change: 150.00, changepercent: 8585.00},
  {tickersymbol: 'GOOG', tickername: 'Alphabet,Inc', price: '$136,600', change: -128.00, changepercent: -1039.00},
  {tickersymbol: 'TSLA', tickername: 'Tesla Inc', price: '$211,291', change: 0.0000, changepercent: -128.00},
  {tickersymbol: 'META', tickername: 'Meta Platforms, Inc.', price: '$170,872', change: 150.00, changepercent: 8585.00},
  {tickersymbol: 'IBM', tickername: 'International Business Machines Corporation', price: '$136,600', change: -128.00, changepercent: -1039.00},
  {tickersymbol: 'MSFC', tickername: 'Microsoft Corporation', price: '$211,291', change: 0.0000, changepercent: -128.00},
  {tickersymbol: 'DCTH', tickername: 'Delcath Systems, Inc.', price: '$170,872', change: 150.00, changepercent: 8585.00},
  {tickersymbol: 'CRM', tickername: 'Salesforce, Inc.', price: '$136,600', change: -128.00, changepercent: -1039.00},
  {tickersymbol: 'JPM', tickername: 'JPMorgan Chase & Co', price: '$211,291', change: 0.0000, changepercent: -128.00},
  {tickersymbol: 'WFC', tickername: 'Wells Fargo & Company', price: '$170,872', change: 150.00, changepercent: 8585.00},
  {tickersymbol: 'KO', tickername: 'Coca-Cola Company', price: '$136,600', change: -128.00, changepercent: -1039.00},
  {tickersymbol: 'TSLA', tickername: 'Tesla Inc', price: '$211,291', change: 0.0000, changepercent: -128.00},
];

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'tickersymbol', 'tickername', 'price', 'change', 'changepercent', 'star'];
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.tickersymbol + 1}`;
  }

  getChangeStyle(change: number): string {
    if (change > 0) {
      return 'positive-value'; // CSS class for positive values
    } else if (change < 0) {
      return 'negative-value'; // CSS class for negative values
    } else {
      return ''; // No special style for zero values
    }
  }

  getChangePercentStyle(changepercent: number): string {
    if (changepercent > 0) {
      return 'positive-value'; // CSS class for positive values
    } else if (changepercent < 0) {
      return 'negative-value'; // CSS class for negative values
    } else {
      return ''; // No special style for zero values
    }
  }

  addSymbols() {
    this.dialog.open(AddSymbolsComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  deleteSymbols() {
    this.dialog.open(DeleteSymbolsComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  cloneBasket() {
    this.dialog.open(CloneBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  deleteBasket() {
    this.dialog.open(DeleteBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  widgetDialog() {
    this.dialog.open(WidgetDialogComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      position: { right: '0px', top: '0px' },
    });
  }
}
