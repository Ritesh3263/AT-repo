import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from 'src/app/pages/components/feedback/feedback.component';
import { ProfileComponent } from 'src/app/pages/components/profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public dialog: MatDialog) {}
  
  myProfile() {
    this.dialog.open(ProfileComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  feedbackDialog() {
    this.dialog.open(FeedbackComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }
}
