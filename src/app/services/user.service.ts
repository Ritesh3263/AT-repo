import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any = {}; // Cache user for shared access

  public loadUserEvent = new EventEmitter<string>();

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
      let res:any = await fetch(`${environment.apiBaseUrl}/authenticated-api/user/is-authenticated`, headers);

      let data = await res.json();
      if(data.error) {
        console.log("isAuthenticated API Error: ", res.error);
        return false;
      }
      return data.isAuthenticated;
    }
    catch(e: any) {
      return false;
    }
  }

  async logout() {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/user/logout`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getUserDetails(invalidateCache=false) {
    if(this.user && this.user.firstName && !invalidateCache) {
      return this.user;
    }
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/user`, this.getHeaders());
      let data = await res.json();
      if(data && data.user) {
        this.loadUserEvent.emit("LOAD_USER");
        this.user = data.user;
        return data.user;
      }
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async updateProfile(user: any, file: File) {
    try{
      const formData = new FormData();
      formData.append("user", JSON.stringify(user));
      if(file) {
        formData.append("file", file, file.name);
      }

      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/user/profile`, this.getHeaders('POST', formData, true));
      return await res.json();
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async submitFeedbackForm(form: any) {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/user/feedback-form`, this.getHeaders('POST', form));
      return await res.json();
    }
    catch(e: any) {
      return {error: e.message}
    }
  }


  // ------------- Unauthenticated API Calls to /api/user/* ( Login must not be an authenticated request, etc. ) ------------- //

  async getLoginUri(provider: string): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/api/user/federatedLoginRedirectUri?provider=${provider}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get Login URI Error: " + e.message)
      return {error: e.message}
    }
  }

  async getLoginToken(code:any): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/api/user/federatedLoginToken?code=${code}`, this.getHeaders());
      let data = await res.json();
      if(data && data.user) {
        this.loadUserEvent.emit("LOAD_USER");
        this.user = data.user;
      }
      return data;
    }
    catch(e: any) {
      console.log("Get Login Token Error: " + e.message)
      return {error: e.message}
    }
  }

  async login(email: string | null, password: string | null) {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/api/user/login`, this.getHeaders('POST', {email: email, password: password}));
      let data = await res.json();
      if(data && data.user) {
        this.loadUserEvent.emit("LOAD_USER");
        this.user = data.user;
      }
      return data;
    }
    catch(e: any) {
      console.log("login Error: " + e.message);
      return {error: e.message}
    }
  }

  async signup(token: string, user: any) {
    try{
      let body = {token: token, email: user.email, password: user.password, firstName: user.firstName, lastName: user.lastName, displayName: user.firstName + ' ' + user.lastName, phoneNumber: user.phoneNumber};
      let res = await fetch(`${environment.apiBaseUrl}/api/user`, this.getHeaders('POST', body));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("signup Error: " + e.message);
      return {error: e.message}
    }
  }

  async sendPasswordResetEmail(email: string | null) {
    try{
      let body = {email: email};
      let res = await fetch(`${environment.apiBaseUrl}/api/user/send-password-reset-email`, this.getHeaders('POST', body));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("sendPasswordResetEmail Error: " + e.message);
      return {error: e.message}
    }
  }

  async sendEmailVerificationEmail(email: string) {
    try{
      let body = {email: email};
      let res = await fetch(`${environment.apiBaseUrl}/api/user/send-email-verification-email`, this.getHeaders('POST', body));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

  async verifyPasswordResetToken(token:any): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/api/user/verify-password-reset-token?token=${token}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get Login Token Error: " + e.message)
      return {error: e.message}
    }
  }

  async resetPassword(token: string, password: string | null) {
    try{
      let body = {token: token, password: password};
      let res = await fetch(`${environment.apiBaseUrl}/api/user/password-reset`, this.getHeaders('POST', body));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("resetPassword Error: " + e.message);
      return {error: e.message}
    }
  }
}
