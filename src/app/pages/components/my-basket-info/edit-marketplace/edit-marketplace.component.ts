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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditMarketplaceComponent>) {}

  updateBasket() {
    this.basketService.updateBasket(this.data.basket).then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage(`Marketplace Visibility Updated`)
        this.dialogRef.close({success: true})
      }
    })
  }
}
