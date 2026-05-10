import axios, { type AxiosError } from 'axios';

const GAME_SLUG = 'mmo_sandbox';
const GUEST_SESSION_KEY = `${GAME_SLUG}-guest-session`;

interface PersistedRecord {
  state?: Record<string, unknown>;
}

interface LoginRequiredDetail {
  loginUrl: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseStorage = (key: string): PersistedRecord | null => {
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }

    const state = parsed.state;
    return isRecord(state) ? { state } : {};
  } catch {
    return null;
  }
};

const getFrontpageToken = (): string | null => {
  const auth = parseStorage('auth-storage');
  const state = auth?.state;
  if (!state) {
    return null;
  }

  const user = state.user;
  if (isRecord(user) && (user.is_guest === true || user.auth_type === 'guest')) {
    return null;
  }

  return typeof state.token === 'string' && state.token !== '' ? state.token : null;
};

const getGuestToken = (): string | null => {
  const guest = parseStorage(GUEST_SESSION_KEY);
  const token = guest?.state?.token;
  return typeof token === 'string' && token !== '' ? token : null;
};

const getBearerToken = (): string | null => getFrontpageToken() ?? getGuestToken();

const apiBaseUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api`;

export const webhatcheryApiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

webhatcheryApiClient.interceptors.request.use((config) => {
  const token = getBearerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

webhatcheryApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Record<string, unknown>>) => {
    if (error.response?.status === 401) {
      const loginUrl = error.response.data?.login_url;
      if (typeof loginUrl === 'string' && loginUrl !== '') {
        const rawAuth = window.localStorage.getItem('auth-storage');
        const auth = rawAuth ? JSON.parse(rawAuth) as PersistedRecord : {};
        const state = auth.state ?? {};
        window.localStorage.setItem(
          'auth-storage',
          JSON.stringify({
            ...auth,
            state: {
              ...state,
              loginUrl,
            },
          }),
        );

        window.dispatchEvent(
          new CustomEvent<LoginRequiredDetail>('webhatchery:login-required', {
            detail: { loginUrl },
          }),
        );
      }
    }

    return Promise.reject(error);
  },
);

export const webhatcheryGuestSessionKey = GUEST_SESSION_KEY;
