import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConnectDialogComponent } from './connect-dialog/connect-dialog.component';

import { BrokerService } from 'src/app/services/broker.service';

@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.scss']
})
export class BrokerageComponent {

  displayedColumns: string[] = ['account_number', 'accountBalance', 'openPositions'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  selectedBrokerId!: number;

  brokerMaster!: any;
  accounts!: any;

  constructor(public dialog: MatDialog, private brokerService: BrokerService) {}

  ngOnInit() {
    this.brokerService.getBrokerMaster().then((data) => {
      if(data && data.success && data.brokers) {
        this.brokerMaster = data.brokers;
        this.selectedBrokerId = this.brokerMaster[0].id;
        this.getBrokerAccounts();
      }
    })
  }

  getBrokerAccounts() {
    this.brokerService.getBrokerAccounts(this.selectedBrokerId).then((data) => {
      if(data && data.success && data.accounts) {
        this.accounts = data.accounts;
        this.dataSource = new MatTableDataSource<any>(this.accounts);
        this.selection = new SelectionModel<any>(true, []);
      }
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.accountNumber + 1}`;
  }

  connectDialog() {
    this.dialog.open(ConnectDialogComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }
}
