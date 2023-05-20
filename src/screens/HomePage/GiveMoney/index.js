// noinspection JSValidateTypes

import React, {useEffect, useState} from "react";
import {KeyboardAvoidingView, TouchableOpacity, View, Image} from "react-native";
import {Button, Dialog, Text, TextInput} from "react-native-paper"
import * as Contacts from 'expo-contacts';
import DropDownFlashList from "../../Components/dropDownFlashList";
import {DatePickerInput} from "react-native-paper-dates";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {Camera} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {getItem, setItem} from "../../../core/utils";

const FlatListDropDown = () => {

    const [contacts, setContacts] = useState([]);
    const [amount, setAmount] = useState(0);
    const [inputDate, setInputDate] = useState(new Date());
    const [visible, setVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [note, setNote] = useState("");
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(1);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    // Function to handle the camera capture
    const handleCameraCapture = async () => {
        const {status} = await Camera.requestPermissionsAsync();
        if (status === 'granted') {
            const photo = await ImagePicker.launchCameraAsync();
            if (!photo.cancelled) {
                setImage(photo.uri);
                hideDialog();
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            hideDialog();
        }
    };

    useEffect(() => {
        (async () => {
            const {status} = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                try {
                    const localContacts = await getItem('contacts')
                    if(localContacts){
                        setContacts(localContacts);
                    }else{
                        const {data} = await Contacts.getContactsAsync({
                            fields: [Contacts.Fields.Emails],
                        });
                        if (data.length > 0) {
                            setContacts(data);
                            setItem('contacts', data).then(r => console.log(r))
                        }
                    }

                }catch (e) {
                    const {data} = await Contacts.getContactsAsync({
                        fields: [Contacts.Fields.Emails],
                    });
                    if (data.length > 0) {
                        setContacts(data);
                        setItem('contacts', data).then(r => console.log(r))
                    }
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
                        data={[{id: 1, name: "Item1", price: 2}, {id: 2, name: "Item2", price: 4}, {
                            id: 3,
                            name: "Item3",
                            price: 6
                        }]}
                        inputLabel="Items"
                        headerTitle="List of items"
                        onSelect={(value) => {
                            setPrice(value.price)
                        }}
                    />
                </View>
                <View className={"flex flex-row gap-2 mt-0 -z-30"}>
                    <TextInput
                        className={"bg-white flex-1 mt-2 -z-30"}
                        onChangeText={(text) => setQty(text)}
                        value={qty.toString()}
                        mode={"outlined"}
                        label={"Qty"}
                        keyboardType={"numeric"}
                    />
                    <TextInput
                        className={"bg-white flex-1 mt-2 -z-30"}
                        onChangeText={(text) => setPrice(text)}
                        value={price.toString()}
                        mode={"outlined"}
                        label={"Price"}
                        keyboardType={"numeric"}
                    />
                </View>
                <TextInput
                    className={"bg-white mt-2 -z-30"}
                    value={amount.toString()}
                    mode={"outlined"}
                    label={"Amount"}
                    onChangeText={(value) => setAmount(value)}
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
                    <TouchableOpacity onPress={showDialog}
                                      className={"flex items-center justify-center px-4 bg-blue-50 shadow-sm border border-blue-100 rounded-lg my-[4px] mx-3"}>
                        <MaterialCommunityIcons name={"camera"} size={30} color={"black"}/>
                    </TouchableOpacity>
                </View>
                <TextInput
                    className={"bg-white mt-2 -z-30"}
                    onChangeText={(text) => setNote(text)}
                    value={note}
                    mode={"outlined"}
                    label={"Notes (Optional)"}
                    inputMode={"text"}
                    multiline={true}
                    numberOfLines={5}
                />

                {image &&
                    <Image source={{uri: image, width: 150, height: 150}} resizeMethod={"auto"} className={"mt-4"}/>}

                <Button mode={"contained"} className={"mt-4 py-1"} onPress={() => alert("Work in Progress!")}>Submit</Button>
            </KeyboardAvoidingView>


            <Dialog visible={visible} onDismiss={hideDialog} dismissable={true} style={{backgroundColor: "white"}}>
                <Dialog.Title style={{fontSize: 18}}>Select</Dialog.Title>
                <Dialog.Content>
                    <View className={"flex flex-row justify-evenly mb-10 mt-5"}>
                        <TouchableOpacity onPress={handleCameraCapture}
                                          className={"flex justify-center items-center shadow-md gap-y-3 bg-blue-50 px-5 py-2 rounded-lg"}>
                            <MaterialCommunityIcons name={"camera"} size={30} color={"black"}/>
                            <Text>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickImage}
                                          className={"flex justify-center items-center shadow-md gap-y-3 bg-blue-50 px-5 py-2 rounded-lg"}>
                            <MaterialIcons name={"photo"} size={30} color={"black"}/>
                            <Text>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </Dialog.Content>
            </Dialog>
        </View>
    );
};

export default FlatListDropDown;