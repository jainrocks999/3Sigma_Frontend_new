import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import fonts from 'resources/fonts/fonts';
import {FontSizeEnum} from 'resources/fonts/fontStyles';
import GAlert, {MessageType} from 'library/common/GAlert';

import {useDispatch, useSelector} from 'react-redux';
import GModal from 'library/wrapper/GModal';
import {List} from 'datalib/entity/List';
import {RootDispatch, RootState} from '../../store/app.store';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {Nillable} from '../../models/custom.types';
import DynamicForm from 'library/form-field/DynamicForm';
import {Category} from 'datalib/entity/category';
import Helper from '../../utils/helper';
import {CATEGORY_FORM} from '../../configs/constants';
import {
  createCategory,
  updateCategory,
} from '../../store/slices/quotation.slice';
import R from 'resources/R';

const AddCategoryModal = ({
  editItem = null,
  isVisible,
  onModalHide,
}: {
  editItem: Nillable<List>;
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
}) => {
  const dispatch = useDispatch<RootDispatch>();
  const [category, setCategory] = useState<Category>(
    editItem || {
      name: '',
      color: '',
    },
  );
  useEffect(() => {
    if (editItem) {
      setCategory(editItem);
    }
  }, [editItem]);

  const loading = useSelector(
    (state: RootState) => state.quotation.updateCategoriesStatus,
  );
  const addListItem = async () => {
    if (Helper.isFormValid(CATEGORY_FORM, category)) {
      let response;
      if (editItem) {
        category._id = editItem._id;
        response = await dispatch(updateCategory(category));
      } else {
        response = await dispatch(createCategory(category));
      }
      if (response.meta.requestStatus === 'fulfilled') {
        GAlert('Category successfully creaetd', MessageType.SUCCESS);
        onModalHide(false);
      }
    }
  };
  const handleValueChange = (_value: {field: string; value: string}) => {
    const updatedItem = {...category, [_value.field]: _value.value};
    setCategory(updatedItem);
  };
  return (
    <GModal
      isVisible={isVisible}
      onModalHide={() => onModalHide(false)}
      loading={loading.status === ThunkStatusEnum.LOADING}>
      <View style={styles.modalView}>
        <View style={styles.headerWrapper}>
          <Text style={styles.popupHeader}>
            {editItem ? 'UPDATE CATEGORY' : 'ADD CATEGORY'}
          </Text>
        </View>
        <DynamicForm
          formFields={CATEGORY_FORM}
          buttonTitle={editItem ? 'UPDATE CATEGORY' : 'ADD CATEGORY'}
          buttonPress={addListItem}
          fieldValues={category}
          handleValueChange={handleValueChange}
          containerStyle={{paddingHorizontal: 20}}
        />
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {},
  modalView: {
    backgroundColor: R.colors.bgCol,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
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
    minHeight: 380,
  },
  popupHeader: {
    fontFamily: fonts.bold,
    color: R.colors.themeCol1,
    fontSize: FontSizeEnum.LG,
  },
  enableDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  addlistButtonWrapper: {
    width: '100%',
    marginVertical: moderateScale(40),
  },
});

export default AddCategoryModal;
