import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../features/profile/profileSlice";
import { ThemeProvider } from "@mui/material/styles";
import { dynamicTheme } from "../theme";
import { useQuery } from "react-query";
import { fetchClientUrl, userProfileUrl } from "../config";
import axios from "axios";
import Loader from "./loader";
import Head from 'next/head';


export default function Layout({ children }) {
  const router = useRouter();
  const user = useSelector(selectProfile);
  const dispatch = useDispatch();
  const [hostname, setHostname] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    [accessToken]
  );

  const {
    isError: profileError,
    isFetching: profileFetching,
    data: profileData,
  } = useQuery(
    ["profile", user, accessToken],
    () => axios.get(userProfileUrl, config).then((res) => res.data),
    { enabled: !!accessToken, refetchOnWindowFocus: false }
  );

  const {
    data: clientData,
    isFetching: clientFetching,
    isError: clientError,
  } = useQuery(
    ["fetchClient"],
    () => axios.get(`${fetchClientUrl}${hostname}`).then((res) => res.data),
    { enabled: Boolean(hostname), refetchOnWindowFocus: false }
  );

  useEffect(() => {
    setHostname(window.location.host);

    if (!clientData) return

    const access_token = sessionStorage.getItem("jwtToken");
    if ((!access_token || access_token === "") && (router.pathname !== "/app-sumo-signup" && router.pathname !== "/register" && router.pathname !== "/login")) {
      dispatch(
        setProfile({
          ...user,
          client: clientData,
        })
      );
      router.push("/login");
    } else {
      setAccessToken(access_token);
    }
  }, [clientData, user]);

  useEffect(() => {
    if ((!profileData || !clientData || !accessToken) && (router.pathname !== "/register" && router.pathname !== "/login" && router.pathname !== "/app-sumo-signup")) return;
    if ((router.pathname === "/register" || router.pathname !== "/login" || router.pathname !== "/app-sumo-signup") && !clientData) return;

    if(!clientData) return

    dispatch(
      setProfile({
        ...user,
        token: accessToken,
        details: profileData,
        client: clientData,
      })
    );

    if (profileData && !profileData.linkedin_connected_account) {
      router.push("/connect");
    }
  }, [profileData, accessToken, clientData, user]);


  if (profileError) {
    sessionStorage.removeItem("jwtToken");
    router.push("/login");
  }

  if (!hostname || !clientData || clientFetching || clientError) {
    return <Loader />;
  }

  if (
    (profileFetching ||
      !accessToken ||
      !profileData ||
      !user ||
      !user.details ||
      !user.token ||
      !user.client) &&
    router.pathname !== "/login" &&
    router.pathname !== "/register" &&
    router.pathname !== "/google-callback" &&
    router.pathname !== "/app-sumo-signup"
  ) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        {console.log(clientData.favicon)}
        <link rel="shortcut icon" href={`${clientData.favicon}`} />
      </Head>
      <ThemeProvider
        theme={dynamicTheme(
          clientData.primary_color,
          clientData.primary_dark_color,
          clientData.theme_color
        )}
      >
        {children}
      </ThemeProvider>
    </>
  );
}
