import {FlatList, TouchableOpacity, View} from "react-native";
import {Text, TextInput} from "react-native-paper";
import {FlashList} from "@shopify/flash-list";
import React, {useEffect, useState, memo} from "react";

function DropDownFlashList({data = [], onSelect = () => null, onChangeInput  = () => null, inputLabel = "label", headerTitle = "headerTitle", closeDropDown = false}) {

    const [isDropDownOpen, setIsDropDownOpen] = useState(closeDropDown);
    const [filteredContacts, setFilteredContacts] = useState(data);

    useEffect(() => {
        setFilteredContacts(data);
    }, [data]);

    const [value, setValue] = useState('');

    const renderSeparator = () => {
        return (
            <View className={"border border-slate-100"}/>
        );
    };

    const searchItems = (text) => {
        const newData = data?.filter((item) => {
            const itemData = `${item?.name?.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredContacts(newData);
        setValue(text);
    };

    const renderHeader = () => {
        return (
            <View className={"bg-slate-100 p-2 rounded-t-2xl py-3"}>
                <Text className={"text-slate-600"}>{headerTitle}</Text>
            </View>
        );
    };

    const renderFooter = () => {
        return (
            <View className={"bg-slate-100 p-2 rounded-b"}/>
        );
    };

    const renderItem = ({item}) => {

        const name = item.name;
        const searchTerm = value?.toUpperCase();
        const index = name?.toUpperCase().indexOf(searchTerm);
        if (index === -1) {
            return null;
        }
        const start = name?.slice(0, index);
        const highlight = name?.slice(index, index + searchTerm.length);
        const end = name?.slice(index + searchTerm.length);

        return (
            <TouchableOpacity className={"w-full"} onPress={() => {
                setValue(item.name);
                onSelect(item);
                setIsDropDownOpen(false);
            }} style={{padding: 10}}>
                <Text>
                    {start}
                    <Text style={{color: 'dodgerblue'}}>
                        {highlight}
                    </Text>
                    {end}
                </Text>
            </TouchableOpacity>
        )
    }

    return (<View className={"relative z-50"}>
        <TextInput
            className={"bg-white"}
            onChangeText={(text) => {
                searchItems(text);
                onChangeInput(text);
            }}
            onFocus={() => setIsDropDownOpen(true)}
            value={value}
            mode={"outlined"}
            label={inputLabel}
            right={<TextInput.Icon icon={isDropDownOpen  ? "close" : "chevron-down"} size={28} color={'red'} onPress={() => setIsDropDownOpen((value) => !value)}/>}
            onEndEditing={() => setIsDropDownOpen(false)}
        />
        {isDropDownOpen && (<View style={{flex: 1, width: "100%", height: 400, position: "absolute", top:55}}
          className={"bg-white border border-slate-200 shadow-md shadow-slate-400 mt-1 rounded-b-lg rounded-t-2xl z-50"}>
            <FlashList
                data={filteredContacts}
                renderItem={renderItem}
                estimatedItemSize={200}
                keyExtractor={(value, index) => index}
                ItemSeparatorComponent={renderSeparator}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                                // className={"w-full h-full"}
            />
        </View>)}
    </View>);
}

export default memo(DropDownFlashList);