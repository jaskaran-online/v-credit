import {View, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {List, Text, Divider, TextInput, Menu, Searchbar} from 'react-native-paper'
import {useEffect, useState} from "react";
import {Feather, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {StatusBar} from "expo-status-bar";
import {styled} from "nativewind";
import {DatePickerInput} from 'react-native-paper-dates';
import { TwoCards } from '../../Components/TwoCards';
import {useAuth} from "../../../hooks";
import {useDailyBook, usePartyStatement} from "../../../apis/useApi";

const renderHeader = () => <View className={"flex-row justify-between px-4 py-2 space-x-2 items-center"}>
    <View className="flex-1 border-b-2 border-slate-300 w-1/3">
        <Text variant={"bodyMedium"} className="text-left text-slate-800">Customer</Text>
    </View>
    <View className="flex-1 border-b-2 border-amber-400">
        <Text variant={"bodyMedium"} className="text-right text-slate-800 mr-2">Given</Text>
    </View>
    <View className="flex-1 border-b-2 border-blue-500">
        <Text variant={"bodyMedium"} className="text-right text-slate-800">Received</Text>
    </View>
</View>

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

    const {mutate, data : dailyBookData, isLoading} = usePartyStatement();
    const [reload, setReload] = useState(false);

    const [filteredList, setFilteredList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showOptions, setShowOptions] = useState("");
    const [query, setQuery] = useState("");

    function loadCustomerData(){
        setReload(true)
        const formData = new FormData();
        formData.append('company_id', auth.user.company_id);
        formData.append('cost_center_id', auth.user.cost_center_id);
        formData.append('fromDate', "2023-06-01");
        formData.append('toDate', "2023-06-11");
        formData.append('user_id', auth.user.id);
        mutate(formData);
        setReload(false)
    }

    useEffect(() => {
        loadCustomerData();
    }, []);

    const handleSearch = (text) => {
        setQuery(text);
        const filtered = (dailyBookData?.data?.transactions).filter((item) =>
            item?.customer?.name?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredList(filtered);
    };

    useEffect(() => {
        setFilteredList(dailyBookData?.data?.transactions);
    }, [dailyBookData]);

    const options = [{label: 'Credit Given', onPress: handleClearSelection}, {
        label: 'Payment Received',
        onPress: handleDeleteSelectedItem
    }, {label: 'Clear', onPress: handleEditSelectedItem},];

    const handleSelect = item => {
        setSelectedItem(item);
    };

    const handleOptionSelect = show => {
        setShowOptions(show => !show);
    };

    const handleClearSelection = () => {
        setSelectedItem(null);
    };

    const handleDeleteSelectedItem = () => {
        const filtered = filteredList.filter(item => item.id !== selectedItem.id);
        setFilteredList(filtered);
        setSelectedItem(null);
    };

    const handleEditSelectedItem = () => {
        console.log('Edit selected item:', selectedItem);
        setSelectedItem(null);
    };

    const StyledView = styled(TouchableOpacity)
    const Box = ({className, children, ...props}) => (
        <StyledView className={`flex text-center h-20 rounded ₹{className}`} {...props}>
            {children}
        </StyledView>
    )

    const [inputDate, setInputDate] = useState(new Date('2023-06-01'))
    const [fromInputDate, setFromInputDate] = useState(new Date('2023-06-11'))

    return (<View className={"bg-white flex-1"}>
        <StatusBar animated={true}/>
        <StyledView className="flex h-15 p-2 bg-blue-50">
            <View className={"flex flex-row my-2"}>
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
                    value={fromInputDate}
                    onChange={(d) => setFromInputDate(d)}
                    inputMode="start"
                    mode={"outlined"}
                    className={"bg-blue-50 mx-1"}
                />
            </View>
            <TwoCards toReceive={dailyBookData?.data?.totalOfTransactions?.toReceive} toPay={dailyBookData?.data?.totalOfTransactions?.toPay} />
        </StyledView>

        <View className={"flex flex-row justify-between w-full px-3 items-center py-4"}>
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
        {!isLoading ? <FlashList
            data={filteredList}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            estimatedItemSize={200}
            onSearch={handleSearch}
            onSelect={handleSelect}
            selected={selectedItem}
            showOptions={showOptions}
            options={options}
            refreshing={reload}
            onRefresh={() => loadCustomerData()}
            onOptionSelect={handleOptionSelect}
        /> : <Text>Loading..</Text> }
    </View>);
}