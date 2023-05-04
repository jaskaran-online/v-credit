import {View, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {List, Text, Divider} from 'react-native-paper'

const renderItem = ({item, index}) => <View className={"flex flex-row justify-between px-4 py-2 border-b-2 border-slate-200"}>
    <View>
        <Text variant="titleSmall" class={"text-slate-800"}>{item.title}</Text>
        <Text variant={"labelSmall"} className="text-slate-400">{item.date}</Text>
    </View>
    <TouchableOpacity className={"flex flex-row justify-center items-center"}>
        <Text variant={"titleSmall"}
              className={(index % 2 === 0) ? "text-red-600" : "text-green-600"}>200</Text>
        <List.Icon icon="share" color={(index % 2 === 0) ? "gray" : "dodgerblue" } style={{
            backgroundColor: (index % 2 === 0) ? 'whitesmoke' : '#dbeafe',
            borderRadius: 100,
            padding: 3,
            marginLeft: 10
        }}/>
    </TouchableOpacity>
</View>;

export default function Index() {
    const DATA = [
        {
            title: "First Item",
            date: '17-APR-2022'
        },
        {
            title: "Second Item",
            date: '17-APR-2022'
        },
        {
            title: "First Item",
            date: '17-APR-2022'
        },
        {
            title: "Second Item",
            date: '17-APR-2022'
        },
        {
            title: "First Item",
            date: '17-APR-2022'
        },
        {
            title: "Second Item",
            date: '17-APR-2022'
        },
        {
            title: "First Item",
            date: '17-APR-2022'
        },
        {
            title: "Second Item",
            date: '17-APR-2022'
        },
        {
            title: "First Item",
            date: '17-APR-2022'
        },
        {
            title: "Second Item",
            date: '17-APR-2022'
        },
        {
            title: "First Item",
            date: '17-APR-2022'
        },
        {
            title: "Second Item",
            date: '17-APR-2022'
        },
    ];
    return (
        <View className={"bg-white flex-1"}>
            <FlashList
                data={DATA}
                renderItem={renderItem}
                estimatedItemSize={200}
            />
        </View>
    );
}