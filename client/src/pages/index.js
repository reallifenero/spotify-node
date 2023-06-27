import { useEffect, useState } from "react";

import { accessToken, logout } from "../spotify/auth";
import { getCurrentUserProfile } from "../spotify/api";
import { catchErrors } from "../utils/utils";

import "../styles/App.css";

function App() {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const getProfile = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    catchErrors(getProfile);
  }, [profile]);

  const LOGIN_URI =
    process.env.NODE_ENV === "production"
      ? "https:spotify-node.herokuapp.com/login"
      : "http://localhost:8888/login";

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
              href={`${LOGIN_URI}`}
              rel="noopener noreferrer"
            >
              Login to Spotify
            </a>
          </div>
        ) : (
          <>
            {profile && (
              <section>
                <h1>{profile.display_name} is Logged in</h1>
                <p>he has only {profile.followers.total} followers</p>
                <img src={profile.images[0].url} alt="" />
              </section>
            )}
            <div>
              <span onClick={() => logout()}>Logout</span>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
