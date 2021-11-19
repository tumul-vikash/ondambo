/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, PermissionsAndroid, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Actions} from 'react-native-router-flux';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
    this.timeoutId = null;
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.verifyLoggedIn();
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  verifyLoggedIn = async () => {
    try {
      const value = await AsyncStorage.getItem('phone');
      if (value !== null) {
        Actions.home();
      } else {
        Actions.login();
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <View style={styles.main}>
          <Image
            source={require('../assets/images/OndaIcon.png')}
            style={styles.logo}
          />
          <Text style={styles.text}>ONDA CABS</Text>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: '#46ACF1'}]}>
            This product belongs to
          </Text>
          <Text style={[styles.footerText, {color: '#424242'}]}>
            Ondambo Investment cc.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 0.2,
  },
  main: {
    flex: 0.7,
    alignItems: 'center',
  },
  text: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#424242',
  },
  logo: {
    width: 215,
    height: 205,
    marginTop: 50,
    marginBottom: 20,
  },
  footer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
