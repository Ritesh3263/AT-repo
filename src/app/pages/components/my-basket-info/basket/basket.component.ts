import { AfterViewInit, Component, Renderer2, ViewChild, Inject } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CloneBasketComponent } from '../clone-basket/clone-basket.component';
import { DeleteBasketComponent } from '../delete-basket/delete-basket.component';
import { EditSymbolsComponent } from '../edit-symbols/edit-symbols.component';
import { WidgetDialogComponent } from '../widget-dialog/widget-dialog.component';

import { ActivatedRoute } from '@angular/router';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';
import { Basket } from 'src/app/interfaces/basket';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

import { AdminService } from 'src/app/services/admin.service';
import { TableComponent } from 'src/app/layouts/table/table.component';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent {
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  search = '';
  displayedColumns: string[] = ['select', 'symbol', 'name', 'price', 'change', 'changepercent', 'timestamp', 'deleted_at', 'star'];
  basket: any = []
  dataSource = new MatTableDataSource<Basket>(this.basket);
  selection = new SelectionModel<Basket>(this.basket, []);
  basketId: number = 0;
  symbols: any =[]
  basketList: any = []
  columnDetails: any = [];
  defaultSort: any = {sortColumn: 'timestamp', sortMode: 'desc'};
  @ViewChild(TableComponent) table!:TableComponent;

  constructor(@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, private renderer: Renderer2, public dialog: MatDialog, private basketService: BasketsService, private activatedRoute: ActivatedRoute,
  private utilityService: UtilitiesService, private adminService: AdminService) {
    this._setColumnDetails();
  }


  _setColumnDetails() {
    this.columnDetails = [
      {
        label: null,
        key: 'select',
        type: 'select'
      },
      {
        label: 'Ticker Symbol',
        key: 'symbol',
        type: 'text'
      },
      {
        label: 'Ticker Name',
        key: 'name',
        type: 'text'
      },
      {
        label: 'Price',
        key: 'price',
        type: 'currency'
      },
      {
        label: 'Change',
        key: 'change',
        type: 'currency'
      },
      {
        label: 'Change %',
        key: 'changepercent',
        type: 'currency'
      },
      {
        label: 'Added At',
        key: 'timestamp',
        type: 'date'
      },
      {
        label: 'Deleted At',
        key: 'deleted_at',
        type: 'date'
      } ,
      {
        label: null,
        key: 'menu',
        type: 'menu',
        mainMenuOption: 'Add to Basket',
        subMenuOptions: this.basketList,
        menuCallback: this.addSymbolToBasket,
        basketService: this.basketService,  // Scope issues, need to include this service at the menu level
        utilityService: this.utilityService // Scope issues, need to include this service at the menu level
      }
    ]
  }

  ngOnInit(id = null) {
    this.basketId = id || this.parentComponent.getBasketId();
    this.basketService.getBasketDetails(this.basketId).then((data) => {
      if(data.error || !data.basket) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.basket = data.basket;
      }
    })

    this.basketService.getAllBaskets(1, 0).then((data: any) => {
      if(data.error || !data.baskets) {
        this.utilityService.displayInfoMessage("Error Loading Basket List: " + data.error, true);
      }
      else {
        this.basketList = data.baskets;

        this._setColumnDetails();
      }
    });
  }

  async getBasketSymol(pageNumber: number, pageSize: number, sortColumn : string | null = null, sortMode : string | null = null, search : string | null = null, param : any = null) {
    return await this.basketService.getSymbols(param, pageNumber, pageSize, sortColumn, sortMode)
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
        this.table.getData(true);
      }
    });
  }

  deleteSymbols() {
    let dialogRef = this.dialog.open(EditSymbolsComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Delete Symbols from the Basket", description: "The selected symbol(s) below will be deleted from the basket.", mode: "DELETE", tickers: JSON.parse(JSON.stringify(this.table.getSelectedItems())), basket: JSON.parse(JSON.stringify(this.basket))}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success) {
        this.table.getData(true);
      }
    });
  }

  cloneBasket() {
    let dialogRef = this.dialog.open(CloneBasketComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: this.basket
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success && result.id) {
        this.utilityService.navigate(`/my-basket-info/${result.id}/basket`)
        this.ngOnInit(result.id);
      }
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

  isTagsEditMode: boolean = false;

  enterTagsEditMode() {
    this.isTagsEditMode = true;
  }

  exitTagsEditMode() {
    this.isTagsEditMode = false;
    this.updateBasket();
  }

  updateBasket() {
    this.basketService.updateBasket(this.basket).then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage('Basket Updated Successfully')
      }
    })
  }

  addSymbolToBasket(basket: any, symbol: any) {
    this.basketService.editSymbols(basket.id, [{id: symbol.id}], 'PATCH').then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage(`Symbols Added`)
      }
    })
  }
}
