import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Peer from "peerjs";
import { SocketServiceService } from "../../services/socket-service.service";
import { from } from "rxjs";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  videoEnabled = false;
  audioEnabled = false;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  localStream: MediaStream;
  @Input()set videoEnabledProp(videoEnabled: boolean){
    if(this.localStream){
      this.localStream.getVideoTracks()[0].enabled = videoEnabled;
    }
  }
  @Input()set audioEnabledProp(audioEnabled: boolean){
    if(this.localStream){
      this.localStream.getAudioTracks()[0].enabled = audioEnabled;
    }
  }
  remoteStream: MediaStream;
  isCaller: boolean;
  @Input()isOnCall = false;

  @Input() remotePeerId: string
  @Input() peer: Peer;

  constructor( private socketService: SocketServiceService ) {


  }

  ngOnInit(): void {

    // this.socketService.fetchCanvas().subscribe(value => {
    //   this.isOnCall = true
    //   from<Promise<MediaStream>>(navigator.mediaDevices.getUserMedia({video: true, audio: true})).subscribe(stream => {
    //     this.remoteStream = stream
    //     this.remoteStream.getVideoTracks()[0].enabled = false
    //     this.remoteStream.getAudioTracks()[0].enabled = false
    //
    //     this.callWithAudio(value.data)
    //   })
    //
    // })
    from<Promise<MediaStream>>(navigator.mediaDevices.getUserMedia({video: true, audio: true})).subscribe(stream => {
      console.log(stream,'stricmchi')
      this.remoteStream = stream
      this.remoteStream.getVideoTracks()[0].enabled = false
      this.remoteStream.getAudioTracks()[0].enabled = false

      this.callWithAudio(this.remotePeerId)
    })

    this.peer.on('call', ( call ) => {
      console.log('call')

      from<Promise<MediaStream>>(navigator.mediaDevices.getUserMedia({video: true, audio: true})).subscribe(( stream: MediaStream ) => {
        this.localStream = stream;
        this.localStream.getVideoTracks()[0].enabled = false
        this.localStream.getAudioTracks()[0].enabled = false
        console.log(this.localStream,'dsadsalocal')
        call.answer(this.localStream)
        call.on('stream', async (stream: any) => {
          this.video.nativeElement.srcObject = stream;
        })

      })

    })
  }

  callWithAudio( id: string ) {
    console.log(id,'aidi')
    const call = this.peer.call(id, this.remoteStream);

    call.on('stream',  stream => {
      this.video.nativeElement.srcObject = stream;
    })
  }

  toggleVideoMute(){
    if(!this.localStream && !this.remoteStream){
      return
    }
    if(this.isCaller){
      this.videoEnabled = !this.videoEnabled
      this.localStream.getVideoTracks()[0].enabled = this.videoEnabled

    }else {
      this.videoEnabled = !this.videoEnabled
      this.remoteStream.getVideoTracks()[0].enabled = this.videoEnabled


    }
  }

  toggleAudioMute(){
    if(!this.localStream && !this.remoteStream){
      return
    }
    if(this.isCaller){
      this.audioEnabled = !this.audioEnabled
      this.localStream.getAudioTracks()[0].enabled = this.audioEnabled
    }else {
      this.audioEnabled = !this.audioEnabled
      this.remoteStream.getAudioTracks()[0].enabled = this.audioEnabled
    }
  }

  connect() {
    this.isOnCall = true
    console.log(this.isCaller,'caller')
    if(this.isCaller){
      return;
    }
    if(!this.isCaller){
      console.log('inside')
      this.isCaller = true
    }

    this.socketService.sendCanvas(this.peer.id)
  }

}
