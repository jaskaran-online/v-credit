import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { AuthNavigator } from './auth-navigator';
import { DrawerNavigator } from './drawer-navigator';
import { navigationRef } from './index';
import { NavigationContainer } from './navigation-container';
import { useAuthCompanyStore } from '../core/utils';
import { useAuth } from '../hooks';
import { Balance, EditTransaction, Purchase } from '../screens';
import CustomerList from '../screens/customers-list';
import CustomerTransactionDetails from '../screens/dashboard/customers/details';
import ShareScreen from '../screens/dashboard/customers/pdf';
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
  }, [hideSplash, status]);

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
              component={PartyStatements}
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
                headerTitle: 'All transactions',
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
                headerTitle: 'customers',
              }}
              name="ViewCustomers"
              component={CustomerList}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'Balance',
              }}
              name="Balance"
              component={Balance}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: 'Purchase',
              }}
              name="Purchase"
              component={Purchase}
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
