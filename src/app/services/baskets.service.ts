import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketsService {
  currentBasket: any = {}
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

  async getAllBaskets(nameOnly:number = 0, includeSubscriptions:number = 0, excludeList:any = null): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/baskets${nameOnly ? '?nameOnly=true' : ''}${includeSubscriptions ? '&includeSubscriptions=true' : ''}${excludeList ? `&excludeList=${JSON.stringify(excludeList)}`:''}`, this.getHeaders());
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
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/baskets/marketplace?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getAllSymbols(pageNumber: Number, pageSize: Number, search:string, tickerSymbols: string | null = null): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/symbols?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&${tickerSymbols ? `tickerSymbols=${tickerSymbols}` : ''}`, this.getHeaders());
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

  async getBasketDetails(basketId: number, reload = false): Promise<any> {
    try{
      if(this.currentBasket && this.currentBasket.basket && this.currentBasket.basket.id && (this.currentBasket.basket.id == basketId) && !reload) {
        return this.currentBasket;
      }

      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}`, this.getHeaders());
      this.currentBasket = await res.json();
      return this.currentBasket;
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

  async getSymbols(basketId: Number, pageNumber: Number, pageSize: Number, sortColumn: string | null, sortMode: string|null): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/symbols?pageNumber=${pageNumber}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortMode=${sortMode}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async editSymbols(basketId: Number, tickers: any, method: string, replaceTickers: boolean = false): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/symbols`, this.getHeaders(method, {tickers: tickers, replaceTickers: replaceTickers}));
      return await res.json();
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

  async getBasketAccounts(basketId: number): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/accounts`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async setBasketAccount(basketId: number, accountNumber: number, method = 'PUT',brokerageId=null): Promise<any> {
    try{

      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/accounts/${accountNumber}`, method == 'PUT'?this.getHeaders(method, {brokerageId : brokerageId}):this.getHeaders(method));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      return {error: e.message}
    }
  }

  async getAuditLog(basketId: Number, pageNumber: Number, pageSize: Number, sortColumn: string | null, sortMode: string|null): Promise<any> {
    try{
      let res = await fetch(`${environment.apiBaseUrl}/authenticated-api/basket/${basketId}/audit-log?pageNumber=${pageNumber}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortMode=${sortMode}`, this.getHeaders());
      return await res.json();
    }
    catch(e: any) {
      return {error: e.message}
    }
  }
}
