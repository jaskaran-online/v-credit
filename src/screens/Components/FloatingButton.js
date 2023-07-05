import {View} from "react-native";
import {Button} from "react-native-paper";

export default function FloatingButtons({navigation, customer}) {
    return (
        <View className={"absolute bottom-10 flex w-full flex-row justify-evenly space-x-2 px-4"}>
            <View className={"flex-1"}>
                <Button
                    mode={"contained"}
                    onPress={() => navigation.navigate("TakeMoney", {customer})}
                    className={"bg-sky-500 shadow shadow-slate-300"}
                >
                    Take Payment
                </Button>
            </View>
            <View className={"flex-1"}>
                <Button
                    mode={"contained"}
                    onPress={() => navigation.navigate("GiveMoney", {customer})}
                    className={"bg-amber-500 shadow shadow-slate-300"}
                >
                    Give Credit
                </Button>
            </View>
        </View>
    );
}
