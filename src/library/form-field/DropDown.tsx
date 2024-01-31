/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Keyboard,
  TextInput,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {moderateScale} from 'resources/responsiveLayout';
import Button from '../common/ButtonGroup';
import {ScrollView} from 'react-native-gesture-handler';

interface DropDownProps {
  title?: string;
  options: Array<any>;
  defaultOption: any;
  placeholder: string;
  multiSelectEnabled?: boolean;
  subType?: boolean;
  editable?: boolean;
  displayColor?: boolean;
  onChangeVal: (item: any) => void;
  onActionBtnPress?: (editItem?: any) => void;
  textInputStyle?: ViewStyle;
}
const DropDown = (props: DropDownProps) => {
  const [option, setOption] = useState(null);
  const [showOptionPicker, toggleOptionPicker] = useState(false);
  const [selectedDataIndexes, setIndexes] = useState<Array<number>>([]);
  const {multiSelectEnabled = false} = props;
  useEffect(() => {
    if (option === null && props.defaultOption) {
      const selIdx: Array<number> = [];
      if (multiSelectEnabled) {
        props.options.map((val, idx) => {
          if (props.defaultOption.includes(val.value)) {
            selIdx.push(idx);
          }
        });
        setIndexes(selIdx);
      } else {
        const selected = props.options.find(_i =>
          typeof _i === 'string'
            ? _i === props.defaultOption
            : _i.value == props.defaultOption || _i.name == props.defaultOption,
        );
        if (selected) {
          setOption(selected);
        }
      }
    } else if (
      !props.defaultOption ||
      props.defaultOption === null ||
      props.defaultOption.length === 0
    ) {
      setOption(null);
    } else if (
      typeof props.defaultOption !== 'object' &&
      props.defaultOption !== option?.value
    ) {
      const selected = props.options.find(_i =>
        typeof _i === 'string'
          ? _i === props.defaultOption
          : _i.value == props.defaultOption || _i.name == props.defaultOption,
      );
      if (selected) {
        setOption(selected);
      }
    }
  }, [props.defaultOption, props.options]);

  const toggle = (_index: number) => {
    if (selectedDataIndexes.includes(_index)) {
      setIndexes(selectedDataIndexes.filter(i => i !== _index));
    } else {
      setIndexes([...selectedDataIndexes, _index]);
    }
  };
  const onMultiSelection = () => {
    props.onChangeVal &&
      props.onChangeVal(
        props.options
          .filter((v, i) => selectedDataIndexes.includes(i))
          .map(i => i.value),
      );
    toggleOptionPicker(false);
    Keyboard.dismiss();
  };
  const getValue = () => {
    if (multiSelectEnabled) {
      return selectedDataIndexes.length
        ? props.options
            .filter((v, i) => selectedDataIndexes.includes(i))
            .map(_v => _v.name)[0] +
            (selectedDataIndexes.length > 1
              ? ` and ${selectedDataIndexes.length - 1} more selected`
              : '')
        : '';
    } else {
      return option ? (typeof option === 'string' ? option : option?.name) : '';
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={props.editable === undefined || props.editable ? 0 : 1}
        onPress={() => {
          Keyboard.dismiss();
          props.editable === undefined || props.editable
            ? toggleOptionPicker(true)
            : null;
        }}>
        <View style={{width: '100%'}}>
          <TextInput
            style={[
              styles.inputStyle,
              {
                color:
                  option || selectedDataIndexes.length
                    ? R.colors.themeCol1
                    : R.colors.themeCol1,
                ...props.textInputStyle,
              },
            ]}
            placeholder={props.placeholder}
            placeholderTextColor={'#999999'}
            editable={false}
            pointerEvents="none"
            value={getValue()}
          />
        </View>
        <View
          style={{
            width: 30,
            marginLeft: -20,
          }}>
          <MaterialCommunityIcons
            name={showOptionPicker ? 'chevron-up' : 'chevron-down'}
            size={25}
            color={R.colors.themeCol1}
          />
        </View>
      </TouchableOpacity>

      <GModal
        style={{justifyContent: 'flex-end'}}
        isVisible={showOptionPicker}
        onModalHide={() => toggleOptionPicker(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{props.placeholder}</Text>
            {props.onActionBtnPress && (
              <TouchableOpacity
                style={styles.addListButton}
                onPress={() => {
                  props.onActionBtnPress && props.onActionBtnPress();
                }}>
                <Text style={styles.addButtonText}>+ Add New</Text>
              </TouchableOpacity>
            )}
          </View>
          {props?.options?.length > 0 ? (
            <View style={{maxHeight: 600}}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {props.options &&
                  props.options.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        style={styles.itemContainer}
                        onPress={() => {
                          if (multiSelectEnabled) {
                            toggle(index);
                          } else {
                            setOption(item);
                            if (typeof item === 'string') {
                              props.onChangeVal && props.onChangeVal(item);
                            } else {
                              props.onChangeVal &&
                                props.onChangeVal(item.value);
                            }
                            toggleOptionPicker(false);
                            Keyboard.dismiss();
                          }
                        }}>
                        {props.displayColor ? (
                          <View
                            style={[
                              styles.colorCircle,
                              {
                                backgroundColor:
                                  item.color || item.value || 'black',
                              },
                            ]}
                          />
                        ) : null}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}>
                          <View>
                            <Text
                              style={{
                                ...R.generateFontStyle(
                                  FontSizeEnum.BASE,
                                  FontWeightEnum.SEMI_BOLD,
                                ),
                                color: R.colors.themeCol1,
                                textTransform: 'capitalize',
                              }}>
                              {typeof item === 'string' ? item : item.name}
                            </Text>
                            {item.description && (
                              <Text
                                style={{
                                  ...R.generateFontStyle(
                                    FontSizeEnum.SM,
                                    FontWeightEnum.MEDIUM,
                                  ),
                                  color: R.colors.labelCol1,
                                  textTransform: 'capitalize',
                                }}>
                                {item.description}
                              </Text>
                            )}
                          </View>
                          {multiSelectEnabled && (
                            <View>
                              <MaterialCommunityIcons
                                name={
                                  selectedDataIndexes.indexOf(index) !== -1
                                    ? 'checkbox-marked'
                                    : 'checkbox-blank-outline'
                                }
                                color={R.colors.themeCol2}
                                size={25}
                              />
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
              {multiSelectEnabled ? (
                <Button label={'Apply'} onPress={onMultiSelection} />
              ) : null}
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
              }}>
              <Text
                style={{
                  ...R.generateFontStyle(
                    FontSizeEnum.SM,
                    FontWeightEnum.MEDIUM,
                  ),
                  color: R.colors.labelCol1,
                  textTransform: 'capitalize',
                }}>
                {props?.emptyText || '0 Option available'}
              </Text>
            </View>
          )}
        </View>
      </GModal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '30%',
    // justifyContent: 'space-between',
  },
  container: {
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
  colorCircle: {
    backgroundColor: 'black',
    height: 20,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  textInput: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
  },
  totalCenter: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  ModalCloseBtn: {
    height: 55,
    width: 55,
    borderRadius: 60,
    backgroundColor: '#00000041',
    // alignSelf: 'center',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 8,
  },
  optionBackground: {
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textStyle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
  },
  inputStyle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.labelCol1,
    paddingHorizontal: 10,
    textTransform: 'capitalize',
  },
  modalTitle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  addListButton: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(5),
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemContainer: {
    width: '100%',
    paddingVertical: 20,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
  },
});

export default DropDown;
