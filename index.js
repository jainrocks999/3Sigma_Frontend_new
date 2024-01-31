import 'react-native-gesture-handler';
// import NewRelic from 'newrelic-react-native-agent';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
// import {Platform} from 'react-native';
// import {APP_VERSION} from './env';
// let appToken;

// if (Platform.OS === 'ios') {
//   appToken = 'AA1af9028b48bb74f002455f32be32806bed2b29ef-NRMA';
// } else {
//   appToken = 'AAc09f5911c2f3553e7ba417856dec79b20eb85aa5-NRMA';
// }

// const agentConfiguration = {
//   //Android Specific
//   // Optional:Enable or disable collection of event data.
//   analyticsEventEnabled: true,

//   // Optional:Enable or disable crash reporting.
//   crashReportingEnabled: true,

//   // Optional:Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
//   interactionTracingEnabled: true,

//   // Optional:Enable or disable reporting successful HTTP requests to the MobileRequest event type.
//   networkRequestEnabled: true,

//   // Optional:Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
//   networkErrorRequestEnabled: true,

//   // Optional:Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
//   httpRequestBodyCaptureEnabled: true,

//   // Optional:Enable or disable agent logging.
//   loggingEnabled: true,

//   // Optional:Specifies the log level. Omit this field for the default log level.
//   // Options include: ERROR (least verbose), WARNING, INFO, VERBOSE, AUDIT (most verbose).
//   logLevel: NewRelic.LogLevel.INFO,

//   // iOS Specific
//   // Optional:Enable/Disable automatic instrumentation of WebViews
//   webViewInstrumentation: true,

//   // Optional:Set a specific collector address for sending data. Omit this field for default address.
//   collectorAddress: '',

//   // Optional:Set a specific crash collector address for sending crashes. Omit this field for default address.
//   crashCollectorAddress: '',
// };

// NewRelic.startAgent(appToken, agentConfiguration);
// NewRelic.setJSAppVersion(APP_VERSION);
AppRegistry.registerComponent(appName, () => App);
