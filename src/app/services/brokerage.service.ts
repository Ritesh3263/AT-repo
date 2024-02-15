import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrokerageService {

  constructor() { }
  getHeaders(method: string = "GET", body:any = null,token:any=null): RequestInit {
    let headers: RequestInit = {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "token" : token

      },
      body: null
    }
    if(body) {
      headers.body = JSON.stringify(body);
    }

    return headers;
  }

  async getBrokerages(): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/brokerage/brokerages`, this.getHeaders())
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

  async getBrokerageAccounts(brokerage:any): Promise<any> {
    try{

      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/brokerage/${brokerage}/accounts`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

  async getAllBrokerageAccounts(): Promise<any> {
    try{

      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/brokerage/all-accounts`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }


  async getRedirectedUrl(): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/brokerage/redirectedUrl`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }


  async setAccessToken(input:any): Promise<any> {
    try{
      let apiInput = {code:input.code,user_id:input.user_id};
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/brokerage/set-access-token`, this.getHeaders('POST', apiInput));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }
  async getSync(){
    try{
        let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/brokerage/sync`, this.getHeaders());
        let data = await res.json();
        return data;
      }
      catch(e: any) {
        return {error: e.message}
      }
  }


  
  async DisconnectBrokerage(brokerageType: string): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/brokerages/${brokerageType}`, this.getHeaders('DELETE'));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

}
