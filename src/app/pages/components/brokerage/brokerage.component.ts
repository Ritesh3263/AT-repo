import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConnectDialogComponent } from './connect-dialog/connect-dialog.component';
import { BrokerageService } from '../../../services/brokerage.service'
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';

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
export class BrokerageComponent implements AfterViewInit{
  showSpinner: boolean = false;
  isDisableAccounts :boolean=false;
  user_id:any="nikhil";

  // displayedColumns: string[] = ['accountNumber', 'accountBalance', 'openPositions'];
  displayedColumns: string[] = ['accountId', 'accountType','cashBalance','buyingPower','equity','marketValue','overnightBuyingPower','status'];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectedOption: string = 'option1';
  activeBrokerages :any=null;

   brokerage_type = new FormControl('TS', [Validators.required]);
   state:any;
   tokenForRetrieveAccounts :any=null;
  constructor(public dialog: MatDialog,private brokerageService:BrokerageService,private route: ActivatedRoute,private location:LocationStrategy) {
    // getting access token from tradestation 
    this.state = this.location.getState();
    if(this.state && this.state.code){
      this.steAccessToken(this.state.code,'nikhil')
      // this.isDisableAccounts = true;
      this.getBrokerageAccount("TS",'nikhil');
    }
    // get tradestation token from session 
    // let isAccess_token = sessionStorage.getItem("token")
    // if(isAccess_token){
      // this.tokenForRetrieveAccounts =isAccess_token; 
     
    // }

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getAccessToken();
  }

  getAccessToken(){
    this.brokerageService.getAccessToken(this.user_id).then((data) => {
      if(data && !data[0].status && data[0].status !== 'error' && data[0].active_brokerage_key){
        this.activeBrokerages= data;
        this.getBrokerageAccount(this.activeBrokerages[0].active_brokerage_key,this.user_id)
      }
    })
  }

  getBrokerageAccount(brokerage:any,user_id:any){
    this.showSpinner = true;
    this.brokerageService.getBrokerageAccounts(brokerage,this.user_id).then((data) => {
      this.showSpinner=false;
      this.isDisableAccounts =true
        this.dataSource = data
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

  connectDialog(brokerage_type:any) {
    this.dialog.open(ConnectDialogComponent, {
      panelClass: 'custom-modal',
      data:brokerage_type,
      disableClose: true
    });
  }
  steAccessToken(inputCode:any,inputUser:any){
    this.showSpinner = true;
    let input = {
      code:inputCode,
      user_id:inputUser
    }
    this.brokerageService.setAccessToken(input).then((data) => {
      this.showSpinner=false;
      if(data && data.access_token){
        // this.tokenForRetrieveAccounts = data.access_token;
        this.isDisableAccounts = true;
        this.getBrokerageAccount("TS",this.user_id)
        // sessionStorage.setItem("token",data.access_token)
      }

      // this.spinner.hide()

    })
  }


}
