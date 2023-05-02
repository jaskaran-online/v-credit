import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import React, {useContext, useState} from 'react';
import { SimpleLineIcons as Icon } from '@expo/vector-icons';
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    Pressable, Button
} from 'react-native';

import {Reports, HomePage} from '../screens'
import {COLORS} from '../core';

const PROFILE_PIC =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp=CAU';

function CustomDrawerContent(props) {
    return (
        <View style={{flex: 1, backgroundColor: COLORS.white}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerHeaderContainer}>
                    <View style={styles.drawerHeaderInnerContainer}>
                        <View>
                            <Text style={{color: 'dodgerblue'}}>Login Name</Text>
                            <Text style={{color: 'dodgerblue'}}>Description</Text>
                        </View>
                        <Image
                            source={{
                                uri: PROFILE_PIC,
                            }}
                            style={{width: 60, height: 60, borderRadius: 30}}
                        />
                    </View>
                </View>
                <DrawerItemList {...props} />

                <DrawerItem
                    label={'RATE_APP_NOW'}
                    labelStyle={styles.drawerItemLabel}
                    onPress={() => Linking.openURL('market://details?id=com.ycw')}
                    icon={({focused, size, color}) => (
                        <Icon name="star" size={size} color={COLORS.orange} />
                    )}
                />

                <DrawerItem
                    label={'INVITE_FRIENDS'}
                    labelStyle={styles.drawerItemLabel}
                    onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.ycw&hl=en_IN&gl=US')}
                    icon={({focused, size, color}) => (
                        <Icon
                            name="share"
                            size={size}
                            color={COLORS.deeppink}
                        />
                    )}
                />
            </DrawerContentScrollView>

            <View style={styles.footerButtonContainer}>
                <Button
                    title={'LOGOUT_BUTTON'}
                    buttonStyle={styles.languageSwitcherButton}
                    onPress={() => console.log('Logout')}
                />

                <View style={styles.footerVersionTextContainer}>
                    <Pressable onPress={() => Linking.openURL('https://jaskaran.com/')}>
                        <Text style={{color: "dodgerblue"}}>jaskaran.com</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {

    const dimensions = useWindowDimensions();

    return (
        <Drawer.Navigator
            drawerContent={CustomDrawerContent}
            initialRouteName="HomePage"
            allowFontScaling={false}
            animationEnabled
            drawerActiveBackgroundColor={"dodgerblue"}
            screenOptions={({navigation, route}) => ({
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                headerShown: true,
                headerTitleAlign: 'center', headerStyle: {
                    backgroundColor: COLORS.white,
                },
                headerTitleStyle: {
                    color: "dodgerblue",
                },
                headerTintColor: "dodgerblue",
            })}>

            <Drawer.Screen
                name="HomePage"
                component={HomePage}
                options={{
                    headerShown: true,
                    drawerActiveTintColor: COLORS.white,
                    drawerActiveBackgroundColor: "dodgerblue",
                    title: ({focused}) => (<Text style={{color: focused ? COLORS.white : "dodgerblue"}}>HOME</Text>),
                    drawerIcon: ({focused, size, color}) => (
                        <Icon name="home" size={size} color={focused ? COLORS.white : "dodgerblue"} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Reports"
                component={Reports}
                options={{
                    headerShown: true,
                    title: ({focused}) =>(<Text style={{color: focused ? COLORS.white : "dodgerblue"}}>Reports</Text>),
                    drawerActiveTintColor: COLORS.white,
                    drawerActiveBackgroundColor: "dodgerblue",
                    drawerIcon: ({focused, size}) => (
                        <Icon name="plus" size={size} color={focused ? COLORS.white : "dodgerblue"} />
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
        paddingTop: 20,
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
        color: "dodgerblue",
        fontSize: 16,
    },
});