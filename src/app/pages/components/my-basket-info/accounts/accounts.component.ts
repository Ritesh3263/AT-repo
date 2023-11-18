import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  accountNumber: number;
  dateOfLinked: string;
  noOfBasketsLinked: number;
  brokerageName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {accountNumber: 9954534354535489, dateOfLinked: '01-10-2023', noOfBasketsLinked: 6, brokerageName: 'John Doe'},
  {accountNumber: 9954534354535489, dateOfLinked: '01-10-2023', noOfBasketsLinked: 6, brokerageName: 'John Doe'},
  {accountNumber: 9954534354535489, dateOfLinked: '01-10-2023', noOfBasketsLinked: 6, brokerageName: 'John Doe'},
  {accountNumber: 9954534354535489, dateOfLinked: '01-10-2023', noOfBasketsLinked: 6, brokerageName: 'John Doe'},
  {accountNumber: 9954534354535489, dateOfLinked: '01-10-2023', noOfBasketsLinked: 6, brokerageName: 'John Doe'},
];

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {
  displayedColumns: string[] = ['select', 'accountNumber', 'dateOfLinked', 'noOfBasketsLinked', 'brokerageName', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(public dialog: MatDialog) {}

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.accountNumber + 1}`;
  }
}
