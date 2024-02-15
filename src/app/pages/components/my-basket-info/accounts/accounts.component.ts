import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { JourneyInfoComponent } from '../journey-info/journey-info.component';
import { BasketsService } from 'src/app/services/baskets.service';
import { EditAccountsComponent } from '../edit-accounts/edit-accounts.component';
import { UtilitiesService } from 'src/app/services/utilities.service';
import {BrokerageService} from "../../../../services/brokerage.service";
import { BasketTradeService } from 'src/app/services/basket-trade.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {
  displayedColumns: string[] = [/*'select',*/ 'account_number', 'timestamp', 'linked_basket_count', 'broker_name', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  linkedAccount: any = {}
  basketId!: number;
  brokerMaster: any;
  hasPendingOrders = false;
  basket: any = {}

  constructor(@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, public dialog: MatDialog, private basketService: BasketsService, private utilityService: UtilitiesService,
    private brokerageService: BrokerageService, private basketTradeService: BasketTradeService) {}

  async ngOnInit() {
    this.basketId = this.parentComponent.getBasketId();
    this.basket = await this.parentComponent.getBasket()

    let data = await this.basketService.getBasketAccounts(this.basketId)
    if(data && data.success && data.accounts && data.accounts.length) {
      this.linkedAccount = data.accounts[0]
      this.dataSource = new MatTableDataSource<any>(data.accounts);
    }

    let orders = await this.basketTradeService.getOrderByBasketId(this.linkedAccount.broker_code, this.basketId, "Pending")
    if(orders && orders.orders && orders.orders.length) {
      this.hasPendingOrders = true;
    }
    this.basketTradeService.getBrokerageAccountPosition(this.linkedAccount.broker_code, this.linkedAccount.broker_account_id).then((data) => {
      if (data && data.success && data.Positions) {
        if(data.Positions.length)
          this.hasPendingOrders = true;
      }
    })
    // Get all active brokers and connected accounts done async to avoid blocking
    this.brokerageService.getAllBrokerageAccounts().then((data) => {
      if(!data.brokers) {
        this.utilityService.displayInfoMessage("Error retrieving broker list: " + JSON.stringify(data), true)
      }

      this.brokerMaster = data.brokers;
    });
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.accountNumber + 1}`;
  }

  addAccount() {
    let dialogRef= this.dialog.open(EditAccountsComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Link account to the Basket", basketId: this.basketId, mode: "ADD", brokerMaster: this.brokerMaster}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success) {
        this.ngOnInit();
      }
    });
  }

  removeAccount(account: any) {
    if(this.hasPendingOrders) {
      this.utilityService.displayInfoMessage("You cannot unlink an account with pending orders.", true)
      return;
    }
    this.basketService.setBasketAccount(this.basketId, account.account_id, 'DELETE').then((data) => {
      if(data && data.success && data.results) {
        this.utilityService.displayInfoMessage("Account unlinked from basket.")
        this.dataSource = new MatTableDataSource<any>([]);
      }
      else {
        this.utilityService.displayInfoMessage("Error ocurred removing account from basket.", true);
      }
    })
  }
}
