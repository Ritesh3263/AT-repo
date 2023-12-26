import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocket
  private messageSubject = new Subject<string>();
  

  constructor() {
    this.socket = new WebSocket('ws:34.228.194.95:8765/ws');
  }

  //receiveMessages function is used for receiving messages continues 
  receiveMessages() {
    return new Promise((res) => {
      this.socket.addEventListener('message', (event) => {
        const message = event.data;
        console.log("helloooo",message)
        this.messageSubject.next(message);
        res(message)
      });
    })

  }

  //getMessages service is used to get websocket values

  public getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }



  //closeConnection service is used to close webSocket connection
  closeConnection() {
    this.socket.close();
  }

  //connect service is used to connect webSocket
  connect(brokerage:any) {
    return new Promise((res) => {
      this.socket = new WebSocket('ws:34.228.194.95:8765/'+brokerage);
      this.socket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
        res(event)
      });
    })
  }


  // sendMessage(message: string) {
  //   this.socket.emit('message', message);
  // }

  // onMessage() {
  //   return this.socket.fromEvent('new-message');
  // }
}
