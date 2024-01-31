import {ProductSummary} from 'datalib/entity/product';
import Button from 'library/common/ButtonGroup';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import GModal from 'library/wrapper/GModal';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
interface QuickProductModal {
  isVisible: boolean;
  onModalHide: () => void;
  product: ProductSummary;
  onValueUpdate: (selection: ProductSummary) => void;
}
const QuickProductUpdate = ({
  isVisible,
  onModalHide,
  product,
  onValueUpdate,
}: QuickProductModal) => {
  const [description, setDescription] = useState(product?.description);
  const [unitPrice, setUnitPrice] = useState(product?.unitPrice);

  const handleUpdate = () => {
    onValueUpdate &&
      onValueUpdate({
        ...product,
        description,
        unitPrice,
      });
    onModalHide();
  };

  return (
    <GModal isVisible={isVisible} onModalHide={onModalHide}>
      <View style={styles.modalView}>
        <View style={styles.headerWrapper}>
          <Text style={styles.popupHeader}>Quick product update</Text>
        </View>
        <View style={styles.scrollStyle}>
          <View style={styles.fieldWrapper}>
            <SectionedTextInput
              label={'Price  per item'}
              isRequired={false}
              maxLength={15}
              keyboardType="numeric"
              placeholder={'Enter amount'}
              leftContent={
                <MaterialCommunityIcons
                  name={'currency-inr'}
                  size={22}
                  color={R.colors.themeCol2}
                />
              }
              defaultValue={`${unitPrice || ''}`}
              onChangeText={(_unitPrice: number) => {
                setUnitPrice(_unitPrice);
              }}
            />
            <SectionedTextInput
              label={'Description'}
              isRequired={false}
              multiLine={true}
              numberOfLines={7}
              height={200}
              defaultValue={`${description || ''}`}
              onChangeText={(_description: string) => {
                setDescription(_description);
              }}
            />
          </View>
          <Button onPress={handleUpdate} label={'Save'} />
        </View>
      </View>
    </GModal>
  );
};
export default QuickProductUpdate;
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
  fieldWrapper: {marginVertical: 20},
});
