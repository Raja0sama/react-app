import {AppType} from '@global/reducers/app';
import React from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';

interface NewsType extends AppType {
  route: {params: {item: {url: string}}};
}
const News = ({route}: NewsType) => {
  return (
    <View className="w-full h-full bg-red">
      <WebView source={{uri: route.params.item.url}} />
    </View>
  );
};

export default News;
