import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  // This path relative to the api base url
  baseUrl = `${environment.apiBaseUrl}/authenticated-api/audit-log`;

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

  async getUserActivity(pageNumber: Number, pageSize: Number, search:string) {
    try{
      let res = await fetch(`${this.baseUrl}/user-activity?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURI(search)}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }
}
