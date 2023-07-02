// noinspection JSValidateTypes
import React, {useEffect, useState} from "react";
import {KeyboardAvoidingView, TouchableOpacity, View, Image, Keyboard} from "react-native";
import {Button, Dialog, Text, TextInput} from "react-native-paper"
import * as Contacts from 'expo-contacts';
import DropDownFlashList from "../../Components/dropDownFlashList";
import {DatePickerInput} from "react-native-paper-dates";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {Camera} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {getItem, removeItem, setItem} from "../../../core/utils";
import {useCompanyProductsData, usePaymentApi, useProductsApi} from "../../../apis/useApi";
import {useAuth} from "../../../hooks";
import Toast from "react-native-toast-message";
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const showToast = (message, type) => {
    Toast.show({
        type: type,
        text1: type === 'success' ? 'Success' : 'Error',
        text2: message,
        position : "bottom"
    });
}

function convertDateFormat(dateString) {
    const dateObj = new Date(dateString);

    const convertedDate = dateObj.toISOString()
        .slice(0, 10) // Extract YYYY-MM-DD
        .replace('T', ' '); // Replace 'T' with a space

    const convertedTime = dateObj.toISOString()
        .slice(11, 19); // Extract HH:MM:SS

    return `${convertedDate} ${convertedTime}`;
}

const FlatListDropDown = ({navigation, route}) => {
    const auth = useAuth.use?.token();
    const {mutate: productRequest, isLoading ,data: products, isSuccess: isProductsSuccess, error : productsError, isErrorProduct} = useProductsApi();
    const {mutate: request, data: paymentApiResponse, isSuccess: isPaymentSuccess, error : paymentError, isError} = usePaymentApi();

    useEffect(() => {
        const formData = new FormData();
        formData.append('company_id', auth?.user?.company_id);
        productRequest(formData)
    }, []);


    if(isError){
        showToast(paymentError.message, 'error');
    }

    if(isPaymentSuccess){
        showToast(paymentApiResponse.data.message, 'success');
        setTimeout(() => navigation.navigate('HomePage'), 1000);
    }


    const [contacts, setContacts] = useState([]);
    const [visible, setVisible] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(route.params?.customer);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);
    const [inputDate, setInputDate] = useState(new Date());
    const [imageUri, setImageUri] = useState(null);
    const [note, setNote] = useState("");

    useEffect(() => {
        (async () => {
            const {status: contactStatus} = await Contacts.requestPermissionsAsync();
            if (contactStatus === 'granted') {
                try {
                    const localContacts = await getItem('contacts')
                    if (localContacts) {
                        setContacts(localContacts);
                    } else {
                        const {data : contactsArray} = await Contacts.getContactsAsync({
                            fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
                        });
                        if (contactsArray.length > 0) {
                            setContacts(contactsArray);
                            setItem('contacts', contactsArray).then(r => console.log(r))
                        }
                    }
                } catch (error) {
                    const {data: contactsArray} = await Contacts.getContactsAsync({
                        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
                    });
                    if (contactsArray.length > 0) {
                        setContacts(contactsArray);
                        setItem('contacts', contactsArray).then(r => console.log(r))
                    }
                }
            }
        })();
    }, []);

    useEffect(() => {
        setAmount(parseFloat(price || 0) * parseFloat(qty || 1));
    }, [price, qty]);

    const showDialog = () => {
        setVisible(true);
        Keyboard.dismiss();
    };

    const hideDialog = () => setVisible(false);

    const handleCameraCapture = async () => {
        const {status: cameraStatus} = await Camera.requestCameraPermissionsAsync();
        if (cameraStatus === 'granted') {
            const photo = await ImagePicker.launchCameraAsync();
            if (!photo?.cancelled) {
                setImageUri(photo?.uri);
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

        if (!result.canceled) {
            setImageUri(result.uri);
            hideDialog();
        }
    };

    const handlePriceChange = (inputPrice) => {
        setPrice(inputPrice);
    };

    const handleQtyChange = (inputQty) => {
        setQty(inputQty)
    };

    const onFormSubmit = () => {
        let phoneNumber = route?.params?.customer?.phone || null;
        console.log(phoneNumber)
        if (selectedCustomer === null) {
            showToast("Please Select Customer", "error");
            return false;
        }

        if (!selectedCustomer?.phoneNumbers && phoneNumber === null) {
            showToast("The contact you selected doesn't have a mobile number!", 'error');
            return false;
        }

        if(phoneNumber == null){
            const phoneNumberObject = selectedCustomer?.phoneNumbers[0];
            if (phoneNumberObject?.number) {
                phoneNumber = phoneNumberObject.number;
            } else if (phoneNumberObject?.digits) {
                phoneNumber = phoneNumberObject.digits;
            }
        }

        if(price == 0 || qty == 0){
            showToast("Please check price and qty", 'error');
            return false;
        }

        const formData = new FormData();
        formData.append('company_id', auth.user?.company_id);
        formData.append('cost_center_id', auth.user?.cost_center_id);
        formData.append('customer_name', selectedCustomer?.name);
        formData.append("from_date", convertDateFormat(inputDate.toString()));
        if(imageUri){
            formData.append('image', {
                uri: imageUri,
                type: 'image/jpeg', // Modify the type based on your image type
                name: 'image.jpg', // Modify the name based on your image name
            });
        }
        formData.append('notes', note);
        formData.append('price', price);
        formData.append('phone',  phoneNumber);
        formData.append('phone_id', selectedCustomer?.id);
        if(selectedProduct){
            formData.append('product_id', selectedProduct?.id);
        }
        formData.append('transaction_type_id', 1);
        formData.append('qty', qty);
        formData.append('user_id', auth?.user?.id);
        request(formData);
    }

    return (
        <View className={"flex-1 bg-white"}>
            <KeyboardAvoidingView
                behavior="padding" className={"bg-white flex-1 px-4 pt-2"}>
                <DropDownFlashList
                    data={contacts}
                    inputLabel="Select Customer"
                    headerTitle="Showing contact from Phonebook"
                    onSelect={(contactObj) => {
                        setSelectedCustomer(contactObj);
                    }}
                    selectedItemName={selectedCustomer?.name}
                    filterEnabled={true}
                />
                {!isLoading && <View className={"mt-2 -z-10"}>
                    <DropDownFlashList
                        data={products}
                        inputLabel="Select Product (Optional)"
                        headerTitle="List of products"
                        onSelect={(product) => handlePriceChange(parseFloat(product?.price).toFixed(4))}
                    />
                </View>}
                <View className={"flex flex-row gap-2 mt-0 -z-30"}>
                    <TextInput
                        className={"bg-white flex-1 mt-2 -z-30"}
                        onChangeText={handleQtyChange}
                        value={qty.toString()}
                        mode={"outlined"}
                        label={"Qty"}
                        keyboardType={"numeric"}
                    />
                    <TextInput
                        className={"bg-white flex-1 mt-2 -z-30"}
                        onChangeText={handlePriceChange}
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
                    onChangeText={(value) => setAmount(value)}
                    label={"Amount"}
                    inputMode={"numeric"}
                    editable={false}
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
                />
                <>
                    {imageUri && <Image source={{uri: imageUri, width: 150, height: 150}} resizeMethod={"auto"} className={"mt-4"}/>}
                </>
                <Button mode={"contained"} className={"mt-4 py-1 -z-50"}
                        onPress={() => onFormSubmit()}>Submit</Button>
            </KeyboardAvoidingView>

            <Dialog visible={visible} onDismiss={hideDialog} dismissable={true} style={{backgroundColor: "white"}}
                    dismissableBackButton={true}>
                <Dialog.Title style={{fontSize: 18}}>Select</Dialog.Title>
                <Dialog.Content>
                    <View className={"flex flex-row justify-evenly mb-10 mt-5"}>
                        <View className={"flex gap-2 items-center"}>
                            <TouchableOpacity onPress={handleCameraCapture}
                                              className={"flex justify-center items-center shadow-md bg-blue-500 p-4 rounded-3xl"}>
                                <MaterialCommunityIcons name={"camera"} size={30} color={"white"}/>
                            </TouchableOpacity>
                            <Text variant={"titleMedium"} className={"text-stone-600"}>Camera</Text>
                        </View>
                        <View className={"flex gap-2 items-center"}>
                            <TouchableOpacity onPress={pickImage}
                                              className={"flex justify-center items-center shadow-md bg-green-600 p-4 rounded-3xl"}>
                                <MaterialIcons name={"photo"} size={30} color={"white"}/>
                            </TouchableOpacity>
                            <Text variant={"titleMedium"} className={"text-stone-600"}>Gallery</Text>
                        </View>
                    </View>
                </Dialog.Content>
            </Dialog>
        </View>
    );
};

export default React.memo(FlatListDropDown);