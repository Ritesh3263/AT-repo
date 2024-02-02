import { Component, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { BrokerService } from 'src/app/services/broker.service';
import { BrokerageService } from 'src/app/services/brokerage.service';

@Component({
  selector: 'app-edit-accounts',
  templateUrl: './edit-accounts.component.html',
  styleUrls: ['./edit-accounts.component.scss']
})
export class EditAccountsComponent {

  displayedColumns: string[] = ['select','account_number', 'accountBalance'/*, 'openPositions'*/];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(false, []);
  basketId: number;
  selectedBrokerId!: any;
  brokerMaster!: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditAccountsComponent>, private brokerService: BrokerService,private brokerageService:BrokerageService) {
    this.basketId = data.basketId;
  }

  ngOnInit() {
    this.brokerService.getBrokerMaster().then((data) => {
      if(data && data.success && data.brokers) {
        this.brokerMaster = data.brokers;
        this.selectedBrokerId = this.brokerMaster[0];
        this.getBrokerAccounts();
      }
    })
  }

  getBrokerAccounts() {
    this.dataSource = new MatTableDataSource<any>([]);
    this.selection = new SelectionModel<any>(false, []);
      this.brokerageService.getBrokerageAccounts(this.selectedBrokerId.broker_code).then((data) => {
        if(data.error || !data.success) {
          this.utilityService.displayInfoMessage(data.error, true)
        }
        else {
          data.Accounts.forEach((element:any) => {
            element.account_number=element.AccountID;
            element.accountBalance= element.BuyingPower
          });
          this.dataSource = new MatTableDataSource<any>(data.Accounts);
          this.selection = new SelectionModel<any>(false, []);
        }
        
      })

      // this.brokerService.getBrokerAccounts(this.selectedBrokerId).then((data) => {
      //   if(data && data.success && data.accounts) {
      //     this.dataSource = new MatTableDataSource<any>(data.accounts);
      //     this.selection = new SelectionModel<any>(false, []);
      //   }
      // })
    // }
  }

  updateBasket() {
    this.basketService.setBasketAccount(this.basketId,this.selection.selected[0].AccountID, this.data.mode == 'ADD' ? 'PUT' : 'DELETE',this.selectedBrokerId.id).then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage(`Account ${this.data.mode == 'ADD' ? 'Linked.' : 'Unlinked.'}`)
        this.dialogRef.close({success: true})
      }
    })
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    let isSelected = this.selection.isSelected(row)

    return `${isSelected ? 'deselect' : 'select'} row ${row.accountNumber + 1}`;
  }

}