import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MD3DarkTheme as DarkTheme, MD3LightTheme as LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { RootNavigator } from "./src/navigations/root-navigator";
import Toast from 'react-native-toast-message';

// Create a client
const queryClient = new QueryClient()

const lightTheme = {
    ...LightTheme,
    ...NavigationDefaultTheme,
    colors: {
        ...LightTheme.colors,
        ...NavigationDefaultTheme.colors
    },
};

const darkTheme = {
    ...DarkTheme,
    ...NavigationDarkTheme,
    colors: {
        ...DarkTheme.colors,
        ...NavigationDarkTheme.colors
    },
};
export default function App() {

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const theme = isDarkTheme ? darkTheme : lightTheme;

    return (
        <QueryClientProvider client={queryClient}>
            <PaperProvider theme={theme}>
                <RootNavigator theme={theme}/>
                <Toast />
            </PaperProvider>
        </QueryClientProvider>
    );
}