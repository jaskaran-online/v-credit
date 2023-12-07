/* eslint-disable react/no-unstable-nested-components */
import {
  Fontisto as Icon,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  SimpleLineIcons,
} from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  TouchableHighlight,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  RadioButton,
  Text,
} from 'react-native-paper';
import { COLORS } from '../core';
import { HomePage, Reports } from '../screens';
import { useAuth } from '../hooks';
import CustomerList from '../screens/HomePage/CustomerList';
import { useAuthCompanyStore } from '../core/utils';
import appJSON from '../../app.json';
import { ProfitLoss } from '../screens';
const openPlayStore = () => {
  const playStoreUrl =
    'https://play.google.com/store/apps/details?id=com.webcooks.mycreditbook';

  Linking.canOpenURL(playStoreUrl)
    .then((supported) => {
      if (supported) {
        Linking.openURL(playStoreUrl);
      } else {
        console.log("Can't open Play Store app.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

function CustomDrawerContent(props) {
  const signOut = useAuth?.use?.signOut();
  const auth = useAuth.use?.token();

  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [deleteAccountLoading, setLoadingDeleteAccount] = useState(false);

  const toggleDeleteModalHandler = () => {
    setLoadingDeleteAccount(true);
    setTimeout(function () {
      setLoadingDeleteAccount(false);
      signOut();
    }, 3000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, marginLeft: 20 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeaderContainer}>
          <View style={styles.drawerHeaderInnerContainer}>
            <View>
              <Avatar.Text
                size={40}
                color="white"
                labelStyle={{ fontSize: 15 }}
                label="US"
              />
              <Text variant={'titleMedium'} className="mt-3">
                {auth?.user?.name || 'User Name'}
              </Text>
              <Text variant={'bodySmall'} className={'text-slate-600'}>
                {auth?.user?.email}
              </Text>
            </View>
          </View>
        </View>

        <DrawerItemList {...props} />

        <DrawerItem
          label="App Rating"
          labelStyle={styles.drawerItemLabel}
          onPress={openPlayStore}
          icon={({ size }) => (
            <AntDesign
              name="staro"
              size={size - 5}
              color={COLORS.darkTransparent}
            />
          )}
        />

        <DrawerItem
          label="Invite Friends"
          labelStyle={styles.drawerItemLabel}
          onPress={async () => {
            await Share.share({
              message: `https://play.google.com/store/apps/details?id=com.webcooks.mycreditbook&pcampaignid=web_share`,
            });
          }}
          icon={({ size }) => (
            <AntDesign
              name="sharealt"
              size={size - 5}
              color={COLORS.darkTransparent}
            />
          )}
        />
      </DrawerContentScrollView>

      <View style={styles.footerButtonContainer}>
        <Button
          mode="contained"
          compact={true}
          onPress={() => signOut()}
          icon={'door'}
        >
          Logout
        </Button>
        <Button
          mode="contained"
          compact={true}
          onPress={() => setDeleteModalVisibility(true)}
          icon={'delete'}
          className={'mt-2 mb-1 bg-red-500'}
        >
          Delete Account
        </Button>
        <View style={styles.footerVersionTextContainer} className={'mb-2'}>
          <Text className={'text-slate-600 font-bold'} variant="bodyMedium">
            Version : {appJSON.expo.version}
          </Text>
        </View>
      </View>

      <Portal>
        <Dialog visible={deleteModalVisibility} className={'bg-white rounded'}>
          <Dialog.Title style={{ fontSize: 14 }} className={'font-bold'}>
            Are you sure you want to delete account ?
          </Dialog.Title>
          <Dialog.Content style={{ minHeight: 100 }}>
            <View className={'flex-row justify-center items-center'}>
              <Image
                source={{
                  uri: 'https://assets-v2.lottiefiles.com/a/e09820ea-116b-11ee-8e93-4f2a1602d144/HdbA8EJlUN.gif',
                  width: 100,
                  height: 100,
                }}
                className={'my-2'}
              />
            </View>
            <Text
              variant={'bodyMedium'}
              className={'mb-1 text-red-600 font-semibold'}
            >
              {' '}
              You cannot undo this action afterwards!{' '}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode={'contained'}
              className={'px-4 rounded bg-red-500'}
              onPress={() => toggleDeleteModalHandler()}
              loading={deleteAccountLoading}
            >
              {deleteAccountLoading ? 'Please wait' : 'Agree'}
            </Button>
            <Button
              mode={'contained'}
              className={'px-4 rounded bg-gray-800'}
              onPress={() => setDeleteModalVisibility(false)}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const Drawer = createDrawerNavigator();

const CompanySwitch = () => {
  const auth = useAuth.use?.token();
  const setCompany = useAuthCompanyStore((state) => state.setCompany);
  const [showCompanySwitchModal, setShowCompanySwitchModal] = useState(false);
  const [checked, setChecked] = useState(auth?.user?.company?.id);
  const showCompanySwitchModalHandler = () => {
    setShowCompanySwitchModal(true);
  };

  const hideCompanySwitchModalHandler = () => {
    setShowCompanySwitchModal(false);
  };

  return (
    <>
      <Button
        onPress={showCompanySwitchModalHandler}
        className={'bg-white rounded-full mr-2 border-2 shadow-sm'}
      >
        <MaterialCommunityIcons
          name={'account-switch'}
          size={20}
          color={COLORS.primary}
        />
      </Button>

      <Portal>
        <Dialog
          visible={showCompanySwitchModal}
          onDismiss={hideCompanySwitchModalHandler}
          className={'bg-white rounded'}
        >
          <Dialog.Title style={{ fontSize: 18 }} className={'font-semibold'}>
            Please select company
          </Dialog.Title>
          <Dialog.Content style={{ minHeight: 100 }}>
            <ScrollView>
              {auth?.user?.companies?.map((companyItem) => {
                return (
                  <View key={companyItem.id}>
                    <TouchableHighlight
                      activeOpacity={1}
                      underlayColor={'#eff6ff'}
                      onPress={() => {
                        setChecked(companyItem.id);
                        setCompany(companyItem);
                      }}
                    >
                      <View className={'flex-row items-center gap-x-1 ml-1'}>
                        <RadioButton
                          value={companyItem.id}
                          status={
                            checked === companyItem.id ? 'checked' : 'unchecked'
                          }
                        />
                        <Text>{companyItem.name}</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                );
              })}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode={'contained'}
              className={'px-4 rounded bg-blue-800'}
              onPress={hideCompanySwitchModalHandler}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export function DrawerNavigator() {
  const auth = useAuth.use?.token();
  const hasRoleOneOrFour = auth?.user?.roles?.some(
    (role) => role.id === 1 || role.id === 4,
  );
  const dimensions = useWindowDimensions();
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const drawerLabelStyleCustom = {
    fontSize: 15,
    fontWeight: 600,
    color: COLORS.darkTransparent,
  };

  return (
    <React.Fragment>
      <Drawer.Navigator
        drawerContent={CustomDrawerContent}
        initialRouteName="HomePage"
        allowFontScaling={false}
        animationEnabled={true}
        drawerActiveBackgroundColor={'black'}
        screenOptions={() => ({
          overlayColor: 'rgba(190,190,190,0.4)',
          drawerType: '',
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
          drawerStyle: {
            width: Dimensions.get('window').width / 1.3,
          },
        })}
      >
        <Drawer.Screen
          name="HomePage"
          component={HomePage}
          options={{
            headerShown: true,
            drawerActiveBackgroundColor: 'transparent',
            drawerActiveTintColor: COLORS.primary,
            drawerLabelStyle: drawerLabelStyleCustom,
            headerStyle: { backgroundColor: '#eff6ff' },
            title: ({ focused }) => (
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.darkTransparent,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {company?.name || 'Home'}
              </Text>
            ),
            headerRight: () => <CompanySwitch />,
            drawerIcon: ({ focused, size }) => (
              <AntDesign
                name="home"
                size={size - 5}
                color={focused ? COLORS.primary : COLORS.darkTransparent}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Profit and Loss"
          component={ProfitLoss}
          options={{
            headerShown: true,
            headerTitle: 'Profit and Loss',
            headerStyle: { backgroundColor: '#eff6ff' },
            drawerLabelStyle: drawerLabelStyleCustom,
            title: ({ focused }) => (
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.darkTransparent,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Profit and Loss
              </Text>
            ),
            drawerActiveBackgroundColor: 'transparent',
            drawerIcon: ({ focused, size }) => (
              <AntDesign
                name="barschart"
                size={size - 5}
                color={focused ? COLORS.primary : COLORS.darkTransparent}
              />
            ),
          }}
        />
        {hasRoleOneOrFour && (
          <Drawer.Screen
            name="Reports"
            component={Reports}
            options={{
              headerShown: true,
              headerTitle: 'Reports',
              headerStyle: { backgroundColor: '#eff6ff' },
              title: ({ focused }) => (
                <Text
                  style={{
                    color: focused ? COLORS.primary : COLORS.darkTransparent,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Reports
                </Text>
              ),
              drawerActiveBackgroundColor: 'transparent',
              drawerActiveTintColor: COLORS.primary,
              drawerLabelStyle: drawerLabelStyleCustom,
              drawerIcon: ({ focused, size }) => (
                <AntDesign
                  name="linechart"
                  size={size - 5}
                  color={focused ? COLORS.primary : COLORS.darkTransparent}
                />
              ),
            }}
          />
        )}
        <Drawer.Screen
          name="Customers"
          component={CustomerList}
          options={{
            headerShown: true,
            drawerActiveBackgroundColor: 'transparent',
            drawerLabelStyle: drawerLabelStyleCustom,
            drawerActiveTintColor: COLORS.primary,
            headerStyle: { backgroundColor: '#eff6ff' },
            drawerIcon: ({ focused, size }) => (
              <SimpleLineIcons
                name="people"
                size={size - 5}
                color={focused ? COLORS.primary : COLORS.darkTransparent}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  drawerHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  drawerHeaderInnerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  drawerItemLabel: {
    color: COLORS.darkTransparent,
    fontSize: 15,
    fontWeight: 600,
  },
  footerButtonContainer: {
    bottom: 0,
    left: 0,
    padding: 20,
    position: 'absolute',
    right: 20,
  },
  footerVersionTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
