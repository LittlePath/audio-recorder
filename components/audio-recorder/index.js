window.customElements.define('audio-recorder',
  class AudioRecorder extends HTMLElement{
    constructor(){
      super();
    }

    connectedCallback(){
      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(this.style);
      shadowRoot.appendChild(this.content);
      
      this.mediaRecorder = undefined;

      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.addEventListener('click', (event) => {
        if(this.mediaRecorder && this.mediaRecorder.state === 'recording'){
          this.stop();
        }else{
          this.start();
        }
      });
    }

    get style(){
      let style = document.createElement('style');
      style.innerHTML = `
        .stop{
          background-color: red;
        }
      `;
      return style;
    }

    get content(){
      let content = document.createElement('div');
      content.innerHTML = `
      <button id="start-stop">Start Recording</button>
      `;
      return content;
    }

    start(){
      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.innerHTML = 'Stop Recording';
      startStopButton.classList.add('stop');

      let audioChunks = [];

      const constraints = {
        audio: true,
        video: false
      };

      // .aac  audio/aac
      // .mp3  audio/mpeg
      // .oga  audio/ogg
      // .opus audio/opus
      // .wav  audio/wav
      // .weba audio/webm
      const options = {
        type: 'audio/ogg'
      }
        
      navigator.mediaDevices.getUserMedia(constraints)
        .then( (stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.addEventListener('dataavailable', (event) => {
            audioChunks.push(event.data);
          });
          this.mediaRecorder.addEventListener('stop', (event) => {
            this.saveRecording(new Blob(audioChunks, options));
          });
          this.mediaRecorder.start();
        })
        .catch( (error) => {
          console.error(`navigator.getUserMedia error: ${error}`);
        });
    }

    stop(){
      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.innerHTML = 'Start Recording';
      startStopButton.classList.remove('stop');
      this.mediaRecorder.stop();
    }

    saveRecording(audioBlob){
      let blobUrl = URL.createObjectURL(audioBlob);
      let audio = document.createElement('audio');
      audio.setAttribute('src', blobUrl);
      audio.setAttribute('controls', '');
      this.shadowRoot.append(audio);

      let a = document.createElement('a');
      a.setAttribute('href', blobUrl);
      a.setAttribute('download', `recording-${new Date().toISOString()}.oga`);
      a.innerText = 'Download';
      this.shadowRoot.append(a);
    }
  }
);
