import { open } from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import callbackTemplate from "./callBackTemplate";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import router from "@/router";
import { useUserStore } from "@/stores/userStore";

const openBrowserToConsent = (port: string) => {
  return open(
    "https://accounts.google.com/o/oauth2/auth?" +
      "response_type=token&" +
      "client_id=852278279567-tunbs9gqq6a3403rrpnvvv564drseu43.apps.googleusercontent.com&" +
      `redirect_uri=http%3A//localhost:${port}&` +
      "scope=email%20profile%20openid&" +
      "prompt=consent"
  );
};

export const openGoogleSignIn = (port: string) => {
  return new Promise((resolve, reject) => {
    openBrowserToConsent(port).then(resolve).catch(reject);
  });
};

export const googleSignIn = async (payload: string) => {
  const url = new URL(payload);
  // Get `access_token` from redirect_uri param
  const access_token = new URLSearchParams(url.hash.substring(1)).get(
    "access_token"
  );

  if (!access_token) {
    console.log("theres no access token");
    return;
  }

  const auth = getAuth();

  const credential = GoogleAuthProvider.credential(access_token);
  //   this doesnt work
  signInWithCredential(auth, credential)
    .then((user) => {
      useUserStore().setUser(user);
      router.push("/Home");
    })
    .catch((error) => {
      console.log(error);
      return;
    });
};

export const signOut = () => {
  const auth = getAuth();
  return auth.signOut();
};

export const login = () => {
  // Wait for callback from tauri oauth plugin
  listen("oauth://url", (data) => {
    googleSignIn(data.payload as string);
  });

  // Start tauri oauth plugin. When receive first request
  // When it starts, will return the server port
  // it will kill the server
  invoke("plugin:oauth|start", {
    config: {
      // Optional config, but use here to more friendly callback page
      response: callbackTemplate,
    },
  }).then((port: any) => {
    openGoogleSignIn(port as string);
  });
};

export const logout = () => {
  return signOut();
};
