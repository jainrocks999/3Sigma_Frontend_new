import BackButton from 'library/common/BackButton';
import {IconButton} from 'library/common/ButtonGroup';
import GAlert, {MessageType} from 'library/common/GAlert';
import GTopTabViewer from 'library/common/GTopTabViewer';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import PressableText from 'library/common/PressableText';
import TermsConditionModal from 'library/modals/TermsConditionModal';
import Share, {Social} from 'react-native-share';
import {Nillable} from '../../models/custom.types';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import YoutubePlayerModal from 'library/modals/YoutubePlayerModal';
import {selectReferredUsers} from '../../store/slices/user.slice';
import {getReferredUsers} from '../../store/slices/actions/User';
export default function ReferralsScreen() {
  const dispatch = useDispatch<RootDispatch>();
  const tabRoutes = [
    {
      name: 'Invite',
      component: Invite,
    },
    {
      name: 'Rewards',
      component: Rewards,
    },
  ];
  useEffect(() => {
    dispatch(getReferredUsers());
  }, []);
  return (
    <GScreen>
      <View style={styles.btnWrapper}>
        <BackButton title={'Referral'} />
      </View>
      <GTopTabViewer
        initialRouteName={'Timeline'}
        tabBarStyle={styles.tabBarStyle}
        routes={tabRoutes}
      />
    </GScreen>
  );
}
const Invite = () => {
  const [policyModal, setPolicyModal] = useState<boolean>(false);
  const [videoModal, setVideoModal] = useState<boolean>(false);
  const referralCode: Nillable<string> = useSelector(
    (state: RootState) => state.user?.user?.referralCode || '',
  );
  const sharableURL = `https://www.3sigmacrm.com/${referralCode}`;
  const sharableMessage = `Hi, \n I'm using 3Sigma for managing my business leads, user my code ${referralCode} to get the 10% discount on subscription and exciting rewards`;

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    GAlert('Note copied to clipboard', MessageType.SUCCESS);
  };
  const handleSharePress = (type: Nillable<Social> = null) => {
    if (type) {
      const shareOptions = {
        title: 'Share via',
        message: sharableMessage,
        url: sharableURL,
        social: type,
      };
      Share.shareSingle(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } else {
      const shareOptions = {
        title: 'Share via',
        message: sharableMessage,
        url: sharableURL,
        social: type,
      };
      Share.open(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={'gift'} size={50} color={'#2B5AA0'} />
        </View>
        <Text style={styles.headerText}>
          Invite your friends and earn upto 50,000
        </Text>
        <Text style={styles.headerDescText}>
          You get 100 rupees when your friends purcahse premium plans.
        </Text>
      </View>
      <View>
        <View style={styles.videoText}>
          <Text style={styles.headerText}>See how referral works</Text>
          <IconButton
            icon={'play'}
            btnStyle={styles.btnStyle}
            iconColor={R.colors.white}
            iconSize={25}
            onPress={() => setVideoModal(true)}
          />
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.headerText}>{sharableURL}</Text>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyToClipboard(sharableURL)}>
            <MaterialCommunityIcons
              name="content-copy"
              size={25}
              color={R.colors.themeCol2}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.shareBtnContainer}>
          <TouchableOpacity
            onPress={() => handleSharePress(Share.Social.WHATSAPP)}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="whatsapp"
                size={30}
                color={R.colors.green}
              />
              <Text style={styles.linkText}>Whatsapp</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSharePress(Share.Social.EMAIL)}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="email"
                size={30}
                color={R.colors.youtubeRed}
              />
              <Text style={styles.linkText}>email</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSharePress(Share.Social.MESSENGER)}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="message-processing"
                size={30}
                color={R.colors.themeCol2}
              />
              <Text style={styles.linkText}>Message</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSharePress()}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={30}
                color={R.colors.themeCol2}
              />
              <Text style={styles.linkText}>More</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.policyContainer}>
          <PressableText
            onPress={() => setPolicyModal(true)}
            textStyle={styles.policyText}>
            Read referrals policy
          </PressableText>
        </View>
      </View>
      <TermsConditionModal
        isVisible={policyModal}
        onModalHide={() => setPolicyModal(false)}
      />
      <YoutubePlayerModal
        isVisible={videoModal}
        videoId={''}
        onModalHide={() => setVideoModal(false)}
      />
    </View>
  );
};
const Rewards = () => {
  const history: any = useSelector(selectReferredUsers);
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <View style={styles.box}>
          <View>
            <Text style={styles.boxHeader}>Your rewards balance </Text>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.boxAmount}>₹ 5000</Text>
            <TouchableOpacity style={styles.wthdrawBtn}>
              <Text style={styles.buttonText}>Withdraw to bank</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.box}>
          <View>
            <Text style={styles.boxHeader}>Total rewards earned </Text>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.boxAmount}>₹ 5000</Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.historyHeader}>Invite history</Text>
      </View>
      <ScrollView>
        {history.map((item: any, index: number) => (
          <View key={index.toString()} style={styles.historyBox}>
            <View>
              <Text style={styles.historyTest}>{item.userName || ''}</Text>
              <Text style={styles.historyTest}>{item.mobile || ''}</Text>
            </View>
            <View>
              <Text style={styles.historyTest}>
                {item.hasSubscription ? '₹ 100' : 'No purchase'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  tabBarStyle: {},
  balanceContainer: {},
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyBox: {
    backgroundColor: R.colors.white,
    marginBottom: 10,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    padding: 20,
  },
  boxHeader: {
    color: R.colors.white,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
  },
  historyTest: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    marginBottom: 10,
  },
  historyHeader: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    textAlign: 'center',
    marginVertical: 15,
  },
  boxAmount: {
    color: R.colors.white,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
  },
  wthdrawBtn: {
    backgroundColor: R.colors.white,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  copyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 20,
  },
  topContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  policyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  linkText: {
    color: R.colors.lightgrayText,
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    marginTop: 10,
  },
  linkContainer: {
    backgroundColor: R.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    marginBottom: 10,
  },
  headerDescText: {
    color: R.colors.lightgrayText,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    marginBottom: 20,
  },
  policyText: {
    color: R.colors.themeCol2,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
  },
  videoText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnStyle: {
    backgroundColor: R.colors.youtubeRed,
    marginTop: -10,
    marginLeft: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtnContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
