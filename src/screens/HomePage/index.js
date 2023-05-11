import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";

import Customers from "./../HomePage/Customers";
import Transactions from "./../HomePage/Transactions";

import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { COLORS } from "../../core";

import { withTheme } from "react-native-paper";

const StyledView = styled(TouchableOpacity);

const Box = ({ className, children, ...props }) => (
  <StyledView
    className={`flex text-center h-20 rounded ${className}`}
    {...props}
  >
    {children}
  </StyledView>
);

const Tab = createMaterialTopTabNavigator();

function Index() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar animated={true} />
      <TwoCards />
      <View className={"flex-1"}>
        <TabNavigator Customers={Customers} Transactions={Transactions} />
      </View>
      <View
        className={
          "absolute bottom-10 flex w-full flex-row justify-evenly space-x-2 px-4 "
        }
      >
        <View className={"flex-1"}>
          <Button
            mode={"contained"}
            onPress={() => console.log("Take Payment")}
            className={"bg-sky-500 shadow shadow-slate-300"}
          >
            Take Payment
          </Button>
        </View>
        <View className={"flex-1"}>
          <Button
            mode={"contained"}
            onPress={() => console.log("Give Create")}
            className={"bg-amber-500 shadow shadow-slate-300"}
          >
            Give Create
          </Button>
        </View>
      </View>
    </View>
  );
}

function TabNavigator({ Customers, Transactions }) {
  const screenOptions = {
    tabBarLabelStyle: {
      fontSize: 13,
      fontWeight: "600",
    },
    tabBarStyle: {
      backgroundColor: "white",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.18,
      shadowRadius: 10.0,
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
export default withTheme(Index);

function TwoCards({}) {
  return (
    <StyledView className="flex flex-row items-center p-2 space-x-2 h-1/8 bg-blue-50">
      <Box className="flex-row items-center flex-1 bg-white shadow-md justify-evenly">
        <View className="bg-emerald-600 p-2 rounded-full h-[45px] w-[45px] justify-center items-center">
          <MaterialCommunityIcons
            name="call-received"
            size={24}
            color="white"
          />
        </View>
        <View>
          <Text variant={"bodyMedium"}>To Receive</Text>
          <Text variant={"titleLarge"} className="font-bold text-slate-700">
            $100
          </Text>
        </View>
      </Box>
      <Box className="flex-row items-center flex-1 bg-white shadow-md justify-evenly">
        <View className="bg-red-500 p-2 rounded-full h-[45px] w-[45px] justify-center items-center">
          <MaterialIcons name="call-made" size={24} color="white" />
        </View>
        <View>
          <Text variant={"bodyMedium"}>To Pay</Text>
          <Text variant={"titleLarge"} className="font-bold text-slate-700">
            $140
          </Text>
        </View>
      </Box>
    </StyledView>
  );
}
