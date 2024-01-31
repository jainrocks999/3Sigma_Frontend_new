import {useNavigation} from '@react-navigation/native';
import {Category} from 'datalib/entity/category';
import {Product} from 'datalib/entity/product';
import BackButton from 'library/common/BackButton';
import {DeleteButton} from 'library/common/ButtonGroup';
import GAlert, {MessageType} from 'library/common/GAlert';
import UploadImage, {FileRelationEnum} from 'library/common/UploadImage';
import DynamicForm from 'library/form-field/DynamicForm';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import GScreen from 'library/wrapper/GScreen';
import React, {useState} from 'react';
import {View, Text, Platform, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {CATEGORY_FORM, PRODUCT_FORM} from '../../configs/constants';
import {Nillable} from '../../models/custom.types';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  initialPaginationMetaData,
  selectCtegories,
  updateProduct,
} from '../../store/slices/quotation.slice';
import Helper from '../../utils/helper';
import AddCategoryModal from './AddCategoryModal';
import DocumentPicker from 'react-native-document-picker';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {deleteFiles} from '../../store/slices/lead.slice';

const AddProductScreen = ({route}: any) => {
  const editItem = route.params?.editItem || null;
  const dispatch = useDispatch<RootDispatch>();
  const categories = useSelector(selectCtegories);
  const navigation = useNavigation();
  const updateProductsStatus = useSelector(
    (state: RootState) => state.quotation.updateProductsStatus,
  );
  const fileUploadStatus = useSelector(
    (state: RootState) => state.lead.fileUploadStatus,
  );
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const [showCategoryModal, setCategoryModal] = useState<boolean>(false);
  const [filesToUpload, setFilesToUpload] = useState<Array<any>>([]);
  const [images, setImages] = useState<Array<any>>(
    editItem?.images ? editItem?.images : [],
  );
  const [category, setCategory] = useState<Nillable<Category>>(null);
  const [product, setProduct] = useState<Product>({
    category: editItem?.category?._id || '',
    productId: editItem?.productId || '',
    name: editItem?.name || '',
    description: editItem?.description || '',
    currency: editItem?.currency || '',
    unitType: editItem?.unitType || '',
    price: editItem?.price || '',
  });
  const prodcutForm = [...PRODUCT_FORM];
  if (editItem) {
    prodcutForm[0].disable = false;
    prodcutForm[1].readOnly = true;
    prodcutForm[3].disable = true;
    prodcutForm[4].disable = true;
  } else {
    prodcutForm[0].disable = false;
    prodcutForm[1].readOnly = false;
    prodcutForm[3].disable = true;
    prodcutForm[4].disable = true;
    prodcutForm[0].options =
      categories.map(_cat => ({
        name: _cat.name,
        value: _cat._id,
        color: _cat.color,
      })) || [];
  }
  const handleValueChange = (_value: {field: string; value: string}) => {
    const updatedItem = {...product, [_value.field]: _value.value};
    setProduct(updatedItem);
  };
  const handleSaveProduct = async () => {
    if (Helper.isFormValid(prodcutForm, product)) {
      let response;
      delete product.productId;
      delete product.currency;
      delete product.unitType;
      if (editItem) {
        product._id = editItem._id;
        // delete product.category;
        delete product.name;
        response = await dispatch(updateProduct(product));
      } else {
        response = await dispatch(createProduct(product));
        if (
          response.meta.requestStatus === 'fulfilled' &&
          filesToUpload.length
        ) {
          await Helper.handleFileUpload(
            dispatch,
            filesToUpload,
            FileRelationEnum.product,
            response.payload?._id || '',
          );
        }
      }
      if (response.meta.requestStatus === 'fulfilled') {
        await dispatch(
          getProductById(editItem ? editItem._id : response.payload?._id),
        );
        navigation.goBack();
      }
    }
  };

  const handleDelete = async (confirm: boolean) => {
    setConfirmation(false);
    if (confirm) {
      await dispatch(deleteProduct(editItem._id));
      // await dispatch(getProducts(initialPaginationMetaData));
      navigation.goBack();
    }
  };
  const handleCategoryAction = (editCategory = null) => {
    setCategory(editCategory);
    setCategoryModal(true);
  };

  const handleDeleteFile = (index: any) => {
    if (typeof index !== 'number') {
      const _files = images.filter(_i => _i?.fileName !== index?.fileName);
      _files.splice(index, 1);
      setImages(_files);
      dispatch(
        deleteFiles({
          type: 'product',
          product: editItem?._id,
          filePaths: [index?.filePath],
        }),
      );
    } else {
      const _files = [...filesToUpload];
      _files.splice(index, 1);
      setFilesToUpload(_files);
    }
  };
  return (
    <GScreen
      loading={
        updateProductsStatus.status === ThunkStatusEnum.LOADING ||
        fileUploadStatus.status === ThunkStatusEnum.LOADING
      }>
      <View style={styles.container}>
        <View style={styles.backBtnWrapper}>
          <BackButton title={editItem ? 'Update Product' : 'Create Product'} />
          {editItem ? (
            <DeleteButton onPress={() => setConfirmation(true)} />
          ) : null}
        </View>
        <View style={styles.listContainer}>
          <DynamicForm
            formFields={prodcutForm}
            fieldValues={product}
            handleValueChange={handleValueChange}
            buttonTitle={editItem ? 'Update Product' : 'Create Product'}
            buttonPress={handleSaveProduct}
            childrenAtTop
            onActionBtnPress={handleCategoryAction}>
            <View>
              <UploadImage
                label={'Upload Images'}
                onFileSelect={(file: Array<any>) => {
                  setFilesToUpload([...filesToUpload, ...file]);
                  if (editItem) {
                    Helper.handleFileUpload(
                      dispatch,
                      file,
                      FileRelationEnum.product,
                      editItem._id || '',
                    );
                    dispatch(getProductById(editItem?._id));
                  }
                }}
                multiple
                fileTypes={DocumentPicker.types.images}
                files={[...images, ...filesToUpload]}
                onDeletePress={handleDeleteFile}
                hideNames
              />
            </View>
          </DynamicForm>
        </View>
      </View>
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleDelete}
        confirmationMessage={'Are you sure want to delete?'}
      />
      <AddCategoryModal
        isVisible={showCategoryModal}
        editItem={category}
        onModalHide={setCategoryModal}
      />
    </GScreen>
  );
};
export default AddProductScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    paddingVertical: 10,
  },

  backBtnWrapper: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  listContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
});
