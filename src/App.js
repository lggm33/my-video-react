import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { connect } from 'twilio-video'
import './App.css';

function App() {

  const getTokenURL = ''

  const [state, setState] = useState({
    token: '',
    roomName: '',
    identity: '',
    room: null,

  })

  const videoParticipants = useRef(null)

  const handleSubmit = async () => {
    getToken()
  }

  const getToken = async () => {
    try {
      const response = await axios.post(getTokenURL, {
        identity: state.identity, roomName: state.roomName
      })
      setState({ ...state, token: response.data.jwt })
      console.log(response.data.jwt)
    } catch (error) {
      console.log(error)
    }

  }


  useEffect(() => {
    if (state.room) {

      handleConnectedParticipant(state.room.localParticipant)
      state.room.participants.forEach(handleConnectedParticipant)
      state.room.on('participantConnected', handleConnectedParticipant)

      state.room.on('participantDisconnected', handleDisconnectedParticipant)
      window.addEventListener('pagehide', () => state.room.disconnect())
      window.addEventListener('beforeunload', () => state.room.disconnect())
    }


  }, [state.room])

  const handleConnectedParticipant = (participant) => {
    participant.tracks.forEach((trackPublication) => {
      handleTrackPublished(trackPublication, participant)
    })
    participant.on('trackPublished', (trackPublication, participant) => {
      handleTrackPublished(trackPublication, participant)
    })
  }

  const handleTrackPublished = (trackPublication, participant) => {

    const videoParticipantDiv = document.createElement("div");
    videoParticipantDiv.id = participant.sid
    videoParticipants.current.appendChild(videoParticipantDiv)
    const handleTrackSubcribed = (track) => { videoParticipantDiv.appendChild(track.attach()) }

    if (trackPublication.track) { handleTrackSubcribed(trackPublication.track) }
    trackPublication.on('subscribed', handleTrackSubcribed)
  }

  const handleDisconnectedParticipant = (participant) => {
    const participantToRemove = document.getElementById(`${participant.sid}`)
    participantToRemove.remove()
  }

  useEffect(() => {

    const joinRoom = async () => {
      try {
        // const mediaTracks = await createMediaTracks()
        const room = await connect(state.token, { name: state.roomName, video: true, audio: false })
        setState({ ...state, room })
      } catch (error) {
        console.log(`Unable to connect to Room: ${error}`)
      }
    }

    if (state.token !== '') {
      joinRoom()
    }

  }, [state.token])


  const handleOnChange = (e) => {
    const { name, value } = e.target

    setState({ ...state, [name]: value })
  }

  return (
    <div className="App">

      <p>State.token: {state.token}</p>
      <button type='button' onClick={(e) => handleSubmit(e)}>Get Token</button>
      <input name='identity' placeholder='User' value={state.identity} onChange={(e) => handleOnChange(e)}></input>
      <input name='roomName' placeholder='Room' value={state.roomName} onChange={(e) => handleOnChange(e)}></input>
      <div ref={videoParticipants} ></div>



    </div>
  );
}

export default App;
