import React, { useState, useEffect } from 'react';
import { encode } from 'base-64';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";
import {
  HomeScreen,
  FormRegister as FormRegisterScreen,
  PulihkanAkun
} from './screens';

const Stack = createStackNavigator();

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
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Home"
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="FormRegister" component={FormRegisterScreen} />
              <Stack.Screen name="Restore" component={PulihkanAkun} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </Provider>
      </Root>
    );
  }
}
