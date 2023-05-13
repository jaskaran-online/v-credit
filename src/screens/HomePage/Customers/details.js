import { View, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  List,
  Text,
  Divider,
  TextInput,
  Menu,
  Searchbar,
} from "react-native-paper";
import { useState } from "react";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import {FloatingButtons} from "./../index"

const renderHeader = () => (
  <View className={"flex-row justify-between px-4 py-2 space-x-2 items-center"}>
    <View className="flex-1 border-b-2 border-slate-300 w-1/3">
      <Text variant={"bodyMedium"} className="text-left text-slate-800">
        Customer
      </Text>
    </View>
    <View className="flex-1 border-b-2 border-amber-400">
      <Text variant={"bodyMedium"} className="text-right text-slate-800 mr-2">
        Given
      </Text>
    </View>
    <View className="flex-1 border-b-2 border-blue-500">
      <Text variant={"bodyMedium"} className="text-right text-slate-800">
        Received
      </Text>
    </View>
  </View>
);

const renderItem = ({ item, index }) => (
  <TouchableOpacity
    className={
      "flex flex-row justify-between items-center px-1.5 py-2 border-b-2 border-slate-200"
    }
  >
    <View className="flex flex-row items-center w-1/4">
      <View className="mr-1">
        {index % 2 === 0 ? (
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
          {index % 2 === 0 ? "Payment" : "Credit"}
        </Text>
        <Text variant={"labelSmall"} className="text-slate-400">
          5 May 2023
        </Text>
      </View>
    </View>
    <View>
      {index % 2 !== 0 ? (
        <View className={"mr-2"}>
          <Text variant={"bodyMedium"} className="text-slate-800 mr-2">
            100
          </Text>
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
        {index % 2 === 0 ? (
          <View>
            <Text variant={"bodyMedium"} className="text-slate-800">
              200
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

export default function Index() {
  const data = [
    { id: "1", title: "Item 1", description: "This is item 1" },
    {
      id: "2",
      title: "Item 2",
      description: "This is item 2",
    },
    { id: "3", title: "Item 3", description: "This is item 3" },
    {
      id: "4",
      title: "Item 4",
      description: "This is item 4",
    },
    { id: "5", title: "Item 5", description: "This is item 5" },
  ];

  const options = [
    { label: "Credit Given", onPress: handleClearSelection },
    {
      label: "Payment Received",
      onPress: handleDeleteSelectedItem,
    },
    { label: "Clear", onPress: handleEditSelectedItem },
  ];

  const [filteredList, setFilteredList] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [query, setQuery] = useState("");
  const handleSearch = (text) => {
    setQuery(text);
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
    console.log(filtered);
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
    console.log("Edit selected item:", selectedItem);
    setSelectedItem(null);
  };

  return (
    <View className={"bg-white flex-1"}>
      <View className="bg-blue-50 h-28">
        <View className="mx-2 h-24 bg-white mt-1 rounded-md shadow-sm flex flex-row items-center justify-between px-6">
          <View className="flex flex-row space-x-4 items-center">
            <View className="bg-red-400 p-2 rounded-full">
              <MaterialIcons name="call-made" size={20} color="white" />
            </View>
            <View className="ml-2">
              <Text variant="bodyMedium" className="text-slate-600">
                To Pay
              </Text>
              <Text variant="titleLarge" className="text-slate-900 font-bold">
                ₹ 100
              </Text>
            </View>
          </View>
          <View className="flex flex-row space-x-6 pr-2">
            <TouchableOpacity className="bg-blue-50 p-2 rounded-full  flex items-center">
              <MaterialIcons name="call" size={24} color="dodgerblue" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-50 p-2 rounded-full ">
              <MaterialCommunityIcons name="whatsapp" size={26} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
              lineHeight : 0,
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
              <>
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
              </>
            );
          })}
        </View>
      )}

      <FlashList
        data={filteredList}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        estimatedItemSize={200}
        onSearch={handleSearch}
        onSelect={handleSelect}
        selected={selectedItem}
        showOptions={showOptions}
        options={options}
        onOptionSelect={handleOptionSelect}
      />
      <FloatingButtons/>
    </View>
  );
}
