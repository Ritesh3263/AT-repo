import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UtilitiesService} from "../../../../services/utilities.service";
import {EditBrokerComponent} from "../modals/edit-broker/edit-broker.component";
import {AdminService} from "../../../../services/admin.service";
import {TableComponent} from "../../../../layouts/table/table.component";

@Component({
  selector: 'app-admin-brokerages',
  templateUrl: './admin-brokerages.component.html',
  styleUrls: ['./admin-brokerages.component.scss']
})
export class AdminBrokeragesComponent {
  @ViewChild(TableComponent) table!:TableComponent;
  columnDetails = [
    {
      label: 'Name',
      key: 'name',
      type: 'text'
    },
    {
      label: 'Broker Code',
      key: 'broker_code',
      type: 'text'
    },
    {
      label: 'Active',
      key: 'active',
      type: 'text'
    },
    {
      label: 'Created At',
      key: 'created_at',
      type: 'date'
    },
    {
      label: 'Updated At',
      key: 'updated_at',
      type: 'date'
    },
    {
      label: 'Updated By',
      key: 'last_updated_by_user_email',
      type: 'text'
    }
  ]
  constructor(public dialog: MatDialog, public utilityService: UtilitiesService, private adminService: AdminService) { }

  async getBrokers(pageNumber: number, pageSize: number, sortColumn : string | null = null, sortMode : string | null = null, search : string | null = null) {
    return await this.adminService.getBrokers(pageNumber, pageSize, sortColumn, sortMode, search)
  }

  async editBroker(broker: any) {
    let dialogRef= this.dialog.open(EditBrokerComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: broker ? "Edit Broker" : "Create Broker", broker: JSON.parse(JSON.stringify(broker)), mode: "EDIT"}
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe(async result => {
        if(!broker && result && result.success) {
          this.table.getData(true);
        }
        return resolve({reload: result && result.success});
      });
    })
  }
}
