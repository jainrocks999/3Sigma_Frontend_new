/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {Quotation} from 'datalib/entity/quotation';
import BackButton from 'library/common/BackButton';
import GAlert from 'library/common/GAlert';
import DynamicForm from 'library/form-field/DynamicForm';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {QUOTATION_FORM} from '../../configs/constants';
import {Nillable} from '../../models/custom.types';
import {RootDispatch, RootState} from '../../store/app.store';
import QuotationApi from 'datalib/services/product.api';
import {
  createQuotation,
  getQuotationById,
  quotationByIdSelector,
  updateQuotation,
} from '../../store/slices/quotation.slice';
import Helper from '../../utils/helper';
import moment from 'moment';
import {EditButton} from 'library/common/ButtonGroup';
import QuotIdModal from './Components/QuotIdModal';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';

const AddQuotationScreen = ({route}: any) => {
  const quitationId = route.params?.quitationId || null;
  const leadId = route.params?.leadId || null;
  const dispatch = useDispatch<RootDispatch>();
  const updateQuotationsStatus = useSelector(
    (state: RootState) => state.quotation.updateQuotationsStatus,
  );
  const navigation = useNavigation();
  const formFields = [...QUOTATION_FORM];
  const [showQuotIdModal, setQuoIdModal] = useState<boolean>(false);
  const quotationItem: Nillable<Quotation> = useSelector((state: RootState) =>
    quotationByIdSelector(state, quitationId),
  );
  const [quotation, setQuotation] = useState<Quotation>({
    lead: quotationItem?.lead?._id || leadId || '',
    // title: quotationItem?.title || '',
    quotationId: quotationItem?.quotationId || '',
    createdDate: quotationItem?.createdDate || new Date(),
    note: quotationItem?.note || '',
    discount: quotationItem?.discount || {type: 'fixed', rate: null},
    additionalCharges: quotationItem?.additionalCharges || [],
    taxes: quotationItem?.taxes || [],
    products: quotationItem?.products || [],
  });
  useEffect(() => {
    if (!quitationId) {
      generateQuotationId();
    }
  }, []);
  const generateQuotationId = async () => {
    const response = await new QuotationApi().getQuotationId();
    if (response) {
      setQuotation({...quotation, quotationId: response || ''});
    }
  };
  const handleValueChange = (_value: {field: string; value: string}) => {
    const updatedItem = {...quotation, [_value.field]: _value.value};
    setQuotation(updatedItem);
  };
  const handleSaveQuotation = async () => {
    if (Helper.isFormValid(QUOTATION_FORM, quotation)) {
      if (!quotation.products || quotation.products.length === 0) {
        GAlert('Please add product to your quotation');
        return;
      }
      let response;
      delete quotation.quotationId;
      delete quotation.title;
      if (quotation?.discount && !quotation?.discount?.rate) {
        const discount = {...quotation?.discount};
        delete discount.amount;
        discount.rate = 0;
        quotation.discount = discount;
      }
      if (!quotation.note || quotation.note === '') {
        delete quotation.note;
      }
      quotation.products = quotation.products.map(item => {
        const newItem = {...item};
        if (newItem.product) {
          delete newItem.product;
        }
        return newItem;
      });
      if (quitationId) {
        quotation._id = quitationId;
        delete quotation.lead;
        response = await dispatch(updateQuotation(quotation));
      } else {
        response = await dispatch(createQuotation(quotation));
      }

      if (response.meta.requestStatus === 'fulfilled') {
        if (quitationId) {
          dispatch(getQuotationById(quitationId));
        }
        navigation.goBack();
      }
    }
  };
  const onValueUpdate = (_value: any) => {
    setQuotation({...quotation, ..._value});
    setQuoIdModal(false);
  };
  formFields[0].disable = quitationId ? true : false;
  formFields[1].disable = true;
  return (
    <GScreen
      loading={updateQuotationsStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <View style={styles.backBtnWrapper}>
          <BackButton
            title={quitationId ? 'Update Quotation' : 'Create Quotation'}
          />
        </View>
        <View style={styles.listContainer}>
          <DynamicForm
            formFields={formFields}
            fieldValues={quotation}
            handleValueChange={handleValueChange}
            buttonTitle={quitationId ? 'Update Quotation' : 'Create Quotation'}
            buttonPress={handleSaveQuotation}
            containerStyle={styles.containerStyle}
            childrenAtTop
            ListFooterComponent={<QuotationSummery quotation={quotation} />}>
            <View style={styles.quotIdContainer}>
              <View>
                <Text style={styles.quotIdText}>
                  Quotation Number: {quotation.quotationId}
                </Text>
                <Text style={styles.quotDateText}>
                  {moment(quotation?.createdDate).format('DD MMM YYYY')}
                </Text>
              </View>
              <View>
                <EditButton onPress={() => setQuoIdModal(true)} />
              </View>
            </View>
          </DynamicForm>
        </View>
      </View>
      <QuotIdModal
        isVisible={showQuotIdModal}
        onModalHide={() => setQuoIdModal(false)}
        quotation={quotation}
        onValueUpdate={onValueUpdate}
      />
    </GScreen>
  );
};
const QuotationSummery = ({quotation}: {quotation: Quotation}) => {
  const [subTotal, setSubTotal] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  useEffect(() => {
    let _subTotal = 0;
    let _discountAmount = 0;
    if (quotation && quotation.products) {
      _subTotal = quotation.products.reduce(
        (accumulator: number, element: any) => {
          return accumulator + element.unitPrice * element.quantity;
        },
        0,
      );
      setSubTotal(_subTotal);
    }

    let totalCharges = 0;
    let totalTaxes = 0;
    if (quotation.additionalCharges && quotation.additionalCharges.length) {
      totalCharges = quotation.additionalCharges.reduce(
        (accumulator: number, element: any) => {
          return (
            accumulator +
            (element.type !== 'fixed'
              ? (_subTotal / 100) * parseFloat(element.rate)
              : parseFloat(element.rate))
          );
        },
        0,
      );
    }
    if (quotation.discount) {
      if (quotation.discount.type !== 'fixed') {
        _discountAmount =
          ((_subTotal + totalCharges) / 100) * quotation.discount.rate || 0;
      } else {
        _discountAmount = quotation.discount.rate || 0;
      }
    }

    const _totalAfterDiscount = _subTotal + totalCharges - _discountAmount;
    if (quotation.taxes && quotation.taxes.length) {
      totalTaxes = quotation.taxes.reduce(
        (accumulator: number, element: any) => {
          return accumulator + element.type !== 'fixed'
            ? (_totalAfterDiscount / 100) * parseFloat(element.rate)
            : element.rate;
        },
        0,
      );
    }
    setDiscountAmount(_discountAmount);
    setGrandTotal(_totalAfterDiscount + totalTaxes);
  }, [quotation]);
  return (
    <View>
      <Text style={styles.labelStyle}>Quotation Summery</Text>
      <View style={styles.summeryContainer}>
        <View style={styles.rowItem}>
          <Text style={styles.listItemText}>
            Sub Total ({quotation.products && quotation.products.length})
          </Text>
          <Text style={styles.listAmountText}>₹ {subTotal.toFixed(2)}</Text>
        </View>
        {quotation.additionalCharges && quotation.additionalCharges.length ? (
          <Text style={styles.listItemHeading}>Additional Charges</Text>
        ) : null}
        <View>
          {quotation.additionalCharges &&
            quotation.additionalCharges.map((charge, index) => (
              <View style={styles.rowItem} key={`charge_${index}`}>
                <Text style={styles.listItemText}>
                  {charge.title}
                  {charge.type !== 'fixed' ? `(${charge.rate}%)` : ''}
                </Text>
                <Text style={styles.listAmountText}>
                  ₹{' '}
                  {charge.type !== 'fixed'
                    ? (
                        ((subTotal - discountAmount) / 100) *
                        parseFloat(charge.rate)
                      ).toFixed(2)
                    : charge.rate}
                </Text>
              </View>
            ))}
        </View>
        {discountAmount > 0 && (
          <View style={styles.rowItem}>
            <Text style={styles.listItemText}>
              Discount
              {quotation.discount && quotation.discount.type !== 'fixed'
                ? `(${quotation.discount.rate}%)`
                : ''}
            </Text>
            <Text style={styles.listAmountText}>
              ₹ {Helper.currencyFormate(discountAmount)}
            </Text>
          </View>
        )}
        {quotation.taxes && quotation.taxes.length ? (
          <Text style={styles.listItemHeading}>Taxes and Charges</Text>
        ) : null}
        <View>
          {quotation.taxes &&
            quotation.taxes.map((charge, index) => (
              <View style={styles.rowItem} key={`charge_${index}`}>
                <Text style={styles.listItemText}>
                  {charge.title}
                  {charge.type !== 'fixed' ? `(${charge.rate}%)` : ''}
                </Text>
                <Text style={styles.listAmountText}>
                  ₹{' '}
                  {charge.type !== 'fixed'
                    ? (
                        ((subTotal - discountAmount) / 100) *
                        parseFloat(charge.rate)
                      ).toFixed(2)
                    : charge.rate}
                </Text>
              </View>
            ))}
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.listTotalText}>Total</Text>
          <Text style={styles.listTotalAmountText}>
            ₹ {Helper.currencyFormate(grandTotal)}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default AddQuotationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    paddingVertical: 10,
  },
  summeryContainer: {
    backgroundColor: R.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backBtnWrapper: {
    paddingHorizontal: 20,
  },

  listContainer: {
    flex: 1,
  },
  containerStyle: {
    paddingHorizontal: 20,
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginVertical: 20,
  },
  listItemText: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
  },
  listItemHeading: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
  },
  listAmountText: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
  },
  listTotalText: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
  },
  listTotalAmountText: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quotIdContainer: {
    backgroundColor: R.colors.white,
    borderRadius: 15,
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quotIdText: {
    color: R.colors.themeCol2,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
  },
  quotDateText: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
  },
});
