/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {Product, ProductSummary} from 'datalib/entity/product';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import QuickProductUpdate from '../../screens/ManageQuotationScreen/Components/QuickProductUpdate';
import {RootState} from '../../store/app.store';
import {
  selectProductById,
  selectProducts,
} from '../../store/slices/quotation.slice';
import Button from '../common/ButtonGroup';
import GModal from '../wrapper/GModal';
import SectionedTextInput from './SectionedTextInput';
import {ScrollView} from 'react-native-gesture-handler';
import Helper from '../../utils/helper';

const ProductPicker = (props: any) => {
  const [showProductSelector, setProductSelector] = useState<boolean>(false);
  const products: Array<Product> = useSelector(selectProducts);
  const [selectedProduct, setSelectedProduct] = useState<Array<ProductSummary>>(
    props?.default_value || [],
  );
  useEffect(() => {
    props.handleValueChange &&
      props.handleValueChange({
        value: selectedProduct,
        field: props.value,
      });
  }, [selectedProduct]);
  const updateProductSelection = (selection: ProductSummary) => {
    const _products: Array<ProductSummary> = upsert(
      [...selectedProduct],
      selection,
    );
    setSelectedProduct(_products);
  };
  const upsert = (array: Array<ProductSummary>, element: ProductSummary) => {
    const i = array.findIndex(_element => _element.id === element.id);
    if (i > -1) {
      array[i] = element;
    } else {
      array.push(element);
    }
    return array.filter(_element => _element.quantity > 0);
  };
  return (
    <View style={styles.productContainer}>
      <View style={styles.fieldsContainer}>
        <TouchableOpacity
          style={styles.addListButton}
          onPress={() => {
            setProductSelector(true);
          }}>
          <MaterialCommunityIcons
            name={'package-variant-closed'}
            size={20}
            color={R.colors.black}
          />
          <Text style={styles.addButtonText}>Select Product</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal: -20}}>
        {selectedProduct.map((productSummery, index) => (
          <ProductSelectionItem
            key={`product_${index}`}
            showQuickEdit
            productSummery={productSummery}
            productId={productSummery.id}
            updateProductSelection={updateProductSelection}
          />
        ))}
      </View>
      <ProductSelectionModal
        showProductSelector={showProductSelector}
        setProductSelector={setProductSelector}
        products={products}
        selectedProducts={selectedProduct}
        onProductSelect={setSelectedProduct}
      />
    </View>
  );
};
export default ProductPicker;
const ProductSelectionModal = ({
  showProductSelector,
  setProductSelector,
  onProductSelect,
  products,
  selectedProducts = [],
}: {
  showProductSelector: boolean;
  setProductSelector: (showProductSelector: boolean) => void;
  onProductSelect: (products: Array<ProductSummary>) => void;
  products: Array<Product>;
  selectedProducts: Array<ProductSummary>;
}) => {
  const [listProduct, setListProduct] = useState(products || []);
  const [selectedProduct, setSelectedProduct] =
    useState<Array<ProductSummary>>(selectedProducts);
  const [subTotal, setSubTotal] = useState<number>(0);

  const [searchText, setSearchText] = useState<string>('');
  const onSubmitSearch = (_searchText: string) => {
    setListProduct(products.filter(_p => _p.name?.includes(_searchText)));
  };
  useEffect(() => {
    setSelectedProduct(selectedProducts);
  }, [selectedProducts]);

  const updateProductSelection = (selection: ProductSummary) => {
    const _products: Array<ProductSummary> = upsert(
      [...selectedProduct],
      selection,
    );
    setSubTotal(
      _products.reduce((accumulator, element) => {
        return accumulator + element.unitPrice * element.quantity;
      }, 0),
    );
    setSelectedProduct(_products);
  };
  const upsert = (array: Array<ProductSummary>, element: ProductSummary) => {
    const i = array.findIndex(_element => _element.id === element.id);
    if (i > -1) {
      array[i] = element;
    } else {
      array.push(element);
    }
    return array.filter(_element => _element.quantity > 0);
  };
  const handleButtonPress = () => {
    onProductSelect(selectedProduct);
    setProductSelector(false);
  };
  return (
    <GModal
      isVisible={showProductSelector}
      onModalHide={() => setProductSelector(false)}>
      <View
        style={styles.modalContainer}
        onStartShouldSetResponder={(): boolean => true}>
        <View style={styles.searchContainer}>
          <Text style={[styles.modalTitle]}>Add Products</Text>
          <SectionedTextInput
            placeholder={'Search'}
            containerStyle={styles.inputStyle}
            leftContent={
              <Feather name={'search'} size={18} color={R.colors.themeCol1} />
            }
            defaultValue={searchText}
            onChangeText={(toSearch: string) => {
              setSearchText(toSearch);
            }}
            onSubmitEditing={() => {
              onSubmitSearch(searchText);
            }}
          />
        </View>
        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
          {listProduct && listProduct.length ? (
            listProduct.map((item, index) => (
              <ProductSelectionItem
                key={index}
                productId={item._id || ''}
                productSummery={
                  selectedProduct.filter(
                    summery => summery.id === item._id,
                  )[0] || null
                }
                updateProductSelection={updateProductSelection}
              />
            ))
          ) : (
            <View style={styles.footerContainer}>
              <Text style={styles.messageText}>0 Producs available</Text>
            </View>
          )}
        </ScrollView>
        {/* <GFlatList
          data={listProduct}
          scrollEnabled={false}
          renderItem={({item, index}) => (
            <ProductSelectionItem
              key={index}
              productId={item._id}
              productSummery={
                selectedProduct.filter(summery => summery.id === item._id)[0] ||
                null
              }
              updateProductSelection={updateProductSelection}
            />
          )}
          emptyMessage={'0 Producs available'}
        /> */}

        <View style={styles.bottomBar}>
          <Text style={styles.summeryText}>
            {selectedProduct.length || 0} Items | ₹{' '}
            {Helper.currencyFormate(subTotal)}
          </Text>
          <Button
            buttonStyle={styles.buttonStyle}
            label="Add Proucts"
            onPress={handleButtonPress}
          />
        </View>
      </View>
    </GModal>
  );
};
export const ProductSelectionItem = ({
  productId,
  updateProductSelection,
  productSummery,
  showQuickEdit = false,
}: {
  productId: string;
  productSummery: ProductSummary;
  showQuickEdit?: boolean;
  updateProductSelection: (selection: ProductSummary) => void;
}) => {
  const product: Product = useSelector((state: RootState) =>
    selectProductById(state, productId),
  );
  const [quantity, setQuantity] = useState(productSummery?.quantity || 0);
  const [showQuickProduct, setQuickEdit] = useState(false);

  useEffect(() => {
    setQuantity(productSummery?.quantity || 0);
  }, [productSummery?.quantity]);
  useEffect(() => {
    if (product && updateProductSelection) {
      updateProductSelection({
        id: product._id || '',
        quantity: quantity,
        unitPrice: productSummery?.unitPrice || product?.price || 0,
        description: productSummery?.description || product.description || '',
      });
    }
  }, [quantity]);
  return (
    <Pressable>
      <View style={styles.productItem}>
        <View style={{width: '60%'}}>
          <Text style={styles.productTitle} numberOfLines={1}>
            {product?.name}
          </Text>
          <View style={{width: '100%'}}>
            <Text style={[styles.description]} numberOfLines={1}>
              {productSummery
                ? productSummery?.description
                : product?.description}
            </Text>
            <Text style={styles.price} numberOfLines={1}>
              {product?.currency}{' '}
              {Helper.currencyFormate(
                productSummery ? productSummery.unitPrice : product.price,
              )}{' '}
              per item
            </Text>
            {showQuickEdit && (
              <View
                style={[
                  styles.circleBtn,
                  {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                  },
                ]}>
                <Pressable
                  style={[styles.circleBtnInner]}
                  onPress={() => setQuickEdit(true)}
                  android_ripple={R.darkTheme.grayRipple}>
                  <MaterialCommunityIcons
                    name={'pencil'}
                    color={R.colors.themeCol2}
                    size={15}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <View>
          <View style={styles.quantityPicker}>
            <View style={styles.circleBtn}>
              <Pressable
                onPress={() => {
                  if (quantity > 0) {
                    setQuantity(quantity - 1);
                  }
                }}
                android_ripple={R.darkTheme.grayRipple}
                style={styles.circleBtnInner}>
                <MaterialCommunityIcons
                  name={'minus'}
                  color={R.colors.themeCol2}
                  size={20}
                />
              </Pressable>
            </View>
            <Text style={styles.quantityText}>{quantity}</Text>
            <View style={styles.circleBtn}>
              <Pressable
                onPress={() => setQuantity(quantity + 1)}
                android_ripple={R.darkTheme.grayRipple}
                style={styles.circleBtnInner}>
                <MaterialCommunityIcons
                  name={'plus'}
                  color={R.colors.themeCol2}
                  size={20}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.amountContianer}>
            <Text style={styles.amountText}>
              <Text style={styles.rupeeText}>₹ </Text>
              {Helper.currencyFormate(
                (productSummery ? productSummery.unitPrice : product.price) *
                  quantity,
              )}
            </Text>
          </View>
        </View>
        <QuickProductUpdate
          isVisible={showQuickProduct}
          onModalHide={() => setQuickEdit(false)}
          product={productSummery}
          onValueUpdate={updateProductSelection}
        />
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 20,
  },
  bottomBar: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: R.colors.themeCol1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    backgroundColor: R.colors.themeCol2,
    width: 150,
    height: 50,
    justifyContent: 'center',
  },
  inputStyle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    textTransform: 'capitalize',
    color: R.colors.themeCol1,
  },
  summeryText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
    textTransform: 'capitalize',
    color: R.colors.white,
  },
  warningText: {color: R.colors.IndianRed},
  imageStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  fieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  addListButton: {
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(10),
    backgroundColor: R.colors.white,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    marginLeft: 10,
  },
  searchContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  modalContainer: {
    backgroundColor: R.colors.bgCol,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  productItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: R.colors.white,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productTitle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    textTransform: 'capitalize',
  },
  description: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
  },
  price: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
    marginTop: 10,
  },
  modalTitle: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.black,
    marginBottom: 10,
  },
  rupeeText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol2,
  },
  amountText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    textAlign: 'right',
  },
  quantityText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    minWidth: 30,
    textAlign: 'center',
  },

  circleBtn: {
    borderRadius: 20,
    height: 35,
    width: 35,
    overflow: 'hidden',
    backgroundColor: R.colors.InputGrey4,
  },
  circleBtnInner: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountContianer: {
    marginTop: 10,
  },
  productContainer: {
    borderRadius: 10,
  },
  footerContainer: {
    paddingTop: 20,
    textAlign: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  messageText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: 'black',
    textAlign: 'center',
    marginTop: 30,
    minHeight: 50,
  },
});
