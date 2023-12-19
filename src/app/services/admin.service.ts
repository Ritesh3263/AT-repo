import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor() { }

  getHeaders(method: string = "GET", body:any = null, formData: boolean = false): RequestInit {
    let headers: RequestInit = {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: null
    }
    if(body) {
      headers.body = formData ? body : JSON.stringify(body);
    }
    if(formData) {
      delete headers.headers;
    }

    return headers;
  }

// ------------- Authenticated API Calls to /authenticated-api/user/* ( Login must not be an authenticated request ) ------------- //

  async isAuthenticated(): Promise<boolean> {
    try{
      let headers: RequestInit = {
        method: "GET",
        credentials: "include"
      }

      let res:any = await fetch(`${environment.apiBaseUrl}/admin-api/is-authenticated`, headers);

      let data = await res.json();
      if(data.error) {
        return false;
      }
      return data.isAuthenticated;
    }
    catch(e: any) {
      return false;
    }
  }

  async publishNotification(notificationData: any) {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/admin-api/publish-notification`, this.getHeaders('POST', notificationData));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

}
