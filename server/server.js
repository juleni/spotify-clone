const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

// require("dotenv").config();

const SPOTIFY_REDIRECT_URI = "http://localhost:3000";
const SPOTIFY_CLIENT_ID = "521c7d7095d4429983c8208e90694c24";
const SPOTIFY_CLIENT_SECRET = "1f887585a71447669b9c12fc12786224";
const SPOTIFY_REFRESH_TOKEN = "";
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: SPOTIFY_REDIRECT_URI, //process.env.SPOTIFY_REDIRECT_URI,
    clientId: SPOTIFY_CLIENT_ID, //process.env.SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET, //process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken,
  });

  // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log("The access token has been refreshed!");
      console.log(data.body);
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log("----- ERROR: INSIDE OF REFRESH CATCH -----");
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: SPOTIFY_REDIRECT_URI, //process.env.SPOTIFY_REDIRECT_URI,
    clientId: SPOTIFY_CLIENT_ID, //process.env.SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET, //process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log("----- INSIDE OF authorizationCodeGrant -----");
      console.log("----- DATA -----");
      console.log(data);

      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log("----- ERROR: INSIDE OF CATCH -----");
      console.log("----- CODE -----");
      console.log(code);
      console.log("----- CODE -----");
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(3001);
