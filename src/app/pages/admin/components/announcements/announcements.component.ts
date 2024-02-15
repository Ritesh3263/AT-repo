import { Component } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import {InfoModalComponent} from "../../../../layouts/info-modal/info-modal.component";

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent {
  form: FormGroup = new FormGroup('');

  columnDetails = [
    {
      label: null,
      key: 'profilePhoto',
      type: 'image'
    },
    {
      label: 'Sent By',
      key: 'displayName',
      type: 'text'
    },
    {
      label: 'Subject',
      key: 'subject',
      type: 'text'
    },
    {
      label: 'Sent At',
      key: 'timestamp',
      type: 'date'
    }
  ]

  constructor(private fb: FormBuilder, public utilityService: UtilitiesService, private adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit() {
    this.resetForm()
  }

  resetForm() {
    this.form = this.fb.group ({
      subject: new FormControl('', [Validators.required]),
      notificationData: new FormControl('', [Validators.required])
    })
  }

  sendAnnouncement() {
    let form = this.form.controls;
    let announcement = {
      subject: form['subject'].getRawValue(),
      notificationData: form['notificationData'].getRawValue(),
      action: 'ANNOUNCEMENT'
    }

    this.adminService.publishNotification(announcement).then((response) => {
      if(response && response.success && response.notifications) {
        this.utilityService.displayInfoMessage("Announcment Sent!", false, 8000)
        this.resetForm()
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(announcement), true, 8000)
      }
    })
  }

  async getNotifications(pageNumber: number, pageSize: number, sortColumn : string | null = null, sortMode : string | null = null, search : string | null = null) {
    return await this.adminService.getNotifications(pageNumber, pageSize, sortColumn, sortMode, search)
  }

  async viewNotification(notification:any) {
    let recipients = ''
    if(notification && notification.recipients && notification.recipients.length) {
      for(let i = 0; i< notification.recipients.length; i++)
        recipients += notification.recipients[i].email + '\n'
    }
    let dialogRef= this.dialog.open(InfoModalComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Notification", details: [{key: 'Sent By', value: notification.displayName}, { key: 'Subject', value: notification.subject}, {key: 'Content', value: notification.notification_data}, {key: 'Recipients', value: recipients, type: 'list'}]}
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe(async result => {
        return resolve({reload: result && result.success});
      });
    })
  }
}
