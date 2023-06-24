import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (refreshToken) {
      fetch(`/refresh_token?refresh_token=${refreshToken}`)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
