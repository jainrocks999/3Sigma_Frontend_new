/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import {Nillable} from '../../models/custom.types';
import AddButton from '../common/AddButton';
import Button, {DeleteButton, EditButton} from '../common/ButtonGroup';
import GModal from '../wrapper/GModal';
import DropDown from './DropDown';
import {FormField} from './DynamicForm';
import SectionedTextInput from './SectionedTextInput';

const CustomFieldPicker = (props: any) => {
  const [fields, setFields] = useState<Array<FormField>>(
    props.default_value || [],
  );
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editField, setEditField] = useState<Nillable<FormField>>(null);
  const removeField = (value: string) => {
    setFields(fields.filter(v => v.value !== value));
    setShowFieldModal(false);
  };
  useEffect(() => {
    if (props.value.length) {
      props.handleValueChange &&
        props.handleValueChange({
          value: fields,
          field: props.value,
        });
    }
  }, [fields]);
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.fieldsContainer}>
        {/* <Text style={[styles.labelStyle, {marginTop: 0}]}>
            {props.label}
            <Text style={styles.warningText}>{props.isRequired ? '*' : ''}</Text>
          </Text> */}
        <TouchableOpacity
          style={styles.addListButton}
          onPress={() => {
            setEditField(null);
            setShowFieldModal(true);
          }}>
          <Text style={styles.addButtonText}>+ Add custom fields</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {fields.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Pressable
              android_ripple={R.darkTheme.grayRipple}
              style={styles.itemInner}
              onPress={() => {
                setEditField(item);
                setShowFieldModal(true);
              }}>
              <View style={styles.rowItems}>
                <MaterialCommunityIcons
                  name="form-select"
                  size={20}
                  color={R.colors.themeCol1}
                />
                <Text style={styles.fieldNameText}>{item.name}</Text>
              </View>
              <EditButton
                onPress={() => {
                  setEditField(item);
                  setShowFieldModal(true);
                }}
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <AddFieldModal
        isVisible={showFieldModal}
        onModalHide={() => setShowFieldModal(false)}
        editField={editField}
        options={props.options}
        removeField={removeField}
        handleNewFild={(field: FormField) => {
          setFields([
            ...fields.filter(v => v.value !== editField?.value),
            field,
          ]);
          setShowFieldModal(false);
        }}
      />
    </View>
  );
};
const AddFieldModal = (props: any) => {
  const {
    isVisible,
    onModalHide,
    editField,
    options,
    removeField,
    handleNewFild,
  } = props;
  const [fieldOptions, setFieldOptions] = useState<Array<string>>(
    editField?.fieldOptions || [],
  );
  const [field, setField] = useState(
    editField || {
      name: '',
      type: '',
      isRequired: false,
      value: '',
    },
  );
  useEffect(() => {
    if (editField) {
      setField(editField);
      if (editField?.fieldOptions) {
        setFieldOptions(editField?.fieldOptions);
      }
    } else {
      setField({
        name: '',
        type: '',
        isRequired: false,
        value: '',
      });
    }
  }, [editField, isVisible]);
  const handleValueUpdate = (fieldName: string, _value: any) => {
    const newField: any = {...field};
    if (fieldName === 'name' && _value) {
      // newField.label = _value;
      newField.value = _value.trim().toLowerCase().split(' ').join('_');
    }
    newField[fieldName] = _value;
    setField(newField);
  };
  return (
    <GModal isVisible={isVisible} onModalHide={onModalHide}>
      <View style={styles.modalView}>
        <View style={styles.headerWrapper}>
          <Text style={styles.popupHeader}>Add custom field</Text>
          <DeleteButton onPress={() => removeField(field.value)} />
        </View>
        <View style={styles.scrollStyle}>
          <View style={{}}>
            <SectionedTextInput
              label={'Field title'}
              placeholder={'Field title'}
              value={`${field.name || ''}`}
              onChangeText={(name: string) => {
                handleValueUpdate('name', name);
              }}
            />
          </View>

          {isVisible && (
            <View>
              <Text style={[styles.labelStyle, {marginTop: 0}]}>
                Field type
              </Text>
              <DropDown
                title={'Select'}
                options={options || []}
                onChangeVal={selection => {
                  handleValueUpdate('type', selection);
                }}
                onActionBtnPress={props.onActionBtnPress}
                defaultOption={editField?.type}
                placeholder={'Select'}
              />

              {field?.type === 'selection' ? (
                <OptionSelector
                  fieldOptions={fieldOptions}
                  onOptionChange={setFieldOptions}
                />
              ) : null}
            </View>
          )}
          <AddButton
            title={'Save'}
            onPress={() => {
              if (field.type === 'selection') {
                handleNewFild({...field, fieldOptions});
              } else {
                handleNewFild(field);
              }
            }}
          />
        </View>
      </View>
    </GModal>
  );
};
export const OptionSelector = (props: any) => {
  const [fieldOptions, setFieldOptions] = useState<Array<string>>(
    props?.fieldOptions || [],
  );
  const [isOpen, setOpen] = useState<boolean>(true);
  const [value] = useState(new Animated.Value(0));
  const handleValueUpdate = (_value: string, index: number) => {
    const newOptions = [...fieldOptions];
    newOptions[index] = _value;
    setFieldOptions(newOptions);
  };
  useEffect(() => {
    props.onOptionChange && props.onOptionChange(fieldOptions);
  }, [fieldOptions]);
  useEffect(() => {
    Animated.timing(value, {
      toValue: isOpen ? 70 * fieldOptions.length : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen, fieldOptions]);
  return (
    <View>
      <View style={{alignSelf: 'flex-end'}}>
        <TouchableOpacity onPress={() => setOpen(!isOpen)}>
          <MaterialCommunityIcons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={30}
            color={R.colors.black}
          />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          {
            height: value < 200 ? value : 250,
            justifyContent: 'space-between',
            overflow: 'hidden',
            maxHeight: 250,
          },
        ]}>
        <ScrollView>
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
        </ScrollView>
      </Animated.View>
      <Button
        label={'Add New Option'}
        onPress={() => setFieldOptions([...fieldOptions, ''])}
        buttonStyle={[styles.buttonStyle, {marginBottom: 10}]}
        labelStyle={{color: R.colors.themeCol2}}
      />
    </View>
  );
};

export default CustomFieldPicker;
const styles = StyleSheet.create({
  sectionContainer: {
    borderRadius: 10,
  },
  fieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 10,
  },
  addListButton: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(5),
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: moderateScale(5),
    height: 30,
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.white,
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
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: R.colors.white,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  fieldNameText: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    marginLeft: 10,
  },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
