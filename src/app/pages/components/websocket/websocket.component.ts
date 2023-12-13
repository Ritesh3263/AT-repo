import { Component } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent {
   
  message: string = '';
ourPut :any=[];
  constructor(private webSocketService: WebsocketService ){

  }
  sendMessage() {
    if (this.message.trim()) {
      // this.webSocketService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnInit() {
    this.webSocketService.connect();

    // this.webSocketService.onMessage().subscribe((message: any) => {
    //   console.log('Received message:', message);
    //   this.ourPut.push(message) ;
    // });
  }

  ngOnDestroy() {
    // this.webSocketService.disconnect();
  }

}
