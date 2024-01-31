import {Quotation} from 'datalib/entity/quotation';
import Button from 'library/common/ButtonGroup';
import DateSelect from 'library/form-field/DateSelect';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import GModal from 'library/wrapper/GModal';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
interface QuotIdModal {
  isVisible: boolean;
  onModalHide: () => void;
  quotation: Quotation;
  onValueUpdate: ({}) => void;
}
const QuotIdModal = ({
  isVisible,
  onModalHide,
  quotation,
  onValueUpdate,
}: QuotIdModal) => {
  const [quotationDate, setQuotationDate] = useState(
    new Date(quotation?.createdDate),
  );
  const [quotationPrefix, setQuotationPrefix] = useState('');
  const [quotationSerial, setQuotationSerial] = useState('');
  const handleUpdate = () => {
    onValueUpdate &&
      onValueUpdate({
        createdDate: quotationDate,
        quotationId: `${quotationPrefix}-${quotationSerial}`,
      });
  };
  useEffect(() => {
    if (quotation.quotationId) {
      const chunks = quotation.quotationId.split('-');
      if (chunks[0]) {
        setQuotationPrefix(chunks[0]);
      }
      if (chunks[1]) {
        setQuotationSerial(chunks[1]);
      }
    }
  }, [quotation.quotationId]);
  return (
    <GModal isVisible={isVisible} onModalHide={onModalHide}>
      <View style={styles.modalView}>
        <View style={styles.headerWrapper}>
          <Text style={styles.popupHeader}>Edit Quotation Date and Number</Text>
        </View>
        <View style={styles.scrollStyle}>
          <View>
            <Text style={styles.labelStyle}>
              Date
              <Text style={styles.warningText}>*</Text>
            </Text>
            <DateSelect
              type="date"
              placeholder={'Select date'}
              style={{
                ...R.generateFontStyle(
                  FontSizeEnum.BASE,
                  FontWeightEnum.MEDIUM,
                ),
                color: R.colors.labelCol1,
              }}
              readOnly={false}
              defaultValue={quotationDate}
              onChangeText={(value: Date) => {
                setQuotationDate(value);
              }}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <View style={styles.leftField}>
              <SectionedTextInput
                label={'Prefix'}
                isRequired={false}
                multiline
                readOnly={true}
                defaultValue={`${quotationPrefix || ''}`}
                onChangeText={(_quotationPrefix: string) => {
                  setQuotationPrefix(_quotationPrefix);
                }}
              />
            </View>
            <View style={styles.rightField}>
              <SectionedTextInput
                label={'Starting serial number'}
                isRequired={false}
                multiline
                readOnly={true}
                defaultValue={`${quotationSerial || ''}`}
                onChangeText={(_quotationSerial: string) => {
                  setQuotationSerial(_quotationSerial);
                }}
              />
            </View>
          </View>
          <Button onPress={handleUpdate} label={'Save'} />
        </View>
      </View>
    </GModal>
  );
};
export default QuotIdModal;
const styles = StyleSheet.create({
  leftField: {flex: 1, marginRight: 5},
  rightField: {flex: 1, marginLeft: 5},
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
  fieldWrapper: {flexDirection: 'row', marginVertical: 20},
});
