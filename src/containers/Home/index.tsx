import {AppData, AppState, AppType, fetchNews} from '@global/reducers/app';
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  FlatList,
  HStack,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

interface HomeType extends AppType {}
const category = ['apple', 'meta', 'netflix', 'google', 'twitter', 'tesla'];
const Home = ({}: HomeType) => {
  const {t} = useTranslation();
  const [selected, setSelected] = useState('apple');
  const dispatch = useDispatch();
  const {data, loading, lang} = useSelector((state: {app: AppState}) => ({
    data: state.app.data,
    loading: state.app.loading,
    lang: state.app.lang,
  }));
  const textAlign = lang === 'ar' ? 'right' : 'left';
  const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
  useEffect(() => {
    fetchNews(selected, lang)(dispatch);
  }, [dispatch, selected, lang]);

  return (
    <View>
      <Heading style={{textAlign}} size={'sm'} className="mb-[5px]">
        {t('category')}
      </Heading>
      <View style={{flexDirection}} className="overflow-scroll">
        <Button size="sm" variant="subtle" colorScheme="violet">
          {selected.replace(/(^\w)/, (match: string) => match.toUpperCase())}
        </Button>
        <Divider
          orientation="vertical"
          mx="2"
          _light={{
            bg: 'muted.800',
          }}
          _dark={{
            bg: 'muted.50',
          }}
        />
        <FlatList
          inverted={lang == 'ar'}
          horizontal
          data={category.filter(e => e !== selected)}
          renderItem={({item}) => <RenderItem {...{item, setSelected}} />}
          keyExtractor={item => item}
        />
      </View>
      {loading ? (
        <View className="w-full h-full justify-center items-center">
          <HStack space={8} justifyContent="center" alignItems="center">
            <Spinner size="lg" />
          </HStack>
        </View>
      ) : (
        <FlatList
          className="mt-[10px]"
          data={data}
          renderItem={renderCards}
          keyExtractor={item => item.title}
        />
      )}
    </View>
  );
};

export default Home;

interface RenderItemType {
  item: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const RenderItem = ({item, setSelected}: RenderItemType) => (
  <Button
    onPress={() => setSelected(item)}
    key={item}
    className="mr-[6px]"
    size="sm"
    variant="subtle">
    {item.replace(/(^\w)/, (match: string) => match.toUpperCase())}
  </Button>
);

interface CardType {
  item: AppData;
}

const Card = ({item}: CardType) => {
  const {navigate} = useNavigation();
  const {lang} = useSelector((state: {app: AppState}) => ({
    lang: state.app.lang,
  }));
  const textAlign = lang === 'ar' ? 'right' : 'left';
  const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
  const onPress = useCallback(
    () => navigate('NEWS' as never, {item} as never),
    [navigate, item],
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <Box alignItems="center" className="mt-5">
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: 'coolGray.600',
            backgroundColor: 'gray.700',
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: 'gray.50',
          }}>
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image
                source={{
                  uri: item.urlToImage,
                }}
                alt="image"
              />
            </AspectRatio>
            <Center
              bg="violet.500"
              _dark={{
                bg: 'violet.400',
              }}
              _text={{
                color: 'warmGray.50',
                fontWeight: '700',
                fontSize: 'xs',
              }}
              position="absolute"
              bottom="0"
              right={lang === 'ar' ? '0' : undefined}
              px="3"
              py="1.5">
              {item.source.name}
            </Center>
          </Box>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading textAlign={textAlign} size="md" ml="-1">
                {item.title}
              </Heading>
              <Text
                textAlign={textAlign}
                fontSize="xs"
                _light={{
                  color: 'violet.500',
                }}
                _dark={{
                  color: 'violet.400',
                }}
                fontWeight="500"
                ml="-0.5"
                mt="-1">
                {item.author}
              </Text>
            </Stack>
            <Text textAlign={textAlign} fontWeight="400">
              {item.description}
            </Text>
            <HStack
              alignItems="center"
              space={4}
              flexDir={flexDirection}
              justifyContent="space-between">
              <HStack alignItems="center">
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}
                  fontWeight="400">
                  {dateToDaysAgo(item.publishedAt)}
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};
const renderCards = ({item}: {item: AppData}) => {
  return <Card item={item} />;
};

function dateToDaysAgo(dateString: string) {
  // Parse the date string
  const date: any = new Date(dateString);
  // Get the current date and time
  const now = Date.now();
  // Calculate the difference in seconds
  const diff = (now - date) / 1000;
  // Convert to days
  let days = diff / 86400;
  // Round to the nearest integer
  days = Math.round(days);
  // Return a string
  return `${days} days ago`;
}
