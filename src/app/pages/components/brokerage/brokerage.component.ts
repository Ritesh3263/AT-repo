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
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
  showSpinner: boolean = true;
  isDisableAccounts :boolean=false;
  user_id:any=null;

  // displayedColumns: string[] = ['accountNumber', 'accountBalance', 'openPositions'];
  displayedColumns: string[] = ['accountId', 'accountType','cashBalance','buyingPower','equity','marketValue','overnightBuyingPower','status'];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectedOption: string = 'option1';
  activeBrokerages :any=null;
  brokerage_type = new FormControl('ts', [Validators.required]);
   state:any;
   user:any;
   tokenForRetrieveAccounts :any=null;
  constructor(public dialog: MatDialog,private brokerageService:BrokerageService,private route: ActivatedRoute,private location:LocationStrategy,private userService: UserService,private utilityService:UtilitiesService) {
    /* getting access code from tradeStation */
    this.state = this.location.getState();
    if(this.state && this.state.code){
      this.steAccessToken(this.state.code,this.state.user.firstName)
    }

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    /* if there is no active code related brokerages then only call the user*/
    if(this.state && !this.state.code){
    this.loadUserDetails();
    }
  }

/***loadUserDetails function is used to get user information  */
  loadUserDetails() {
    this.userService.getUserDetails().then((user:any) => {
      this.user_id = user.firstName?user.firstName:null
      this.getBrokerages();
    })
  }


  /***getBrokerages function is used to get  active brokerages*/
  getBrokerages(){
    this.showSpinner = true;
    this.brokerageService.getBrokerages(this.user_id).then((data) => {
      this.showSpinner = false;
      if(data && data.success) {
        this.activeBrokerages= data.brokerages;
        this.getBrokerageAccount(this.activeBrokerages[0].active_brokerage_key,this.user_id)
      }
    })
  }

  /***getBrokerageAccount function is used to get  active Accounts related to brokerage*/
  getBrokerageAccount(brokerage:any,user_id:any){
    this.showSpinner=true;
    this.brokerageService.getBrokerageAccounts(brokerage,user_id?user_id:this.user_id).then((data) => {
      this.showSpinner=false;
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.isDisableAccounts =true
        this.dataSource.data = data.Accounts;
      }
      
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
  checkboxLabel(row?: any): string {
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

  /***getBrokerageAccount function is used to send brokerage code for generating access token*/
  steAccessToken(inputCode:any,inputUser:any){
    this.showSpinner = true;
    let input = {
      code:inputCode,
      user_id:inputUser
    }
    this.brokerageService.setAccessToken(input).then((data) => {
      this.showSpinner=false;
      if(data && data.success){
        this.isDisableAccounts = true;
        this.getBrokerageAccount(data.active_brokerage_key,data.current_user)
      }
    })
  }


}
