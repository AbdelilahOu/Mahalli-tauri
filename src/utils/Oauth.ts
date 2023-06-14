import { open } from "@tauri-apps/api/shell";

const openBrowserToConsent = (port: number) => {
  return open(
    "https://accounts.google.com/o/oauth2/auth?" +
      "response_type=token&" +
      "client_id=<CLIEN_ID_FROM_FIREBASE>&" +
      `redirect_uri=http%3A//localhost:${port}&` +
      "scope=email%20profile%20openid&" +
      "prompt=consent"
  );
};
