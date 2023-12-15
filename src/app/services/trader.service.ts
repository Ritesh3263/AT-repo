import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraderService {
  // This path relative to the api base url
  baseUrl = `${environment.apiBaseUrl}/authenticated-api/trader`;

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

  async follow(traderUserId: number, method: string = 'PUT') {
    try{
      let res = await fetch(`${this.baseUrl}/${traderUserId}/follow`, this.getHeaders(method));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getBaskets(traderUserId: string) {
    try{
      let res = await fetch(`${this.baseUrl}/${traderUserId}/baskets`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getPublishersFollowed() {
    try{
      let res = await fetch(`${this.baseUrl}/following`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getPublisherProfile(traderUserId:string) {
    try{
      let res = await fetch(`${this.baseUrl}/following/${traderUserId}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }
}
