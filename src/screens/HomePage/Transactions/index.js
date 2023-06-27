import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { useTransactionsData } from "../../../apis/useApi";
import { useAuth } from "../../../hooks";
import { useFocusEffect } from "@react-navigation/native";
import navigation from '../../../navigations/index'
import {renderHeader, renderItem} from '../../../core/utils';
const isToday = (dateString) => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  return (
      currentDate.getFullYear() === inputDate.getFullYear() &&
      currentDate.getMonth() === inputDate.getMonth() &&
      currentDate.getDate() === inputDate.getDate()
  );
};

export default function Index() {

  const auth = useAuth.use?.token();
  const {mutate, data, isLoading} = useTransactionsData();

  const [reload, setReload] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setFilteredList(data?.data);
  }, [data]);

  useEffect(() => {
    loadCustomerData();
  }, []);

  useFocusEffect(
      useCallback(() => {
        loadCustomerData();
        return () => {
          // Useful for cleanup functions
          console.log("Screen was unfocused");
        };
      }, [])
  );

  function loadCustomerData(){
    setReload(true)
    const formData = new FormData();
    formData.append('company_id', auth.user.company_id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    mutate(formData);
    setReload(false)
  }

  const options = [
    { label: "Credit Given", onPress: handleClearSelection },
    {
      label: "Payment Received",
      onPress: handleDeleteSelectedItem,
    },
    { label: "Clear", onPress: handleEditSelectedItem },
  ];

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = (data?.data).filter((item) =>
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const handleOptionSelect = (show) => {
    setShowOptions((show) => !show);
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
  };

  const handleDeleteSelectedItem = () => {
    const filtered = filteredList.filter((item) => item.id !== selectedItem.id);
    setFilteredList(filtered);
    setSelectedItem(null);
  };

  const handleEditSelectedItem = () => {
    setSelectedItem(null);
  };

  
  return (
    <View className={"bg-white flex-1"}>
      <View
        className={
          "flex flex-row justify-between w-full px-3 items-center py-4"
        }
      >
        <View className={"flex flex-row relative"} style={{ width: "80%" }}>
          <Searchbar
            onChangeText={handleSearch}
            value={query.toString()}
            style={{
              width: "100%",
              backgroundColor : "transparent"
            }}
            inputStyle={{
              fontSize: 12,
              lineHeight : Platform.OS === "android" ? 16 :  0,
              paddingBottom: 20
            }}
            placeholder="Search Name, Amount or Txn Note"
            className={"bg-white border-2 border-slate-200 h-10"}
          />
        </View>
        <View className={"flex"} style={{ width: "15%" }}>
          {options && (
            <TouchableOpacity
              className="p-2 bg-white border-slate-900 shadow shadow-slate-300 rounded-xl w-[48] mt-1 h-[40] justify-center items-center"
              onPress={() => handleOptionSelect(true)}
            >
              <Feather name="filter" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showOptions && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            zIndex: 9999999,
            backgroundColor: "white",
          }}
          className={
            "border-2 border-slate-100 shadow-black shadow-lg right-10 top-14"
          }
        >
          {options.map((value, index, array) => {
            return (
                <TouchableOpacity
                  key={index}
                  onPress={value.onPress}
                  className={
                    value.label === "Clear" ? "bg-slate-200" : "bg-white"
                  }
                >
                  <Text variant={"labelLarge"} className={"pl-2 pr-4 py-2"}>
                    {value.label}
                  </Text>
                </TouchableOpacity>
            );
          })}
        </View>
      )}
      {isLoading ?
          <ActivityIndicator className={"mt-16"}/>
          :

      <FlashList
        data={filteredList}
        renderItem={({ item, index }) => renderItem({ item, index, userId: auth.user.id })}
        ListHeaderComponent={renderHeader}
        estimatedItemSize={200}
        refreshing={reload}
        onRefresh={loadCustomerData}
        onSearch={handleSearch}
        onSelect={handleSelect}
        selected={selectedItem}
        showOptions={showOptions}
        options={options}
        onOptionSelect={handleOptionSelect}
        ListFooterComponent={<View style={{height: 100}}/>}
        ListEmptyComponent={<View className={"flex-1 d-flex justify-center items-center h-16"}><Text variant={"bodyMedium"}>No Records Available!</Text></View>}
      />
      }
    </View>
  );
}
