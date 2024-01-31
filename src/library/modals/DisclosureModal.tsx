import React from 'react';
import {Dimensions, StyleSheet, View, Text, ScrollView} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
import {IconButton} from '../common/ButtonGroup';
import {Nillable} from '../../models/custom.types';
interface WebViewModalProps {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
  type: Nillable<DisclosureTypes>;
}
export enum DisclosureTypes {
  CONTACT = 'contact',
  STORAGE = 'storage',
  LOCATION = 'location',
  PHONE_CALL = 'phone-call',
}
const DisclosureModal = ({isVisible, onModalHide, type}: WebViewModalProps) => {
  const disclosure = {
    [DisclosureTypes.CONTACT]: `we understand that managing contacts can be time-consuming, so we have designed our app to allow users to easily import their contacts from their contact list and add them as leads. These contacts are securely stored on our servers, so that you can access them easily at a later time.
    We take the privacy and security of your data very seriously. Rest assured that we do not upload any other contacts to our servers, and the data you provide is used only for the purpose of providing you with access to your leads.This is an optional permission and can be disabled ,but that would mean you will have limited access to use some features.
    `,
    [DisclosureTypes.STORAGE]: `we understand the importance of organizing files related to your leads for easy access, so we have designed our app to allow users to upload any type of file, such as invoices, PDFs, and images. This feature enables you to keep all relevant files in one place and access them from anywhere.
    We want to assure you that we take the privacy and security of your data very seriously. We only upload the files that you explicitly upload to our server. We do not upload any other files to our servers, ensuring that your data is safe and secure.This is an optional permission and can be disabled ,but that would mean you will have limited access to use some features.
    `,
    [DisclosureTypes.LOCATION]: `we want to provide our users with a seamless way to create geotagged records of their activities, such as customer visits, using our check-in feature. These records can be stored for custom access, navigation, and planning purposes.
    We take the privacy and security of our users' data very seriously. We want to assure you that we do not access any location information in the background. Your location information is only accessed when you explicitly use our check-in feature to create a geotagged record of your activity.This is an optional permission and can be disabled ,but that would mean you will have limited access to use some features.
    `,
    [DisclosureTypes.PHONE_CALL]: `To ensure a seamless experience for you, we upload your local device call logs to our servers, which allows us to automatically create call activities with leads in your CRM. With this feature, all your incoming, outgoing, and missed calls will be logged automatically with your CRM leads. However, please note that we only log call data with numbers that are added as leads in your CRM, and any other call data with numbers not added as leads will be deleted automatically. 
    We want to assure you that we do not share your call logs data with any third party, so your data is completely secure with us. Granting Call log access permission is an elective process ,you can choose to deny it ,in that case automatic activites for call will not be created.`,
  };
  return (
    <GModal isVisible={isVisible} onModalHide={() => onModalHide(false)}>
      <View style={styles.modalContainer}>
        <IconButton
          btnStyle={styles.closeBtn}
          onPress={() => onModalHide(false)}
          icon={'close'}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.headingMain}>Disclosure</Text>
          <Text style={styles.paragraph}>{type ? disclosure[type] : null}</Text>
        </ScrollView>
      </View>
    </GModal>
  );
};
export default DisclosureModal;
const styles = StyleSheet.create({
  modalContainer: {
    minHeight: '100%',
    maxHeight: '80%',
    backgroundColor: R.colors.bgCol,
    padding: 20,
  },
  container: {
    justifyContent: 'center',
    height: Dimensions.get('screen').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingtext: {
    textAlign: 'center',
  },
  heading: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    marginBottom: 10,
  },
  headingMain: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.SEMI_BOLD),
    marginBottom: 10,
  },
  paragraph: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
    marginBottom: 20,
  },
  closeBtn: {position: 'absolute', right: 10, top: 10},
});
