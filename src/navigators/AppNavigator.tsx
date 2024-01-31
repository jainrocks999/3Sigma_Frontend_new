/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from '@react-native-community/netinfo';
import {navigationRef} from './NavigationService';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {Linking, LogBox, Platform} from 'react-native';
import {isFunction, isNull} from 'lodash-es';
import React, {
  Component,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SInfoTypeEnum from '../models/common/sInfoType.enum';
import {
  AuthContextProvider,
  AuthFunctions,
} from '../store/contexts/AuthContext';
import {endAppStartup, initialize} from 'react-native-embrace';

import jwtUtil from '../utils/jwt.util';
import sInfoUtil from '../utils/sInfo.util';
import SplashScreen from '../screens/WelcomeScreen/SplashScreen';
import RegistrationRoutes from './RegistrationRoutes';
import FeatureRoutes from './FeatureRoutes';
import {RootDispatch, RootState} from '../store/app.store';
import {useDispatch, useSelector} from 'react-redux';
import {setUserProfile, currentUserSelector} from '../store/slices/user.slice';
import GAlert from 'library/common/GAlert';
import AsyncStorage from '@react-native-community/async-storage';
import InAppUpdate from '../utils/InAppUpdate';
import syncActivities from '../utils/syncActivities';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
// import BackgroundService from 'react-native-background-actions';
import BackgroundTimer from 'react-native-background-timer';
import {enableScreens} from 'react-native-screens';
import crashlytics from '@react-native-firebase/crashlytics';
import logger from 'library/hooks/logger';
import {DevSettings} from 'react-native';
import ga from 'library/hooks/analytics';

enableScreens(false);
const AppNavigator: FunctionComponent<any> = () => {
  const dispatch = useDispatch<RootDispatch>();
  const routeNameRef = React.useRef();
  const [language, setLanguage] = useState<string | null>('en');
  const [hasNoInternet, setHasNoInternet] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('Loading App');
  const currentUser = useSelector((state: RootState) =>
    currentUserSelector(state),
  );
  const rootAuthContext: AuthFunctions = useMemo(
    () => ({
      signIn: async (_pStatus: boolean = true) => {
        setAuthenticated(true);
        logger.log('User signed in.');
      },
      signOut: async () => {
        setAuthenticated(false);
        logger.log('User signed out.');
        await sInfoUtil.remove(SInfoTypeEnum.JWT);
        await AsyncStorage.removeItem('ACTIVITIES_SYNC_TIME');
      },
    }),
    [],
  );
  useEffect(() => {
    bootstrapApp();
  }, []);

  useEffect(() => {
    try {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      InAppUpdate.checkUpdate(); // this is how you check for update
    } catch (error) {
      console.log('Error in  checking updated');
    }
    initialize();
    return () => endAppStartup();
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      startTask();
    } else {
      try {
        BackgroundTimer.stopBackgroundTimer();
        AsyncStorage.removeItem('ACTIVITIES_SYNC_TIME');
      } catch (error) {
        console.log('Timer not scheduled');
      }
    }
  }, [isAuthenticated]);
  const startTask = async () => {
    // const options = {
    //   taskName: 'ActivitySyncService',
    //   taskTitle: 'Checking Call logs',
    //   taskDesc: 'Running...',
    //   taskIcon: {
    //     name: 'ic_launcher',
    //     type: 'mipmap',
    //   },
    //   color: '#ff00ff',
    //   linkingURI: 'sigmacrm://home', // See Deep Linking for more info
    //   parameters: {
    //     delay: 1000,
    //   },
    // };
    // console.log('Start background task');
    // await BackgroundService.start(syncActivities, options);
    try {
      initializeNotifications();
      BackgroundTimer.runBackgroundTimer(() => {
        syncActivities();
      }, 1000 * 60 * 1);
    } catch (error) {
      console.log('Error in setting tasks');
    }
  };
  useEffect(() => {
    const netInfoSubscriber = NetInfo.addEventListener(state => {
      setHasNoInternet(!state.isConnected);
      loadLanguage();
      if (state.isConnected) {
        bootstrapApp();
        isFunction(netInfoSubscriber) ? netInfoSubscriber() : undefined;
      }
    });
    return () =>
      isFunction(netInfoSubscriber) ? netInfoSubscriber() : undefined;
  }, []);
  const loadLanguage = async () => {
    const value = await AsyncStorage.getItem('@language');
    setLanguage(value ? value : null);
  };

  const bootstrapApp = async () => {
    console.log(currentUser);
    setMessage('Bootstrap App');
    if (!currentUser || isNull(currentUser)) {
      setMessage('Checking user login');
      try {
        const storedJwt = await sInfoUtil.fetch(SInfoTypeEnum.JWT);
        if (storedJwt) {
          let decodedJwt = jwtUtil.parseJwt(storedJwt);
          setMessage('Token found! loading user data...');
          decodedJwt && handleJwt();
        } else {
          setAuthenticated(false);
          setInitializing(false);
        }
      } catch (error) {
        GAlert('Error!!');
      }
    } else {
      setInitializing(false);
      setAuthenticated(true);
    }
  };

  const handleJwt = () => {
    dispatch(setUserProfile())
      .then((_response: any) => {
        if (_response.payload && _response.payload._id) {
          setMessage('User data loaded in redux...');
          crashlytics().setUserId(_response.payload._id);
          logger.log('User data loaded in redux');
          setInitializing(false);
          setAuthenticated(true);
        } else {
          logger.log('Dta not loaded from API');
          handleJwt();
        }
      })
      .catch(async _error => {
        logger.log('Error in loading user data from JWT');
        setMessage('Error in loading user data from JWT, retrying...');
        //check is staus not 401
        await sInfoUtil.remove(SInfoTypeEnum.JWT);
        await sInfoUtil.remove(SInfoTypeEnum.USER_CONTEXT);
        GAlert('Token expired, logging out...');
        DevSettings.reload();
        logger.error(_error);
      });
  };
  const initializeNotifications = () => {
    PushNotification.deleteChannel('default');
    PushNotification.createChannel(
      {
        channelId: 'default', // (required)
        channelName: 'default', // (required)
        soundName: 'notification.mp3', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        playSound: true,
      },
      created => console.log(`Notification channel created '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.configure({
      onNotification: function (notification: any) {
        if (notification.userInteraction) {
          if (notification.data.toScreen) {
          }
        } else {
          PushNotification.localNotification({
            allowWhileIdle: true,
            ignoreInForeground: false,
            title: notification.title,
            message: notification.message,
            soundName: 'notification.mp3',
            visibility: 'public',
            channelId: 'default',
            playSound: true,
          });
        }
      },
    });

    if (Platform.OS === 'ios') {
      messaging().onMessage(async remoteMessage => {
        PushNotificationIOS.presentLocalNotification({
          alertTitle: remoteMessage?.notification?.title || '',
          alertBody: remoteMessage?.notification?.body || '',
          userInfo: remoteMessage.data,
          isSilent: false,
          applicationIconBadgeNumber: 0,
        });
      });
    }
  };

  if (initializing || language === '') {
    return <SplashScreen hasNoInternet={hasNoInternet} message={message} />;
  }
  const config = {
    screens: {
      LEAD_PROFILE_SCREEN: {
        path: 'lead/:id',
        parse: {
          id: (id: string) => `${id}`,
        },
      },
      TASK_HOME_SCREEN: {
        path: 'task/:id',
        parse: {
          id: (id: string) => `${id}`,
        },
      },
      CREATE_LEAD_SCREEN: {
        path: 'create-lead/:number',
        parse: {
          phone: (number: string) => `${number}`,
        },
      },
    },
  };
  const linking = {
    prefixes: ['https://app.sigmacrm.com', 'sigmacrm://'],
    config,
  };
  return (
    <AuthContextProvider value={rootAuthContext}>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        fallback={
          <SplashScreen
            hasNoInternet={hasNoInternet}
            message={'Loading app data...'}
          />
        }
        onReady={() => {
          try {
            routeNameRef.current =
              navigationRef.current.getCurrentRoute()?.name || 'Home';
          } catch (error) {
            if (routeNameRef.current) {
              routeNameRef.current = 'Home';
            }
          }
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            ga.logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}>
        {isAuthenticated ? <FeatureRoutes /> : <RegistrationRoutes />}
      </NavigationContainer>
    </AuthContextProvider>
  );
};
export default AppNavigator;
