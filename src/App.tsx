// import React, { FunctionComponent } from 'react';
// import { LogBox, StatusBar, SafeAreaView } from 'react-native';
// import { Provider as StoreProvider } from 'react-redux';
// import { defaultTheme } from 'resources/palette/gTheme.interface';
// import FlashMessage from 'react-native-flash-message';

// import AppNavigator from './navigators/AppNavigator';
// import store from './store/app.store';
// import { ThemeContextProvider } from './store/contexts/ThemeContext';
// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import enJson from './language/en.json';
// import hiJson from './language/hi.json';
// import { Provider as PaperProvider } from 'react-native-paper';
// import R from 'resources/R';
// import StripePaymentWrapper from 'library/wrapper/StripePaymentWrapper';
// i18n.use(initReactI18next).init({
//   compatibilityJSON: 'v3',
//   resources: {
//     en: {
//       translation: enJson,
//     },
//     hi: {
//       translation: hiJson,
//     },
//   },
//   lng: 'en',
//   fallbackLng: 'en',

//   interpolation: {
//     escapeValue: false,
//   },
// });

// LogBox.ignoreAllLogs();

// // Sentry.init({
// //   dsn: 'https://d0cbe7aea25047168ee8e21a774bd9f7@o473352.ingest.sentry.io/5508192',
// //   tracesSampleRate: 0.8,
// //   sampleRate: 1.0,
// //   enableAutoPerformanceTracking: true,
// //   integrations: [
// //     new Sentry.ReactNativeTracing({
// //       tracingOrigins: [
// //         'https://threesigma-backend-production.herokuapp.com/',
// //         /^\//,
// //       ],
// //     }),
// //   ],
// // });
// const App: FunctionComponent<any> = () => (
//   <StripePaymentWrapper>
//     <PaperProvider>
//       <StoreProvider store={store}>
//         <ThemeContextProvider value={defaultTheme}>
//           <SafeAreaView style={{ backgroundColor: R.colors.bgCol }} />
//           <StatusBar
//             backgroundColor={R.colors.bgCol}
//             barStyle={'dark-content'}
//             animated={true}
//           />
//           <AppNavigator />
//         </ThemeContextProvider>
//         <FlashMessage position="top" animated={true} />
//       </StoreProvider>
//     </PaperProvider>
//   </StripePaymentWrapper>
// );

// export default App;
// // export default Sentry.wrap(App);
/**
 * React Native App Iap Example
 *
 * @format
 */
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { withIAPContext } from "react-native-iap";
import { createStackNavigator } from "@react-navigation/stack";

import { Home } from "./iap/Home";
import { Subscriptions } from "./iap/Subscriptions";

export const screens = [
  {
    name: "Subscriptions",
    title: "Subscriptions",
    component: withIAPContext(Subscriptions),
    section: "Context",
    color: "#cebf38",
  },
  {
    name: "Home",
    component: Home,
    section: "Context",
    color: "#cebf38",
  },
];

const Stack = createStackNavigator();

export const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ title: "MainlyPaleo Subscriptions" }}>
    {screens.map(({ name, component, title }) => (
      <Stack.Screen
        key={name}
        name={name}
        component={component}
        //hide the header on these screens
        options={{
          title: title,
          headerShown:
            name === "Home" || name === "Subscriptions" ? false : true,
        }}
      />
    ))}
  </Stack.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default App;