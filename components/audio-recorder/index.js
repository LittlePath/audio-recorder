window.customElements.define('audio-recorder',
  class AudioRecorder extends HTMLElement{
    constructor(){
      super();
    }

    connectedCallback(){
      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(this.style);
      shadowRoot.appendChild(this.content);
      
      let recordButton = this.shadowRoot.querySelector('#record-button');
      recordButton.addEventListener('click', (event) => this.recordClickHandler(event) );
   }

    get style(){
      let style = document.createElement('style');
      style.innerHTML = `
      `;
      return style;
    }

    get content(){
      let content = document.createElement('div');
      content.innerHTML = `
      <audio id="audio-recorder" ></audio>
      <button id="record-button">Start Recording</button>
      `;
      return content;
    }

    recordClickHandler(event){
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

    sourceOpenHandler(event){
    }

  }
);
