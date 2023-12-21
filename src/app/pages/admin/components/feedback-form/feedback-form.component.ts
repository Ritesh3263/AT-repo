import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';
import { FeedbackComponent } from 'src/app/pages/components/feedback/feedback.component';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent {
  columnDetails = [
    {
      label: null,
      key: 'profilePhoto',
      type: 'image'
    },
    {
      label: 'Name',
      key: 'userDisplayName',
      type: 'text'
    },
    {
      label: 'Email',
      key: 'userEmail',
      type: 'text'
    },
    {
      label: 'Brokerage',
      key: 'brokerageName',
      type: 'text'
    },
    {
      label: 'Is Website Easy?',
      key: 'isWebsiteEasy',
      type: 'text'
    },
    {
      label: 'Submitted At',
      key: 'timestamp',
      type: 'date'
    }
  ]

  constructor(public utilityService: UtilitiesService, private adminService: AdminService, public dialog: MatDialog) {}

  async getFeedbackForms(pageNumber: number, pageSize: number, sortColumn : string | null = null, sortMode : string | null = null, search : string | null = null) {
    return await this.adminService.getFeedbackForms(pageNumber, pageSize, sortColumn, sortMode, search)
  }

  viewForm(row:any) {
    let dialogRef= this.dialog.open(FeedbackComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Submitted Feedback", formData: row, mode: "VIEW"}
    });
  }
}
