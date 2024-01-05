import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { useAuth } from './src/hooks';
import { useContactsStore } from './src/hooks/zustand-store';
import { RootNavigator } from './src/navigations/root-navigator';
import { loadContacts } from './src/service/contactService';
import { useVerifyUserAuthApi } from './src/apis/use-api';
import { useAuthStore } from './src/hooks/auth-store';
import * as SplashScreen from 'expo-splash-screen';
// Create a client
const queryClient = new QueryClient();

const lightTheme = {
  ...LightTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...LightTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
};

const darkTheme = {
  ...DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

export default function App() {
  const { initialize, loading, updateUserActivity, checkAutoLogout } = useAuthStore();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    initialize(); // Initialize the auth state on app start
  }, []);

  useEffect(() => {
    if (!loading) {
      hideSplash();
      updateUserActivity();
      checkAutoLogout();
    }
  }, [loading, hideSplash, updateUserActivity, checkAutoLogout]);

  const [isDarkTheme] = useState(false);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <StatusBar translucent animated />
            <RootNavigator theme={theme} />
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
