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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private dialogRef: MatDialogRef<CloneBasketComponent>, private utilitiesService: UtilitiesService) {}

  cloneBasket() {
    this.data.action = 'clone';
    this.data.name = this.basketName;
    this.basketService.createBasket(this.data).then((data) => {
      if(!(data && data.status.id)) {
        this.utilitiesService.displayInfoMessage("Error Creating Basket: " + JSON.stringify(data,null,2));
      }
      else {
        this.utilitiesService.displayInfoMessage(`${this.basketName} created!`);
        this.dialogRef.close({success: true, id: data.status.id});
      }
    })
  }
}
