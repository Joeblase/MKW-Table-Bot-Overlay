export const DEFAULT_API_URL = "https://mkw-table-bot-api.jprq.site";

const API_URL_KEY = "apiUrl";

// localStorage can throw (blocked storage, private mode), so every access is guarded.
export function getApiUrl() {
  try {
    return localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
  } catch {
    return DEFAULT_API_URL;
  }
}

export function setApiUrl(url) {
  try {
    if (!url || url === DEFAULT_API_URL) {
      localStorage.removeItem(API_URL_KEY);
    } else {
      localStorage.setItem(API_URL_KEY, url);
    }
  } catch (err) {
    console.error("Could not save API URL", err);
  }
}
