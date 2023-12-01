import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CloneBasketComponent } from '../clone-basket/clone-basket.component';
import { DeleteBasketComponent } from '../delete-basket/delete-basket.component';
import { EditSymbolsComponent } from '../edit-symbols/edit-symbols.component';
import { WidgetDialogComponent } from '../widget-dialog/widget-dialog.component';

import { ActivatedRoute } from '@angular/router';
import { Basket } from 'src/app/interfaces/basket';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements AfterViewInit {
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  search = '';
  displayedColumns: string[] = ['select', 'symbol', 'name', 'price', 'change', 'changepercent', 'star'];
  basket: any = []
  dataSource = new MatTableDataSource<Basket>(this.basket);
  selection = new SelectionModel<Basket>(this.basket, []);
  basketId: number = 0;
  symbols: any =[]


  constructor(private renderer: Renderer2, public dialog: MatDialog, private basketService: BasketsService, private activatedRoute: ActivatedRoute, private utilitiesService: UtilitiesService) {}

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
      }
    })
    this.getBasketSymbols(true);
  }

  getBasketSymbols(resetPage = false) {
    if(resetPage) {
      this.pageIndex = 0;
      this.length = 0;
    }
    this.basketService.getSymbols(this.basketId, this.pageIndex, this.pageSize).then((data) => {
      if(data && data.symbols) {
        this.symbols = data.symbols;
        this.dataSource = new MatTableDataSource<any>(this.symbols);
        this.selection = new SelectionModel<any>(this.symbols, []);
        this.length = this.symbols[0].totalRows;
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.symbol + 1}`;
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
    let dialogRef= this.dialog.open(EditSymbolsComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Add Symbols to the Basket", description: "Enter symbols to add to the basket.  Use a comma separated list for multiple.", mode: "ADD", tickers: [], basket: JSON.parse(JSON.stringify(this.basket))}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success) {
        this.ngOnInit();
      }
    });
  }

  deleteSymbols() {
    let dialogRef = this.dialog.open(EditSymbolsComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Delete Symbols from the Basket", description: "The selected symbol(s) below will be deleted from the basket.", mode: "DELETE", tickers: JSON.parse(JSON.stringify(this.selection.selected)), basket: JSON.parse(JSON.stringify(this.basket))}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success) {
        this.ngOnInit();
      }
    });
  }

  cloneBasket() {
    this.dialog.open(CloneBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: this.basket
    });
  }

  deleteBasket() {
    this.dialog.open(DeleteBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: this.basket
    });
  }

  widgetDialog(eve:any) {
    this.dialog.open(WidgetDialogComponent, {
      panelClass: 'custom-modal-lg',
      disableClose: true,
      data:eve,
    });
  }

  isEditMode: boolean = false;

  enterEditMode() {
    this.isEditMode = true;
  }

  exitEditMode() {
    this.isEditMode = false;
    this.updateBasket();
  }

  isDescEditMode: boolean = false;

  enterDescEditMode() {
    this.isDescEditMode = true;
  }

  exitDescEditMode() {
    this.isDescEditMode = false;
    this.updateBasket();
  }

  updateBasket() {
    this.basketService.updateBasket(this.basket).then((data) => {
      if(data && data.success) {
        this.utilitiesService.displayInfoMessage('Basket Updated Successfully')
      }
      else {
        this.utilitiesService.displayInfoMessage(JSON.stringify(data), true)
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getBasketSymbols();
  }
}
