import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";

// import { useAuth } from './../core';

import { AuthNavigator } from "./auth-navigator";
import { NavigationContainer } from "./navigation-container";
import { DrawerNavigator } from "./drawer-navigator";
import {
  AllParties,
  AllReports,
  AllTransactions,
  DayBook,
  PartyStatement,
} from "../screens/Reports";

const Stack = createNativeStackNavigator();

export const Root = () => {
  // const status = useAuth.use.status();
  const status = "login";

  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== "idle") {
      hideSplash();
    }
  }, [hideSplash, status]);

  const headerBackgroundColor = { backgroundColor: "#eff6ff" };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        animation: "flip",
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
              options={{ headerShown: false }}
              name="App"
              component={DrawerNavigator}
            />

            {/* Report Screens */}
            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerTitle: "Day Book",
              }}
              name="DayBook"
              component={DayBook}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerTitle: "Party Statement",
              }}
              name="Party"
              component={PartyStatement}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerTitle: "All Parties",
              }}
              name="AllParty"
              component={AllParties}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerTitle: "All Transactions",
              }}
              name="AllTransactions"
              component={AllTransactions}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerTitle: "Cost Centre Wise Profit",
              }}
              name="CostCenter"
              component={AllReports}
            />
          </Stack.Group>
        )}
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const RootNavigator = ({ theme }) => (
  <NavigationContainer theme={theme}>
    <Root />
  </NavigationContainer>
);
