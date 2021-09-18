import React, { useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket(window.location.origin.replace(/^http/, 'ws'));


function App() {
  let [data, setData] = useState({});
  let [max, setMax] = useState(0);
  let buttons = []
  const captureInput = (event) => {
    client.send(event.target.value);
  }
  for(let i=0; i<10; i++) {
    buttons.push(<>
      <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '340px'}}>
        <div style={{display: 'flex'}}>
          <div style={{display: 'inline', float: 'left'}}>
            <button style={{width: '60px'}} onClick={captureInput} value={i}>{i}</button> &nbsp;
            <progress style={{width: '200px'}} value={data[i]} max={max}> {data[i]} </progress> &nbsp;
          </div>
          <div style={{display: 'inline', float: 'right'}}>{data[i]} hits</div>
        </div>
      </div>
    </>)
  }

  client.onopen = () => {
    // console.log('WebSocket client connected')
  }
  client.onmessage = message => {
    let messageJSON = JSON.parse(message.data)
    setData(messageJSON.counts)
    setMax(messageJSON.max)
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h1 style={{textAlign: 'center'}}>WebSockets demo</h1>
      {
        buttons.map(button => {
          return button
        })
      }
      <br /><br />
      <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '340px', textAlign: 'left'}}>
        1. Open <a href={window.location.href} target='_blank'>this page</a> in multiple tabs/devices.
        <br /><br />
        2. Click the buttons and notice the counts getting updated without manually refreshing the page
      </div>
    </div>
  );
}

export default App;