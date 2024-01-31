import React, {FunctionComponent, useEffect, useState} from 'react';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import _routes from '../configs/routes';
import ScreenNameEnum from '../models/routes/screenName.enum';
import {PermissionsAndroid} from 'react-native';
import {RootState} from '../store/app.store';
import {useSelector} from 'react-redux';
const Stack = createStackNavigator();

const FeatureRoutes: FunctionComponent<any> = ({
  SceenName,
}: {
  SceenName?: ScreenNameEnum;
}) => {
  const isOnboardCompleted = useSelector(
    (state: RootState) => state?.user?.user?.isOnboardCompleted,
  );
  const [permissionRequired, setPermissionStatus] = useState<boolean | null>(
    null,
  );
  useEffect(() => {
    checkUserPermission();
  }, []);
  const checkUserPermission = async () => {
    const storageReadPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    // const contactPermission = await PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    // );

    const storageWritePermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const callLogPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    );
    const locationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    setPermissionStatus(
      !storageReadPermission ||
        !storageWritePermission ||
        !callLogPermission ||
        !locationPermission,
    );
  };
  if (!SceenName) {
    SceenName = permissionRequired
      ? ScreenNameEnum.APP_PERMISSION_SCREEN
      : !isOnboardCompleted
      ? ScreenNameEnum.UPDATE_BASIC_PROFILE_SCREEN
      : ScreenNameEnum.WELCOME_SLIDER_SCREEN;
  }
  console.log('SceenName', SceenName);
  return permissionRequired != null ? (
    <Stack.Navigator
      initialRouteName={SceenName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      {_routes.FEATURE_ROUTE.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
        />
      ))}
    </Stack.Navigator>
  ) : null;
};

// const Drawer = createDrawerNavigator();

// function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawer {...props} />}
//       useLegacyImplementation={true}
//       screenOptions={{
//         headerShown: false,
//       }}>
//       <Drawer.Screen
//         name="DrawerRoutes"
//         component={FeatureRoutes}
//         options={{
//           drawerPosition: 'right',
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }
export default FeatureRoutes;
