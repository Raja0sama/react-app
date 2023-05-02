import React, {useCallback} from 'react';
import {
  SafeAreaView,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {View, useColorModeValue, useTheme} from 'native-base';

import {AppType} from '@global/reducers/app';
import Header from '@components/Header';
import Home from '@containers/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import get from 'lodash.get';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();

interface StackRoutes {
  [key: string]: {
    component: JSX.Element | Element;
    header?: () => JSX.Element;
    backButton?: boolean;
  };
}
const stackRoutes: StackRoutes = {
  HOME: {component: Home},
};

export const InitialRoutes = (): JSX.Element => {
  const {lang, theme}: AppType = useSelector((state: {app: AppType}) => ({
    lang: state.app.lang,
    theme: state.app.theme,
  }));
  const {colors} = useTheme();
  const color = useColorModeValue('warmGray.50', 'coolGray.800');
  const bg = get(colors, color);
  const backgroundColor = {backgroundColor: bg};

  return (
    <SafeAreaView style={backgroundColor} className="flex-1">


      <Stack.Navigator>
        {Object.entries(stackRoutes).map(route =>
          StackScreen({route, lang, theme, bg, backgroundColor}),
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};

interface StackScreenProps {
  routeName: string;
  lang: string;
  theme: string;
  route: [string, StackRoutes];
  bg: string;
  backgroundColor: StyleProp<ViewStyle>;
}
const StackScreen = ({
  route,
  lang,
  theme,
  bg,
  backgroundColor,
}: StackScreenProps) => {
  const [name, routeInfo] = route;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const Component = routeInfo.component;
  const fn = useCallback(
    (props: any) => (
      <SafeSpace>
        <Component {...props} {...{lang, theme, bg}} />
      </SafeSpace>
    ),
    [Component, bg, lang, theme],
  );
  return (
    <Stack.Screen
      options={{
        header: props => (
          <SafeSpace style={backgroundColor}>
            <Header back={routeInfo?.backButton} bg={bg} {...props} />
          </SafeSpace>
        ),
        contentStyle: backgroundColor,
      }}
      key={name}
      name={name}
      initialParams={{lang, theme}}
      component={fn}
    />
  );
};

const SafeSpace = ({children, ...props}: ViewProps) => {
  return (
    <View className="px-4 py-4" {...props}>
      {children}
    </View>
  );
};
