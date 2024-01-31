/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import {Nillable} from '../../models/custom.types';
import {RootState} from '../../store/app.store';
import {selectPrefrence} from '../../store/slices/user.slice';
import {DeleteButton} from '../common/ButtonGroup';
import ListModal from '../common/ListModal';

import {FormField} from './DynamicForm';
import SectionedTextInput from './SectionedTextInput';

const AdditionalCharges = (props: FormField) => {
  const [charges, setCharges] = useState<
    Array<{
      title: string;
      type: string;
      rate: number;
    }>
  >(props.default_value || []);
  const taxOptionArr: Nillable<Array<any>> = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.TAX_OPTIONS),
  );
  const [taxOptions, showTaxOptions] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const removeCharge = (index: number) => {
    setCharges(charges.filter((v, i) => i !== index));
  };
  useEffect(() => {
    props.handleValueChange &&
      props.handleValueChange({
        value:
          props.value !== 'taxes'
            ? charges
            : charges.map(({title, rate}) => ({title, rate})),
        field: props.value,
      });
  }, [charges]);
  const handleValueUpdate = (field: string, value: any, index: number) => {
    const newCharge: any = [...charges];
    newCharge[index][field] = value;
    setCharges(newCharge);
  };
  const handleTaxSelect = (value: string) => {
    const tax = taxOptionArr?.find(taxes => taxes.title === value);
    if (tax) {
      const newCharges = [...charges];
      newCharges[editIndex] = tax;
      setCharges(newCharges);
    }
    showTaxOptions(false);
  };
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.labelContainer}>
        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => {
            setCharges([
              ...charges,
              {title: '', type: props.defaultOption || 'fixed', rate: 0},
            ]);
          }}>
          <Text style={[styles.labelBoldStyle, {marginTop: 0}]}>
            <MaterialCommunityIcons
              name={'plus'}
              color={R.colors.themeCol2}
              size={20}
            />
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      {charges
        ? charges.map((charge, index) => (
            <View key={index}>
              <View style={[styles.fieldsContainer, {}]}>
                <View style={{marginRight: 5}}>
                  <DeleteButton onPress={() => removeCharge(index)} />
                </View>
                <View style={{flex: 2}}>
                  <SectionedTextInput
                    placeholder={props.placeholder}
                    value={`${charge.title || ''}`}
                    onChangeText={(title: string) => {
                      handleValueUpdate('title', title, index);
                    }}
                    tag={props.suggestion || []}
                    rightWidth={props.showOptions ? '20%' : '0%'}
                    rightContent={
                      props.showOptions && (
                        <TouchableOpacity
                          onPress={() => {
                            setEditIndex(index);
                            showTaxOptions(true);
                          }}>
                          <MaterialCommunityIcons
                            name={
                              taxOptions
                                ? 'arrow-up-drop-circle'
                                : 'arrow-down-drop-circle'
                            }
                            size={22}
                            color={R.colors.themeCol1}
                          />
                        </TouchableOpacity>
                      )
                    }
                  />
                </View>
                <View style={{flex: 1.5, marginLeft: 5}}>
                  <SectionedTextInput
                    inputStyle={{textAlign: 'right'}}
                    value={`${charge.rate || ''}`}
                    keyboardType={'numeric'}
                    onChangeText={(rate: string) => {
                      handleValueUpdate('rate', rate, index);
                    }}
                    rightWidth={charge.type === 'rate' ? '20%' : '0%'}
                    leftWidth={charge.type === 'fixed' ? '20%' : '0%'}
                    rightContent={
                      charge.type === 'rate' && (
                        <MaterialCommunityIcons
                          name={'percent-outline'}
                          size={22}
                          color={R.colors.themeCol2}
                        />
                      )
                    }
                    leftContent={
                      charge.type === 'fixed' && (
                        <MaterialCommunityIcons
                          name={'currency-inr'}
                          size={22}
                          color={R.colors.themeCol2}
                        />
                      )
                    }
                  />
                </View>
              </View>
            </View>
          ))
        : null}
      <ListModal
        display={taxOptions}
        onModalClose={() => showTaxOptions(false)}
        onItemSelect={handleTaxSelect}
        data={(taxOptionArr || []).map(taxes => ({
          name: `${taxes.title} ${taxes.rate}%`,
          value: taxes.title,
        }))}
        title={'Select Tax'}
        emptyMessage="0 option available."
      />
    </View>
  );
};
export default AdditionalCharges;
const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  fieldsContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  sectionContainer: {
    borderRadius: 10,
  },
  optionBtn: {paddingVertical: 5},
  labelBoldStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: {color: R.colors.IndianRed},
});
