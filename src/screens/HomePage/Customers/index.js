import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {List, Text, Divider} from 'react-native-paper'
import _ from 'lodash';
import navigation from '../../../navigations/index'
import {useCustomersData} from "../../../apis/useApi";
import {useCallback, useEffect, useState} from "react";
import {useAuth} from "../../../hooks";
import { useFocusEffect } from "@react-navigation/native";
import {useFilterToggleStore} from "../../Components/TwoCards";

const renderItem = ({item, index}) => {

    const toPay = parseFloat((item?.toPay || 0).toFixed(2));
    const toReceive = parseFloat((item?.toReceive || 0).toFixed(2));

    let balance = 0;
    let color = "text-slate-400";
    if(toReceive > toPay){
        balance = toReceive - toPay;
        color = "text-green-700";
    }else if( toReceive < toPay){
        balance = toPay - toReceive
        color = "text-red-400";
    }

    return (<View
        className={"flex flex-row justify-between px-4 py-2 border-b-2 border-slate-200"}>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerTransactionDetails', {
            id: item.customer?.id,
            name: item.customer?.name
        })}>
            <Text variant="titleSmall" class={"text-slate-800"}>{item?.customer?.name}</Text>
            <Text variant={"labelSmall"} className="text-slate-400">{item?.customer?.created_at}</Text>
        </TouchableOpacity>
        <TouchableOpacity className={"flex flex-row justify-center items-center"}  onPress={() => navigation.navigate('CustomerTransactionDetails', {
            id: item.customer?.id,
            name: item.customer?.name
        })}>
            <View className={"mr-3"}>
                <Text variant={"bodyMedium"} className={`${color} `}>{(balance).toFixed(2) } ₹</Text>
            </View>
        </TouchableOpacity>
    </View>);
};

export default function Index() {
    useFocusEffect(
        useCallback(() => {
            loadCustomerData();
            return () => {
                // Useful for cleanup functions
                console.log("Screen was unfocused");
            };
        }, [])
    );

    const {mutate, data, isLoading, error} = useCustomersData();
    const [reload, setReload] = useState(false);
    const auth = useAuth?.use?.token();

    const filterBy = useFilterToggleStore(state => state.filterBy);
    const [orderedData, setOrderedData] = useState([]);

    useEffect(() => {
        if(data?.data){
            if(filterBy !== "none"){
                const orderedArray = _.orderBy(data?.data, ['type'], [filterBy === "toReceive" ? 'desc' : 'asc']);
                setOrderedData(orderedArray);
            }else{
                setOrderedData(data?.data);
            }
        }
    }, [filterBy, data, isLoading]);

    function loadCustomerData(){
        setReload(true)
        const formData = new FormData();
        formData.append('cost_center_id', auth?.user.cost_center_id);
        formData.append('company_id', auth?.user.company_id);
        formData.append('user_id', auth?.user.id);
        mutate(formData);
        setReload(false)
    }

    useEffect(() => {
        loadCustomerData();
    }, []);

    return (
        <View className={"bg-white flex-1"}>
            {isLoading && !data ? <View className={"flex-1 justify-center"}>
                <ActivityIndicator/>
            </View> : <FlashList
                data={orderedData}
                renderItem={renderItem}
                estimatedItemSize={200}
                refreshing={reload}
                onRefresh={loadCustomerData}
                ListFooterComponent={<View style={{height: 100}}/>}
                ListEmptyComponent={<View className={"flex-1 d-flex justify-center items-center h-16"}><Text variant={"bodyMedium"}>No Records Available!</Text></View>}
            />}
        </View>
    );
}