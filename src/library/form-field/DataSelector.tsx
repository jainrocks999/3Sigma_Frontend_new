import React, {useState} from 'react';
import {TouchableOpacity, Keyboard, View, StyleSheet, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import LeadSelectionModal from '../modals/LeadSelectionModal';
import TeamSelectionModal from '../modals/TeamSelectionModal';
import UserSelectionModal from '../modals/UserSelectionModal';
interface DataSelectorProps {
  type: string;
  field: string;
  defaultValue: any;
  isMultiSelect?: boolean;
  excludeOptions?: Array<string>;
  handleValueChange?: (item: {field: string; value: any}) => void;
}
const DataSelector = ({
  type,
  handleValueChange,
  field,
  isMultiSelect = false,
  defaultValue,
  excludeOptions,
}: DataSelectorProps) => {
  const [showOptionPicker, setShowOptionPicker] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(defaultValue);
  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
          setShowOptionPicker(true);
        }}>
        <View style={styles.largeBox}>
          {selectedOptions ? (
            <Text style={styles.inputStyle}>
              {Array.isArray(selectedOptions) ? (
                selectedOptions.length > 0 ? (
                  `${selectedOptions.length} ${
                    selectedOptions.length === 1 ? `${type}` : `${type}s`
                  } selected`
                ) : (
                  <Text style={{color: '#999999'}}>{'Select ' + type}</Text>
                )
              ) : (
                selectedOptions?.name || 'Select ' + type
              )}
            </Text>
          ) : (
            <Text style={[styles.inputStyle, {color: '#999999'}]}>
              Select {type}
            </Text>
          )}
        </View>
        <View style={styles.smallBox}>
          <MaterialCommunityIcons
            name={showOptionPicker ? 'chevron-up' : 'chevron-down'}
            size={25}
            color={R.colors.themeCol1}
          />
        </View>
      </TouchableOpacity>
      {type === 'lead' && (
        <LeadSelectionModal
          isVisible={showOptionPicker}
          onModalHide={() => setShowOptionPicker(false)}
          selectedOptions={selectedOptions}
          isMultiSelect={isMultiSelect}
          onOptionSelect={(options: Array<any>) => {
            if (isMultiSelect && Array.isArray(options)) {
              setSelectedOptions(options);
              handleValueChange &&
                handleValueChange({
                  value: options,
                  field: field,
                });
            } else {
              handleValueChange &&
                handleValueChange({
                  value: options._id,
                  field: field,
                });
              setSelectedOptions(options);
            }
          }}
        />
      )}
      {type === 'team' && (
        <TeamSelectionModal
          isVisible={showOptionPicker}
          onModalHide={() => setShowOptionPicker(false)}
          selectedOptions={selectedOptions}
          isMultiSelect={isMultiSelect}
          excludeOptions={excludeOptions || []}
          onOptionSelect={(options: any) => {
            handleValueChange &&
              handleValueChange({
                value: isMultiSelect ? options : options._id,
                field: field,
              });
            setSelectedOptions(options);
          }}
        />
      )}
      {type === 'user' && (
        <UserSelectionModal
          isVisible={showOptionPicker}
          onModalHide={() => setShowOptionPicker(false)}
          selectedOptions={selectedOptions}
          excludeUsers={excludeOptions}
          includeCurrentUser={true}
          onOptionSelect={(options: any) => {
            handleValueChange &&
              handleValueChange({
                value: options._id,
                field: field,
              });
            setSelectedOptions(options);
          }}
        />
      )}
    </>
  );
};
export default DataSelector;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: R.colors.white,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputStyle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
    paddingHorizontal: 10,
  },
  smallBox: {width: '7%'},
  largeBox: {width: '93%'},
  warningText: {color: R.colors.IndianRed},
});
