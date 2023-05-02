import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Heading,
  Menu,
  Pressable,
  Text,
  useColorMode,
  useTheme,
} from 'native-base';
import React, {useCallback, useState} from 'react';
import {StatusBar, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Moon from '@assets/moon.svg';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import Sun from '@assets/sun.svg';
import get from 'lodash.get';
import {langToggle} from '@global/reducers/app';
import {useTranslation} from 'react-i18next';

interface MenuOption {
  key: string;
  icon?: React.ElementType;
}

interface HeaderType extends NativeStackHeaderProps {
  bg: string;
  back: boolean;
  navigation: any;
}

const theme: MenuOption[] = [
  {key: 'dark', icon: () => <Moon width="20" height="20" />},
  {key: 'light', icon: () => <Sun width="20" height="20" />},
];
const langArray: MenuOption[] = [
  {key: 'عربي', icon: undefined},
  {key: 'English', icon: undefined},
];

const Header = ({bg, back, navigation}: HeaderType) => {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const lang = useSelector((state: any) => state.app.lang);
  const text = get(colors, 'violet.600');
  const {setColorMode} = useColorMode();
  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const dispatch = useDispatch();

  const changeLang = (key: string) => {
    i18n.changeLanguage(key === 'عربي' ? 'ar' : 'en');
    dispatch(langToggle(key === 'عربي' ? 'ar' : 'en'));
  };

  const changeTheme = (key: string) => {
    setColorMode(key);
  };
  const direction = {flexDirection: lang === 'ar' ? 'row-reverse' : 'row'};
  return (
    <Box bg={bg}>
      <StatusBar
        backgroundColor={bg}
        barStyle={lang === 'ar' ? 'light-content' : 'dark-content'}
      />
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          ...direction,
        }}>
        {back ? (
          <TouchableOpacity onPress={goBack}>
            {lang === 'ar' ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          </TouchableOpacity>
        ) : (
          <Heading color={text}>{t('title')}</Heading>
        )}
        <View style={direction}>
          <MenuRender
            options={langArray}
            onPress={changeLang}
            selectedIndex={lang === 'en' ? 1 : 0}
          />
          <View style={{width: 2}} />
          <MenuRender options={theme} onPress={changeTheme} selectedIndex={1} />
        </View>
      </View>
    </Box>
  );
};

export default Header;

interface MenuRenderProps {
  options: MenuOption[];
  onPress: (key: string) => void;
  selectedIndex: number;
}

const MenuRender = ({options, onPress, selectedIndex}: MenuRenderProps) => {
  const [selected, setSelected] = useState(options[selectedIndex]);
  const Icon = selected.icon;
  const onSelection = useCallback(
    (key: string, icon: React.ElementType) => {
      setSelected({key, icon});
      onPress(key);
    },
    [onPress],
  );
  return (
    <Menu
      w="100"
      trigger={triggerProps => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            {Icon ? <Icon /> : <Text>{selected.key}</Text>}
          </Pressable>
        );
      }}>
      {options.map(({key, icon: IconComponent}) => (
        <Menu.Item
          key={key}
          onPress={() => onSelection(key, IconComponent as React.ElementType)}>
          <View className="flex-row">
            {IconComponent && <IconComponent />}
            <Text className="capitalize pl-1">{key}</Text>
          </View>
        </Menu.Item>
      ))}
    </Menu>
  );
};
