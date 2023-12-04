import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-edit-marketplace',
  templateUrl: './edit-marketplace.component.html',
  styleUrls: ['./edit-marketplace.component.scss']
})
export class EditMarketplaceComponent {
  termsAgreed: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditMarketplaceComponent>) {
    console.log(this.data.basket.public)
  }

  updateBasket() {
    this.basketService.updateBasket(this.data.basket).then((data) => {
      if(data && data.success) {
        this.utilityService.displayInfoMessage(`Marketplace Visibility Updated`)
        this.dialogRef.close({success: true})
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(data.status.error), true)
      }
    })
  }
}
