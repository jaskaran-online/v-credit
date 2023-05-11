import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { COLORS } from "../../core";

const Tab = createMaterialTopTabNavigator();

export function TabNavigator({ Customers, Transactions }) {
  const screenOptions = {
    tabBarLabelStyle: {
      fontSize: 13,
      fontWeight: "600",
    },
    tabBarStyle: {
      backgroundColor: "white",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 5.0,
      elevation: 1,
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
    <NavigationContainer independent={true}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Customers" component={Customers} />
        <Tab.Screen name="Credit/Udhaar" component={Transactions} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
