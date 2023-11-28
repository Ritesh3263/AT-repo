import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  // This path relative to the api base url
  baseUrl = `${environment.apiBaseUrl}/authenticated-api/notifications`;

  constructor() { }

  getHeaders(method: string = "GET", body:any = null): RequestInit {
    let headers: RequestInit = {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: null
    }
    if(body) {
      headers.body = JSON.stringify(body);
    }

    return headers;
  }

  async getUserNewNotificationCount() {
    try{
      let res = await fetch(`${this.baseUrl}/user-new-notification-count`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getUserNotifications(pagination: any) {
    try{
      let res = await fetch(`${this.baseUrl}/user-notifications?pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async setUserNotificationViewed(notification_event_id: number) {
    try{
      let res = await fetch(`${this.baseUrl}/user-notification-viewed`, this.getHeaders('POST', {notification_event_id: notification_event_id}));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getUserNewNotificationPreferences() {
    try{
      let res = await fetch(`${this.baseUrl}/user-notification-preferences`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async setUserNotificationPreferences(email: boolean, sms: boolean) {
    try{
      let res = await fetch(`${this.baseUrl}/user-notification-preferences`, this.getHeaders('POST', {email: email, sms: sms}));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

}
