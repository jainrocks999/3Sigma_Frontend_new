/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
import DynamicForm, {FormField} from '../form-field/DynamicForm';

interface FilterProps {
  isVisible: boolean;
  defaultFilter: any;
  filterForm: Array<FormField>;
  onModalClose: () => void;
  onResetPress: () => void;
  onFilterSelect: () => void;
  onFilterChange: (defaultFilter: any) => void;
}
const CommonFilterModal = ({
  isVisible,
  onModalClose,
  onResetPress,
  defaultFilter,
  onFilterChange,
  filterForm,
  onFilterSelect,
}: FilterProps) => {
  return (
    <GModal isVisible={isVisible} onModalHide={onModalClose}>
      <View style={styles.modalView}>
        <View style={styles.modalHeader}>
          <Text style={styles.modaleTitle}>Quotation Filter</Text>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                onResetPress && onResetPress();
              }}>
              <Text style={[styles.buttonText, {color: R.colors.themeCol2}]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <DynamicForm
          buttonTitle={'Apply Filter'}
          formFields={filterForm || []}
          fieldValues={defaultFilter || {}}
          handleValueChange={onFilterChange}
          buttonPress={onFilterSelect}
          containerStyle={styles.formContainer}
        />
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    bottom: 0,
    backgroundColor: R.colors.bgCol,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 4,
  },
  formContainer: {
    marginHorizontal: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modaleTitle: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
    padding: moderateScale(10),
  },
  closeButton: {
    alignSelf: 'center',
    marginRight: moderateScale(15),
  },
  buttonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    textTransform: 'uppercase',
  },
});

export default CommonFilterModal;
