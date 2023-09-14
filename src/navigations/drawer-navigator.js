import {
  Fontisto as Icon,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
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
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
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
              labelStyle={{ fontSize: 20 }}
              label='US'
            />
          </View>
        </View>
        <DrawerItemList {...props} />

        <DrawerItem
          label='App Rating'
          labelStyle={styles.drawerItemLabel}
          onPress={() => alert('Will be available soon!')}
          icon={({ size }) => (
            <Icon name='star' size={size - 5} color={COLORS.primary} />
          )}
        />

        <DrawerItem
          label='Invite Friends'
          labelStyle={styles.drawerItemLabel}
          onPress={() => alert('Will be available soon!')}
          icon={({ size }) => (
            <Icon name='share' size={size - 5} color={COLORS.primary} />
          )}
        />
      </DrawerContentScrollView>

      <View style={styles.footerButtonContainer}>
        <Button
          mode='contained'
          compact={true}
          onPress={() => signOut()}
          icon={'door'}
        >
          Logout
        </Button>
        <Button
          mode='contained'
          compact={true}
          onPress={() => setDeleteModalVisibility(true)}
          icon={'delete'}
          className={'mt-2 mb-1 bg-red-500'}
        >
          Delete Account
        </Button>
        <View style={styles.footerVersionTextContainer} className={'mb-2'}>
          <Text className={'text-slate-500'} variant='bodySmall'>
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
  const company = useAuthCompanyStore((state) => state.selectedCompany);
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
          headerStyle: { backgroundColor: '#eff6ff' },
          title: company?.name || 'Home',
          headerRight: () => <CompanySwitch />,
          drawerIcon: ({ focused, size }) => (
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
            headerStyle: { backgroundColor: '#eff6ff' },
            title: ({ focused }) => (
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
            drawerIcon: ({ focused, size }) => (
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
          headerStyle: { backgroundColor: '#eff6ff' },
          drawerIcon: ({ focused, size }) => (
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
