import UtilityApi from 'datalib/services/utility.api';
import Button from 'library/common/ButtonGroup';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import GModal from 'library/wrapper/GModal';
import moment from 'moment';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import {RootDispatch} from '../../store/app.store';
import GAlert, {MessageType} from '../common/GAlert';
interface ReportBugModalProps {
  isVisible: boolean;
  onModalHide: () => void;
}
const ReportBugModal = ({isVisible, onModalHide}: ReportBugModalProps) => {
  const [emailText, setEmailText] = useState<string>();
  const handleUpdate = async () => {
    if (!emailText || emailText === '') {
      GAlert('Please describe your issue');
      return;
    }
    try {
      const subject = `Bug reported - ${moment().format(
        'DD MMM YYYY HH:mm:ss',
      )}`;
      const payload = {
        // to: 'vivek@3sigmacrm.com',
        to: 'jdeveloper.vimal@gmail.com',
        subject: subject,
        message: emailText,
      };
      const response = await new UtilityApi().sendEmailByGoogle(payload);
      if (response && response.status) {
        GAlert(
          'Email sent, we will get back to you asap.',
          MessageType.SUCCESS,
        );
      }
    } catch (error) {}
  };
  return (
    <GModal isVisible={isVisible} onModalHide={onModalHide}>
      <View style={styles.modalView}>
        <View style={styles.headerWrapper}>
          <Text style={styles.popupHeader}>Report Bug</Text>
        </View>
        <View style={styles.scrollStyle}>
          <View style={styles.fieldWrapper}>
            <SectionedTextInput
              label={'Explain your issue'}
              isRequired={false}
              multiLine={true}
              numberOfLines={7}
              height={200}
              autoFocus
              defaultValue={`${emailText || ''}`}
              onChangeText={(_description: string) => {
                setEmailText(_description);
              }}
            />
          </View>
          <Button onPress={handleUpdate} label={'Send'} />
        </View>
      </View>
    </GModal>
  );
};
export default ReportBugModal;
const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  modalView: {
    maxHeight: '80%',
    width: '100%',
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: moderateScale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 20,
    backgroundColor: R.colors.bgCol,
  },

  scrollStyle: {
    width: '100%',
  },
  popupHeader: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
  },
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 10,
  },
  warningText: {color: 'red'},
});
