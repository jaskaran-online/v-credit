import {View, TouchableOpacity, Linking, Platform} from "react-native";
import {FlashList} from "@shopify/flash-list";
import {Text, Searchbar} from "react-native-paper";
import {useEffect, useState} from "react";
import {
    Feather,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";

import {FloatingButtons} from "./../index"
import {useCustomerTransactionData} from "../../../apis/useApi";
import {useAuth} from "../../../hooks";
import {renderHeader} from "../../../core/utils";

const makePhoneCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
        .then((supported) => {
            if (supported) {
                return Linking.openURL(url);
            } else {
                alert("Phone call not supported");
            }
        })
        .catch((error) => console.log(error));
};

const sendWhatsApp = (phoneWithCountryCode) => {
    let msg = "Hi..";

    let mobile =
        Platform.OS !== "ios" ? "+" + phoneWithCountryCode : phoneWithCountryCode;
    if (mobile) {
        if (msg) {
            let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
            Linking.openURL(url)
                .then(data => {
                    console.log("WhatsApp Opened");
                })
                .catch(() => {
                    alert("Make sure WhatsApp installed on your device");
                });
        } else {
            alert("Please insert message to send");
        }
    } else {
        alert("Please insert mobile no");
    }
};

const renderItem = ({item, index}) => (
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
                    <MaterialIcons name="call-made" size={14} color="red"/>
                )}
            </View>
            <View>
                <Text variant={"titleSmall"} className="text-slate-800">
                    {item?.transaction_type_id === 2 ? "Payment" : "Credit"}
                </Text>
                <Text variant={"labelSmall"} className="text-slate-400">
                    {item?.date}
                </Text>
            </View>
        </View>
        <View>
            {item?.transaction_type_id === 1 ? (
                <View className={"mr-2"}>
                    <Text variant={"bodyMedium"} className="text-slate-800 mr-2">
                        { parseFloat(item?.amount).toFixed(2) }₹
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
                {item?.transaction_type_id === 2 ? (
                    <View>
                        <Text variant={"bodyMedium"} className="text-slate-800">
                            { parseFloat(item?.amount).toFixed(2) }₹
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

export default function Index({navigation, route}) {
    const auth = useAuth.use?.token();
    const {mutate, data, isLoading} = useCustomerTransactionData();

    useEffect(() => {
        loadCustomerData();
    }, []);

    useEffect(() => {
        setFilteredList(data?.data?.transactions);
    }, [data]);


    const options = [
        {label: "Credit Given", onPress: handleClearSelection},
        {
            label: "Payment Received",
            onPress: handleDeleteSelectedItem,
        },
        {label: "Clear", onPress: handleEditSelectedItem},
    ];

    const [filteredList, setFilteredList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [query, setQuery] = useState("");
    const [reload, setReload] = useState(false);

    const handleSearch = (inputValue) => {
        setQuery(inputValue);
        const filteredList = (data?.data?.transactions).filter(item =>
            String(item.amount).includes(inputValue) || String(item.id).includes(inputValue)
        );
        setFilteredList(filteredList);
    };

    function loadCustomerData(){
        setReload(true);
        const formData = new FormData();
        formData.append('company_id', auth.user.company_id);
        formData.append('cost_center_id', auth.user.cost_center_id);
        formData.append('customer_id', route.params.id);
        formData.append('user_id', auth.user.id);
        mutate(formData);
        setReload(false);
    }

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

    const toReceive =  data?.data?.sumAmountByType.toReceive || 0;
    const toPay = data?.data?.sumAmountByType.toPay || 0;
    return (
        <View className={"bg-white flex-1"}>
            <View className="bg-blue-50 h-28">
                <View
                    className="mx-2 h-24 bg-white mt-1 rounded-md shadow-sm flex flex-row items-center justify-between px-6">
                    <View className="flex flex-row space-x-4 items-center">
                        <View className="bg-red-400 p-2 rounded-full">
                            <MaterialIcons name="call-made" size={20} color="white"/>
                        </View>
                        <View className="ml-2">
                            <Text variant="bodyMedium" className="text-slate-600">
                                Total Balance
                            </Text>
                            <Text variant="titleLarge" className="text-slate-900 font-bold">
                                { Math.abs(toReceive > 0 ?  parseFloat(toReceive - toPay).toFixed(2)   : toPay > 0 ?   parseFloat(toPay - toReceive).toFixed(2) : parseFloat(toReceive - toPay).toFixed(2)) }₹
                            </Text>
                        </View>
                    </View>

                    <View className="flex flex-row space-x-6 pr-2">
                        <TouchableOpacity className="bg-blue-50 p-2 rounded-full  flex items-center" onPress={() => makePhoneCall(data?.data?.phone)}>
                            <MaterialIcons name="call" size={24} color="dodgerblue"/>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-50 p-2 rounded-full" onPress={() => sendWhatsApp(data?.data?.phone)}>
                            <MaterialCommunityIcons name="whatsapp" size={26} color="green"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View
                className={
                    "flex flex-row justify-between w-full px-3 items-center py-4"
                }
            >
                <View className={"flex flex-row relative"} style={{width: "80%"}}>
                    <Searchbar
                        onChangeText={(text) => handleSearch(text)}
                        value={query.toString()}
                        style={{
                            width: "100%",
                            backgroundColor: "transparent"
                        }}
                        inputStyle={{
                            fontSize: 12,
                            lineHeight : Platform.OS === "android" ? 16 :  0,
                            paddingBottom: 20
                        }}
                        placeholder="Search Amount or Txn Note"
                        className={"bg-white border-2 border-slate-200 h-10"}
                    />
                </View>
                <View className={"flex"} style={{width: "15%"}}>
                    {options && (
                        <TouchableOpacity
                            className="p-2 bg-white border-slate-900 shadow shadow-slate-300 rounded-xl w-[48] mt-1 h-[40] justify-center items-center"
                            onPress={() => handleOptionSelect(true)}
                        >
                            <Feather name="filter" size={20} color="black"/>
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

            <FlashList
                data={filteredList}
                renderItem={({ item, index }) => renderItem({ item, index, userId: auth.user.id })}
                ListHeaderComponent={renderHeader}
                estimatedItemSize={200}
                onSearch={handleSearch}
                onSelect={handleSelect}
                selected={selectedItem}
                showOptions={showOptions}
                options={options}
                refreshing={reload}
                onRefresh={loadCustomerData}
                onOptionSelect={handleOptionSelect}
            />
            <FloatingButtons navigation={navigation}/>
        </View>
    );
}
