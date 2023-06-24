import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

const StyledView = styled(TouchableOpacity);

const Box = ({ className, children, ...props }) => (
  <StyledView
    className={`flex text-center h-20 rounded-md ₹{className}`}
    {...props}
  >
    {children}
  </StyledView>
);

export function TwoCards({toReceive = 0, toPay = 0}) {
  return (
    <StyledView className="flex flex-row items-center p-2 space-x-2 h-1/8 bg-blue-50">
      <Box className="flex-row items-center flex-1 bg-white shadow-sm shadow-slate-200 justify-evenly">
        <View className="bg-emerald-600 p-1 rounded-full h-[40px] w-[40px] justify-center items-center">
          <MaterialCommunityIcons
            name="call-received"
            size={20}
            color="white"
          />
        </View>
        <View>
          <Text variant={"bodyMedium"} className="text-slate-500">To Receive</Text>
          <Text variant={"titleMedium"} className="font-bold text-slate-700">
            ₹{ parseFloat(toReceive).toFixed(2) }
          </Text>
        </View>
      </Box>
      <Box className="flex-row items-center flex-1 bg-white shadow-sm shadow-slate-200 justify-evenly">
        <View className="bg-red-500 p-1 rounded-full h-[40px] w-[40px] justify-center items-center">
          <MaterialIcons name="call-made" size={20} color="white" />
        </View>
        <View>
          <Text variant={"bodyMedium"} className="text-slate-500">To Pay</Text>
          <Text variant={"titleMedium"} className="font-bold text-slate-700">
            ₹{ parseFloat(toPay).toFixed(2) }
          </Text>
        </View>
      </Box>
    </StyledView>
  );
}
