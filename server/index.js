require("dotenv").config();

const PORT = process.env.PORT || 8888;
const CLIENT_ID = process.env.CLIENT_ID || "20100395a89044388a6b832ade30e643";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI =
  process.env.REDIRECT_URI ||
  "https://spotify-node-88afa51b6fea.herokuapp.com/callback";
const FRONTEND_URI = process.env.FRONTEND_URI;

const cors = require("cors");
const path = require("path");
const axios = require("axios");
const express = require("express");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const history = require("connect-history-api-fallback");

const app = express();

// Priority serve any static files

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(express.static(path.resolve(__dirname, "../client/build")));

app
  .use(express.static(path.resolve(__dirname, "../client/build")))
  .use(cors())
  .use(cookieParser())
  .use(
    history({
      verbose: true,
      rewrites: [
        { from: /\/login/, to: "/login" },
        { from: /\/callback/, to: "/callback" },
        { from: /\/refresh_token/, to: "/refresh_token" },
      ],
    })
  )
  .use(express.static(path.resolve(__dirname, "../client/build")));

/**
 * Generate a random string containing numn  and letters
 * @param {number} length the length of the string
 * @return {string} The generated string
 */

function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const stateKey = "spotify_auth_sate";

/**
 * Routes Config
 */

app.get("/", (req, res) => {
  res.send("Hello, world! This is a new spotify app!");
});

app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";

  res.cookie(stateKey, state);

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
    show_dialog: false,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, token_type, refresh_token } = response.data;

        const queryParams = querystring.stringify({
          access_token,
          refresh_token,
        });

        // Redirect to app
        // pass along the  tokens in query params

        res.redirect(`${FRONTEND_URI}?${queryParams}`);
      } else {
        res.redirect(
          `/?${querystring.stringify({
            error: "invalid_token",
          })}`
        );
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/refresh_token", (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Returns all remaining routs to the react app to be handled
// by react router.

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/public/index.html"));
});

app.listen(PORT, (_) => {
  console.log("listening on port " + PORT);
});
