import React, { useState, useEffect } from 'react';
import { encode } from 'base-64';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";
import Routes from './Routes';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { 
  ApplicationProvider,
  IconRegistry
} from '@ui-kitten/components'; 
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  if (!global.btoa) { global.btoa = encode; }
  
  const [appIsReady, setAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }

      prepareResources();
    })();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      (async () => {
        await SplashScreen.hideAsync();
      })();
    }
  }, [appIsReady]);

  const prepareResources = async () => {
    await Font.loadAsync({
      'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
      'Nunito': require('./assets/fonts/Nunito-Black.ttf'),
      'Nunito-italic': require('./assets/fonts/Nunito-Italic.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })

    setAppReady(true);
  }

  if (!appIsReady) {
    return null;
  }else{
    return(
      <Root>
        <Provider store={store}>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <MenuProvider>
              <Routes />
            </MenuProvider>
          </ApplicationProvider>
          <StatusBar style="light" />
        </Provider>
      </Root>
    );
  }
}
