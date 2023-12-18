/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Text } from 'react-native-paper';

import { AuthNavigator } from './auth-navigator';
import { DrawerNavigator } from './drawer-navigator';
import { navigationRef } from './index';
import { NavigationContainer } from './navigation-container';
import { useAuth } from '../hooks';
import { useAuthCompanyStore } from '../hooks/zustand-store';
import { Balance, EditTransaction, Purchase } from '../screens';
import CustomerList from '../screens/customers-list';
import CustomerTransactionDetails from '../screens/dashboard/customers/details';
import ShareScreen from '../screens/dashboard/customers/pdf';
import AttachedImage from '../screens/dashboard/transactions/attached-image';
import GiveMoney from '../screens/give-payment';
import {
  AllParties,
  AllTransactions,
  CostCenter,
  DayBook,
  PartyStatements,
} from '../screens/reports';
import TakePayment from '../screens/take-payment';

const Stack = createNativeStackNavigator();
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const Root = () => {
  const status = useAuth.use.status();
  const auth = useAuth.use?.token();
  const setCompany = useAuthCompanyStore((state) => state.setCompany);
  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash().then((r) => null);
      }, 1000);
      setCompany(auth?.user?.company);
    }
  }, [auth?.user?.company, hideSplash, setCompany, status]);

  const headerBackgroundColor = { backgroundColor: '#eff6ff' };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'flip',
        headerShadowVisible: false, // applied here
      }}>
      <Stack.Group>
        {status === 'signOut' || status === 'idle' ? (
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
            <Stack.Screen options={{ headerShown: false }} name="App" component={DrawerNavigator} />

            {/* Report Screens */}
            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Day Book</Text>,
              }}
              name="DayBook"
              component={DayBook}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Party Statement</Text>,
              }}
              name="Party"
              component={PartyStatements}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">All Parties</Text>,
              }}
              name="AllParty"
              component={AllParties}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">All transactions</Text>,
              }}
              name="AllTransactions"
              component={AllTransactions}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Cost Centre Wise Profit</Text>,
              }}
              name="CostCenter"
              component={CostCenter}
            />

            <Stack.Screen
              options={({ route }) => ({
                headerTitle: () => (
                  <Text variant="titleMedium">
                    {route?.params?.name ? route?.params?.name : 'Details'}
                  </Text>
                ),
                headerStyle: headerBackgroundColor,
                headerShown: true,
              })}
              name="CustomerTransactionDetails"
              component={CustomerTransactionDetails}
            />

            <Stack.Screen
              options={({ route }) => ({
                headerTitle: () => (
                  <Text variant="titleMedium">
                    {route?.params?.name ? route?.params?.name : 'Details'}
                  </Text>
                ),
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
                headerTitle: () => <Text variant="titleMedium">Take Money</Text>,
              }}
              name="TakeMoney"
              component={TakePayment}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Give Money</Text>,
              }}
              name="GiveMoney"
              component={GiveMoney}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Edit</Text>,
              }}
              name="EditTransaction"
              component={EditTransaction}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Customers</Text>,
              }}
              name="ViewCustomers"
              component={CustomerList}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Balance</Text>,
              }}
              name="Balance"
              component={Balance}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Purchase</Text>,
              }}
              name="Purchase"
              component={Purchase}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">View Image</Text>,
              }}
              name="ViewImage"
              component={AttachedImage}
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
