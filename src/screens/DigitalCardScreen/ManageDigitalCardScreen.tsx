import BackButton from 'library/common/BackButton';
import DynamicForm from 'library/form-field/DynamicForm';
import GScreen from 'library/wrapper/GScreen';
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import {DIGITAL_CARD_FORM} from '../../configs/constants';
import {Digitalcard} from 'datalib/entity/digitalcard';
import {isNil} from 'lodash';
import GAlert from 'library/common/GAlert';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch} from '../../store/app.store';
import {createDigitalCard} from '../../store/slices/actions/DigitalCard';
import {Nillable} from '../../models/custom.types';
import {selectDigitalCard} from '../../store/slices/user.slice';
import {useNavigation} from '@react-navigation/native';

export default function ManageDigitalCardScreen() {
  const dispatch = useDispatch<RootDispatch>();
  const navigator = useNavigation();
  const digitalcard: Nillable<Digitalcard> = useSelector(selectDigitalCard);
  const [edititem, setDigitalCard] = useState<any>({
    name: digitalcard?.name || '',
    phone: digitalcard?.phone || '',
    email: digitalcard?.email || '',
    whatsapp: digitalcard?.whatsapp || '',
    website: digitalcard?.website || '',
    facebook: digitalcard?.facebook || '',
    instagram: digitalcard?.instagram || '',
    linkedIn: digitalcard?.linkedIn || '',
    googleCalendar: digitalcard?.googleCalendar || '',
    customFields: {},
    briefDescription: digitalcard?.briefDescription || '',
    designation: digitalcard?.designation || '',
    companyName: digitalcard?.companyName || '',
    companyAddress: digitalcard?.companyAddress || '',
  });
  const handleCustomField = (item: {field: string; value: any}) => {
    const newDCard = {...edititem};
    if (item && item.field) {
      newDCard[item.field] = item.value;
      setDigitalCard({...newDCard});
    }
  };
  const handleDigitalCardSave = async () => {
    try {
      const payload = {...edititem};
      if (isValidCard()) {
        console.log(payload);
        const response = await dispatch(createDigitalCard(payload));
        if (response && response.meta.requestStatus === 'fulfilled') {
          console.log('digital card', response.payload);
          navigator.goBack();
        }
      }
    } catch (error) {
      console.log('Error in data', error);
    }
  };
  const isValidCard = () => {
    let valid = true;
    DIGITAL_CARD_FORM.map((field: any) => {
      if (
        field.isRequired &&
        (edititem[field.value] === '' || isNil(edititem[field.value]))
      ) {
        if (valid) {
          GAlert(`${field.label} cannot be empty`);
        }
        valid = false;
      }
    });
    return valid;
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <BackButton title={'Digital Card'} />
        </View>
        <DynamicForm
          formFields={DIGITAL_CARD_FORM}
          fieldValues={edititem}
          handleValueChange={handleCustomField}
          buttonPress={handleDigitalCardSave}
        />
      </View>
    </GScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    paddingHorizontal: -20,
  },
});
