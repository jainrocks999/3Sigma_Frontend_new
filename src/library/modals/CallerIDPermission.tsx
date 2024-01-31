import React, {useState} from 'react';
import {Dimensions, StyleSheet, View, Text, ScrollView} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
import TermsConditionModal from './TermsConditionModal';
import PressableText from '../common/PressableText';
interface WebViewModalProps {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
}
const CallerIDPermission = ({isVisible, onModalHide}: WebViewModalProps) => {
  const [termsModal, setTermsModal] = useState<boolean>(false);
  return (
    <>
      <GModal isVisible={isVisible} onModalHide={() => onModalHide(false)}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.headingMain}>Permission</Text>
            <Text style={styles.heading}>Overlay Permission</Text>
            <Text style={styles.paragraph}>
              Allows us to show Caller ID pop up on top of different screens
            </Text>
            <Text style={styles.heading}>Manage phone calls</Text>
            <Text style={styles.paragraph}>
              Allows us to show Caller id pop up on different call events
            </Text>
            <Text style={styles.heading}>Default caller id app</Text>
            <Text style={styles.paragraph}>
              Allows us to show pop up even power saving mode is enaled
            </Text>
            <Text style={styles.heading}>Stop optimizing battery usage </Text>
            <Text style={styles.paragraph}>
              Allows us to show pop up even power saving mode is enaled
            </Text>
            <Text style={styles.paragraph}>
              Your privacy is imortant to us and we neber share any data withany
              third party You can find more details about how we handle your
              data in our{' '}
              <PressableText onPress={() => setTermsModal(true)}>
                privacy policy
              </PressableText>
            </Text>
          </ScrollView>
        </View>
      </GModal>
      <TermsConditionModal
        isVisible={termsModal}
        onModalHide={() => setTermsModal(false)}
      />
    </>
  );
};
export default CallerIDPermission;
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
});
