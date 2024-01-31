/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
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
import GAlert from '../common/GAlert';

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
const DropDownWithOption = (props: DropDownProps) => {
  const [option, setOption] = useState(null);
  const [sortOption, setSortOption] = useState(false);
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
            ? _i === props.defaultOption.orderBy
            : _i.value === props.defaultOption.orderBy ||
              _i.name === props.defaultOption,
        );
        setOption(selected);
      }
    } else if (props.defaultOption === null) {
      setOption(null);
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
    if (option) {
      props.onChangeVal &&
        props.onChangeVal({
          orderBy: option.value,
          isAscending: sortOption,
        });
      toggleOptionPicker(false);
      Keyboard.dismiss();
    } else {
      GAlert('Select atleast ont option');
    }
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
      return option ? (typeof option === 'string' ? option : option.name) : '';
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
        <View style={{width: '100%', flexDirection: 'row'}}>
          <View style={{justifyContent: 'center'}}>
            <MaterialCommunityIcons
              name={sortOption ? 'sort-ascending' : 'sort-descending'}
              color={R.colors.themeCol2}
              size={20}
            />
          </View>
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
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: '40%',
          }}>
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
                        style={{
                          width: '100%',
                          paddingVertical: 20,
                          borderBottomColor: 'lightgrey',
                          borderBottomWidth: 0.5,
                          flexDirection: 'row',
                        }}
                        onPress={() => {
                          if (multiSelectEnabled) {
                            toggle(index);
                          } else {
                            setOption(item);
                            if (option) {
                              setSortOption(
                                option.value !== item.value
                                  ? true
                                  : !sortOption,
                              );
                            } else {
                              setSortOption(true);
                            }
                          }
                        }}>
                        <View>
                          <MaterialCommunityIcons
                            name={
                              option && option.value === item.value
                                ? 'radiobox-marked'
                                : 'radiobox-blank'
                            }
                            color={R.colors.themeCol2}
                            size={25}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginLeft: 10,
                            flex: 1,
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
                          {option && option.value === item.value ? (
                            <TouchableOpacity
                              style={styles.sortBtn}
                              onPress={() => setSortOption(!sortOption)}>
                              <Text style={styles.sortOptionText}>
                                {sortOption ? 'ASC' : 'DESC'}
                              </Text>
                              <MaterialCommunityIcons
                                name={
                                  sortOption
                                    ? 'sort-ascending'
                                    : 'sort-descending'
                                }
                                color={R.colors.themeCol2}
                                size={25}
                              />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
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
          <Button label={'Save'} onPress={onMultiSelection} />
        </View>
      </GModal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  sortOptionText: {
    color: R.colors.themeCol2,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    textTransform: 'uppercase',
    marginRight: 5,
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
    marginBottom: 10,
  },
  addListButton: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(5),
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: moderateScale(5),
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DropDownWithOption;
