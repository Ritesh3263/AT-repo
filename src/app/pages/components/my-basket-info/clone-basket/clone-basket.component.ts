import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-clone-basket',
  templateUrl: './clone-basket.component.html',
  styleUrls: ['./clone-basket.component.scss']
})
export class CloneBasketComponent {
  basketName!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private dialogRef: MatDialogRef<CloneBasketComponent>, private utilitiesService: UtilitiesService) {
    this.basketName = 'Clone of ' + this.data.name
  }

  cloneBasket() {
    let basket = {
      name: this.basketName,
      description: this.data.description,
      action: 'CLONE',
      sourceBasketId: this.data.id
    }

    this.basketService.createBasket(basket).then((data) => {
      if(data.error || !data.id) {
        this.utilitiesService.displayInfoMessage("Error Creating Basket: " + data.error);
      }
      else {
        this.utilitiesService.displayInfoMessage(`${basket.name} created!`);
        this.dialogRef.close({success: true, id: data.id});
      }
    })
  }
}
