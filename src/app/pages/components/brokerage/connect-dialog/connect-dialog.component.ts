import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-connect-dialog',
  templateUrl: './connect-dialog.component.html',
  styleUrls: ['./connect-dialog.component.scss']
})
export class ConnectDialogComponent {
  // constructor(private env:environment){

  // }

  brokerageURl :string = environment.brokerageUrl;

}
