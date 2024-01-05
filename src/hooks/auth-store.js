import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      lastActivity: Date.now(), // Track the user's last activity

      // Initialize the state by checking AsyncStorage for a logged-in user
      initialize: async () => {
        try {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            set({ user: JSON.parse(storedUser) });
          }
        } catch (error) {
          console.error('Error initializing auth state:', error);
        } finally {
          set({ loading: false });
        }
      },

      // Login function to set the authenticated user and reset last activity time
      login: async (userData) => {
        try {
          set({ user: userData, lastActivity: Date.now() });
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error logging in:', error);
        }
      },

      // Logout function to clear the authenticated user
      logout: async () => {
        try {
          set({ user: null });
          await AsyncStorage.removeItem('user');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      },

      // Check if the user needs to be auto-logged out after 2 days of inactivity
      checkAutoLogout: () => {
        const currentTime = Date.now();
        if (currentTime - this.lastActivity >= TWO_DAYS_IN_MS && this.user) {
          this.logout();
        }
      },

      // Update the last activity time whenever the user performs an action
      updateUserActivity: () => {
        set({ lastActivity: Date.now() });
      },
    }),
    {
      name: 'app-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Setup a timer to check for auto-logout every minute
setInterval(useAuthStore.getState().checkAutoLogout, 60000);
