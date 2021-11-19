import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default class CustomInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{}}>
        <Text style={styles.text}>{this.props.label}</Text>
        <TextInput
            style={styles.input}
            keyboardType={this.props.keyboardtype ? this.props.keyboardtype : 'default'}
            onChangeText={(data) => this.props.onchangetext(data)}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholdertextcolor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    input: {
        fontSize: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#46ACF1',
        backgroundColor: '#e8e8e8'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#46ACF1',
        marginBottom: 7,
    },
});