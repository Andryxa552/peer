import { catchError, from, fromEvent, of, tap } from "rxjs";

const audioHelper  = {
  audioBlobs: [],
  mediaRecorder: null,
  streamBeingCaptured: null,

  start: function (  ) {
    console.log(navigator.mediaDevices);
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return from(Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.')));
    }
   return  from(navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)
     .then(stream  => {
       console.log(stream)
     }))
  },

  stop: function (  ) {
    return new Promise(resolve => {
      //save audio type to pass to set the Blob type
      // @ts-ignore
      let mimeType = audioHelper.mediaRecorder.mimeType;

      //listen to the stop event in order to create & return a single Blob object
      // @ts-ignore
      audioHelper.mediaRecorder.addEventListener("stop", () => {
        //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
        let audioBlob = new Blob(audioHelper.audioBlobs, { type: mimeType });

        //resolve promise with the single audio blob representing the recorded audio
        resolve(audioBlob);
      });

      //stop the recording feature
      // @ts-ignore
      audioHelper.mediaRecorder.stop();

      //stop all the tracks on the active stream in order to stop the stream
      audioHelper.stopStream();

      //reset API properties for next recording
      audioHelper.resetRecordingProperties();
    });

  },
  cancel: function (  ) {

  },

  stopStream: function() {

    //stopping the capturing request by stopping all the tracks on the active stream
    // @ts-ignore
    audioHelper.streamBeingCaptured.getTracks() //get all tracks from the stream
      .forEach((track: any) => track.stop()); //stop each one
  },
  /** Reset all the recording properties including the media recorder and stream being captured*/
  resetRecordingProperties: function () {
    audioHelper.mediaRecorder = null;
    audioHelper.streamBeingCaptured = null;
  }
}

function startAudioRecording() {

  audioHelper.start().pipe(
    tap(value => {
      console.log(value,'start')
    })
  )
}

function StopAudioRecording() {
  //stop the recording using the audio recording API
  console.log("Stopping Audio Recording...")
  audioHelper.stop()
    .then((audioAsblob :  any) => { //stopping makes promise resolves to the blob file of the recorded audio
      console.log("stopped with audio Blob:", audioAsblob);

      //Do something with the recorded audio
      //...
    })
    .catch((error:  any) => {
      //Error handling structure
      switch (error.name) {
        case 'InvalidStateError': //error from the MediaRecorder.stop
          console.log("An InvalidStateError has occured.");
          break;
        default:
          console.log("An error occured with the error name " + error.name);
      };

    });
}

export {
  audioHelper,
  startAudioRecording,
  StopAudioRecording
}
