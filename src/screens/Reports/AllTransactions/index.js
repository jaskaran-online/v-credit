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
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { DatePickerInput } from "react-native-paper-dates";
import { TwoCards } from "../../Components/TwoCards";
import { PaperSelect } from "react-native-paper-select";
import { ScrollView } from "react-native-gesture-handler";

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
          Jaskaran
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
  const [colors, setColors] = useState({
    value: "",
    list: [
      { _id: "1", value: "Test1" },
      { _id: "2", value: "Test2" },
      { _id: "3", value: "Test3" }
    ],
    selectedList: [],
    error: "",
  });

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

  const StyledView = styled(TouchableOpacity);
  const Box = ({ className, children, ...props }) => (
    <StyledView
      className={`flex text-center h-20 rounded ${className}`}
      {...props}
    >
      {children}
    </StyledView>
  );

  const [inputDate, setInputDate] = useState(new Date());

  return (
    <View className={"bg-white flex-1"}>
      <StatusBar animated={true} />
      <StyledView className="flex h-15 p-2 bg-blue-50">
            <View className={"flex flex-row mb-2"}>
            <DatePickerInput
                locale="en"
                label="From"
                value={inputDate}
                onChange={(d) => setInputDate(d)}
                inputMode="start"
                mode={"outlined"}
                className={"bg-blue-50 mx-1"}
            />

            <DatePickerInput
                locale="en"
                label="To"
                value={inputDate}
                onChange={(d) => setInputDate(d)}
                inputMode="start"
                mode={"outlined"}
                className={"bg-blue-50 mx-1"}
            />
            </View>
            <View className={"flex gap-0"}>
            <PaperSelect
                textInputStyle={{
                backgroundColor: "transparent"
                }}
                label="Party"
                value={colors.value}
                onSelection={(value) => {
                setColors({
                    ...colors,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: "",
                });
                }}
                arrayList={[...colors.list]}
                selectedArrayList={colors.selectedList}
                textInputMode="outlined"
                hideSearchBox={true}

            />

            <PaperSelect
                textInputStyle={{
                backgroundColor: "transparent"
                }}
                className={"bg-blue-50"}
                label="Transaction Type"
                value={colors.value}
                onSelection={(value) => {
                setColors({
                    ...colors,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: "",
                });
                }}
                arrayList={[...colors.list]}
                selectedArrayList={colors.selectedList}
                textInputMode="outlined"
                hideSearchBox={true}
            />
            </View>
            <TwoCards />
        </StyledView>
        <View
            className={
            "flex flex-row justify-between w-full px-4 items-center pb-2 mt-4"
            }
        >
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
    </View>
  );
}
