import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity 
} from 'react-native';

export default class CustomButton1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View
        style={this.props.containerstyle}
      >
        <TouchableOpacity
            style={[styles.btn, this.props.btnstyle]}
            onPress={() => this.props.onpress()}
        >
            <Text style={[styles.btnText, this.props.btntextstyle]}>{this.props.value}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    btn: {
        padding: 7,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#46ACF1'
    },

    btnText: {
        fontSize: 16,
        color: '#fff'
    }
});
