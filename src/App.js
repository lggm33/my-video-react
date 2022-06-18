import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {connect, createLocalTracks} from 'twilio-video'
import './App.css';

function App() {

  const getTokenURL = 'https://generate-token-7936.twil.io/video'

  const [state, setState] = useState({
    token: '',
    roomName: '',
    identity: '',
  })

  const getToken = async () => {
    try {
      const response = await axios.post(getTokenURL, {
        identity: state.identity, roomName:state.roomName})
      setState({...state, token:response.data.jwt })
      console.log(response.data.jwt)
    } catch (error) {
      console.log(error)
    }
    
  }

  const handleSubmit = async () => {
    getToken()
  } 

   const handleOnChange = (e) => {
    const {name, value} = e.target

    setState({...state, [name]: value})
   }

   useEffect(() => {console.log(state)}, [state])

  return (
    <div className="App">
      <header className="App-header">
        <p>State.token: {state.token}</p>
      <button type='button' onClick={(e) => handleSubmit(e)}>Get Token</button>
      <input name='identity' placeholder='User' value={state.identity} onChange={(e) => handleOnChange(e)}></input>
      <input name='roomName' placeholder='Room' value={state.roomName} onChange={(e) => handleOnChange(e)}></input>
      </header>

    </div>
  );
}

export default App;
