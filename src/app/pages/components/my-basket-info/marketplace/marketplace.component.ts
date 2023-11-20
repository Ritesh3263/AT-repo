import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';
import { TurnoffMarketplaceComponent } from '../turnoff-marketplace/turnoff-marketplace.component';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent {
  toggleValue = true;
  toggleText = 'ON';

  constructor(public dialog: MatDialog) {}

  onToggleChange() {
    this.toggleText = this.toggleValue ? 'ON' : 'OFF';

    if (!this.toggleValue) {
      this.turnOffMarketplaceDialog();
    }
  }

  openTermsConditionsDialog() {
    this.dialog.open(TermsConditionsComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  turnOffMarketplaceDialog() {
    this.dialog.open(TurnoffMarketplaceComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }
}
