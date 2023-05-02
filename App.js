import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RootNavigator} from "./src/navigations/root-navigator";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Create a client
const queryClient = new QueryClient()

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};
export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
              <RootNavigator />
          </PaperProvider>
      </QueryClientProvider>
  );
}