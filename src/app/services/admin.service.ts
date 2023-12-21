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

  async getUsers(pageNumber: number, pageSize: number, sortColumn: string | null = null, sortMode: string | null = null, search: string | null = null) {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/admin-api/users?pageNumber=${pageNumber}&pageSize=${pageSize}${sortColumn ? `&sortColumn=${sortColumn}` : ''}${sortMode ? `&sortMode=${sortMode}` : ''}${search ? `&search=${search}` : ''}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async createUser(user: any) {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/admin-api/user`, this.getHeaders('POST', user));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("signup Error: " + e.message);
      return {error: e.message}
    }
  }

  async updateUser(user: any) {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/admin-api/user/${user.id}`, this.getHeaders('PATCH', user));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("signup Error: " + e.message);
      return {error: e.message}
    }
  }

  async getFeedbackForms(pageNumber: number, pageSize: number, sortColumn: string | null = null, sortMode: string | null = null, search: string | null = null) {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/admin-api/feedback-forms?pageNumber=${pageNumber}&pageSize=${pageSize}${sortColumn ? `&sortColumn=${sortColumn}` : ''}${sortMode ? `&sortMode=${sortMode}` : ''}${search ? `&search=${search}` : ''}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }
}
