/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';

import { AuthNavigator } from './auth-navigator';
import { DrawerNavigator } from './drawer-navigator';
import { navigationRef } from './index';
import { NavigationContainer } from './navigation-container';
import { useAuthStore } from '../hooks/auth-store';
import { useAuthCompanyStore } from '../hooks/zustand-store';
import { Balance, EditTransaction, Purchase } from '../screens';
import CustomerList from '../screens/customers-list/customerList';
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
import SingleUserGiveMoney from '../screens/single-user/give-money';
import SingleUserReceiveMoney from '../screens/single-user/receive-money';
import TakePayment from '../screens/take-payment';

const Stack = createNativeStackNavigator();

function Privacy() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://mycreditbook.com/privacy-policy.html' }}
        originWhitelist={['*']}
        scalesPageToFit={true} // For iOS
        allowsFullscreenVideo={true}
        allowsBackForwardNavigationGestures={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

export const Root = () => {
  const { user: auth } = useAuthStore();
  const setCompany = useAuthCompanyStore((state) => state.setCompany);

  useEffect(() => {
    if (auth) {
      setCompany(auth?.user?.company);
    }
  }, [auth, setCompany]);

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
        {!auth ? (
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
                headerTitle: () => <Text variant="titleMedium">Give Money</Text>,
              }}
              name="SingleUserGiveMoney"
              component={SingleUserGiveMoney}
            />

            <Stack.Screen
              options={{
                headerStyle: headerBackgroundColor,
                headerShown: true,
                headerTitle: () => <Text variant="titleMedium">Give Money</Text>,
              }}
              name="SingleUserReceiveMoney"
              component={SingleUserReceiveMoney}
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
        <Stack.Screen
          name="PrivacyPolicy"
          component={Privacy}
          options={{
            headerStyle: headerBackgroundColor,
            headerShown: true,
            headerTitle: () => <Text variant="titleMedium">Privacy Policy</Text>,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const RootNavigator = ({ theme }) => {
  return (
    <NavigationContainer theme={theme} navigationRef={navigationRef}>
      <Root />
    </NavigationContainer>
  );
};
