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

import { BasketsService } from 'src/app/services/baskets.service';
import { ActivatedRoute } from '@angular/router';

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
  basket: any = []
  dataSource = new MatTableDataSource<PeriodicElement>(this.basket);
  selection = new SelectionModel<PeriodicElement>(true, []);
  basketId: number = 0;


  constructor(private renderer: Renderer2, public dialog: MatDialog, private basketService: BasketsService, private activatedRoute: ActivatedRoute) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.activatedRoute.parent!.params.forEach((param) => {
      for(let key in param) {
        if(key == 'id') {
          this.basketId = param[key];
        }
      }
    })
    this.basketService.getBasketDetails(this.basketId).then((data) => {
      if(data && data.basket) {
        this.basket = data.basket;
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.basket.tickers);
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data ? this.dataSource.data.length : 0;
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

  widgetDialog(eve:any) {
    this.dialog.open(WidgetDialogComponent, {
      panelClass: 'custom-modal-lg',
      disableClose: true,
      data:eve,
    });
  }

  yourText: string = "Austin Powers";
  isEditMode: boolean = false;

  enterEditMode() {
    this.isEditMode = true;
  }

  exitEditMode() {
    this.isEditMode = false;
    // Additional logic to save changes if needed
  }

  descText: string = "Demo Description comes here Demo Description comes hereDemo Description comes heres";
  isDescEditMode: boolean = false;

  enterDescEditMode() {
    this.isDescEditMode = true;
  }

  exitDescEditMode() {
    this.isDescEditMode = false;
    // Additional logic to save changes if needed
  }

  isMenuOpen: boolean = false;

  openMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
