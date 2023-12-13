import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  tickersymbol: string;
  shares: number;
  currentprice: number;
  investaccount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { tickersymbol: 'TSLA', shares: 1734, currentprice: 19660, investaccount: 34090.440 },
  { tickersymbol: 'DCTH', shares: 1500, currentprice: 100, investaccount: 150000 },
  { tickersymbol: 'KC', shares: 500, currentprice: 200, investaccount: 100000 },


];

const CONFIRMELEMENT_DATA: PeriodicElement[] = [
  { tickersymbol: 'META', shares: 2000, currentprice: 200, investaccount: 400000 },
  { tickersymbol: 'GOOG', shares: 3000, currentprice: 300, investaccount: 900000 },
  { tickersymbol: 'IBM', shares: 1000, currentprice: 100, investaccount: 100000 },


];
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent {

  displayedColumns: string[] = ['tickersymbol', 'shares', 'currentprice', 'investaccount','status'];
  // displayedColumns2: string[] = ['empty', 'empty', 'title', 'amount'];
  // displayedColumns3: string[] = ['empty2', 'empty2', 'title2', 'amount2'];
  // displayedColumns4: string[] = ['empty3', 'empty3', 'title3', 'amount3'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSourceConfirm = new MatTableDataSource<PeriodicElement>(CONFIRMELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
