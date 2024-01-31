/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {isFunction} from 'lodash';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import {Nillable} from '../../models/custom.types';
import Helper from '../../utils/helper';
import AddButton from '../common/AddButton';
import GFlatList from '../common/GFlatList';
import TagPicker from '../common/TagPicker';
import TimeSelect from '../common/TimeSelect';
import AdditionalCharges from './AdditionalCharges';
import CustomFieldPicker, {OptionSelector} from './CustomFieldPicker';
import DataSelector from './DataSelector';
import DateSelect from './DateSelect';
import DropDown from './DropDown';
import GCheckBox from './GCheckBox';
import InputText from './InputText';
import MapsInput from './MapsInput';
import PhoneInputWithCountry from './PhoneInputWithCountry';
import ProductPicker from './ProductPicker';
import SectionedTextInput from './SectionedTextInput';

export interface FormField {
  name?: string;
  value: string;
  placeholder?: string;
  isRequired?: boolean;
  type: string;
  label?: string;
  multiLine?: boolean;
  displayColor?: boolean;
  numberOfLines?: number;
  maxLength?: Nillable<number>;
  readOnly?: boolean;
  read_only?: boolean;
  disable?: boolean;
  optionCreator?: boolean;
  multiSelect?: boolean;
  isVerifyBlock?: boolean;
  verify?: boolean;
  disableFutureDate?: boolean;
  disablePastDate?: boolean;
  showOptions?: boolean;
  tagKey?: PrefrenceKeyEnum;
  default_value?: any;
  defaultOption?: any;
  options?: Array<any>;
  suggestion?: Array<any>;
  fieldOptions?: Array<any>;
  excludeOptions?: Array<any>;
  modalTitle?: string;
  handleValueChange?: (item: {field: string; value: any}) => void;
  onActionBtnPress?: (editItem?: any) => void;
}
export interface DynamicFormProps {
  formFields: Array<FormField>;
  fieldValues: any;
  handleValueChange: (item: {field: string; value: any}) => void;
  onActionBtnPress?: (editItem?: any) => void;
  buttonPress?: () => void;
  containerStyle?: any;
  buttonTitle?: string;
  ListFooterComponent?: any;
  childrenAtTop?: boolean;
}

const DynamicForm = ({
  children,
  formFields,
  fieldValues,
  handleValueChange,
  buttonPress,
  containerStyle = {},
  buttonTitle = 'SAVE',
  onActionBtnPress,
  ListFooterComponent,
  childrenAtTop = false,
}: PropsWithChildren<DynamicFormProps>) => {
  const renderItem = ({item, index}: {item: FormField; index: number}) => {
    return (
      <RenderField
        {...item}
        key={index}
        default_value={(fieldValues && fieldValues[item.value]) || null}
        fieldOptions={
          item.type === 'selection' && fieldValues.options
            ? fieldValues.options
            : []
        }
        handleValueChange={handleValueChange}
        onActionBtnPress={onActionBtnPress}
      />
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={-100}
      style={[styles.container, containerStyle]}>
      <TouchableWithoutFeedback>
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {childrenAtTop ? children : null}
            {/* <GFlatList
              scrollEnabled={false}
              data={formFields.filter(_i => !_i.disable)}
              renderItem={renderItem}
              keyboardShouldPersistTaps={'handled'}
              automaticallyAdjustKeyboardInsets={true}
              ListFooterComponent={ListFooterComponent}
            /> */}
            {formFields
              .filter(_i => !_i.disable)
              .map((item, index) => renderItem({item, index}))}
            {ListFooterComponent ? ListFooterComponent : null}
            {!childrenAtTop ? children : null}
          </ScrollView>
          {isFunction(buttonPress) ? (
            <View style={{paddingVertical: 20}}>
              <AddButton title={buttonTitle} onPress={() => buttonPress()} />
            </View>
          ) : null}
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default DynamicForm;
const RenderField = (props: FormField) => {
  switch (props.type) {
    case 'selection':
      return <SelectionInput {...props} />;
    case 'multi-selection':
      return (
        <View>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          <DropDown
            multiSelectEnabled
            options={props.options || []}
            onChangeVal={selection => {
              props.handleValueChange &&
                props.handleValueChange({
                  value: selection,
                  field: props.value,
                });
            }}
            defaultOption={props?.default_value || []}
            placeholder={props.placeholder || ''}
          />
        </View>
      );
    case 'lead_picker':
      return (
        <View>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          <DataSelector
            type={'lead'}
            field={props.value}
            defaultValue={props.default_value || null}
            handleValueChange={props.handleValueChange}
            isMultiSelect={props?.multiSelect || false}
          />
        </View>
      );
    case 'team_picker':
      return (
        <View>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          <DataSelector
            type={'team'}
            field={props.value}
            defaultValue={props.default_value || null}
            handleValueChange={props.handleValueChange}
            isMultiSelect={props?.multiSelect || false}
          />
        </View>
      );
    case 'user_picker':
      return (
        <View>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          <DataSelector
            type={'user'}
            field={props.value}
            excludeOptions={props.excludeOptions || []}
            defaultValue={props.default_value || null}
            handleValueChange={props.handleValueChange}
            isMultiSelect={props?.multiSelect || false}
          />
        </View>
      );
    case 'tag_picker':
      return (
        <View>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          <TagPicker
            tagKey={props.tagKey}
            tagLabel={'+ New Tag'}
            selectedTags={props.default_value || null}
            onTagSelect={(value: string) => {
              props.handleValueChange &&
                props.handleValueChange({
                  value: [value],
                  field: props.value,
                });
            }}
          />
        </View>
      );
    case 'input':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          placeholder={`Enter ${props.label}`}
          style={{
            ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
            color: R.colors.labelCol1,
          }}
          readOnly={props.readOnly}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(value: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: value,
                field: props.value,
              });
          }}
        />
      );
    case 'date':
      return (
        <View>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          <DateSelect
            type="date"
            placeholder={`Select ${props.label}`}
            style={{
              ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
              color: R.colors.labelCol1,
            }}
            readOnly={props.readOnly}
            defaultValue={props.default_value}
            onChangeText={(value: string) => {
              props.handleValueChange &&
                props.handleValueChange({
                  value: value,
                  field: props.value,
                });
            }}
            disableFutureDate={props.disableFutureDate || false}
            disablePastDate={props.disablePastDate || false}
          />
        </View>
      );
    case 'name':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          placeholder={'Enter client name'}
          keyboardType={'email-address'}
          leftContent={
            <Feather name={'user'} size={22} color={R.colors.themeCol2} />
          }
          readOnly={props.readOnly}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(name: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: name,
                field: props.value,
              });
          }}
          maxLength={50}
        />
      );
    case 'email':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          keyboardType={'email-address'}
          placeholder={'abc@gmail.com'}
          leftContent={
            <MaterialIcons
              name={'mail-outline'}
              size={22}
              color={R.colors.themeCol2}
            />
          }
          readOnly={props.readOnly}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(email: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: email,
                field: props.value,
              });
          }}
          isVerifyBlock={props.isVerifyBlock}
          verify={props.verify}
          onActionBtnPress={props.onActionBtnPress}
        />
      );
    case 'phone':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          keyboardType={'number-pad'}
          placeholder={'Enter phone number'}
          leftContent={
            <MaterialIcons
              name={'phone'}
              size={22}
              color={R.colors.themeCol2}
            />
          }
          minLength={10}
          maxLength={16}
          readOnly={props.readOnly}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(mainPhone: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: mainPhone,
                field: props.value,
              });
          }}
        />
      );
    case 'amount':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
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
          readOnly={props.readOnly}
          value={`${Helper.currencyFormateForInput(props.default_value, true)}`}
          onChangeText={(sale_value: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: parseInt(sale_value.replace(/,/g, ''), 10),
                field: props.value,
              });
          }}
        />
      );
    case 'number':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          maxLength={15}
          readOnly={props.readOnly}
          keyboardType="numeric"
          placeholder={'Enter amount'}
          value={`${props.default_value || ''}`}
          onChangeText={(sale_value: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: parseInt(sale_value.replace(/,/g, ''), 10),
                field: props.value,
              });
          }}
        />
      );
    case 'company_name':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          maxLength={25}
          placeholder={'Enter company name'}
          leftContent={
            <Image source={R.AppImages.companyIcon} style={styles.imageStyle} />
          }
          readOnly={props.readOnly}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(company_name: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: company_name,
                field: props.value,
              });
          }}
        />
      );
    case 'website':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          placeholder={'Enter website url 1'}
          leftContent={
            <MaterialCommunityIcons
              name={'earth'}
              size={22}
              color={R.colors.themeCol2}
            />
          }
          readOnly={props.readOnly}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(website: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: website,
                field: props.value,
              });
          }}
        />
      );
    case 'location':
      return (
        <View style={{height: 300, marginBottom: 20}}>
          <MapsInput
            label={props.label}
            isRequired={props.isRequired}
            type="map"
            mapViewStyle={{height: 200}}
            defaultAddress={
              props.default_value && props.default_value.address
                ? props.default_value.address
                : null
            }
            defaultCoords={
              props.default_value && props.default_value.coords
                ? props.default_value.coords
                : null
            }
            onChangeAddress={(address: string, coords: any) => {
              props.handleValueChange &&
                props.handleValueChange({
                  value: {
                    coords: coords,
                    address: address,
                  },
                  field: props.value,
                });
            }}
            onChangeCoords={(coords: any, address: string) => {
              props.handleValueChange &&
                props.handleValueChange({
                  value: {
                    coords: coords,
                    address: address,
                  },
                  field: props.value,
                });
            }}
          />
        </View>
      );
    case 'text':
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          multiLine={
            props.multiLine || ['notes', 'description'].includes(props.value)
              ? true
              : false
          }
          numberOfLines={7}
          maxLength={props.maxLength || null}
          readOnly={props.readOnly}
          placeholder={props.label}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(notes: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: notes,
                field: props.value,
              });
          }}
        />
      );
    case 'time':
      return (
        <TimeSelect
          label={props.label}
          isRequired={props.isRequired}
          defaultValue={props.default_value || ''}
          onChangeText={(notes: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: notes,
                field: props.value,
              });
          }}
          readOnly={props.readOnly}
        />
      );
    case 'suggestion_input':
      return (
        <View>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          <InputText
            placeHolder={`Enter your ${props.label?.toLocaleLowerCase()}`}
            multiLine={true}
            numberOfLines={5}
            boxHeight={180}
            readOnly={props.readOnly}
            value={`${props.default_value || ''}`}
            onChangeText={(notes: string) => {
              props.handleValueChange &&
                props.handleValueChange({
                  value: notes,
                  field: props.value,
                });
            }}
            tag={props.suggestion || []}
          />
        </View>
      );
    case 'discount':
      return <DiscountInput {...props} />;
    case 'additional_charges':
      return <AdditionalCharges {...props} />;
    case 'product_picker':
      return <ProductPicker {...props} />;
    case 'form_fields_picker':
      return <CustomFieldPicker {...props} />;
    case 'phone_with_country':
      return <PhoneInputWithCountry {...props} />;
    case 'checkbox':
      return (
        <View style={styles.checkboxContainer}>
          <GCheckBox
            isChecked={props.default_value}
            onPress={(value: boolean) => {
              props.handleValueChange &&
                props.handleValueChange({
                  value: value,
                  field: props.value,
                });
            }}
          />
          <View>
            <Text style={[styles.labelStyle, {marginTop: 2, marginLeft: 5}]}>
              {props.label}
              <Text style={styles.warningText}>
                {props.isRequired ? '*' : ''}
              </Text>
            </Text>
          </View>
        </View>
      );
    default:
      return (
        <SectionedTextInput
          label={props.label}
          isRequired={props.isRequired}
          multiline
          readOnly={props.readOnly}
          defaultValue={`${props.default_value || ''}`}
          onChangeText={(notes: string) => {
            props.handleValueChange &&
              props.handleValueChange({
                value: notes,
                field: props.value,
              });
          }}
        />
      );
  }
};

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 10,
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
  container: {
    flex: 1,
    // marginBottom: 20,
  },
  inputStyle: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: R.colors.themeCol1,
  },
  warningText: {color: R.colors.IndianRed},
  imageStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  fieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 10,
  },
  halfWidth: {flex: 1},
  checkboxContainer: {flexDirection: 'row', marginTop: 10, marginBottom: 10},
  addListButton: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(5),
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: moderateScale(5),
    height: 30,
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.white,
  },
  orText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    paddingHorizontal: 5,
  },
  sectionContainer: {
    borderRadius: 10,
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: R.colors.themeCol2,
  },
  btnContainer: {
    width: 50,
    justifyContent: 'center',
    marginLeft: 5,
    alignItems: 'flex-end',
  },
  flexRow: {flexDirection: 'row'},
});
const DiscountInput = (props: FormField) => {
  const [isDiscount, setDiscountInput] = useState(false);
  const [value] = useState(new Animated.Value(0));
  const [discount, setDiscount] = useState(
    props.default_value || {
      type: 'fixed',
      rate: '',
    },
  );
  useEffect(() => {
    Animated.timing(value, {
      toValue: isDiscount ? 70 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDiscount]);
  useEffect(() => {
    props.handleValueChange &&
      props.handleValueChange({
        value: discount,
        field: props.value,
      });
  }, [discount]);

  return (
    <View>
      <View style={styles.fieldsContainer}>
        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => setDiscountInput(!isDiscount)}>
          <Text style={[styles.labelBoldStyle, {marginTop: 0}]}>
            <MaterialCommunityIcons
              name={isDiscount ? 'minus' : 'plus'}
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
      <View>
        <Animated.View
          style={[
            styles.fieldsContainer,
            {height: value, justifyContent: 'space-between'},
          ]}>
          <View style={styles.halfWidth}>
            <SectionedTextInput
              inputStyle={{textAlign: 'right'}}
              placeholder="Enter"
              value={`${
                discount.type === 'fixed' ? discount.rate || '' : 0 || ''
              }`}
              keyboardType={'number-pad'}
              onChangeText={(rate: string) => {
                setDiscount({type: 'fixed', rate: rate});
              }}
              leftWidth={'20%'}
              leftContent={
                <MaterialCommunityIcons
                  name={'currency-inr'}
                  size={22}
                  color={R.colors.themeCol2}
                />
              }
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.orText}>OR</Text>
          </View>
          <View style={styles.halfWidth}>
            <SectionedTextInput
              placeholder="Enter"
              inputStyle={{textAlign: 'right'}}
              keyboardType={'number-pad'}
              value={`${
                discount.type === 'rate' ? discount.rate || '' : 0 || ''
              }`}
              onChangeText={(rate: string) => {
                setDiscount({type: 'rate', rate: rate});
              }}
              rightWidth={'15%'}
              rightContent={
                <MaterialCommunityIcons
                  name={'percent-outline'}
                  size={22}
                  color={R.colors.themeCol2}
                />
              }
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const SelectionInput = (props: any) => {
  const [fieldOptions, setFieldOptions] = useState<Array<string>>(
    props?.fieldOptions || [],
  );
  // const [isOpen, setOpen] = useState<boolean>(true);
  // const [value] = useState(new Animated.Value(0));
  const [selection, setSelection] = useState(props?.default_value || '');
  // const handleValueUpdate = (_value: string, index: number) => {
  //   const newOptions = [...fieldOptions];
  //   newOptions[index] = _value;
  //   setFieldOptions(newOptions);
  // };
  useEffect(() => {
    props.handleValueChange &&
      props.handleValueChange({
        value: selection,
        field: props.value,
        options: fieldOptions,
      });
  }, [fieldOptions, selection]);
  // useEffect(() => {
  //   Animated.timing(value, {
  //     toValue: isOpen ? 70 * fieldOptions.length : 0,
  //     duration: 200,
  //     useNativeDriver: false,
  //   }).start();
  // }, [isOpen, fieldOptions]);
  return (
    <View>
      <Text style={styles.labelStyle}>
        {props.label}
        <Text style={styles.warningText}>{props.isRequired ? '*' : ''}</Text>
      </Text>
      <DropDown
        title={props?.modalTitle || `Select ${props.label}`}
        options={props.options || []}
        onChangeVal={_selection => {
          setSelection(_selection);
        }}
        onActionBtnPress={props.onActionBtnPress}
        displayColor={props?.displayColor || false}
        defaultOption={selection || []}
        placeholder={props.placeholder || `Select ${props.label.toLowerCase()}`}
      />
      {props.optionCreator && props?.default_value === 'selection' ? (
        <OptionSelector
          fieldOptions={fieldOptions}
          onOptionChange={setFieldOptions}
        />
      ) : null}
      {/* <Animated.View
        style={[
          {
            height: value,
            justifyContent: 'space-between',
            borderWidth: 1,
            overflow: 'hidden',
          },
        ]}>
        {props.optionCreator && props?.default_value === 'selection' ? (
          <View>
            {fieldOptions.map((_item, index) => (
              <View style={styles.flexRow} key={index}>
                <View style={{flex: 1}}>
                  <SectionedTextInput
                    placeholder={'Enter Option'}
                    value={_item || ''}
                    onChangeText={(name: string) => {
                      handleValueUpdate(name, index);
                    }}
                  />
                </View>
                <View style={styles.btnContainer}>
                  <DeleteButton
                    onPress={() => {
                      const newArr = [...fieldOptions];
                      newArr.splice(index, 1);
                      setFieldOptions(newArr);
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </Animated.View>
      {props.optionCreator && props?.default_value === 'selection' ? (
        <Button
          label={'Add New Option'}
          onPress={() => setFieldOptions([...fieldOptions, ''])}
          buttonStyle={styles.buttonStyle}
          labelStyle={{color: R.colors.themeCol2}}
        />
      ) : null} */}
    </View>
  );
};
