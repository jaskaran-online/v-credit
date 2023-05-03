import {View, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {List, Text, Divider, TextInput, Menu, Searchbar} from 'react-native-paper'
import {useState} from "react";
import {Feather} from "@expo/vector-icons";

const renderItem = ({item, index}) => <List.Item
    descriptionStyle={{color: 'gray', fontSize: 12, marginTop: 4}}
    title={item.title}
    description={item.description}
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

    const data = [
        {id: '1', title: 'Item 1', description: 'This is item 1'},
        {id: '2', title: 'Item 2', description: 'This is item 2'},
        {id: '3', title: 'Item 3', description: 'This is item 3'},
        {id: '4', title: 'Item 4', description: 'This is item 4'},
        {id: '5', title: 'Item 5', description: 'This is item 5'},
    ];

    const options = [
        {label: 'Name', onPress: handleClearSelection},
        {label: 'Amount', onPress: handleDeleteSelectedItem},
        {label: 'Txn', onPress: handleEditSelectedItem},
    ];

    const [filteredList, setFilteredList] = useState(data);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [query, setQuery] = useState(false);
    const handleSearch = text => {
        setQuery(text);
        const filtered = data.filter(item => item.title.toLowerCase().includes(text.toLowerCase()));
        setFilteredList(filtered);
        console.log(filtered);
    };

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


    return (
        <View className={"bg-white flex-1"}>
            <View className={"flex flex-row justify-between w-full px-3 items-center py-4"}>
                <View className={"flex flex-row relative"} style={{width: '80%'}}>
                    <Searchbar
                        onChangeText={handleSearch}
                        value={query}
                        style={{
                            width: '100%',
                        }}
                        inputStyle={{
                            fontSize:12
                        }}
                        placeholder="Search Name, Amount or Txn Note"
                        className={"bg-white border-2 border-slate-200 h-12"}
                    />
                </View>
                <View className={"flex"} style={{width: '15%'}}>
                    {options && (
                        <TouchableOpacity
                            className="p-2 bg-white border-slate-900 shadow shadow-slate-300 rounded-xl w-[48] mt-1 h-[40] justify-center items-center"
                            onPress={() => handleOptionSelect(true)}>
                            <Feather name="filter" size={20} color="black"/>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
                    {showOptions &&  <View
                        style={{ flex: 1, position: 'absolute', zIndex : 9999999, backgroundColor: 'white' }}
                        className={"border-2 border-slate-100 shadow-black shadow-lg right-10 top-14"}
                    >
                        {options.map((value, index, array) => {
                            return <>
                                <TouchableOpacity onPress={value.onPress}>
                                    <Menu.Item icon="content-paste"  title={value.label} />
                                </TouchableOpacity>
                            </>
                        })}
                    </View>}


            <FlashList
                data={filteredList}
                renderItem={renderItem}
                estimatedItemSize={200}
                onSearch={handleSearch}
                onSelect={handleSelect}
                selected={selectedItem}
                showOptions={showOptions}
                options={options}
                onOptionSelect={handleOptionSelect}
            />
        </View>
    );
}