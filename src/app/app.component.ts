import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, filter, fromEvent } from "rxjs";
import { SocketServiceService } from "./services/socket-service.service";
import Peer from "peerjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  peersArray: string[] = []
  peer: Peer;
  isOnCall = false;
  videoEnabled = false;
  audioEnabled = false;
  constructor(private socketService: SocketServiceService) {
  }
  ngOnInit() {
    this.peer = new Peer({
      host: 'frozen-waters-35931.herokuapp.com',
      port: 443,
      secure: true,
      path: 'peerjs/myapp',
    });
    console.log(this.peer, 'dsadassad')

    this.socketService.fetchCanvas().subscribe(value => {
      if(!this.peersArray.includes(value.data) && value.data !== this.peer.id){
        this.peersArray.push(value.data)
        this.connect()
      }
      console.log(this.peersArray)
    })

  }
  connect(){
    this.isOnCall = true;
    this.socketService.sendCanvas(this.peer.id)
  }

  toggleVideoMute(){
      this.videoEnabled = !this.videoEnabled

  }

  toggleAudioMute(){/**/
      this.audioEnabled = !this.audioEnabled
  }
}
