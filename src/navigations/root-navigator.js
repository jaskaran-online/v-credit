import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect} from 'react';

// import { useAuth } from './../core';

import {AuthNavigator} from './auth-navigator';
import {NavigationContainer} from './navigation-container';
import {DrawerNavigator} from './drawer-navigator';
import {AllParties, AllReports, AllTransactions, DayBook, PartyStatement} from "../screens/Reports";

const Stack = createNativeStackNavigator();

export const Root = () => {
    // const status = useAuth.use.status();
    const status = true;
    const hideSplash = React.useCallback(async () => {
        await SplashScreen.hideAsync();
    }, []);
    useEffect(() => {
        if (status !== 'idle') {
            hideSplash();
        }
    }, [hideSplash, status]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                gestureEnabled: false,
                animation: 'none',
            }}
        >
            <Stack.Group>
                {status === 'signOut' ? (
                    <Stack.Screen name="Auth" component={AuthNavigator}/>
                ) : (
                    <Stack.Group>

                        <Stack.Screen options={{headerShown: false}} name="App" component={DrawerNavigator}/>

                        <Stack.Screen options={{headerStyle: {backgroundColor: '#eff6ff'}, headerTitle: "Day Book"}}
                                      name="DayBook" component={AllParties}/>

                        <Stack.Screen
                            options={{headerStyle: {backgroundColor: '#eff6ff'}, headerTitle: "Party Statement"}}
                            name="Party" component={DayBook}/>

                        <Stack.Screen options={{headerStyle: {backgroundColor: '#eff6ff'}, headerTitle: "All Parties"}}
                                      name="AllParty" component={AllTransactions}/>

                        <Stack.Screen
                            options={{headerStyle: {backgroundColor: '#eff6ff'}, headerTitle: "All Transactions"}}
                            name="AllTransactions" component={PartyStatement}/>

                        <Stack.Screen options={{
                            headerStyle: {backgroundColor: '#eff6ff'},
                            headerTitle: "Cost Centre Wise Profit"
                        }} name="CostCenter" component={AllReports}/>

                    </Stack.Group>
                )}
            </Stack.Group>
        </Stack.Navigator>
    );
};

export const RootNavigator = ({theme}) => (
    <NavigationContainer theme={theme}>
        <Root/>
    </NavigationContainer>
);