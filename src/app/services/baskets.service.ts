import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketsService {

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

  async getAllBaskets(nameOnly = false): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/baskets${nameOnly ? '?nameOnly=true' : ''}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

  async getAllSymbols(pageNumber: Number, pageSize: Number, search:string): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/symbols?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURI(search)}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

  async createBasket(basket: any): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket`, this.getHeaders('POST', {basket: basket}));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

  async getBasketDetails(basketId: number): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }
}
