import { Component, Inject, Renderer2, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from 'src/app/pages/components/feedback/feedback.component';
import { ProfileComponent } from 'src/app/pages/components/profile/profile.component';

import { UserService } from 'src/app/services/user.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UtilitiesService} from "../../services/utilities.service";

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
  notificationPollingInitiated: boolean = false;

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

  constructor(public dialog: MatDialog, private utilitiesService: UtilitiesService, private userService: UserService, private notificationService: NotificationsService, @Inject(DOCUMENT) private document:Document, private render:Renderer2) {
    this.loadUserEventSubscriber = this.userService.loadUserEvent.subscribe({
      next: (event: string) => {
          if(event == 'LOAD_USER') {
            this.loadUserDetails();
          }
      }
    })
  }

  async loadUserDetails() {
    this.userService.getUserDetails().then((user:any) => {
      this.user = user || {};
    })
  }

  ngOnInit() {
    this.render.addClass(this.document.body,'Trading-theme-light')
    this.loadUserDetails();
    this.pollNotifications();
  }

  getUserprofilePhoto() {
    return this.user && this.user.profilePhoto ? this.user.profilePhoto : 'assets/user-tie-solid.svg'
  }

  navigate(route:string) {
    this.utilitiesService.navigate(route);
  }

  logout() {
    sessionStorage.clear();
    this.userService.logout().then((data: any) => {
      this.utilitiesService.navigate('/login');
    })
  }

  async notificationNavigate(notification:any) {
    // Set Notification As Viewed
    let viewed = await this.notificationService.setUserNotificationViewed(notification.notification_event_id);
    this.getNofications()
    if(notification.action == 'BASKET_EDIT' && notification.basket_id) {
      this.utilitiesService.navigate(`baskets/${notification.basket_id}/basket?event=${btoa(JSON.stringify({timestamp: notification.timestamp}))}`)
    }
    else if(notification.action == 'ORDER_COMPLETED' && notification.basket_id) {
      let a = notification.notification_data;
      let transactionId = a.substring(a.indexOf('Transaction ID: ') + 'Transaction ID: '.length, a.length)
      this.utilitiesService.navigate(`baskets/${notification.basket_id}/orders?transactionId=${transactionId}`)
    }
  }

  changeTheme(themevalue:string){
    this.render.removeClass(this.document.body,'Trading-theme-light')
    this.render.removeClass(this.document.body,'Trading-theme-dark')

    if(themevalue=='light'){
      this.render.addClass(this.document.body,'Trading-theme-light')
    }
    if(themevalue=='dark'){

      this.render.addClass(this.document.body,'Trading-theme-dark')
    }
  }

  async pollNotifications() {
    if(this.notificationPollingInitiated)  // Mutex in case this function gets called twice, we only want one instance running
      return;
    this.notificationPollingInitiated = true
    while(1) {
      await this.getNofications()
      await this.utilitiesService.sleep(1000 * 20) // Poll new notifications every 20 seconds
    }
  }

  async getNofications() {
    try{
      let newNotifications = (await this.notificationService.getUserNewNotificationCount()).count
      this.newNotificationCount = newNotifications.new_notification_count || 0;
      let data = await this.notificationService.getUserNotifications({pageNumber: 0, pageSize: 10}, 0)
      if(data && data.notifications) {
        this.notifications = data.notifications
      }
    }
    catch(e) {}
  }

}