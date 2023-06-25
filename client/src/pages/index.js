import { useEffect, useState } from "react";

import { accessToken, logout } from "../spotify";
import "../styles/App.css";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <div>
            <img
              src={
                "https://i.scdn.co/image/ab6775700000ee855ed27974479c5f83d6bbf47e"
              }
              className="App-logo"
              alt="logo"
            />
            <p></p>
            <a
              className="App-link"
              href="http://localhost:8888/login"
              rel="noopener noreferrer"
            >
              Login to Spotify
            </a>
          </div>
        ) : (
          <>
            <p>Logged In</p>
            <span onClick={() => logout()}>Logout</span>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
