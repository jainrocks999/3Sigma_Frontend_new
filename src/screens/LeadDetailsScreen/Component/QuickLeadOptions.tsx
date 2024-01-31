import {TouchableOpacity, Linking, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GAlert from 'library/common/GAlert';
import R from 'resources/R';
import GFlatList from 'library/common/GFlatList';
import LeadFilesModal from 'library/modals/LeadFilesModal';

import {Nillable} from '../../../models/custom.types';

interface QuickLeadOptionsProps {
  phoneNumber: string;
  location: any;
  email: string | null;
  files: Array<any>;
  leadId: Nillable<string>;
}
const QuickLeadOptions = ({
  phoneNumber = '',
  email,
  files,
  leadId,
}: QuickLeadOptionsProps) => {
  const [showFilesModal, setshowFilesModal] = useState(false);
  const options = [
    {
      icon: (
        <MaterialCommunityIcons
          name={'phone-outline'}
          color={(phoneNumber && '#fff') || 'lightgrey'}
          size={22}
        />
      ),
      onPress: () => {
        Linking.canOpenURL(`tel:${phoneNumber}`)
          .then(supported => {
            if (!supported) {
              GAlert('Unable to open default call app');
            } else {
              Linking.openURL(`tel:${phoneNumber}`);
            }
          })
          .catch(err => {
            console.log(err);
            GAlert('Unable to open default call app');
          });
      },
      containerCol: (phoneNumber && '#0096FF') || R.colors.disabledGrey,
      disabled: !phoneNumber,
    },
    {
      icon: (
        <Ionicons
          name={'chatbubble-outline'}
          color={(phoneNumber && '#fff') || 'lightgrey'}
          size={22}
        />
      ),
      onPress: () => {
        Linking.canOpenURL(`sms:${phoneNumber}`)
          .then(supported => {
            if (!supported) {
              GAlert('Unable to open default message app');
            } else {
              Linking.openURL(`sms:${phoneNumber}`);
            }
          })
          .catch(err => {
            console.log(err);
            GAlert('Unable to open default message app');
          });
      },
      containerCol: (phoneNumber && '#FF216A') || R.colors.disabledGrey,
      disabled: !phoneNumber,
    },
    {
      icon: (
        <MaterialCommunityIcons
          name={'email-outline'}
          color={(email && '#fff') || 'lightgrey'}
          size={22}
        />
      ),
      onPress: () => {
        Linking.canOpenURL(`mailto:${email}`)
          .then(supported => {
            if (!supported) {
              GAlert('Unable to open default email app');
            } else {
              Linking.openURL(`mailto:${email}`);
            }
          })
          .catch(err => {
            console.log(err);
            GAlert('Unable to open default email app');
          });
      },
      containerCol: (email && '#FFAD01') || R.colors.disabledGrey,
      disabled: !email || email === '',
    },
    {
      icon: (
        <MaterialCommunityIcons
          name={'whatsapp'}
          color={phoneNumber.length > 8 ? '#fff' : 'lightgrey'}
          size={22}
        />
      ),
      onPress: () => {
        if (phoneNumber.length > 9) {
          let phone =
            phoneNumber.length > 10 ? phoneNumber : `+91${phoneNumber}`;
          Linking.canOpenURL(`whatsapp://send?phone=${phone}`)
            .then(supported => {
              if (!supported) {
                GAlert('Make sure whatsapp is installed and then try');
              } else {
                let nphone =
                  phoneNumber.length > 10 ? phoneNumber : `+91${phoneNumber}`;
                Linking.openURL(`whatsapp://send?phone=${nphone}`);
              }
            })
            .catch(err => {
              console.log(err);
              GAlert('Unable to open whatsapp');
            });
        }
      },
      containerCol: (phoneNumber.length && '#4CB050') || R.colors.disabledGrey,
      disabled: !phoneNumber.length,
    },
    {
      icon: (
        <MaterialCommunityIcons
          name={'file-document-multiple'}
          color={'#ffffff'}
          size={22}
        />
      ),
      onPress: () => setshowFilesModal(true),
      containerCol: '#7A8897',
      disabled: false,
    },
  ];

  const renderItem = ({item, index}: any) => {
    try {
      return (
        <TouchableOpacity
          disabled={item.disabled}
          key={index}
          style={{
            ...styles.circleContainer,
            backgroundColor: item.containerCol,
          }}
          onPress={item.onPress}>
          {item.icon}
        </TouchableOpacity>
      );
    } catch (error) {
      console.log('error in rendering element', error, item);
      return null;
    }
  };
  try {
    return (
      <View style={styles.container}>
        <GFlatList
          data={options}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <LeadFilesModal
          isVisible={showFilesModal}
          onModalHide={setshowFilesModal}
          files={files || []}
          leadId={leadId || ''}
        />
      </View>
    );
  } catch (error) {
    console.log('error in rendering element', error);
    return null;
  }
};

export default QuickLeadOptions;
const styles = StyleSheet.create({
  circleContainer: {
    height: 58,
    width: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  container: {marginLeft: 20, marginBottom: 10},
});
