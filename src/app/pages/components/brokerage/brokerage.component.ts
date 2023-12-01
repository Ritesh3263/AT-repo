import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConnectDialogComponent } from './connect-dialog/connect-dialog.component';
import { BrokerageService } from '../../../services/brokerage.service'
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

export interface PeriodicElement {
  accountNumber: number;
  accountBalance: number;
  openPositions: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
  // {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
  // {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
  // {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
  // {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
];


@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.scss']
})
export class BrokerageComponent {
  showSpinner: boolean = false;

  displayedColumns: string[] = ['accountNumber', 'accountBalance', 'openPositions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectedOption: string = 'option1';
  userData :any=null;
   brokerage_type = new FormControl('1', [Validators.required]);

  constructor(public dialog: MatDialog,private brokerageService:BrokerageService,private spinner: NgxSpinnerService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getAccessToken();
    this.getBrokerageAccount(1);
  }

  getAccessToken(){
    this.brokerageService.getAccessToken("wences").then((data) => {
      this.userData= data;
    })
  }

  getBrokerageAccount(event:any){
    this.showSpinner = true;
    this.brokerageService.getBrokerageAccounts(event.value).then((data) => {
      this.showSpinner=false;
      this.dataSource = data
      // this.spinner.hide()

    })
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.accountNumber + 1}`;
  }

  connectDialog() {
    this.dialog.open(ConnectDialogComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }
}
