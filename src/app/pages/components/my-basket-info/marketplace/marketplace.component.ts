import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMarketplaceComponent } from '../edit-marketplace/edit-marketplace.component';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';
import { BasketsService } from 'src/app/services/baskets.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent {
  toggleValue = true;
  toggleText = 'ON';
  basket: any = {};
  basketId!: number;

  form = this._formBuilder.group({
    public: ''
  });


  constructor(@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, public dialog: MatDialog, private basketService: BasketsService, private _formBuilder: FormBuilder) {
    this.basket = {}
  }

  ngOnInit() {
    this.basketId = this.parentComponent.getBasketId();
    this.basketService.getBasketDetails(this.basketId).then((data) => {
      if(data && data.basket) {
        this.basket = data.basket;
        this.form.controls['public'].setValue(this.basket.public)
      }
    })
  }

  onToggleChange() {
    this.basket.public = !this.basket.public
    this.toggleText = this.basket.public ? 'ON' : 'OFF';

    this.editMarketplaceDialog();
  }

  editMarketplaceDialog() {
    this.basket.public = this.form.controls['public'].getRawValue();
    this.dialog.open(EditMarketplaceComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {basket: this.basket}
    });
  }
}
