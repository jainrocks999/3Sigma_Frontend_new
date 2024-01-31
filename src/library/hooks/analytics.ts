import analytics from '@react-native-firebase/analytics';
const ga = {
  logEvent: async (event: string, data: any = {}) =>
    await analytics().logEvent(event, data),
  logScreenView: async (data: any) => await analytics().logScreenView(data),
};
export default ga;
