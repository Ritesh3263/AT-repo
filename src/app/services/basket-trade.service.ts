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
      console.log("resr",data)
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
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
      console.log("Get symbol price: " + e.message);
      return {error: e.message}
    }
  }

}
