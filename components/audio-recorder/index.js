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

      this.mediaRecorder = undefined;
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

      let audioChunks = [];

      const constraints = {
        audio: true,
        video: false
      };

      const options = {
        type: 'audio/aac'
      }
        
      navigator.mediaDevices.getUserMedia(constraints)
        .then( (stream) => {
          this.mediaRecorder = new MediaRecorder(stream, options);
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
      this.isRecording = false;
    }

    saveRecording(audioBlob){
      let blobUrl = URL.createObjectURL(audioBlob);
      let audio = document.createElement('audio');
      audio.setAttribute('src', blobUrl);
      audio.setAttribute('controls', '');
      this.shadowRoot.append(audio);
    }


  }


);
