import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {inject, observer} from 'mobx-react';
import {Actions} from 'react-native-router-flux';

class DropoffInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {DropoffData, toggleConfirmDropoff, updateDropoffDetails} =
      this.props.rideStore;
    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor="none"
          onPress={() => {
            if (DropoffData) {
              toggleConfirmDropoff();
              updateDropoffDetails();
            }
            Actions.locationSelector({inputType: 'dropoff'});
          }}>
          <Text>{DropoffData ? DropoffData.address : 'Dropoff'}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginHorizontal: 10,
    marginTop: 7,
    paddingLeft: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default inject('rideStore')(observer(DropoffInput));
