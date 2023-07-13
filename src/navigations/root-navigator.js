import {createNativeStackNavigator} from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import React, {useEffect} from "react";
import {navigationRef} from "./index"
import {useAuth} from '../hooks';

import {AuthNavigator} from "./auth-navigator";
import {NavigationContainer} from "./navigation-container";
import {DrawerNavigator} from "./drawer-navigator";
import {
    AllParties,
    AllTransactions,
    DayBook,
    PartyStatement,
    CostCenter
} from "../screens/Reports";

import CustomerTransactionDetails from "../screens/HomePage/Customers/details";
import ShareScreen from "../screens/HomePage/Customers/pdf";

import TakePayment from "../screens/HomePage/TakePayment";
import GiveMoney from "../screens/HomePage/GiveMoney";
import {View} from "react-native";
import {Button} from "react-native-paper";
import {ErrorBoundary} from "react-error-boundary";
import {EditTransaction} from "../screens";

const Stack = createNativeStackNavigator();

export const Root = () => {

    const status = useAuth.use.status();

    const hideSplash = React.useCallback(async () => {
        await SplashScreen.hideAsync();
    }, []);

    useEffect(() => {
        if (status !== "idle") {
            hideSplash();
        }
    }, [hideSplash, status]);

    const headerBackgroundColor = {backgroundColor: "#eff6ff"};

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                animation: "flip",
                headerShadowVisible: false, // applied here
            }}
        >
            <Stack.Group>
                {status === "signOut" ? (
                    <Stack.Screen
                        screenOptions={{
                            headerShown: false,
                        }}
                        name="Auth"
                        component={AuthNavigator}
                    />
                ) : (
                    <Stack.Group>
                        {/* App Drawer Route Navigator */}
                        <Stack.Screen
                            options={{headerShown: false}}
                            name="App"
                            component={DrawerNavigator}
                        />

                        {/* Report Screens */}
                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "Day Book",
                            }}
                            name="DayBook"
                            component={DayBook}
                        />

                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "Party Statement",
                            }}
                            name="Party"
                            component={PartyStatement}
                        />

                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "All Parties",
                            }}
                            name="AllParty"
                            component={AllParties}
                        />

                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "All Transactions",
                            }}
                            name="AllTransactions"
                            component={AllTransactions}
                        />

                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "Cost Centre Wise Profit",
                            }}
                            name="CostCenter"
                            component={CostCenter}
                        />

                        <Stack.Screen
                            options={({route}) => ({
                                title: (route?.params?.name) ? route?.params?.name : 'Details',
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                            })}
                            name="CustomerTransactionDetails"
                            component={CustomerTransactionDetails}
                        />


                        <Stack.Screen
                            options={({route}) => ({
                                title: (route?.params?.name) ? route?.params?.name : 'Details',
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                            })}
                            name="DetailsPdf"
                            component={ShareScreen}
                        />

                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "Take Money",
                            }}
                            name="TakeMoney"
                            component={TakePayment}
                        />

                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "Give Money",
                            }}
                            name="GiveMoney"
                            component={GiveMoney}
                        />

                        <Stack.Screen
                            options={{
                                headerStyle: headerBackgroundColor,
                                headerShown: true,
                                headerTitle: "Edit",
                            }}
                            name="EditTransaction"
                            component={EditTransaction}
                        />
                    </Stack.Group>
                )}
            </Stack.Group>
        </Stack.Navigator>
    );
};


function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <View>
            <Text>An error occurred: {error.message}</Text>
            <Button title="Try Again" onPress={resetErrorBoundary}/>
        </View>
    );
}

export const RootNavigator = ({theme}) => (
    <NavigationContainer theme={theme} navigationRef={navigationRef}>
        {/*<ErrorBoundary FallbackComponent={ErrorFallback}>*/}
            <Root/>
        {/*</ErrorBoundary>*/}
    </NavigationContainer>
);