import { View } from "react-native";
import { Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { withTheme } from "react-native-paper";
import { TabNavigator } from "../Components/TabNavigator";
import { TwoCards } from "../Components/TwoCards";

function Index({navigation}) {
  return (
    <View className="flex-1 bg-white">
      <StatusBar animated={true} />
      <TwoCards />
      <View className={"flex-1"}>
        <TabNavigator/>
      </View>
      <FloatingButtons navigation={navigation}/>
    </View>
  );
}

export default withTheme(Index);

export function FloatingButtons({navigation}) {
  return (
    <View
      className={
        "absolute bottom-10 flex w-full flex-row justify-evenly space-x-2 px-4 "
      }
    >
      <View className={"flex-1"}>
        <Button
          mode={"contained"}
          onPress={() => navigation.navigate("TakeMoney")}
          className={"bg-sky-500 shadow shadow-slate-300"}
        >
          Take Payment
        </Button>
      </View>
      <View className={"flex-1"}>
        <Button
          mode={"contained"}
          onPress={() => navigation.navigate("GiveMoney")}
          className={"bg-amber-500 shadow shadow-slate-300"}
        >
          Give Create
        </Button>
      </View>
    </View>
  );
}
