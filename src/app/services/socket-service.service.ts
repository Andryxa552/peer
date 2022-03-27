import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {

  constructor(private socket: Socket) { }

  sendCanvas(canvasImg: any) {
    console.log(canvasImg,'canvas')
    this.socket.emit('message', {data:canvasImg});
  }

  fetchCanvas() : Observable<{data: string}> {
    return this.socket.fromEvent('message');
  }
}
