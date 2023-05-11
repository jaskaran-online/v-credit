import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { Button } from "react-native-paper";

import Customers from "./../HomePage/Customers";
import Transactions from "./../HomePage/Transactions";

import { StatusBar } from "expo-status-bar";

import { withTheme } from "react-native-paper";
import { TabNavigator } from "./TabNavigator";
import { TwoCards } from "./TwoCards";

export const Tab = createMaterialTopTabNavigator();

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

export default withTheme(Index);
