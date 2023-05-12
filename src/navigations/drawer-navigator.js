import { Fontisto as Icon } from '@expo/vector-icons';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import {
    StyleSheet,
    useWindowDimensions,
    View
} from 'react-native';

import { Avatar, Button, Text } from "react-native-paper";
import { COLORS } from '../core';
import { HomePage, Reports } from '../screens';


function CustomDrawerContent(props) {
    return (
        <View style={{flex: 1, backgroundColor: COLORS.white}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerHeaderContainer}>
                    <View style={styles.drawerHeaderInnerContainer}>
                        <View>
                            <Text variant={"titleMedium"}>Jaskaran Singh</Text>
                            <Text variant={"bodySmall"} className={"text-slate-600"}>Webcooks.in</Text>
                        </View>
                        <Avatar.Text size={50} color="white" labelStyle={{ fontSize :20 }} label="JS" />
                    </View>
                </View>
                <DrawerItemList {...props} />

                <DrawerItem
                    label="App rating"
                    labelStyle={styles.drawerItemLabel}
                    onPress={() => alert('Will be available soon!')}
                    icon={({size}) => (
                        <Icon name="star" size={size - 5} color={COLORS.primary} />
                    )}
                />

                <DrawerItem
                    label="Invite Friends"
                    labelStyle={styles.drawerItemLabel}
                    onPress={() => alert('Will be available soon!')}
                    icon={({size}) => (
                        <Icon
                            name="share"
                            size={size - 5}
                            color={COLORS.primary}
                        />
                    )}
                />
            </DrawerContentScrollView>

            <View style={styles.footerButtonContainer}>
                <Button
                    mode="contained"
                    compact={true}
                    onPress={() => console.log('Logout')}>
                    Logout
                </Button>
                <View style={styles.footerVersionTextContainer}>
                    <Text className={"text-slate-500"} variant="bodySmall">Version : 00.1</Text>
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
            drawerActiveBackgroundColor={"black"}
            screenOptions={() => ({
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                headerShown: true,
                headerTitleAlign: 'center', headerStyle: {
                    backgroundColor: COLORS.white,
                },
                headerTitleStyle: {
                    color: COLORS.darkTransparent,
                },
                headerTintColor: COLORS.darkTransparent,
            })}>

            <Drawer.Screen
                name="HomePage"
                component={HomePage}
                options={{
                    headerShown: true,
                    drawerActiveTintColor: COLORS.white,
                    drawerActiveBackgroundColor: COLORS.primary,
                    headerStyle : { backgroundColor : '#eff6ff'},
                    title: ({focused}) => (<Text style={{color: focused ? COLORS.white : COLORS.darkTransparent}}>HOME</Text>),
                    drawerIcon: ({focused, size}) => (
                        <Icon name="home" size={size - 5} color={focused ? COLORS.white : COLORS.primary} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Reports"
                component={Reports}
                options={{
                    headerShown: true,
                    headerTitle : "Reports",
                    headerStyle : { backgroundColor : '#eff6ff'},
                    title: ({focused}) =>(<Text style={{color: focused ? COLORS.white : COLORS.darkTransparent}}>Reports</Text>),
                    drawerActiveTintColor: COLORS.white,
                    drawerActiveBackgroundColor: COLORS.primary,
                    drawerIcon: ({focused, size}) => (
                        <Icon name="nav-icon-list-a" size={size - 5} color={focused ? COLORS.white : COLORS.primary} />
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