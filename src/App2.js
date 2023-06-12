import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useSyncExternalStore } from 'react';


function App() {

  const [sessionKey, setSessionKey] = useState("")

  async function GetSessionKey(username, password, server) {
    var key = await fetch(server + '/services/auth/login', {
      method: 'POST',
      body: new URLSearchParams({
        username: username,
        password: password,
        output_mode: 'json',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data --> ", data)
        return data['sessionKey']; // indicates a successful request
      });

    return { sessionKey: key };
  }

  GetSessionKey("admin", "Pa55word", "https://localhost:8089").then(result => {
    setSessionKey(result.sessionKey)
  })
  
  useEffect(() => {
    console.log("sessionKey is updated ",sessionKey) 
  
    // return () => {
    //   second
    // }
  }, [sessionKey])
  





  return (
    <div className="App">

    </div>
  );
}

export default App;
