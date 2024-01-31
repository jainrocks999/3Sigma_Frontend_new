import {useNavigation} from '@react-navigation/native';
import Button from 'library/common/ButtonGroup';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {RootState} from '../../store/app.store';
import {currentUserSelector} from '../../store/slices/user.slice';
import PressableText from 'library/common/PressableText';
import DisclosureModal, {DisclosureTypes} from 'library/modals/DisclosureModal';
import {Nillable} from '../../models/custom.types';

const {StatusBarManager} = NativeModules;
const AppPermissionScreen = () => {
  const currentUser = useSelector((state: RootState) =>
    currentUserSelector(state),
  );
  const navigation = useNavigation();
  const [isDisclosure, showDisclosure] = useState<Nillable<DisclosureTypes>>();
  const saveProfile = () => {
    // result['android.permission.READ_CONTACTS'] &&
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        // PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      ]).then(result => {
        if (
          result['android.permission.READ_EXTERNAL_STORAGE'] &&
          result['android.permission.READ_CALL_LOG'] &&
          result['android.permission.WRITE_EXTERNAL_STORAGE']
        ) {
          if (!currentUser?.isOnboardCompleted) {
            navigation.reset({
              index: 0,
              routes: [{name: ScreenNameEnum.UPDATE_BASIC_PROFILE_SCREEN}],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: ScreenNameEnum.HOME_TAB_SCREEN}],
            });
          }
        } else if (
          result['android.permission.ACCESS_COARSE_LOCATION'] ||
          result['android.permission.ACCESS_FINE_LOCATION'] ||
          result['android.permission.READ_EXTERNAL_STORAGE'] ||
          result['android.permission.READ_CALL_LOG'] ||
          result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            'never_ask_again'
        ) {
          if (!currentUser?.isOnboardCompleted) {
            navigation.reset({
              index: 0,
              routes: [{name: ScreenNameEnum.UPDATE_BASIC_PROFILE_SCREEN}],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: ScreenNameEnum.HOME_TAB_SCREEN}],
            });
          }
        }
      });
    } else {
      if (!currentUser?.isOnboardCompleted) {
        navigation.reset({
          index: 0,
          routes: [{name: ScreenNameEnum.UPDATE_BASIC_PROFILE_SCREEN}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: ScreenNameEnum.HOME_TAB_SCREEN}],
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.midContainer}>
          <Text style={styles.labelText}>We need some access!</Text>
          <Text style={styles.subHeadText}>
            3Sigma CRM needs access to following permissions to function
            properly.
          </Text>

          {/* <View style={styles.iconContainer}>
            <FontAwesome5 name={'address-book'} size={50} color={'black'} />
            <View style={styles.rightContaier}>
              <Text style={styles.iconTExt}>Contacts</Text>
              <View style={styles.borderLine} />
              <Text style={styles.detailsText}>
                To add and save leads from phonebook easily.
              </Text>
              <PressableText
                pressableStyle={styles.disText}
                textStyle={styles.textStyle}
                onPress={() => showDisclosure(DisclosureTypes.CONTACT)}>
                Read Disclosure
              </PressableText>
            </View>
          </View> */}

          <View style={styles.iconContainer}>
            <Feather name={'phone-call'} size={50} color={'black'} />
            <View style={styles.rightContaier}>
              <Text style={styles.iconTExt}>Call Logs</Text>
              <View style={styles.borderLine} />
              <Text style={styles.detailsText}>
                Track and log your activites automatically.
              </Text>
              <PressableText
                pressableStyle={styles.disText}
                textStyle={styles.textStyle}
                onPress={() => showDisclosure(DisclosureTypes.PHONE_CALL)}>
                Read Disclosure
              </PressableText>
            </View>
          </View>

          <View style={styles.iconContainer}>
            <Feather name={'folder'} size={50} color={'black'} />
            <View style={styles.rightContaier}>
              <Text style={styles.iconTExt}>Storage</Text>
              <View style={styles.borderLine} />
              <Text style={styles.detailsText}>
                Easily upload, share files and media.
              </Text>
              <PressableText
                pressableStyle={styles.disText}
                textStyle={styles.textStyle}
                onPress={() => showDisclosure(DisclosureTypes.STORAGE)}>
                Read Disclosure
              </PressableText>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name={'place'} size={50} color={'black'} />
            <View style={styles.rightContaier}>
              <Text style={styles.iconTExt}>Location</Text>
              <View style={styles.borderLine} />
              <Text style={styles.detailsText}>
                Easily track lead checkins and checkouts
              </Text>
              <PressableText
                pressableStyle={styles.disText}
                textStyle={styles.textStyle}
                onPress={() => showDisclosure(DisclosureTypes.LOCATION)}>
                Read Disclosure
              </PressableText>
            </View>
          </View>

          {/* <View style={styles.iconContainer}>
          <MaterialIcons
            name={'notifications-active'}
            size={50}
            color={'black'}
          />
          <View style={styles.rightContaier}>
            <Text style={styles.iconTExt}>SMS</Text>
            <View style={styles.borderLine} />
            <Text style={styles.detailsText}>
              Track and log your activites automatically.
            </Text>
          </View>
        </View> */}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          label={'Continue'}
          onPress={saveProfile}
          buttonStyle={styles.s3Btn}
          labelStyle={{...styles.s1BtnLabel}}
        />
      </View>
      <DisclosureModal
        isVisible={isDisclosure ? true : false}
        onModalHide={() => showDisclosure(null)}
        type={isDisclosure}
      />
    </View>
  );
};

export default AppPermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  midContainer: {
    paddingLeft: 25,
    paddingRight: 15,
    paddingTop: StatusBarManager.HEIGHT + 20,
    width: '100%',
  },
  labelText: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  textStyle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol2,
  },
  subHeadText: {
    marginBottom: 20,
    fontSize: 13,
    marginTop: 10,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  borderLine: {
    marginVertical: 5,
    width: '100%',
    height: 1,
    backgroundColor: '#000',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },
  rightContaier: {
    width: '75%',
    marginLeft: 15,
  },
  iconTExt: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  detailsText: {
    fontSize: 13,
    color: R.colors.labelCol1,
  },
  s3Btn: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  s1BtnLabel: {
    color: '#ffffff',
  },
  disText: {
    maxWidth: 120,
    borderRadius: 10,
  },
});
