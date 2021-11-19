import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const OTP = [];
export default class OtpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
    };
    this.inputRefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];
  }

  _goNextAfterEdit = async (index, value) => {
    var {otp} = this.state;
    if (index < this.inputRefs.length - 1) {
      this.inputRefs[index + 1].focus();
    }
    await OTP.push(value);
    this.props.onchangetext(OTP.join(''));
  };

  _goPrevOnDelete = async index => {
    var {otp} = this.state;
    if (index > 0) {
      this.inputRefs[index - 1].focus();
    }
    await OTP.pop();
    this.props.onchangetext(OTP.join(''));
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.inputRefs.map((k, idx) => (
          <TextInput
            key={idx}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.input}
            ref={r => (this.inputRefs[idx] = r)}
            onChangeText={value => this._goNextAfterEdit(idx, value)}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key == 'Backspace') {
                this._goPrevOnDelete(idx);
              }
            }}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 2,
    borderColor: '#46ACF1',
    height: 50,
    width: 50,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
