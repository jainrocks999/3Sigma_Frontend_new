import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import R from 'resources/R';
let calledUrl = '';
interface WebViewModalProps {
  weburl: string;
  isVisible: boolean;
  handleURlChangeActions: (weburl: string) => void;
  onModalHide: (isVisible: boolean) => void;
}
const WebViewModal = ({
  isVisible,
  onModalHide,
  weburl,
  handleURlChangeActions,
}: WebViewModalProps) => {
  const [loading, setLoading] = useState(true);
  console.log('weburl', weburl);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onModalHide(false);
      }}>
      <View style={styles.modalContainer}>
        <WebView
          style={styles.webViewStyle}
          source={{uri: weburl}}
          onNavigationStateChange={event => {
            if (Platform.OS === 'ios') {
              handleURlChangeActions(event.url);
            }
          }}
          onLoadProgress={data => {
            if (
              Platform.OS === 'android' &&
              data.nativeEvent.url != calledUrl
            ) {
              calledUrl = data.nativeEvent.url;
              handleURlChangeActions(data.nativeEvent.url);
            }
          }}
          onLoad={() => {
            setLoading(false);
          }}
        />
      </View>
      {loading && (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={R.colors.themeCol2} />
        </View>
      )}
    </Modal>
  );
};
export default WebViewModal;
const styles = StyleSheet.create({
  modalContainer: {
    minHeight: '100%',
  },
  container: {
    justifyContent: 'center',
    height: Dimensions.get('screen').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingtext: {
    textAlign: 'center',
  },
  webViewStyle: {backgroundColor: 'transparent'},
});
