import React from "react"
import { FaMicrophone } from "react-icons/fa";
import { config } from "../App";


//------------------------SPEECH RECOGNITION-----------------------------

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-IN'




//------------------------COMPONENT-----------------------------

export default class Speech extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      listening: false
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }


  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }
  performTranslationCall = async (user_txt)=>{
    console.log("api",user_txt)
    var response;
    var errored = false;
    try {
      response = await (
        await fetch(`${config.endpoint}/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sent: user_txt,
          }),
        })
      ).json();
    } catch (e) {
      errored = true;
    }
    if(response){
      return response.translated_text;
    }


  }
  performRasaCall = async (user_txt)=>{
    console.log("api",user_txt)
    
    let eng_text;
    eng_text =  await this.performTranslationCall(user_txt);
    console.log("HIN-ENG translation",eng_text)
    // if(localStorage.getItem("lang")==="hi"){
    //   eng_text =  await this.performTranslationCall(user_txt);
    //   console.log("HIN-ENG translation",eng_text)
    // }
    // else{
    //   console.log("No translation")
    //   eng_text=user_txt// await this.performTranslationCall(user_txt)
    
    // }
    let response = await (
      await fetch(`http://localhost:5005/model/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: eng_text
        }),
      })
    ).json();
    let ents = response.entities;
    console.log(response);
    for(let i=0;i<ents.length;i++){
      this.props.search("");
      this.props.search(ents[i].value);
      console.log(ents[i].value)
    }
    if(response)
      return response;
  }
  handleListen() {

    console.log('listening?', this.state.listening)

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''
      finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      // document.getElementById('interim').innerHTML = interimTranscript
      if(finalTranscript)
        this.performRasaCall(finalTranscript)
      // this.translator()
      document.getElementById('final').innerHTML = finalTranscript

    //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1)
      // console.log('stopCmd', stopCmd)

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
        recognition.stop()
        recognition.onend = () => {
          // console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
          // document.getElementById('final').innerHTML = finalText
        }
      }
    }
    
  //-----------------------------------------------------------------------
    
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }

  }

  render() {
    return (
      <div style={container}>
        <div id='final' style={final}></div>
        <button id='microphone-btn' style={button} onClick={this.toggleListen}><FaMicrophone/></button>
        {/*<div id='interim' style={interim}></div>*/}
      </div>
    )
  }
}



const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    width: '50px',
    height: '50px',
    background: 'khaki',
    borderRadius: '100%',
    // margin: '6em 0 2em 0'
  },
  interim: {
    color: 'gray',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    color: 'black',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  }
}

const { container, button, interim, final } = styles
