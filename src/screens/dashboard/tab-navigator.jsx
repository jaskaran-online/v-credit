import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Customers from './customers';
import Transactions from './transactions/transactions';
import { COLORS } from '../../core';

const Tab = createMaterialTopTabNavigator();

export function TabNavigator() {
  const screenOptions = {
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '400',
    },
    tabBarStyle: {
      backgroundColor: 'white',
      shadowRadius: 5.0,
      elevation: 5,
      shadowColor: 'black',
    },
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.darkgray,
    tabBarAllowFontScaling: false,
    tabBarIndicatorStyle: {
      height: 4,
      backgroundColor: COLORS.primary,
    },
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Customers" component={Customers} />
      <Tab.Screen
        name="Transactions"
        options={{
          title: 'Credit / Udhaar',
        }}
        component={Transactions}
      />
    </Tab.Navigator>
  );
}
