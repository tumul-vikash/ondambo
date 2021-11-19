/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, TouchableHighlight} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../utils/CustomInput';
import CustomButton1 from '../utils/CustomButton1';
import OtpForm from '../utils/OtpForm';
import {sendOtp, verifyOtp} from '../components/UserLogin';
import {Actions} from 'react-native-router-flux';

export default class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      otp: null,
      confirmation: null,
      showOtp: false,
      minutes: 0,
      seconds: 0,
    };
    this.intervalId = null;
    this.timerId = null;
  }

  componentDidMount() {
    this.timer(2);
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  handleTextInput = phone => {
    this.setState({phone});
  };

  timer = x => {
    this.timerId = setTimeout(() => {
      this.setState({minutes: x}, () => {
        this.intervalId = setInterval(() => {
          if (this.state.minutes > 0) {
            if (this.state.seconds == 0) {
              this.setState({minutes: this.state.minutes - 1, seconds: 59});
            } else if (this.state.seconds > 0) {
              this.setState({seconds: this.state.seconds - 1});
            }
          } else if (this.state.minutes == 0 && this.state.seconds > 0) {
            this.setState({seconds: this.state.seconds - 1});
          } else if (this.state.minutes == 0 && this.state.seconds == 0) {
            this.stopTimer();
          }
        }, 1000);
      });
    }, x);
  };

  stopTimer = () => {
    clearInterval(this.intervalId);
    clearTimeout(this.timer);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              height: 110,
              backgroundColor: '#46ACF1',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 35,
              }}>
              ONDAMBO
            </Text>
          </View>
          <Image
            style={{
              width: '100%',
              height: 180,
            }}
            source={require('../assets/images/wave1.png')}
          />
        </View>
        <View style={styles.main}>
          {this.state.showOtp ? (
            <View style={styles.otpForm}>
              <OtpForm onchangetext={otp => this.setState({otp})} />
              <CustomButton1
                containerstyle={{
                  marginTop: 9,
                }}
                onpress={() => {
                  verifyOtp(this.state.confirmation, this.state.otp).then(
                    async data => {
                      if (data == 'invalid') {
                        alert('Uknown error');
                      } else {
                        try {
                          await AsyncStorage.setItem('phone', this.state.phone);
                          Actions.home();
                        } catch (e) {
                          console.error(e);
                        }
                      }
                    },
                  );
                }}
                value="Submit"
              />
              {this.state.minutes == 0 && this.state.seconds == 0 ? (
                <TouchableHighlight>
                  <Text>Resend</Text>
                </TouchableHighlight>
              ) : (
                <Text
                  style={{
                    color: 'red',
                    fontSize: 16,
                  }}>
                  Resend OTP in {this.state.minutes}:{this.state.seconds} mins
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.form}>
              <CustomInput
                label="Phone"
                onchangetext={phone => this.handleTextInput(phone)}
                placeholder="Enter phone number"
                placeholdertextcolor="#000"
                keyboardtype="phone-pad"
              />
              <CustomButton1
                containerstyle={{
                  marginTop: 9,
                }}
                onpress={() => {
                  this.setState({showOtp: true}, () => {
                    if (this.state.phone == null) {
                      alert('Phone cannot be empty');
                    } else if (this.state.phone.length == 0) {
                      alert('Phone cannot be empty');
                    } else if (this.state.phone.length < 10) {
                      alert('Phone number should be 10 digits');
                    } else if (this.state.phone.length == 10) {
                      sendOtp(this.state.phone).then(data =>
                        this.setState({confirmation: data}, () =>
                          console.log(this.state.confirmation),
                        ),
                      );
                    } else {
                      alert('Invalid phone number');
                    }
                  });
                }}
                value="Sign in"
              />
            </View>
          )}
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
    flex: 0.5,
  },
  main: {
    flex: 1,
  },
  form: {
    padding: 15,
    marginHorizontal: 10,
    marginTop: 50,
  },
  otpForm: {
    flex: 0.3,
    padding: 15,
    marginHorizontal: 10,
    marginTop: 60,
  },
});
