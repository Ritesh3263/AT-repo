import {Component, Inject, Renderer2} from '@angular/core';
import {JourneyInfoComponent} from "../journey-info/journey-info.component";
import {BasketsService} from "../../../../services/baskets.service";
import {UtilitiesService} from "../../../../services/utilities.service";
import {MatDialog} from "@angular/material/dialog";
import {EditSymbolsComponent} from "../edit-symbols/edit-symbols.component";
import {InfoModalComponent} from "../../../../layouts/info-modal/info-modal.component";

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent {
  basketId!: number;
  basket: any = {}
  columnDetails = [
    {
      label: 'Action',
      key: 'action',
      type: 'text'
    },
    {
      label: 'Modified Data',
      key: 'modified_data',
      type: 'json'
    },
    {
      label: 'Before Update',
      key: 'before_data',
      type: 'json'
    },
    {
      label: 'After Update',
      key: 'after_data',
      type: 'json'
    },
    {
      label: 'Date',
      key: 'timestamp',
      type: 'date'
    }
  ]

  constructor(@Inject(JourneyInfoComponent) public parentComponent: JourneyInfoComponent, private basketService: BasketsService, private utilityService: UtilitiesService, public dialog: MatDialog) {}

  async ngOnInit(id = null) {
    this.basketId = id || this.parentComponent.getBasketId();
    this.basket = await this.parentComponent.getBasket()
  }

  async getAuditLog(pageNumber: number, pageSize: number, sortColumn : string | null = null, sortMode : string | null = null, search : string | null = null, param : any = null) {
    return await this.basketService.getAuditLog(param, pageNumber, pageSize, sortColumn, sortMode)
  }

  jsonRowFormatter(row: any, truncate: boolean = true) {
    const MAX_STR_LEN = 25
    let str = ''
    try{
      row = JSON.parse(row);
    }
    catch(e) {}
    if(row.length) {
      for(let i = 0; i < row.length; i++) {
        str += row[i]['symbol'] + ', '
      }
      str = str.substring(0, str.length - 2)
      if(truncate && str.length > MAX_STR_LEN) {
        str = str.substring(0,MAX_STR_LEN) + '...'
      }
    }
    return row.length ? str : row[Object.keys(row)[0]]
  }

  openModal(row: any) {
    console.log(row)
    let details = []
    try{
      row['before_data'] = JSON.parse(row['before_data'])
      row['after_data'] = JSON.parse(row['after_data'])
      row['modified_data'] = JSON.parse(row['modified_data'])
    }
    catch(e: any) {
    }

    details.push({
      key: 'Action',
      value: row.action
    })
    details.push({
      key: 'Updated At',
      value: (new Date(row.timestamp)).toLocaleDateString() + ' ' + (new Date(row.timestamp)).toLocaleTimeString()
    })
    details.push({
      key: 'Modified Data',
      value: this.jsonRowFormatter(row['modified_data'], false),
      type: null
    })
    details.push({
      key: 'Before Update',
      value: this.jsonRowFormatter(row['before_data'], false),
      type: null
    })
    details.push({
      key: 'After Update',
      value: this.jsonRowFormatter(row['after_data'], false),
      type: null
    })

    let dialogRef= this.dialog.open(InfoModalComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Basket Update", details: details}
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe(async result => {
        return resolve({reload: result && result.success});
      });
    })
  }
}
