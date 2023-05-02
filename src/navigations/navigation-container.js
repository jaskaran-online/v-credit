import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const NavigationContainer = ({ children }) => {
    return (
        <SafeAreaProvider>
            <RNNavigationContainer>{children}</RNNavigationContainer>
        </SafeAreaProvider>
    );
};