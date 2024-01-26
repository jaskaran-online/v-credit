import { AntDesign, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text } from 'react-native-paper';

import appJSON from '../../app.json';
import { useVerifyUserAuthApi, useGetCustomersList } from '../apis/use-api';
import AccordionItem from '../components/accordion-item';
import Avatar from '../components/avatar';
import { COLORS } from '../core';
import { useAuth } from '../hooks';
import { useAuthStore } from '../hooks/auth-store';
import { useAuthCompanyStore, useContactsStore } from '../hooks/zustand-store';
import { HomePage, ProfitLoss, Reports } from '../screens';
import CustomerList from '../screens/customers-list';
import { loadContacts } from '../service/contactService';

const openPlayStore = () => {
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.webcooks.mycreditbook';

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
  const { user: auth, logout: signOut } = useAuthStore();
  const setContacts = useContactsStore((state) => state.setContacts);

  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [deleteAccountLoading, setLoadingDeleteAccount] = useState(false);

  const toggleDeleteModalHandler = () => {
    setLoadingDeleteAccount(true);
    setTimeout(function () {
      setLoadingDeleteAccount(false);
      setContacts([]);
      signOut();
    }, 3000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, marginLeft: 20 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeaderContainer}>
          <View style={styles.drawerHeaderInnerContainer}>
            <View>
              <Avatar size={50} name={auth?.user?.name} color={COLORS.primary} />
              <Text variant="titleMedium" className="mt-1">
                {auth?.user?.name || 'User Name'}
              </Text>
              <Text variant="bodySmall" className="text-slate-600">
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
            <AntDesign name="staro" size={size - 3} color={COLORS.darkTransparent} />
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
            <AntDesign name="sharealt" size={size - 3} color={COLORS.darkTransparent} />
          )}
        />
      </DrawerContentScrollView>

      <View style={styles.footerButtonContainer}>
        <View className="ml-5 my-4">
          <TouchableOpacity
            onPress={() => {
              signOut();
              setContacts([]);
              props.navigation.closeDrawer();
            }}
            className="mt-6 flex-row items-center gap-x-8">
            <AntDesign name="enter" size={22} color={COLORS.darkTransparent} />
            <Text
              style={{
                fontSize: 15,
                fontWeight: 500,
              }}>
              Logout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDeleteModalVisibility(true)}
            className="mt-6 flex-row items-center gap-x-8">
            <AntDesign name="delete" size={22} color={COLORS.darkTransparent} />
            <Text
              style={{
                fontSize: 15,
                fontWeight: 500,
              }}>
              Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://mycreditbook.com/privacy-policy.html').catch((err) =>
                console.error('Error', err)
              );
            }}
            className="mt-6 flex-row items-center gap-x-8">
            <AntDesign name="lock" size={22} color={COLORS.darkTransparent} />
            <Text
              style={{
                fontSize: 15,
                fontWeight: 500,
              }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerVersionTextContainer} className="mb-2">
          <Text className="text-slate-600 " variant="bodyMedium">
            Version : {appJSON.expo.version}
          </Text>
        </View>
      </View>

      <Portal>
        <Dialog visible={deleteModalVisibility} className="rounded bg-white">
          <Dialog.Title style={{ fontSize: 14 }} className="font-bold">
            Are you sure you want to delete account ?
          </Dialog.Title>
          <Dialog.Content style={{ minHeight: 100 }}>
            <View className="flex-row items-center justify-center">
              <Image
                source={{
                  uri: 'https://assets-v2.lottiefiles.com/a/e09820ea-116b-11ee-8e93-4f2a1602d144/HdbA8EJlUN.gif',
                  width: 100,
                  height: 100,
                }}
                className="my-2"
              />
            </View>
            <Text variant="bodyMedium" className="mb-1 font-semibold text-red-600">
              {' '}
              You cannot undo this action afterwards!{' '}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              className="rounded bg-red-500 px-4"
              onPress={() => toggleDeleteModalHandler()}
              loading={deleteAccountLoading}>
              {deleteAccountLoading ? 'Please wait' : 'Agree'}
            </Button>
            <Button
              mode="contained"
              className="rounded bg-gray-800 px-4"
              onPress={() => setDeleteModalVisibility(false)}>
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
  const { user: auth } = useAuthStore();
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
        className="mr-2 rounded-full border-2 bg-white shadow-sm">
        <MaterialCommunityIcons name="account-switch" size={20} color={COLORS.primary} />
      </Button>

      <Portal>
        <Dialog
          visible={showCompanySwitchModal}
          onDismiss={hideCompanySwitchModalHandler}
          className="rounded bg-white">
          <Dialog.Title style={{ fontSize: 18 }} className="font-semibold">
            Please select company
          </Dialog.Title>
          <Dialog.Content style={{ minHeight: 100 }}>
            <ScrollView>
              {auth?.user?.companies?.map((companyItem) => {
                return (
                  <View key={companyItem.id}>
                    <TouchableHighlight
                      activeOpacity={1}
                      underlayColor="#eff6ff"
                      onPress={() => {
                        setChecked(companyItem.id);
                        setCompany(companyItem);
                      }}>
                      <View className="ml-1 flex-row items-center gap-x-1">
                        <RadioButton
                          value={companyItem.id}
                          status={checked === companyItem.id ? 'checked' : 'unchecked'}
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
              mode="contained"
              className="rounded bg-blue-800 px-4"
              onPress={hideCompanySwitchModalHandler}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export function DrawerNavigator() {
  const { user: auth } = useAuthStore();
  const hasRoleOneOrFour = auth?.user?.roles?.some((role) => role.id === 1 || role.id === 4);
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  const contactsList = useContactsStore((state) => state.contactsList);
  const setContacts = useContactsStore((state) => state.setContacts);

  const { mutate: getCustomerRequest, data: apiCustomersList } = useGetCustomersList();

  async function getContacts() {
    console.log('getContacts called');
    const fetchContacts = async () => {
      setContacts([]);
      try {
        const existingContacts = await loadContacts();

        const contactsOnlyWithPhoneNumbers = existingContacts.filter((obj) =>
          obj.hasOwnProperty('phoneNumbers')
        );

        // Handle API customers list update
        if (apiCustomersList?.data) {
          const newContacts = apiCustomersList.data.map((obj) => ({
            id: obj.id,
            name: obj.name,
            digits: obj.phone,
            contactType: 'person',
            phoneNumbers: obj.phone ? [{ digits: obj.phone }] : [],
            imageAvailable: false,
          }));
          setContacts([...newContacts, ...contactsOnlyWithPhoneNumbers]);
        } else {
          setContacts(contactsOnlyWithPhoneNumbers);
        }
      } catch (error) {
        console.error('Failed to load contacts:', error);
      }
    };

    if (contactsList.length === 0 || apiCustomersList?.data) {
      await fetchContacts();
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getContacts();
    }, 6000);
  }, [apiCustomersList]);

  useEffect(() => {
    if (company?.id && auth.user?.cost_center_id) {
      getCustomerRequest({
        company_id: company.id,
        cost_center_id: auth.user.cost_center_id,
      });
    }
  }, [company?.id]);

  const drawerLabelStyleCustom = {
    fontSize: 15,
    fontWeight: 500,
    color: COLORS.darkTransparent,
  };

  const signOut = useAuth?.use?.signOut();

  const {
    mutate: verifyUser,
    isError: isVerifyUserError,
    isLoading: isVerifyUserLoading,
  } = useVerifyUserAuthApi();

  useEffect(() => {
    if (auth?.user) {
      verifyUser({
        id: auth.user.id,
      });
    }
  }, [auth, verifyUser]);

  useEffect(() => {
    if (!isVerifyUserLoading) {
      if (isVerifyUserError) {
        signOut();
      }
    }
  }, [isVerifyUserError, isVerifyUserLoading, signOut]);

  return (
    <>
      <Drawer.Navigator
        drawerContent={CustomDrawerContent}
        initialRouteName="HomePage"
        allowFontScaling={false}
        animationEnabled
        backBehavior="history"
        drawerActiveBackgroundColor="black"
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
            width: Dimensions.get('window').width / 1.2,
          },
        })}>
        <Drawer.Screen
          name="HomePage"
          component={HomePage}
          options={{
            headerShown: true,
            drawerActiveBackgroundColor: 'transparent',
            drawerActiveTintColor: COLORS.primary,
            drawerLabelStyle: drawerLabelStyleCustom,
            headerStyle: { backgroundColor: '#eff6ff' },
            headerTitle: ({ focused }) => (
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.darkTransparent,
                  fontSize: 15,
                  fontWeight: 500,
                }}>
                {company?.name || 'My Credit Book'}
              </Text>
            ),
            headerRight: () => (company ? <CompanySwitch /> : null),
            drawerIcon: ({ focused, size }) => (
              <AntDesign
                name="home"
                size={size - 3}
                color={focused ? COLORS.primary : COLORS.darkTransparent}
              />
            ),
          }}
        />

        {company && (
          <Drawer.Screen
            name="Profit and Loss"
            component={ProfitLoss}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#eff6ff' },
              drawerLabelStyle: drawerLabelStyleCustom,
              headerTitle: ({ focused }) => (
                <Text
                  style={{
                    color: focused ? COLORS.primary : COLORS.darkTransparent,
                    fontSize: 15,
                    fontWeight: 500,
                  }}>
                  Profit and Loss
                </Text>
              ),
              drawerActiveBackgroundColor: 'transparent',
              drawerIcon: ({ focused, size }) => (
                <AntDesign
                  name="barschart"
                  size={size - 3}
                  color={focused ? COLORS.primary : COLORS.darkTransparent}
                />
              ),
            }}
          />
        )}
        {hasRoleOneOrFour && (
          <Drawer.Screen
            name="Reports"
            component={Reports}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#eff6ff' },
              headerTitle: ({ focused }) => (
                <Text
                  style={{
                    color: focused ? COLORS.primary : COLORS.darkTransparent,
                    fontSize: 15,
                    fontWeight: 500,
                  }}>
                  Reports
                </Text>
              ),
              drawerActiveBackgroundColor: 'transparent',
              drawerActiveTintColor: COLORS.primary,
              drawerLabelStyle: drawerLabelStyleCustom,
              drawerIcon: ({ focused, size }) => (
                <AntDesign
                  name="linechart"
                  size={size - 3}
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
                size={size - 3}
                color={focused ? COLORS.primary : COLORS.darkTransparent}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </>
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
    fontWeight: 500,
  },
  footerButtonContainer: {
    bottom: 5,
    left: -10,
    padding: 10,
    position: 'absolute',
    right: 10,
  },
  footerVersionTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
