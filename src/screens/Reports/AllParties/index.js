import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {FlashList} from "@shopify/flash-list";
import {StatusBar} from "expo-status-bar";
import {styled} from "nativewind";
import {useEffect, useState} from "react";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {Searchbar, Text} from "react-native-paper";
import {DatePickerInput} from "react-native-paper-dates";
import {PaperSelect} from "react-native-paper-select";
import {useAuth} from "../../../hooks";
import {useAllParties, useCustomersData, useDailyBook} from "../../../apis/useApi";
import DropDownFlashList from "../../Components/dropDownFlashList";
import navigation from "../../../navigations";

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

const renderItem = ({item, index}) => (
    <TouchableOpacity
        className={
            "flex flex-row justify-between items-center px-1.5 py-2 border-b-2 border-slate-200"
        }
        onPress={() => navigation.navigate('CustomerTransactionDetails', {
            id: item?.customer_id,
            name: item?.name
        })}
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
                    <MaterialIcons name="call-made" size={14} color="red"/>
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

    const {mutate: allPartiesMutate, data: allPartiesData, isLoading: allPartiesLoading} = useAllParties();
    const {mutate: customerMutate, data: customersData, isLoading: isCustomerLoading, error} = useCustomersData();

    const [reload, setPartyReload] = useState(false);

    const [filteredList, setFilteredList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showOptions, setShowOptions] = useState("");
    const [query, setQuery] = useState("");
    const [customer, setCustomer] = useState("");
    const [inputDate, setInputDate] = useState(new Date());

    function fetchCustomers() {
        const formData = new FormData();
        formData.append('cost_center_id', auth?.user.cost_center_id);
        formData.append('company_id', auth?.user.company_id);
        formData.append('user_id', auth?.user.id);
        customerMutate(formData);
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    function loadPartyData() {
        setPartyReload(true)

        const currentDate = inputDate;
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append('company_id', auth.user.company_id);
        formData.append('cost_center_id', auth.user.cost_center_id);
        formData.append('customer_id', customer?.id);
        formData.append('date', dateString);
        allPartiesMutate(formData);
        console.log(formData);
        setPartyReload(false)
    }

    useEffect(() => {
        loadPartyData();
    }, [customer, inputDate]);


    useEffect(() => {
        loadPartyData();
    }, []);

    const options = [
        {label: "Credit Given", onPress: handleClearSelection},
        {
            label: "Payment Received",
            onPress: handleDeleteSelectedItem,
        },
        {label: "Clear", onPress: handleEditSelectedItem},
    ];

    const handleSelect = (item) => {
        setSelectedItem(item);
    };

    const handleOptionSelect = (show) => {
        setShowOptions((show) => !show);
    };

    useEffect(() => {
        setFilteredList(allPartiesData?.data?.transactions);
    }, [allPartiesData]);

    const handleSearch = (text) => {
        setQuery(text);
        const filtered = (allPartiesData?.data?.transactions).filter((item) =>
            item?.customer?.name?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredList(filtered);
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
            <StatusBar animated={true}/>
            <View className="flex h-15 p-2 bg-blue-50">
                <View className={"flex flex-row my-2"}>
                    <DatePickerInput
                        locale="en"
                        label="From"
                        value={inputDate}
                        onChange={(d) => setInputDate(d)}
                        inputMode="start"
                        mode={"outlined"}
                        className={"bg-blue-50 mx-1 w-44"}
                    />
                </View>
                {!isCustomerLoading && <DropDownFlashList
                    data={customersData?.data}
                    inputLabel="Parties"
                    headerTitle="Showing contact from Phonebook"
                    onSelect={(contactObj) => {
                        setCustomer(contactObj);
                    }}
                    isTransparent={true}
                    filterEnabled={true}
                    selectedItemName={customer?.name || ""}
                />}
            </View>
                <View
                    className={
                        "flex flex-row justify-between w-full px-3 items-center py-4"
                    }
                >
                    <Searchbar
                        onChangeText={handleSearch}
                        value={query.toString()}
                        style={{
                            width: "100%",
                            backgroundColor: "transparent"
                        }}
                        inputStyle={{
                            fontSize: 12,
                            lineHeight: Platform.OS === "android" ? 16 : 0,
                            paddingBottom: 20
                        }}
                        placeholder="Search Name, Amount or Txn Note"
                        className={"bg-white border-2 border-slate-200 h-10"}
                    />
                </View>
                <View style={{flex: 1, height: '100%'}}>
                    {allPartiesLoading
                        ? <ActivityIndicator/>
                        : <FlashList
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
                            ListFooterComponent={<View style={{height: 100}}/>}
                            ListEmptyComponent={<View className={"flex-1 d-flex justify-center items-center h-16"}><Text
                                variant={"bodyMedium"}>No Records Available!</Text></View>}
                        />}
                </View>
        </View>
    );
}
