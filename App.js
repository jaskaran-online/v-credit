import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RootNavigator} from "./src/navigations/root-navigator";
import {MD3LightTheme as LightTheme, MD3DarkTheme as DarkTheme, Provider as PaperProvider} from 'react-native-paper';
import {
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {useState} from "react";

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
            </PaperProvider>
        </QueryClientProvider>
    );
}