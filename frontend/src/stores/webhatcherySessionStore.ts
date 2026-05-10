import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  webhatcheryGameApi,
  type WebHatcheryGameState,
  type WebHatcheryUser,
} from '../api/webhatcheryGameApi';
import { webhatcheryGuestSessionKey } from '../api/webhatcheryApiClient';

interface WebHatcherySessionState {
  token: string | null;
  user: WebHatcheryUser | null;
  loginUrl: string | null;
  gameState: WebHatcheryGameState | null;
  isLoading: boolean;
  error: string | null;
  continueAsGuest: () => Promise<WebHatcheryGameState>;
  loadGame: () => Promise<WebHatcheryGameState>;
  saveGame: (
    state: Record<string, unknown>,
    metadata?: Record<string, unknown>,
  ) => Promise<WebHatcheryGameState>;
  mergeGuestSession: (guestToken: string) => Promise<WebHatcheryGameState>;
  clearGuestSession: () => void;
  setLoginUrl: (loginUrl: string | null) => void;
}

export const useWebHatcherySessionStore = create<WebHatcherySessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loginUrl: null,
      gameState: null,
      isLoading: false,
      error: null,

      continueAsGuest: async () => {
        set({ isLoading: true, error: null });
        try {
          const session = await webhatcheryGameApi.createGuestSession();
          set({ token: session.token, user: session.user });
          const gameState = await webhatcheryGameApi.getCurrentGame();
          set({ gameState, isLoading: false });
          return gameState;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to create guest session.';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      loadGame: async () => {
        set({ isLoading: true, error: null });
        try {
          const gameState = await webhatcheryGameApi.getCurrentGame();
          set({ gameState, user: gameState.user, isLoading: false });
          return gameState;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to load game state.';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      saveGame: async (state, metadata = {}) => {
        set({ isLoading: true, error: null });
        try {
          const gameState = await webhatcheryGameApi.saveGame(state, metadata);
          set({ gameState, user: gameState.user, isLoading: false });
          return gameState;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to save game state.';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      mergeGuestSession: async (guestToken) => {
        set({ isLoading: true, error: null });
        try {
          const result = await webhatcheryGameApi.linkGuestAccount(guestToken);
          set({ token: null, user: result.game.user, gameState: result.game, isLoading: false });
          return result.game;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to merge guest progress.';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      clearGuestSession: () => {
        set({ token: null, user: null, gameState: null });
      },

      setLoginUrl: (loginUrl) => {
        set({ loginUrl });
      },
    }),
    {
      name: webhatcheryGuestSessionKey,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        loginUrl: state.loginUrl,
        gameState: state.gameState,
      }),
    },
  ),
);
