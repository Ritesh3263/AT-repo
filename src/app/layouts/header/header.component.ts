import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from 'src/app/pages/components/feedback/feedback.component';
import { ProfileComponent } from 'src/app/pages/components/profile/profile.component';

import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: any = {};
  newNotificationCount = 0;
  loadUserEventSubscriber: any = null;
  notifications: any[] = [];

  myProfile() {
    this.dialog.open(ProfileComponent, {
      panelClass: 'custom-modal',
      disableClose: true
    });
  }

  feedbackDialog() {
    this.dialog.open(FeedbackComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Share Your Feedback", mode: "CREATE"}
    });
  }

  constructor(public dialog: MatDialog, private router: Router, private userService: UserService, private notificationService: NotificationsService) {
    this.loadUserEventSubscriber = this.userService.loadUserEvent.subscribe({
      next: (event: string) => {
          if(event == 'LOAD_USER') {
            this.loadUserDetails();
          }
      }
    })
  }

  loadUserDetails() {
    this.userService.getUserDetails().then((user:any) => {
      this.user = user || {};
    })
    this.notificationService.getUserNotifications({pageNumber: 0, pageSize: 5}, 1).then((data: any) => {
      if(data && data.notifications)
        this.newNotificationCount =  data.notifications.length ? data.notifications[0].totalRows : 0;
        this.notifications = data.notifications;
    })
  }

  ngOnInit() {
    this.loadUserDetails();
  }

  getUserprofilePhoto() {
    return this.user && this.user.profilePhoto ? this.user.profilePhoto : 'assets/user-tie-solid.svg'
  }

  navigate(route:string) {
    this.router.navigate([route]);
  }

  logout() {
    sessionStorage.clear();
    this.userService.logout().then((data: any) => {
      this.router.navigate(['/login']);
    })
  }

  getRoute() {
    return this.router.url;
  }
}