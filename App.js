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
import * as Contacts from "expo-contacts";
import {getItem, setItem} from "./src/core/utils";

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

const loadContactsFromDevice = async () => {

  const { status: contactStatus } = await Contacts.requestPermissionsAsync();
  if (contactStatus === 'granted') {
    try {
      const localContacts = await getItem('contacts');
      if (!localContacts) {
        const { data: contactsArray } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });
        if (contactsArray.length > 0) {
          setItem('contacts', contactsArray).then((r) => null);
        }
      }
    } catch (error) {
      console.error('Error loading local contacts:', error);
    }
  } else if (contactStatus === 'undetermined') {
    // User did not make a decision, ask again or handle accordingly
    // For example, you could display a message asking the user to grant permissions
    console.log('User has not granted contacts permission.');
  } else {
    // Handle the case where permission was denied by the user
    console.log('User denied contacts permission.');
  }
};

export default function App() {
  const authHydrate = useAuth.use.hydrate();

  useEffect(function () {
    authHydrate();
    loadContactsFromDevice().then(r => console.log(r));
  }, []);

  const [isDarkTheme] = useState(false);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <RootNavigator theme={theme} />
        <Toast />
      </PaperProvider>
    </QueryClientProvider>
  );
}
