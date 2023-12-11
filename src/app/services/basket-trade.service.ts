import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketTradeService {

  externalApiUrl:any=environment.externalApiUrl;

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
  async getAccountBasketPosition(accountBasketId : any): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/account_basket_positions/${accountBasketId}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }


  async getSymbolPrice(input: any): Promise<any> {
    try{
      let header = this.getHeaders('POST', {"tickers": input})
      delete header.credentials;
      let res = await fetch(`${environment.externalApiUrl}`, header);
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }


  async setOrders(input: any,user_id:any,broker_id:any): Promise<any> {
    try{
    let header = this.getHeaders('POST', input)
      delete header.credentials;
      let res = await fetch(`${environment.brokerageUrl}/brokerages/${broker_id}/users/${user_id}/orders`, header);
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }


  async setBulkOrders(input: any,user_id:any,broker_id:any): Promise<any> {
    try{
    let header = this.getHeaders('POST', input)
      delete header.credentials;
      let res = await fetch(`${environment.brokerageUrl}/brokerages/${broker_id}/users/${user_id}/group-orders`, header);
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async setSymbolsForBrokeragePrice(input: any): Promise<any> {
    try{
    let header = this.getHeaders('POST', input)
      delete header.credentials;
      let res = await fetch(`${environment.brokerageUrl}/brokerages/trp`, header);
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

}
