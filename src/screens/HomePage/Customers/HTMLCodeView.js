import React from 'react';
import { WebView } from 'react-native-webview';

const HTMLCodeView = ({ htmlCode }) => {
    return (
        <WebView
            source={{ html: htmlCode }}
            originWhitelist={['*']}
            useWebView2={true}
        />
    );
};

export default HTMLCodeView;
