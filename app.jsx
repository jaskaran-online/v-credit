import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { COLORS } from './src/core';
import { useAuthStore } from './src/hooks/auth-store';
import { RootNavigator } from './src/navigations/root-navigator';
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
  const { initialize, loading, user, updateUserActivity, checkAutoLogout } = useAuthStore();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    initialize().then(() => null); // Initialize the auth state on app start
  }, [initialize]);

  useEffect(() => {
    if (!loading) {
      hideSplash().then(() => null);
      updateUserActivity();
      checkAutoLogout();
    }
  }, [loading, hideSplash, updateUserActivity, checkAutoLogout]);

  const [isDarkTheme] = useState(false);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  if (loading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size={24} color={COLORS.primary} />
      </View>
    );
  }

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
  activityIndicator: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
});
