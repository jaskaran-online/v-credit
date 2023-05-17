import React, {useEffect, useState} from "react";
import {KeyboardAvoidingView, TouchableOpacity, View} from "react-native";
import {Text, TextInput} from "react-native-paper"
import * as Contacts from 'expo-contacts';
import * as PropTypes from "prop-types";
import {DropDownFlashList} from "../../Components/dropDownFlashList";
import { DatePickerInput } from "react-native-paper-dates";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {ScrollView} from "react-native-gesture-handler";
const FlatListDropDown = () => {

    const [contacts, setContacts] = useState([]);
    const [amount, setAmount] = useState(0);
    const [inputDate, setInputDate] = useState(new Date());

    useEffect(() => {
        (async () => {
            const {status} = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const {data} = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Emails],
                });
                if (data.length > 0) {
                    setContacts(data);
                    const contact = data[0];
                    console.log(contact);
                }
            }
        })();
    }, []);

    return (
        <View className={"flex-1 bg-white"}>
            <KeyboardAvoidingView
                behavior="padding" className={"bg-white flex-1 px-4 pt-2"}>
                <DropDownFlashList
                    data={contacts}
                    inputLabel="Customer Name"
                    headerTitle="Showing contact from Phonebook"
                    onSelect={(value) => console.log(value)}
                    onChangeInput={(value) => console.log(value)}
                    filterEnabled={true}
                />
                <View className={"mt-2 -z-20"}>
                    <DropDownFlashList
                        data={[{id :1, name : "Item1"},{id :2, name : "Item2"},{id :3, name : "Item3"}]}
                        inputLabel="Items"
                        headerTitle="List of items"
                        onSelect={(value) => console.log(value)}
                        onChangeInput={(value) => console.log(value)}
                    />
                </View>
                <TextInput
                    className={"bg-white mt-2 -z-30"}
                    onChangeText={(text) => setAmount(text)}
                    value={amount}
                    mode={"outlined"}
                    label={"Amount"}
                    inputMode={"numeric"}
                />
                <View className={"flex flex-row w-full mt-2 -z-30"}>
                    <DatePickerInput
                        locale="en"
                        label="From"
                        value={inputDate}
                        onChange={(d) => setInputDate(d)}
                        inputMode="start"
                        mode={"outlined"}
                        className={"bg-blue-50 mx-1"}
                    />
                    <TouchableOpacity className={"flex items-center justify-center px-4 bg-blue-50 shadow-sm border border-blue-100 rounded-lg my-[4px] mx-3"}>
                        <MaterialCommunityIcons name={"camera"} size={30} color={"black"}/>
                    </TouchableOpacity>
                </View>
                <TextInput
                    className={"bg-white mt-2 -z-30"}
                    onChangeText={(text) => setAmount(text)}
                    value={amount}
                    mode={"outlined"}
                    label={"Notes (Optional)"}
                    inputMode={"text"}
                    multiline={true}
                    numberOfLines={5}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

export default FlatListDropDown;