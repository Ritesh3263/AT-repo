import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';


@Component({
  selector: 'app-delete-basket',
  templateUrl: './delete-basket.component.html',
  styleUrls: ['./delete-basket.component.scss']
})
export class DeleteBasketComponent {
  basketName: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private utilityService: UtilitiesService, private dialogRef: MatDialogRef<DeleteBasketComponent>) {}

  deleteBasket() {
    if(this.basketName == this.data.name) {
      this.basketService.deleteBasket(this.data.id).then((data) => {
        if(data.error || !data.success) {
          this.utilityService.displayInfoMessage(data.error, true)
        }
        else {
          this.utilityService.displayInfoMessage("Basket Deleted")
          this.dialogRef.close({success: true, id: data.id})
          this.utilityService.navigate('/baskets')
        }
      })
    }
    else {
      // Alert that the name does not match
      this.utilityService.displayInfoMessage("Please confirm the basket name to continue", true)
    }

  }
}
