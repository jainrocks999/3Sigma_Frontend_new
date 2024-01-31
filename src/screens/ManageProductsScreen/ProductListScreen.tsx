/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {Product} from 'datalib/entity/product';
import {User} from 'datalib/entity/user';
import HoverButton from 'library/buttons/HoverButton';
import BackButton from 'library/common/BackButton';
import {IconButton} from 'library/common/ButtonGroup';
import GFlatList from 'library/common/GFlatList';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {Nillable} from '../../models/custom.types';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  getCategories,
  getProducts,
  initialPaginationMetaData,
  selectCtegoryById,
  selectProducts,
} from '../../store/slices/quotation.slice';
import {selectUserById} from '../../store/slices/user.slice';
import Helper from '../../utils/helper';
import GImage from 'library/common/GImage';
import {TeamMember} from 'datalib/entity/team';

const ProductListScreen = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const products: Array<Product> = useSelector(selectProducts);
  const [searchText, setSearchText] = useState<string>('');
  const [prductList, setProductList] = useState<Array<Product>>(products || []);
  const {findProductsStatus, findCategoriesStatus} = useSelector(
    (state: RootState) => state.quotation,
  );
  const [value] = useState(new Animated.Value(0));
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (props.navigation.isFocused()) {
      if (findProductsStatus.status === ThunkStatusEnum.IDLE) {
        dispatch(getProducts(initialPaginationMetaData));
      }
      if (findCategoriesStatus.status === ThunkStatusEnum.IDLE) {
        dispatch(getCategories(initialPaginationMetaData));
      }
    }
  }, []);
  useEffect(() => {
    handleSearchTextChange(searchText);
  }, [products]);
  useEffect(() => {
    Animated.timing(value, {
      toValue: isOpen ? Dimensions.get('screen').width - 60 : 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);
  const handleSearchTextChange = (_search: string) => {
    setSearchText(_search);
    if (products.length) {
      const newProducts = products.filter((_i: Product) =>
        _i.name?.toLowerCase().includes(_search.toLowerCase()),
      );
      setProductList(newProducts);
    } else {
      setProductList([]);
    }
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.backBtnWrapper}>
          <BackButton title={`My Products (${products.length})`} />
          <Animated.View
            style={[
              {
                width: value,
                justifyContent: 'space-between',
                overflow: 'hidden',
                position: 'absolute',
                right: 20,
                top: -17,
              },
            ]}>
            {isOpen ? (
              <View style={{zIndex: 999}}>
                <SectionedTextInput
                  placeholder={'Search'}
                  defaultValue={`${searchText || ''}`}
                  onChangeText={handleSearchTextChange}
                />
              </View>
            ) : null}
          </Animated.View>
          <IconButton
            icon={isOpen ? 'close' : 'magnify'}
            onPress={() => setOpen(!isOpen)}
            btnStyle={{zIndex: 9}}
          />
        </View>
        <View style={styles.listContainer}>
          <GFlatList
            data={prductList}
            renderItem={({item, index}) => (
              <ListItem key={index} product={item} />
            )}
            emptyMessage={
              findProductsStatus.status === ThunkStatusEnum.LOADING
                ? 'Loading'
                : '0 products found, press + to create new poduct.'
            }
            refreshControl={
              <RefreshControl
                refreshing={
                  findProductsStatus.status === ThunkStatusEnum.LOADING
                }
                onRefresh={() => {
                  dispatch(getProducts(initialPaginationMetaData));
                }}
                title="Pull down to refresh"
                tintColor={R.colors.white}
                titleColor={R.colors.white}
                colors={['red', 'green', 'blue']}
              />
            }
          />
        </View>
      </View>
      <HoverButton
        style={styles.hoverBtn}
        right
        onPress={() =>
          navigation.navigate(ScreenNameEnum.CREATE_PRODUCT_SCREEN)
        }
      />
    </GScreen>
  );
};

export default ProductListScreen;
const ListItem = ({product}: {product: Product}) => {
  const navigation = useNavigation();
  const category = useSelector((state: RootState) =>
    selectCtegoryById(state, product?.category?._id),
  );
  const user: Nillable<User | TeamMember> = useSelector((state: RootState) =>
    selectUserById(state, product?.createdBy || ''),
  );
  return (
    <View style={styles.itemContainer}>
      <Pressable
        onPress={() =>
          navigation.navigate(ScreenNameEnum.CREATE_PRODUCT_SCREEN, {
            editItem: product,
          })
        }
        android_ripple={R.darkTheme.grayRipple}
        style={styles.innerContainer}>
        <View style={styles.itemContainerInner}>
          <View style={styles.imageContainer}>
            {product.images && product.images.length > 0 ? (
              <GImage
                imageName={
                  typeof product.images[0] === 'string'
                    ? product.images[0]
                    : product.images[0].filePath
                }
                style={styles.imageStyle}
              />
            ) : (
              <MaterialCommunityIcons
                name={'image'}
                size={50}
                color={R.colors.themeCol2}
              />
            )}
          </View>
          <View style={styles.descriptionBox}>
            <View style={{flex: 1}}>
              <Text style={styles.nameText} numberOfLines={2}>
                {product?.name}
              </Text>
              <View style={{flexWrap: 'wrap'}}>
                {category && (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.categoryTag,
                      {backgroundColor: category?.color || 'transparent'},
                    ]}>
                    {category?.name?.trim()}
                  </Text>
                )}
              </View>
              <Text style={styles.descriptionText} numberOfLines={1}>
                {product?.description}
              </Text>
              <Text style={styles.createdText} numberOfLines={1}>
                Created by {user?.firstName} {user?.lastName}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>
                ₹ {Helper.currencyFormate(product?.price || 0)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    paddingVertical: 10,
  },
  hoverBtn: {
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
    opacity: 1,
  },
  backBtnWrapper: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  itemContainer: {
    backgroundColor: R.colors.white,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  innerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  listContainer: {
    marginTop: 10,
    flex: 1,
  },
  nameText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
    textTransform: 'capitalize',
  },
  priceText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
  },
  categoryTag: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.SEMI_BOLD),
    color: R.colors.white,
    marginVertical: moderateScale(3),
    marginRight: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(8),
    textTransform: 'capitalize',
    maxWidth: '80%',
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  createdText: {
    ...R.generateFontStyle(FontSizeEnum.XXS, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  itemContainerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnContainer: {
    justifyContent: 'center',
  },
  imageStyle: {
    width: 58,
    height: 58,
  },
  imageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderColor: '#dae4eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  leftContainer: {
    flexDirection: 'row',
  },
  descriptionBox: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  priceContainer: {
    justifyContent: 'center',
  },
});
