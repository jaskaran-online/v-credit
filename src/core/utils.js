import {Linking, TouchableOpacity, View} from 'react-native';
// import * as SecureStore from 'expo-secure-store';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
import navigation from "../navigations";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {Text} from "react-native-paper";
const SecureStore = createSecureStore();

export async function getItem(key) {
  const value = await SecureStore.getItem(key);
  return value ? JSON.parse(value) : null;
}

export async function setItem(key, value) {
  await SecureStore.setItem(key, JSON.stringify(value));
}

export async function removeItem(key) {
  await SecureStore.removeItem(key);
}

export function openLinkInBrowser(url) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

export const createSelectors = (_store) => {

  let store = _store;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use)[k] = () => store((s) => s[k]);
  }

  return store;
};

export const isToday = (dateString) => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  return (
      currentDate.getFullYear() === inputDate.getFullYear() &&
      currentDate.getMonth() === inputDate.getMonth() &&
      currentDate.getDate() === inputDate.getDate()
  );
};

export const renderItem = ({ item: transaction, index, userId }) => {
  return (
      <TouchableOpacity
          className={
            "flex flex-row justify-between items-center px-1.5 py-2 border-b-2 border-slate-200"
          }
          key={index}
          onPress={
            (isToday(transaction?.created_at) && transaction?.user_id === userId)
                ? () => navigation.navigate('EditTransaction', { transaction: transaction })
                : () => null
          }
      >
        <View className="flex flex-row items-center w-1/4">
          <View className="mr-1">
            {transaction?.transaction_type_id === 2 ? (
                <MaterialCommunityIcons
                    name="call-received"
                    size={14}
                    color="green"
                />
            ) : (
                <MaterialIcons name="call-made" size={14} color="red" />
            )}
          </View>
          <View>
            <Text variant={"titleSmall"} className="text-slate-800">
              {transaction?.customer?.name}
            </Text>
            <Text variant={"labelSmall"} className="text-slate-400">
              {transaction?.date}
            </Text>
          </View>
        </View>
        <View>
          {transaction?.transaction_type_id === 1 ? (
              <View className={"mr-2"}>
                <Text variant={"bodyMedium"} className="text-slate-800 mr-2">{ parseFloat(transaction?.amount).toFixed(2) }</Text>
                <Text variant={"labelSmall"} className="text-slate-400 mr-2">
                  (Udhaar)
                </Text>
              </View>
          ) : (
              <Text variant={"bodyMedium"} className={"text-slate-400 text-center"}>
                {" "}
                -{" "}
              </Text>
          )}
        </View>
        <View className={"flex flex-row items-right"}>
          <View>
            {transaction?.transaction_type_id === 2 ? (
                <View>
                  <Text variant={"bodyMedium"} className="text-slate-800">
                    { parseFloat(transaction?.amount).toFixed(2) }
                  </Text>
                  <Text variant={"labelSmall"} className="text-slate-400">
                    (Payment)
                  </Text>
                </View>
            ) : (
                <Text variant={"bodyMedium"} className={"text-slate-400 text-center"}>
                  {" "}
                  -{" "}
                </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
  );
}

export const renderHeader = () => (
    <View className={"flex-row justify-between px-4 py-2 space-x-2 items-center"}>
      <View className="flex-1 border-b-2 border-slate-300 w-1/3">
        <Text variant={"bodyMedium"} className="text-left text-slate-800">
          Customer
        </Text>
      </View>
      <View className="flex-1 border-b-2 border-amber-400">
        <Text variant={"bodyMedium"} className="text-center text-slate-800 mr-2">
          Given
        </Text>
      </View>
      <View className="flex-1 border-b-2 border-blue-500">
        <Text variant={"bodyMedium"} className="text-center text-slate-800">
          Received
        </Text>
      </View>
    </View>
);
