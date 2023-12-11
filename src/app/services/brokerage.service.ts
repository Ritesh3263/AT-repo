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
      // credentials: "include",
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

  async getAccessToken(user_id:any): Promise<any> {
    try{
      let res = await fetch(`${environment.brokerageUrl}/brokerages/token/${user_id}`, this.getHeaders());
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

  async getBrokerageAccounts(brokerage:any,user_id:any): Promise<any> {
    try{

      let res = await fetch(`${environment.brokerageUrl}/brokerages/${brokerage}/users/${user_id}/accounts`, this.getHeaders());
      let data = await res.json();


      // var data;
      // if(brokerage_id == 1){
      //   data = [
      //     {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
      //     {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
      //     {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
      //     {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
      //     {accountNumber: 9954534354535489, accountBalance: 500, openPositions: 6},
      //   ];
      // }else if(brokerage_id == 2){
      //   data = [
      //     {accountNumber: 8854534354535489, accountBalance: 6000, openPositions: 16},
      //     {accountNumber: 8854534354535489, accountBalance: 6000, openPositions: 16},
      //     {accountNumber: 8854534354535489, accountBalance: 6000, openPositions: 16},
      //     {accountNumber: 8854534354535489, accountBalance: 6000, openPositions: 16},
      //     {accountNumber: 8854534354535489, accountBalance: 6000, openPositions: 16},
      //   ];
      // }
      return data?data.Accounts:data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }


 

  async getRedirectedUrl(): Promise<any> {
    try{
      let res = await fetch(`${environment.brokerageUrl}/brokerages/redirect`, this.getHeaders());
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
      let res = await fetch(`${environment.brokerageUrl}/brokerages/set-access-token`, this.getHeaders('POST', apiInput));
      let data = await res.json();
      return data;
    }
    catch(e: any) {
      console.log("Get User Details Error: " + e.message);
      return {error: e.message}
    }
  }

}
