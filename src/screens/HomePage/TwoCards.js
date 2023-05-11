import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { StyledView } from ".";

const StyledView = styled(TouchableOpacity);

const Box = ({ className, children, ...props }) => (
  <StyledView
    className={`flex text-center h-20 rounded ${className}`}
    {...props}
  >
    {children}
  </StyledView>
);

export function TwoCards({}) {
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
