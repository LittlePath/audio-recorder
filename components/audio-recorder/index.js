window.customElements.define('audio-recorder',
  class AudioRecorder extends HTMLElement{
    constructor(){
      super();
    }

    connectedCallback(){
      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(this.style);
      shadowRoot.appendChild(this.content);
      
      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.addEventListener('click', (event) => this.startStopClickHandler(event) );

      this.audioChunks = [];
      this.mimeType = 'audio/aac';
      this.isRecording = false;
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
      <audio id="audio-recorder" ></audio>
      <button id="start-stop">Start Recording</button>
      `;
      return content;
    }

    startStopClickHandler(event){
      if(this.isRecording){
        this.stop();
      }else{
        this.start();
      }
    }

    start(){
      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.innerHTML = 'Stop Recording';
      startStopButton.classList.add('stop');
      this.isRecording = true;

      this.mediaSource = new MediaSource();
      this.mediaSource.addEventListener('sourceopen', (event) => this.sourceOpenHandler(event));
      this.sourceBuffer = undefined;

      const constraints = {
        audio: true,
        video: false
      };
        
      navigator.mediaDevices.getUserMedia(constraints)
        .then( (stream) => {
          window.stream = stream;
          this.shadowRoot.querySelector('audio').srcObject = stream;
        })
        .catch( (error) => {
          console.error(`navigator.getUserMedia error: ${error}`);
        });
    }

    stop(){
      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.innerHTML = 'Start Recording';
      startStopButton.classList.remove('stop');
      this.isRecording = false;
    }

    sourceOpenHandler(event){
    }
  }


);
