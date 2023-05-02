import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RootNavigator} from "./src/navigations/root-navigator";

// Create a client
const queryClient = new QueryClient()

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <RootNavigator />
      </QueryClientProvider>
  );
}