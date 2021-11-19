import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import {getPlaceDetails, searchPlace} from '../components/LocationSelector';
import {Actions} from 'react-native-router-flux';

class LocationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      predictions: null,
    };
  }

  componentDidMount() {}

  render() {
    const {updateDropoffDetails, updatePickupDetails, toggleConfirmDropoff} =
      this.props.rideStore;
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Search.."
          placeholderTextColor="#46ACF1"
          style={styles.input}
          onChangeText={query => {
            searchPlace(query).then(results =>
              this.setState({predictions: results.predictions}),
            );
          }}
        />
        <ScrollView contentContainerStyle={styles.scroll}>
          {this.state.predictions &&
            this.state.predictions.map((prediction, index) => {
              return (
                <TouchableHighlight
                  key={index}
                  style={styles.prediction}
                  underlayColor="none"
                  onPress={() => {
                    getPlaceDetails(prediction.place_id).then(data => {
                      const PD = {
                        address: data.result.formatted_address,
                        place_id: prediction.place_id,
                        coordinates: {
                          latitude: data.result.geometry.location.lat,
                          latitudeDelta: 0.001,
                          longitude: data.result.geometry.location.lng,
                          longitudeDelta: 0.001,
                        },
                      };
                      if (this.props.inputType == 'pickup') {
                        updatePickupDetails(PD);
                        Actions.home({
                          coords: {
                            latitude: data.result.geometry.location.lat,
                            longitude: data.result.geometry.location.lng,
                          },
                        });
                      } else if (this.props.inputType == 'dropoff') {
                        updateDropoffDetails(PD);
                        Actions.home({
                          dCoords: {
                            latitude: data.result.geometry.location.lat,
                            longitude: data.result.geometry.location.lng,
                          },
                        });
                      }
                    });
                  }}>
                  <View>
                    <Text style={styles.main_text}>
                      {prediction.structured_formatting.main_text}
                    </Text>
                    <Text style={styles.description}>
                      {prediction.description}
                    </Text>
                  </View>
                </TouchableHighlight>
              );
            })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#EDEDED',
  },
  main_text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#46ACF1',
  },
  description: {
    fontSize: 16,
    color: '#000',
  },
  scroll: {
    paddingLeft: 5,
  },
  prediction: {
    paddingVertical: 5,
  },
});

export default inject('rideStore')(observer(LocationSelector));
