import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import Contacts, {Contact} from 'react-native-contacts';
import InputText from '../form-field/InputText';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
import GFlatList from '../common/GFlatList';
import Helper from '../../utils/helper';
interface PhoneBookProps {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
}
const PhoneBook = ({isVisible, onModalHide}: PhoneBookProps) => {
  const navigation = useNavigation();
  const [contactsInfo, setContactsInfo] = useState<Array<any>>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [contacts, setContacts] = useState<Array<any>>([]);
  // useEffect(() => {
  //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
  //     title: 'Contacts',
  //     message: 'This app would like to view your contacts.',
  //     buttonPositive: 'Please accept bare mortal',
  //   }).then((permissinStatus: string) => {
  //     if (permissinStatus === 'granted') {
  //       Contacts.getAll()
  //         .then(_contacts => {
  //           const sortedContacts = Helper.sortArrayAlphabetically(
  //             _contacts,
  //             'displayName',
  //           );
  //           setContactsInfo(sortedContacts);
  //           setContacts(sortedContacts);
  //         })
  //         .catch(e => {
  //           console.log(e);
  //         });
  //     }
  //   });
  // }, []);

  const searchData = (text: string) => {
    let info = [...contacts];
    let searchInfo = info.filter(value => {
      return value?.displayName?.includes(text);
    });
    setSearchValue(text);
    if (text !== '') {
      setContactsInfo(searchInfo);
    } else {
      setContactsInfo(contacts);
    }
  };

  const renderItem = ({item, index}: any) => {
    const uniqueNumbers: Array<string> = [];
    item.phoneNumbers.map((phone: Contact) => {
      const number = phone.number.split(' ').join('');
      if (!uniqueNumbers.includes(number)) {
        uniqueNumbers.push(number);
      }
    });
    if (uniqueNumbers.length) {
      return (
        <TouchableOpacity
          style={styles.rowWrapper}
          key={index}
          onPress={() => {
            onModalHide(false);
            navigation.navigate(ScreenNameEnum.CREATE_LEAD_SCREEN, {
              contactInfo: {
                name: item?.displayName,
                phone: uniqueNumbers[0],
                email: item.emailAddresses.length
                  ? item.emailAddresses[0].email
                  : null,
                alternateNumber:
                  uniqueNumbers.length > 1 ? uniqueNumbers[1] : null,
              },
            });
          }}>
          <View style={styles.circleView}>
            <Text style={styles.shortName}>AS</Text>
          </View>
          <View style={styles.contactDetailsWrapper}>
            <Text style={styles.itemTitleText}>{item?.displayName || ''}</Text>
            {uniqueNumbers.map((_number: any, _index: number) => (
              <Text key={_index.toString()} style={styles.itemNumberText}>
                {_number}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  return (
    <GModal isVisible={isVisible} onModalHide={() => onModalHide(false)}>
      <View style={styles.modalView}>
        <Text style={styles.modalHeaderText}>Phonebook</Text>
        <View style={styles.modalHeader}>
          <InputText
            placeHolder={'Search...'}
            value={searchValue}
            onChangeText={(text: string) => searchData(text)}
            textWidth={290}
          />
        </View>
        <View style={{width: '100%'}}>
          <GFlatList data={contactsInfo} renderItem={renderItem} />
        </View>
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderBottomColor: R.colors.textColor3,
    paddingLeft: moderateScale(6),
  },
  contactDetailsWrapper: {
    marginLeft: moderateScale(15),
  },

  modalView: {
    width: '100%',
    height: '90%',
    bottom: 0,
    backgroundColor: 'white',
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: moderateScale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  circleView: {
    width: moderateScale(35),
    height: moderateScale(35),
    borderRadius: moderateScale(20),
    backgroundColor: R.colors.themeCol2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginRight: moderateScale(-16),
  },
  scrollStyle: {
    width: '100%',
  },
  rowWrapper: {
    paddingVertical: moderateScale(10),
    width: '100%',
    paddingLeft: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
  colorIndicator: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(8),
  },
  itemTitleText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  itemNumberText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  shortName: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol3,
  },
  modalHeaderText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.black,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default PhoneBook;
