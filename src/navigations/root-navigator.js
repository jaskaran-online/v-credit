import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useAuth } from '../hooks';
import { navigationRef } from './index';

import {
  AllParties,
  AllTransactions,
  CostCenter,
  DayBook,
  PartyStatement,
} from '../screens/Reports';
import { AuthNavigator } from './auth-navigator';
import { DrawerNavigator } from './drawer-navigator';
import { NavigationContainer } from './navigation-container';

import CustomerTransactionDetails from '../screens/HomePage/Customers/details';
import ShareScreen from '../screens/HomePage/Customers/pdf';

import { EditTransaction } from '../screens';
import GiveMoney from '../screens/HomePage/GiveMoney';
import TakePayment from '../screens/HomePage/TakePayment';
import CustomerList from '../screens/HomePage/CustomerList';
import { useAuthCompanyStore } from '../core/utils';

const Stack = createNativeStackNavigator();

export const Root = () => {
  const status = useAuth.use.status();
  const auth = useAuth.use?.token();
  const setCompany = useAuthCompanyStore((state) => state.setCompany);
  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      hideSplash();
      setCompany(auth?.user?.company);
    }
  }, [hideSplash, status]);

  const headerBackgroundColor = { backgroundColor: '#eff6ff' };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'flip',
        headerShadowVisible: false, // applied here
      }}
    >
      <Stack.Group>
        {status === 'signOut' ? (
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
                headerShown: true,
                headerTitle: 'Day Book',
              }}
              name="DayBook"
              component={DayBook}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'Party Statement',
              }}
              name="Party"
              component={PartyStatement}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'All Parties',
              }}
              name="AllParty"
              component={AllParties}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'All Transactions',
              }}
              name="AllTransactions"
              component={AllTransactions}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'Cost Centre Wise Profit',
              }}
              name="CostCenter"
              component={CostCenter}
            />

            <Stack.Screen
              options={({ route }) => ({
                title: route?.params?.name ? route?.params?.name : 'Details',
                headerStyle: headerBackgroundColor,
                headerShown: true,
              })}
              name="CustomerTransactionDetails"
              component={CustomerTransactionDetails}
            />

            <Stack.Screen
              options={({ route }) => ({
                title: route?.params?.name ? route?.params?.name : 'Details',
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
                headerTitle: 'Take Money',
              }}
              name="TakeMoney"
              component={TakePayment}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'Give Money',
              }}
              name="GiveMoney"
              component={GiveMoney}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'Edit',
              }}
              name="EditTransaction"
              component={EditTransaction}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'Customers',
              }}
              name="ViewCustomers"
              component={CustomerList}
            />
          </Stack.Group>
        )}
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const RootNavigator = ({ theme }) => (
  <NavigationContainer theme={theme} navigationRef={navigationRef}>
    <Root />
  </NavigationContainer>
);
