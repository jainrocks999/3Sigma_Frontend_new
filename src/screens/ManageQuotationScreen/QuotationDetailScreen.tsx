import {useNavigation} from '@react-navigation/native';
import {Quotation} from 'datalib/entity/quotation';
import BackButton from 'library/common/BackButton';
import ListModal from 'library/common/ListModal';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import GScreen from 'library/wrapper/GScreen';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlob from 'react-native-blob-util';
import {QUOTATION_OPTION_ACTIONS} from '../../configs/constants';
import {Nillable} from '../../models/custom.types';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {RootDispatch, RootState} from '../../store/app.store';
import Pdf from 'react-native-pdf';
import {
  deleteQuotation,
  getQuotationById,
  quotationByIdSelector,
  updateQuotation,
} from '../../store/slices/quotation.slice';
import {ENVIRONMENT, S3_URL} from '../../../env';
import GAlert from 'library/common/GAlert';
import RNShare from 'react-native-share';

const QuotationDetailScreen = (props: any) => {
  const quitationId = props.route.params.quitationId;
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const quotation: Nillable<Quotation> = useSelector((state: RootState) =>
    quotationByIdSelector(state, quitationId),
  );
  const quotationUrl = quotation?.quotationUrl
    ? `${S3_URL[ENVIRONMENT]}${quotation.quotationUrl}`
    : null;
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const [approveConfirm, setApproveConfirmation] = useState<boolean>(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const handleDelete = async (confirm: boolean) => {
    setConfirmation(false);
    if (confirm) {
      await dispatch(deleteQuotation(quitationId));
      navigation.goBack();
    }
  };
  const handleOptionSelect = (action: string) => {
    setShowOptionModal(false);
    switch (action) {
      case 'edit':
        navigation.navigate(ScreenNameEnum.CREATE_QUOTATION_SCREEN, {
          quitationId: quitationId,
        });
        break;
      case 'share':
        break;
      case 'preview':
        break;
      case 'copy_link':
        break;
      case 'approve':
        setApproveConfirmation(true);
        break;
      case 'delete':
        setConfirmation(true);
        break;
    }
  };
  const downloadFile = () => {
    if (!quotationUrl) {
      console.log('no quotationUrl return', quotationUrl);
      return;
    }
    const {config, fs} = RNFetchBlob;
    const downloads = fs.dirs.DownloadDir;
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${downloads}/Quotation for ${
          quotation?.lead?.name
        }-${quotation?.quotationId?.replace('#', '')}.pdf`,
      },
    })
      .fetch('GET', quotationUrl, {})
      .then((_res: any) => {
        DeviceEventEmitter.emit('refreshQuotationList');
      })
      .catch(error => console.log('error in downloading file', error));
  };
  const downloadFileByPath = (filePath: string) => {
    return new Promise((resolve, reject) => {
      const {config} = RNFetchBlob;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: true,
          path: filePath,
          description: 'Downloading file.',
        },
      };
      config(options)
        .fetch('GET', quotationUrl)
        .then(res => {
          resolve(true);
        })
        .catch(e => {
          reject(false);
        });
    });
  };
  const shareFile = async () => {
    if (!quotationUrl) {
      console.log('no quotationUrl return', quotationUrl);
      return;
    }
    const filePath = `${
      RNFetchBlob.fs.dirs.DownloadDir
    }/Quotation_${quotation?.quotationId.replace('#', '')}.pdf`;

    console.log('filePath', filePath);
    try {
      await downloadFileByPath(filePath);
      const shareOptions = {
        title: quotation?.quotationId,
        subject: `Quotation – ${quotation?.quotationId}`,
        message: `Please check out this quotation \n ${quotationUrl}`,
        url: `file://${filePath}`,
        type: 'application/pdf',
        failOnCancel: true,
      };

      console.log('shareOptions', shareOptions);

      try {
        await RNShare.open(shareOptions);
      } catch (err) {
        console.log(err, shareOptions);
      } finally {
        console.log('finally');
        RNFetchBlob.fs.unlink(filePath);
      }
    } catch (error) {
      console.log('error', error);
    }
    // const result = await Share.share({
    //   title: 'Quotation Share',
    //   message: `Please check out this quotation \n ${quotationUrl}`,
    //   url: quotationUrl,
    // });
    // if (result.action === Share.sharedAction) {
    //   DeviceEventEmitter.emit('refreshQuotationList');
    // } else if (result.action === Share.dismissedAction) {
    // }
  };
  const handleApprove = async (approved: boolean) => {
    const _quotation = {_id: quotation?._id, status: 'approved'};
    setApproveConfirmation(false);
    if (approved) {
      await dispatch(updateQuotation(_quotation));
      await dispatch(getQuotationById(quotation?._id || ''));
    }
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <BackButton title={'Quotation details'} />
          <TouchableOpacity
            style={styles.optionButtonWrapper}
            onPress={() => setShowOptionModal(!showOptionModal)}>
            <Text style={styles.optionText}>Options</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pdfContainer}>
          {quotationUrl ? (
            <Pdf
              trustAllCerts={false}
              source={{uri: quotationUrl}}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                GAlert('Error in loading quotation');
              }}
              style={styles.pdf}
            />
          ) : (
            <View style={styles.flexContainer}>
              <Text style={styles.emptyText}>Quotation url not found</Text>
            </View>
          )}
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={[styles.customBtn, styles.greenBtn]}
            onPress={shareFile}>
            <Text style={styles.btnText}>Share</Text>
            <MaterialCommunityIcons name={'share'} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.customBtn, styles.primaryBtn]}
            onPress={downloadFile}>
            <MaterialCommunityIcons name={'download'} size={30} color="white" />
            <Text style={styles.btnText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ListModal
        display={showOptionModal}
        onModalClose={() => setShowOptionModal(false)}
        data={QUOTATION_OPTION_ACTIONS}
        onItemSelect={handleOptionSelect}
        title={'Quotation Options'}
      />
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleDelete}
        confirmationMessage={'Are you sure want to delete?'}
      />
      <ConfirmationDialog
        showDialog={approveConfirm}
        onConfirm={handleApprove}
        confirmationMessage={'Are you sure want approve?'}
      />
    </GScreen>
  );
};
export default QuotationDetailScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
  },
  titleWrapper: {
    paddingHorizontal: moderateScale(15),
    // padding: moderateScale(15),
  },
  optionText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  optionButtonWrapper: {
    paddingHorizontal: moderateScale(4),
    paddingVertical: moderateScale(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.white,
    borderRadius: moderateScale(20),
    width: moderateScale(65),
    height: moderateScale(30),
  },
  customBtn: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.white,
    marginHorizontal: 10,
  },
  greenBtn: {
    backgroundColor: R.colors.green,
    marginRight: 5,
  },
  primaryBtn: {
    backgroundColor: R.colors.themeCol5,
    marginLeft: 5,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height,
    backgroundColor: 'lightgray',
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    marginHorizontal: 10,
  },
});
