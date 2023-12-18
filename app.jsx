import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
  const { contactsList: contacts, setContacts } = useContactsStore();
  const authHydrate = useAuth.use.hydrate();

  // Hydrate auth
  useEffect(
    function () {
      authHydrate();
    },
    [authHydrate]
  );

  // Load contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await loadContacts();
        setContacts(contacts);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      }
    };

    fetchContacts();
  }, []);

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
