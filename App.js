import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RootNavigator} from "./src/navigations/root-navigator";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {COLORS} from "./src/core";

// Create a client
const queryClient = new QueryClient()

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: COLORS.primary,
        secondary: COLORS.secondary,
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