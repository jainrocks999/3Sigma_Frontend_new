import 'react-native-gesture-handler';
import React, {FunctionComponent} from 'react';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import ScreenNameEnum from '../models/routes/screenName.enum';
import _routes from '../configs/routes';
const Stack = createStackNavigator();

const RegistrationRoutes: FunctionComponent = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNameEnum.WELCOME_SLIDER_SCREEN}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      {_routes.REGISTRATION_ROUTE.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RegistrationRoutes;
