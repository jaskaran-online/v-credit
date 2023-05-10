import {View, Image, KeyboardAvoidingView} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {useState} from "react";
import Images from "../../core/images";
import {StatusBar} from "expo-status-bar";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {COLORS} from "../../core";
export default function Index() {

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);

    return (
        <View className={"flex-1"}>
            <StatusBar />

            <View className={"w-[50] h-[50] bg-slate-50 absolute top-[85%] right-[15%] z-10 rounded-full"}/>
            <View className={"w-[30] h-[30] bg-neutral-100 absolute top-[20%] left-[15%] z-10 rounded-full"}/>
            <View className={"w-[150] h-[150] bg-green-50 absolute top-[-20] right-[-30] z-30 rounded-full"}/>
            <View className={"w-[150] h-[150] bg-blue-50 absolute bottom-[-40] left-[-30] z-30 rounded-full"}/>

            <KeyboardAvoidingView behavior='padding' className="flex-1 items-center justify-evenly bg-white w-full">
                <View className={"h-1/2 w-full px-6 flex"}>
                    <Image source={require("../../../assets/logo.png")} className={"w-[150] h-[150] m-auto"}/>
                    <Text variant={"titleLarge"} className={"mb-2 text-3xl text-slate-900"}>Login</Text>
                    <View className={"w-full flex-1"}>
                        <>
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={text => setEmail(text)}
                                className={"mb-4 bg-white"}
                                mode={"outlined"}
                                placeholder={"Enter Email"}
                                placeholderTextColor={COLORS.darkGray}
                                activeOutlineColor={"darkgreen"}
                                left={
                                    <TextInput.Icon
                                        onPress={() => { isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true) }}
                                        icon={() => <MaterialCommunityIcons name={"email"} size={20} />}/>
                                }
                            />
                            <TextInput
                                label="Password"
                                placeholder={"Enter Password"}
                                value={password}
                                mode={"outlined"}
                                className={"bg-white"}
                                secureTextEntry={isPasswordSecure}
                                placeholderTextColor={COLORS.darkGray}
                                activeOutlineColor={"darkgreen"}
                                right={
                                    <TextInput.Icon
                                         onPress={() => { isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true) }}
                                         icon={() => <MaterialCommunityIcons name={isPasswordSecure ? "eye-off" : "eye"} size={24} />}/>
                                }
                                left={
                                    <TextInput.Icon
                                        onPress={() => { isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true) }}
                                        icon={() => <MaterialCommunityIcons name={"key"} size={20} />}/>
                                }
                                onChangeText={text => setPassword(text)}
                            />
                        </>
                        <Button mode={"contained"} className={"bg-emerald-900 rounded-md mt-4 h-12 justify-center"} onPress={() => console.log('login')}>Login</Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}