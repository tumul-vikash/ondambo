import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {AsyncStorage} from '@react-native-async-storage/async-storage';
import {inject, observer} from 'mobx-react';
import {Actions} from 'react-native-router-flux';
import {animateToRegion} from '../components/Home';

class PickupInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const {
      ConfirmPickup,
      ConfirmDropoff,
      PickupData,
      DropoffData,
      toggleConfirmDropoff,
      toggleConfirmPickup,
      updateDropoffDetails,
    } = this.props.rideStore;
    return (
      <View style={styles.container}>
        <View style={styles.icon}>
          <TouchableHighlight>
            <Image
              style={styles.iconImg}
              source={require('../assets/images/hamburger.png')}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.address}>
          <TouchableHighlight
            underlayColor="none"
            onPress={async () => {
              if (ConfirmPickup == true) {
                await toggleConfirmPickup();
                if (ConfirmDropoff == true) {
                  await toggleConfirmDropoff();
                  await updateDropoffDetails();
                }
              }
              Actions.locationSelector({inputType: 'pickup'});
            }}>
            <Text>{PickupData ? PickupData.address : null}</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.icon}>
          {ConfirmPickup ? (
            <TouchableHighlight
              underlayColor="none"
              onPress={() => {
                if (this.props.mapRef) {
                  const coordinates = PickupData.coordinates;
                  animateToRegion(this.props.mapRef, coordinates);
                }
              }}>
              <Image
                style={[styles.iconImg, {width: 50, height: 50}]}
                source={require('../assets/images/marker-circle.png')}
              />
            </TouchableHighlight>
          ) : (
            <TouchableHighlight
              underlayColor="none"
              onPress={() => {
                if (this.props.mapRef && this.props.coordinates) {
                  animateToRegion(this.props.mapRef, this.props.coordinates);
                }
              }}>
              <Image
                style={styles.iconImg}
                source={require('../assets/images/mylocation.png')}
              />
            </TouchableHighlight>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginHorizontal: 10,
    marginTop: 35,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  icon: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  address: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  iconImg: {
    width: 27,
    height: 27,
  },
});

export default inject('rideStore')(observer(PickupInput));
