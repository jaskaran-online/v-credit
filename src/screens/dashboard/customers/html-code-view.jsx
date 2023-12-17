import React from 'react';
import { WebView } from 'react-native-webview';

const HtmlCodeView = ({ htmlCode }) => {
  return <WebView source={{ html: htmlCode }} originWhitelist={['*']} useWebView2 />;
};

export default HtmlCodeView;
