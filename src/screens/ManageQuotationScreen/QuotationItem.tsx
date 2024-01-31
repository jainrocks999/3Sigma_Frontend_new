/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import {quotationByIdSelector} from '../../store/slices/quotation.slice';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/app.store';
import {Quotation} from 'datalib/entity/quotation';
import {Nillable} from '../../models/custom.types';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import moment from 'moment';
import Helper from '../../utils/helper';

const QuotationItem = ({quitationId}: any) => {
  const navigation = useNavigation();

  const quotation: Nillable<Quotation> = useSelector((state: RootState) =>
    quotationByIdSelector(state, quitationId),
  );

  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        onPress={() =>
          navigation.navigate(ScreenNameEnum.QUOTATION_DETAIL_SCREEN, {
            quitationId,
          })
        }>
        <View style={styles.messageWrapper}>
          <View>
            <View style={styles.descContainer}>
              <View>
                <Text style={styles.titleText}>{quotation?.quotationId}</Text>
                <Text style={styles.leadNameText}>{quotation?.lead?.name}</Text>
              </View>
              <View>
                <View style={styles.createdBlock}>
                  <Text
                    style={[
                      styles.createdText,
                      {
                        backgroundColor:
                          quotation?.status === 'created'
                            ? R.colors.themeCol5
                            : 'green',
                      },
                    ]}>
                    {quotation?.status}
                  </Text>
                </View>
                <Text style={styles.amountText}>
                  {'₹'} {Helper.currencyFormate(quotation?.total || 0)}
                </Text>
              </View>
            </View>
            <Text style={styles.ownerDescription}>
              {/* Created at : {moment(quotation?.createdAt).format('DD MMM YYYY')}, */}
              Created By : {quotation?.createdBy}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default QuotationItem;
const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(15),
    backgroundColor: R.colors.white,
    marginVertical: moderateScale(7),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  messageWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  messageDescription: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
    marginVertical: moderateScale(1),
    flexWrap: 'wrap',
  },
  titleText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    marginVertical: moderateScale(1),
    textTransform: 'capitalize',
  },
  leadNameText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    color: R.colors.gray,
    textTransform: 'capitalize',
  },
  amountText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    marginVertical: moderateScale(1),
  },
  ownerDescription: {
    ...R.generateFontStyle(FontSizeEnum.XXS, FontWeightEnum.REGULAR),
    color: R.colors.gray,
    marginVertical: moderateScale(1),
    flexWrap: 'wrap',
  },
  descContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createdBlock: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  createdText: {
    ...R.generateFontStyle(FontSizeEnum.XXS, FontWeightEnum.REGULAR),
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'blue',
    borderRadius: 15,
    textTransform: 'capitalize',
  },
  amountBlock: {flexDirection: 'row', justifyContent: 'space-between'},
});
