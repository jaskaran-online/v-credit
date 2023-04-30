import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient()

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <View className="flex-1 items-center justify-center bg-white">
          <Text>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
  );
}