import {View, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {List, Text, Divider} from 'react-native-paper'

const renderItem = ({item, index}) => <List.Item
    descriptionStyle={{color: 'gray', fontSize: 12, marginTop: 4}}
    title={item.title}
    description={item.date}
    right={props => (<TouchableOpacity className={"flex flex-row justify-center items-center"}>
        <Text variant={"titleMedium"}
              className={(index % 2 == 0) ? "text-red-600" : "text-green-600"}>200$</Text>
        <List.Icon {...props} icon="share" color={"dodgerblue"} style={{
            backgroundColor: '#dbeafe',
            borderRadius: 100,
            padding: 5,
            marginLeft: 10
        }}/>
    </TouchableOpacity>)}
/>;

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