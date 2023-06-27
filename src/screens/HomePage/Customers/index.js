import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {List, Text, Divider} from 'react-native-paper'

import navigation from '../../../navigations/index'
import {useCustomersData} from "../../../apis/useApi";
import {useCallback, useEffect, useState} from "react";
import {useAuth} from "../../../hooks";
import { useFocusEffect } from "@react-navigation/native";
import {useQueryClient} from "@tanstack/react-query";
const renderItem = ({item, index}) => {

    const  toPay = item?.sumAmountByType?.toPay || 0;
    const toReceive = item?.sumAmountByType?.toReceive || 0;

    if(toPay == 0 && toReceive == 0){
        return null;
    }

    return (<View
        className={"flex flex-row justify-between px-4 py-2 border-b-2 border-slate-200"}>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerTransactionDetails', {
            id: item?.id,
            name: item?.name
        })}>
            <Text variant="titleSmall" class={"text-slate-800"}>{item?.name}</Text>
            <Text variant={"labelSmall"} className="text-slate-400">{item?.created_at}</Text>
        </TouchableOpacity>
        <TouchableOpacity className={"flex flex-row justify-center items-center"}  onPress={() => navigation.navigate('CustomerTransactionDetails', {
            id: item?.id,
            name: item?.name
        })}>
            <Text variant={"titleSmall"}
                  className={(toPay > toReceive) ? "text-red-600" : "text-green-600"}>
                {
                    Math.abs(toReceive > 0 ?  parseFloat(toReceive - toPay).toFixed(2)   : toPay > 0 ?   parseFloat(toPay - toReceive).toFixed(2) :   parseFloat(toReceive - toPay).toFixed(2))
                }
            </Text>
        </TouchableOpacity>
    </View>);
};

export default function Index() {

    const queryClient = useQueryClient();
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
                data={data?.data}
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