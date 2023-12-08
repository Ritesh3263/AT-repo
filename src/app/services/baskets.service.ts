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

  async getAllBaskets(nameOnly:number = 0, includeSubscriptions:number = 0): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/baskets${nameOnly ? '?nameOnly=true' : ''}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getFavoriteBaskets(): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/baskets/favorites`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getAllBasketsForMarketplace(pageNumber: number, pageSize: number, search: string): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/baskets/marketplace?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURI(search)}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getAllSymbols(pageNumber: Number, pageSize: Number, search:string, tickerSymbols: string | null = null): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/symbols?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURI(search)}&tickerSymbols=${tickerSymbols}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
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
      return {error: e.message}
    }
  }

  async updateBasket(basket: any): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket`, this.getHeaders('PUT', {basket: basket}));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async deleteBasket(basketId: number): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}`, this.getHeaders('DELETE'));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getSymbols(basketId: Number, pageNumber: Number, pageSize: Number): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/symbols?pageNumber=${pageNumber}&pageSize=${pageSize}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async editSymbols(basketId: Number, tickers: any, method: string): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/symbols`, this.getHeaders(method, {tickers: tickers}));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async subscribeToBasket(basketId: number, method:string = 'PUT'): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/subscribe`, this.getHeaders(method, {basketId: basketId}));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async setFavoriteBasket(basketId: number, method:string = 'PUT'): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/favorite`, this.getHeaders(method, {basketId: basketId}));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }
}
