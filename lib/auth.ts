const AUTH_COOKIE = "devhire_session";
const AUTH_STORAGE = "devhire_auth";

export function loginClient(email: string) {
  const userEmail = email.trim().toLowerCase();
  localStorage.setItem(AUTH_STORAGE, JSON.stringify({ userEmail }));
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=604800; samesite=lax`;
}

export function logoutClient() {
  localStorage.removeItem(AUTH_STORAGE);
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function isAuthenticatedClient() {
  return (
    document.cookie.includes(`${AUTH_COOKIE}=1`) &&
    Boolean(localStorage.getItem(AUTH_STORAGE))
  );
}

export function getLoggedInEmail() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { userEmail?: string };
    return parsed.userEmail ?? null;
  } catch {
    return null;
  }
}

export const authCookieName = AUTH_COOKIE;
