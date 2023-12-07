import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useAuth } from './src/hooks';
import { RootNavigator } from './src/navigations/root-navigator';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
  const authHydrate = useAuth.use.hydrate();

  useEffect(function () {
    authHydrate();
  }, []);

  const [isDarkTheme] = useState(false);
  const theme = isDarkTheme ? darkTheme : lightTheme;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <RootNavigator theme={theme} />
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
