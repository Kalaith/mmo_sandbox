import type { AxiosResponse } from 'axios';
import { webhatcheryApiClient } from './webhatcheryApiClient';

export interface WebHatcheryUser {
  id: string;
  email?: string | null;
  username?: string | null;
  display_name?: string | null;
  role?: string;
  roles: string[];
  is_guest: boolean;
  auth_type: string;
}

export interface WebHatcheryGuestSession {
  token: string;
  user: WebHatcheryUser;
}

export interface WebHatcherySave {
  id: number;
  slot: string;
  state: Record<string, unknown>;
  metadata: Record<string, unknown>;
  version: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WebHatcheryGameState {
  user: WebHatcheryUser;
  save: WebHatcherySave;
}

interface WebHatcheryApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LoginInfo {
  login_url: string;
}

interface MergeGuestResponse {
  merged: boolean;
  game: WebHatcheryGameState;
}

const unwrap = <T>(response: AxiosResponse<WebHatcheryApiResponse<T>>): T => {
  const body = response.data;
  if (!body.success || body.data === undefined) {
    throw new Error(body.message ?? body.error ?? 'WebHatchery API request failed.');
  }

  return body.data;
};

export const webhatcheryGameApi = {
  async getLoginInfo(): Promise<LoginInfo> {
    return unwrap(await webhatcheryApiClient.get<WebHatcheryApiResponse<LoginInfo>>('/auth/login-info'));
  },

  async createGuestSession(): Promise<WebHatcheryGuestSession> {
    return unwrap(
      await webhatcheryApiClient.post<WebHatcheryApiResponse<WebHatcheryGuestSession>>('/auth/guest-session'),
    );
  },

  async getCurrentGame(): Promise<WebHatcheryGameState> {
    return unwrap(await webhatcheryApiClient.get<WebHatcheryApiResponse<WebHatcheryGameState>>('/game'));
  },

  async startGame(
    state?: Record<string, unknown>,
    metadata: Record<string, unknown> = {},
  ): Promise<WebHatcheryGameState> {
    return unwrap(
      await webhatcheryApiClient.post<WebHatcheryApiResponse<WebHatcheryGameState>>('/game/start', {
        state,
        metadata,
      }),
    );
  },

  async saveGame(
    state: Record<string, unknown>,
    metadata: Record<string, unknown> = {},
  ): Promise<WebHatcheryGameState> {
    return unwrap(
      await webhatcheryApiClient.post<WebHatcheryApiResponse<WebHatcheryGameState>>('/game/save', {
        state,
        metadata,
      }),
    );
  },

  async getContent<T>(resource: string, params: Record<string, string | number> = {}): Promise<T> {
    return unwrap(
      await webhatcheryApiClient.get<WebHatcheryApiResponse<T>>('/game/content', {
        params: {
          resource,
          ...params,
        },
      }),
    );
  },

  async applyIntent(intent: string, payload: Record<string, unknown> = {}): Promise<WebHatcheryGameState> {
    return unwrap(
      await webhatcheryApiClient.post<WebHatcheryApiResponse<WebHatcheryGameState>>('/game/intent', {
        intent,
        payload,
      }),
    );
  },

  async linkGuestAccount(guestToken: string): Promise<MergeGuestResponse> {
    return unwrap(
      await webhatcheryApiClient.post<WebHatcheryApiResponse<MergeGuestResponse>>('/auth/link-guest', {
        guest_token: guestToken,
      }),
    );
  },
};
