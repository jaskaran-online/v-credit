import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {useEffect, useState} from "react";
import { TouchableOpacity, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import {useCustomersData, useTransactionsData} from "../../../apis/useApi";
import {useAuth} from "../../../hooks";

const renderHeader = () => (
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

const renderItem = ({ item, index }) => (
  <TouchableOpacity
    className={
      "flex flex-row justify-between items-center px-1.5 py-2 border-b-2 border-slate-200"
    }
  >
    <View className="flex flex-row items-center w-1/4">
      <View className="mr-1">
        {item?.transaction_type_id === 2 ? (
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
          {item?.customer?.name}
        </Text>
        <Text variant={"labelSmall"} className="text-slate-400">
          {item?.created_at}
        </Text>
      </View>
    </View>
    <View>
      {item?.transaction_type_id === 1 ? (
        <View className={"mr-2"}>
          <Text variant={"bodyMedium"} className="text-slate-800 mr-2">{item?.amount}</Text>
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
        {item?.transaction_type_id === 2 ? (
          <View>
            <Text variant={"bodyMedium"} className="text-slate-800">
              {item?.amount}
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

  const auth = useAuth.use?.token();
  const {mutate, data, isLoading} = useTransactionsData();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setFilteredList(data?.data);
  }, [data]);

  function loadCustomerData(){
    setReload(true)
    const formData = new FormData();
    formData.append('company_id', auth.user.company_id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    mutate(formData);
    setReload(false)
  }

  useEffect(() => {
    loadCustomerData();
  }, []);

  const options = [
    { label: "Credit Given", onPress: handleClearSelection },
    {
      label: "Payment Received",
      onPress: handleDeleteSelectedItem,
    },
    { label: "Clear", onPress: handleEditSelectedItem },
  ];

  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [query, setQuery] = useState("");
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
          <Text>Loading</Text>
          :

      <FlashList
        data={filteredList}
        renderItem={renderItem}
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
