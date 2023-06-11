import { View } from "react-native";
import { Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { withTheme } from "react-native-paper";
import { TabNavigator } from "../Components/TabNavigator";
import { TwoCards } from "../Components/TwoCards";
import {useCustomerTransactionData, useTotalTransactionData} from "../../apis/useApi";
import {useCallback, useEffect} from "react";
import {useAuth} from "../../hooks";
import { focusManager } from '@tanstack/react-query'
import {useFocusEffect} from "@react-navigation/native";

function Index({navigation}) {
    useFocusEffect(
        useCallback(() => {
            loadCustomerData();
            return () => {
                // Useful for cleanup functions
                console.log("Screen was unfocused");
            };
        }, [])
    );

    const auth = useAuth.use?.token();
    const {mutate, data, isLoading} = useTotalTransactionData();
    function loadCustomerData(){
        const formData = new FormData();
        formData.append('company_id', auth.user.company_id);
        formData.append('cost_center_id', auth.user.cost_center_id);
        formData.append('user_id', auth.user.id);
        mutate(formData);
    }

    useEffect(() => {
        loadCustomerData();
    }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar animated={true} />
      <TwoCards toPay={data?.data?.toPay} toReceive={data?.data?.toReceive}/>
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
