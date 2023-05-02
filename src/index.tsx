import {InitialRoutes} from './config/routes';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './global';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <NativeBaseProvider>
          <InitialRoutes />
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

