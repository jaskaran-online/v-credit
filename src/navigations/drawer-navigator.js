import {Fontisto as Icon, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import {Avatar, Button, Dialog, Portal, RadioButton, Text, TextInput} from 'react-native-paper';
import {COLORS} from '../core';
import {HomePage, Reports} from '../screens';
import {useAuth} from '../hooks';
import CustomerList from '../screens/HomePage/CustomerList';
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CustomDrawerContent(props) {
    const signOut = useAuth.use.signOut();
    const auth = useAuth.use?.token();

    return (
        <View style={{flex: 1, backgroundColor: COLORS.white}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerHeaderContainer}>
                    <View style={styles.drawerHeaderInnerContainer}>
                        <View>
                            <Text variant={'titleMedium'}>
                                {auth?.user?.name || 'User Name'}
                            </Text>
                            <Text variant={'bodySmall'} className={'text-slate-600'}>
                                {auth?.user?.email}
                            </Text>
                        </View>
                        <Avatar.Text
                            size={50}
                            color='white'
                            labelStyle={{fontSize: 20}}
                            label='US'
                        />
                    </View>
                </View>
                <DrawerItemList {...props} />

                <DrawerItem
                    label='App Rating'
                    labelStyle={styles.drawerItemLabel}
                    onPress={() => alert('Will be available soon!')}
                    icon={({size}) => (
                        <Icon name='star' size={size - 5} color={COLORS.primary}/>
                    )}
                />

                <DrawerItem
                    label='Invite Friends'
                    labelStyle={styles.drawerItemLabel}
                    onPress={() => alert('Will be available soon!')}
                    icon={({size}) => (
                        <Icon name='share' size={size - 5} color={COLORS.primary}/>
                    )}
                />
            </DrawerContentScrollView>

            <View style={styles.footerButtonContainer}>
                <Button mode='contained' compact={true} onPress={() => signOut()}>
                    Logout
                </Button>
                <View style={styles.footerVersionTextContainer}>
                    <Text className={'text-slate-500'} variant='bodySmall'>
                        Version : 00.1
                    </Text>
                </View>
            </View>
        </View>
    );
}

const Drawer = createDrawerNavigator();

export const useAuthCompanyStore = create(persist((set) => ({
    selectedCompany: null,
    setCompany: (newState) => set((state) => ({selectedCompany: newState})),
}),{
    name: 'auth-store',
    storage: createJSONStorage(() => AsyncStorage),
}));

export function DrawerNavigator() {

    const auth = useAuth.use?.token();
    const hasRoleOneOrFour = auth?.user?.roles?.some(
        (role) => role.id === 1 || role.id === 4,
    );

    const dimensions = useWindowDimensions()

    const setCompany = useAuthCompanyStore((state) => state.setCompany);
    const company = useAuthCompanyStore((state) => state.selectedCompany);

    const [showCompanySwitchModal, setShowCompanySwitchModal] = useState(false);
    const [checked, setChecked] = useState(auth?.user?.company?.id);
    const showCompanySwitchModalHandler = () => {
        setShowCompanySwitchModal(true);
    }

    const hideCompanySwitchModalHandler = () => {
        setShowCompanySwitchModal(false);
    }

    useEffect(function () {
        if(!company){
            setCompany(auth?.user?.company);
        }
    }, []);

    return (
        <Drawer.Navigator
            drawerContent={CustomDrawerContent}
            initialRouteName='HomePage'
            allowFontScaling={false}
            animationEnabled
            drawerActiveBackgroundColor={'black'}
            screenOptions={() => ({
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                headerShown: true,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: COLORS.white,
                },
                headerTitleStyle: {
                    color: COLORS.darkTransparent,
                },
                headerTintColor: COLORS.darkTransparent,
                headerShadowVisible: false,
            })}
        >
            <Drawer.Screen
                name='HomePage'
                component={HomePage}
                options={{
                    headerShown: true,
                    drawerActiveTintColor: COLORS.white,
                    drawerActiveBackgroundColor: COLORS.primary,
                    headerStyle: {backgroundColor: '#eff6ff'},
                    title: company?.name || 'Home',
                    headerRight: ({size}) => (
                        <>
                            <Button onPress={showCompanySwitchModalHandler}
                                    className={'bg-white rounded-full mr-2 border-2 shadow-sm'}>
                                <MaterialCommunityIcons name={"account-switch"} size={20} color={COLORS.primary}/>
                            </Button>

                            <Portal>
                                <Dialog visible={showCompanySwitchModal} onDismiss={hideCompanySwitchModalHandler}
                                        className={"bg-white rounded"}>
                                    <Dialog.Title style={{fontSize: 18}} className={"font-semibold"}>Please select
                                        company</Dialog.Title>
                                    <Dialog.Content style={{minHeight: 100}}>
                                        <ScrollView>
                                            {(auth?.user?.companies).map((listCompany) => {
                                                return (<View key={listCompany.id}>
                                                    <TouchableHighlight activeOpacity={1} underlayColor={"#eff6ff"}
                                                                        onPress={() => {
                                                                            setChecked(listCompany.id);
                                                                            setCompany(listCompany);
                                                                        }}>
                                                        <View className={"flex-row items-center gap-x-1 ml-1"}>
                                                            <RadioButton
                                                                value={listCompany.id}
                                                                status={(checked === listCompany.id || company.id === listCompany.id) ? 'checked' : 'unchecked'}
                                                            />
                                                            <Text>{listCompany.name}</Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                </View>)
                                            })}
                                        </ScrollView>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button mode={"contained"} className={"px-6 rounded bg-blue-800"}
                                                onPress={hideCompanySwitchModalHandler}>Done</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </>
                    ),
                    drawerIcon: ({focused, size}) => (
                        <Icon
                            name='home'
                            size={size - 5}
                            color={focused ? COLORS.white : COLORS.primary}
                        />
                    ),
                }}
            />
            {hasRoleOneOrFour && (
                <Drawer.Screen
                    name='Reports'
                    component={Reports}
                    options={{
                        headerShown: true,
                        headerTitle: 'Reports',
                        headerStyle: {backgroundColor: '#eff6ff'},
                        title: ({focused}) => (
                            <Text
                                style={{
                                    color: focused ? COLORS.white : COLORS.darkTransparent,
                                }}
                            >
                                Reports
                            </Text>
                        ),
                        drawerActiveTintColor: COLORS.white,
                        drawerActiveBackgroundColor: COLORS.primary,
                        drawerIcon: ({focused, size}) => (
                            <Icon
                                name='nav-icon-list-a'
                                size={size - 5}
                                color={focused ? COLORS.white : COLORS.primary}
                            />
                        ),
                    }}
                />
            )}
            <Drawer.Screen
                name='Customers'
                component={CustomerList}
                options={{
                    headerShown: true,
                    drawerActiveTintColor: COLORS.white,
                    drawerActiveBackgroundColor: COLORS.primary,
                    headerStyle: {backgroundColor: '#eff6ff'},
                    drawerIcon: ({focused, size}) => (
                        <Ionicons
                            name='people'
                            size={size - 5}
                            color={focused ? COLORS.white : COLORS.primary}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    footerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    footerVersionTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    footerButtonContainer: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        padding: 20,
    },
    languageSwitcherButton: {
        backgroundColor: COLORS.red,
        borderRadius: 4,
    },
    drawerCloseButton: {
        height: 30,
        width: 30,
        backgroundColor: COLORS.gray,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    drawerHeaderContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 0.5,
        marginBottom: 20,
    },
    drawerHeaderInnerContainer: {
        paddingBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    drawerItemLabel: {
        color: COLORS.darkTransparent,
        fontSize: 13,
    },
});
