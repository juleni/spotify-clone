import axios from "axios";
import { useEffect, useState } from "react";
// require("dotenv").config();

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    console.log("====useEffect login=======");
    //if (!accessToken || !refreshToken || !expiresIn) return;
    if (!code) return;
    console.log("accessToken = " + accessToken);
    console.log("refreshToken = " + refreshToken);
    console.log("expiresIn = " + expiresIn);
    axios
      .post("http://localhost:3001/login", { code })
      .then((res) => {
        console.log("====LOGIN: RES DATA =======");
        console.log(res.data);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        // don't show the code in the root url (just remove all the
        // extra stuff from the end of url)
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        console.log("====LOGIN CATCH:");
        //window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    console.log("====useEffect refresh=======");
    if (!refreshToken || !expiresIn) return;
    console.log("accessToken = " + accessToken);
    console.log("refreshToken = " + refreshToken);
    console.log("expiresIn = " + expiresIn);
    axios
      .post("http://localhost:3001/refresh", { refreshToken })
      .then((res) => {
        console.log("====REFRESH: RES DATA =======");
        console.log(res.data);
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);
        // don't show the code in the root url (just remove all the
        // extra stuff from the end of url)
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        console.log("====REFRESH: CATCH");
        window.location = "/";
      });
  }, [refreshToken, expiresIn]);

  return accessToken;
}
