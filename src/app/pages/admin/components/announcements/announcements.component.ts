import { Component } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent {
  form: FormGroup = new FormGroup('');

  constructor(private fb: FormBuilder, public utilityService: UtilitiesService, private adminService: AdminService) {}

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
}
