import React, {useEffect, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {Text, TextInput} from "react-native-paper"
import * as Contacts from 'expo-contacts';
import * as PropTypes from "prop-types";
import {DropDownFlashList} from "../TakePayment/dropDownFlashList";

const FlatListDropDown = () => {

    const [contacts, setContacts] = useState([]);
    const [amount, setAmount] = useState(0);

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
        <View className={"bg-white flex-1 px-4 pt-2"}
        >
            <DropDownFlashList
                data={contacts}
                inputLabel="Customer Name"
                headerTitle="Showing contact from Phonebook"
                onSelect={(value) => console.log(value)}
                onChangeInput={(value) => console.log(value)}
            />
            <TextInput
                className={"bg-white mt-2 -z-30"}
                onChangeText={(text) => setAmount(text)}
                value={amount}
                mode={"outlined"}
                label={"Amount"}
                inputMode={"numeric"}
            />
        </View>
    );
};

export default FlatListDropDown;