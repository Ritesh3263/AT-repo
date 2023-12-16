import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  // This path relative to the api base url
  baseUrl = `${environment.apiBaseUrl}/authenticated-api/broker`;

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

  async getBrokerMaster() {
    try{
      let res = await fetch(`${this.baseUrl}/broker-master`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getBrokerAccounts(brokerId:number) {
    try{
      let res = await fetch(`${this.baseUrl}/${brokerId}/accounts`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

}