/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Actions, Router, Scene, Stack} from 'react-native-router-flux';
import {Provider} from 'mobx-react';

import SplashScreen from './src/containers/SplashScreen';
import UserLogin from './src/containers/UserLogin';
import Home from './src/containers/Home';
import LocationSelector from './src/containers/LocationSelector';

import rideStore from './src/stores/rootStore';

export default class App extends Component {
  render() {
    return (
      <Provider rideStore={rideStore}>
        <Router
          titleStyle={{
            color: '#fff',
          }}
          navigationBarStyle={{
            elevation: 0,
            backgroundColor: '#46ACF1',
          }}>
          <Stack key="root">
            <Scene
              key="splash"
              component={SplashScreen}
              headerShown={false}
              initial
            />
            <Scene
              key="login"
              component={UserLogin}
              headerShown={false}
              animationEnabled={false}
            />
            <Scene
              key="home"
              component={Home}
              headerShown={false}
              animationEnabled={false}
            />
            <Scene
              key="locationSelector"
              title="onda"
              component={LocationSelector}
              back={true}
              animationEnabled={false}
            />
          </Stack>
        </Router>
      </Provider>
    );
  }
}
