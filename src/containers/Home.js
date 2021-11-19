/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Modal,
} from 'react-native';
import {RadioGroup} from 'react-native-btr';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Flow, Bounce} from 'react-native-animated-spinkit';
import {inject, observer} from 'mobx-react';
import {
  animateToRegion,
  calculateFare,
  getCurrentPosition,
  getFareChart,
  reverseGeocode,
  zoomOut,
  searchCity,
  getCity,
  bookRide,
} from '../components/Home';
import PickupInput from '../utils/PickupInput';
import DropoffInput from '../utils/DropoffInput';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRef: null,
      pickupDetails: null,
      userLocation: null,
      modalVisible: false,
      distance: 0,
      duration: 0,
      fareChart: null,
      fare: 0,
      showCity: true,
      showBottomButton: false,
      showMessage: false,
      isDisabled: false,
      showLoader: false,
      showPopup: false,
      city: [
        {
          id: 0,
          label: 'share it',
          value: 'share',
          checked: true,
          selected: true,
          color: '#46ACF1',
          labelStyle: {fontSize: 18},
          disabled: false,
          flexDirection: 'row',
          size: 20,
        },
        {
          id: 1,
          label: 'wannaball',
          value: 'wannaball',
          checked: false,
          selected: false,
          color: '#46ACF1',
          labelStyle: {fontSize: 18},
          disabled: false,
          flexDirection: 'row',
          size: 20,
        },
      ],
      outstation: [
        {
          id: 0,
          label: 'Sedan',
          value: 'sedan',
          checked: true,
          selected: true,
          color: '#46ACF1',
          labelStyle: {fontSize: 18},
          disabled: false,
          flexDirection: 'row',
          size: 20,
        },
        {
          id: 1,
          label: 'Innova',
          value: 'inova',
          checked: false,
          selected: false,
          color: '#46ACF1',
          labelStyle: {fontSize: 18},
          disabled: false,
          flexDirection: 'row',
          size: 20,
        },
        {
          id: 2,
          label: 'Quantum bus',
          value: 'quantum',
          checked: false,
          selected: false,
          color: '#46ACF1',
          labelStyle: {fontSize: 18},
          disabled: false,
          flexDirection: 'row',
          size: 20,
        },
        {
          id: 3,
          label: 'Iveco',
          value: 'iveco',
          checked: false,
          selected: false,
          color: '#46ACF1',
          labelStyle: {fontSize: 18},
          disabled: false,
          flexDirection: 'row',
          size: 20,
        },
      ],
    };
    this.mapRef = null;
    this.timeout = null;
  }

  componentDidMount() {
    getFareChart('share').then(data => {
      if (data.category == 'CITY') {
        this.setState({fareChart: data.fareChart});
      } else if (data.category == 'OUTSTATION') {
        console.log('outstation');
      }
    });
  }

  render() {
    const {
      ConfirmPickup,
      ConfirmDropoff,
      toggleConfirmPickup,
      toggleConfirmDropoff,
      PickupData,
      DropoffData,
      showLoader,
      updatePickupDetails,
      updateDropoffDetails,
      updateShowLoader,
    } = this.props.rideStore;

    return (
      <View style={styles.container}>
        <MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={false}
          showsBuildings={true}
          showsPointsOfInterest={true}
          showsIndoors={true}
          initialRegion={{
            latitude: -22.601255,
            longitude: 17.092333,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          }}
          onMapReady={() => {
            getCurrentPosition(this.mapRef).then(() => {
              if (this.props.coords) {
                if (searchCity(PickupData.address)) {
                  this.setState({showMessage: false});
                  animateToRegion(this.mapRef, this.props.coords);
                  toggleConfirmPickup();
                } else {
                  animateToRegion(this.mapRef, this.props.coords);
                  this.setState({showMessage: true});
                }
              } else if (this.props.dCoords) {
                console.log(this.props.dCoords);
                zoomOut(this.mapRef, this.props.dCoords);
                toggleConfirmDropoff();
              }
            });
          }}
          onUserLocationChange={coords => {
            const coordinates = {
              latitude: coords.nativeEvent.coordinate.latitude,
              longitude: coords.nativeEvent.coordinate.longitude,
            };
            this.setState({currentLocation: coordinates});
          }}
          onRegionChangeComplete={e => {
            if (ConfirmPickup == false) {
              reverseGeocode(e).then(result => {
                if (searchCity(result.formatted_address)) {
                  this.setState({showMessage: false});
                  const data = {
                    address: result.formatted_address,
                    place_id: result.place_id,
                    coordinates: e,
                  };
                  updatePickupDetails(data);
                } else {
                  this.setState({showMessage: true});
                }
              });
            }
          }}>
          {ConfirmPickup && PickupData ? (
            <Marker
              onPress={() => {
                toggleConfirmPickup();
                toggleConfirmDropoff();
                updateDropoffDetails();
              }}
              coordinate={{
                latitude: PickupData.coordinates.latitude,
                longitude: PickupData.coordinates.longitude,
              }}
              image={require('../assets/images/marker-circle.png')}
            />
          ) : null}

          {ConfirmDropoff && DropoffData ? (
            <Marker
              coordinate={{
                latitude: DropoffData.coordinates.latitude,
                longitude: DropoffData.coordinates.longitude,
              }}
              image={require('../assets/images/marker-circle.png')}
            />
          ) : null}
          {PickupData && DropoffData && (
            <MapViewDirections
              origin={`place_id:${PickupData.place_id}`}
              destination={`place_id:${DropoffData.place_id}`}
              apikey="AIzaSyD2oyUBA8L7BKlnDFYbNQGTGG1i5UZnHGI"
              mode="DRIVING"
              strokeWidth={20}
              strokeColor="#46ACF1"
              optimizeWaypoints={true}
              onStart={data => console.log(data)}
              onReady={data => {
                updateShowLoader(true);
                this.setState(
                  {
                    //modalVisible: true,
                    distance: data.distance,
                    duration: data.duration,
                  },
                  () => {
                    calculateFare(
                      this.state.distance,
                      this.state.duration,
                      this.state.fareChart,
                    ).then(fare => {
                      this.setState({fare});
                    });
                  },
                );
              }}
            />
          )}
        </MapView>
        {this.state.showMessage ? (
          <View style={styles.message}>
            <Text style={styles.messageText}>
              onda service is not available in this region. For more details
              contact
            </Text>
            <Text style={[styles.messageText, {color: '#000'}]}>
              support@ondambo.com
            </Text>
          </View>
        ) : (
          <PickupInput
            mapRef={this.mapRef}
            coordinates={this.state.currentLocation}
          />
        )}
        {ConfirmPickup && <DropoffInput />}
        <View style={styles.box1}>
          {this.state.showMessage == false && ConfirmPickup == false && (
            <TouchableHighlight
              underlayColor="none"
              onPress={async () => {
                toggleConfirmPickup();
              }}>
              <Image
                style={styles.markerCenter}
                source={require('../assets/images/marker-icon.png')}
              />
            </TouchableHighlight>
          )}
        </View>
        {this.state.modalVisible ? (
          <Modal
            animationType="fade"
            style={{
              justifyContent: 'center',
            }}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: false});
            }}>
            <View style={styles.modalView}>
              <View style={styles.modalContent}>
                <View style={styles.text}>
                  <Text
                    style={{
                      color: '#46ACF1',
                      fontSize: 18,
                    }}>
                    Estimated distance:
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 18,
                    }}>
                    {' '}
                    {this.state.distance.toFixed()}
                  </Text>
                </View>
                <View style={styles.text}>
                  <Text
                    style={{
                      color: '#46ACF1',
                      fontSize: 18,
                    }}>
                    Estimated duration:
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 18,
                    }}>
                    {' '}
                    {this.state.duration.toFixed()}
                  </Text>
                </View>
                <View style={styles.tab}>
                  <TouchableHighlight
                    underlayColor="none"
                    onPress={() => {
                      this.setState({showCity: true, isDisabled: false}, () => {
                        calculateFare(
                          this.state.distance,
                          this.state.duration,
                          this.state.fareChart,
                        ).then(fare => {
                          this.setState({fare});
                        });
                      });
                    }}
                    style={[
                      styles.tabBtn,
                      {
                        borderTopStartRadius: 7,
                        borderBottomStartRadius: 7,
                        borderRightWidth: 1,
                        borderRightColor: '#CCCCCC93',
                      },
                    ]}>
                    <Text style={styles.btnText}>city ride</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor="none"
                    onPress={() => {
                      this.setState({showCity: false}, () => {
                        getFareChart('sedan').then(fare => {
                          const pc = getCity(PickupData.address);
                          const dc = getCity(DropoffData.address);
                          if (pc && dc) {
                            if (pc == dc) {
                              this.setState({isDisabled: true});
                              alert(
                                'Outstation rides not available between same city. Please choose a city ride',
                              );
                            } else {
                              for (let i = 0; i < fare.fareChart.length; i++) {
                                if (
                                  fare.fareChart[i].to == dc &&
                                  fare.fareChart[i].from == pc
                                ) {
                                  this.setState({fare: fare.fareChart[i].fare});
                                } else {
                                  this.setState({fare: 0, isDisabled: true});
                                  alert(
                                    'sedan rides not available for given source and destination',
                                  );
                                }
                              }
                            }
                          } else {
                            this.setState({
                              showMessage: true,
                              modalVisible: false,
                            });
                            alert(
                              'Service not available in given drop location',
                            );
                          }
                        });
                      });
                    }}
                    style={[
                      styles.tabBtn,
                      {
                        borderTopEndRadius: 7,
                        borderBottomEndRadius: 7,
                      },
                    ]}>
                    <Text style={styles.btnText}>outstation</Text>
                  </TouchableHighlight>
                </View>
                {this.state.showCity ? (
                  <RadioGroup
                    color="#46ACF1"
                    radioButtons={this.state.city}
                    onPress={city => {
                      let selectedCity = city.find(e => e.selected);
                      let sc = selectedCity
                        ? selectedCity.value
                        : this.state.city[0].value;
                      getFareChart(sc).then(fareChart => {
                        this.setState({fareChart: fareChart.fareChart});
                        calculateFare(
                          this.state.distance,
                          this.state.duration,
                          fareChart.fareChart,
                        ).then(fare => {
                          this.setState({fare});
                        });
                      });
                    }}
                    style={{paddingTop: 20}}
                  />
                ) : (
                  <RadioGroup
                    color="#46ACF1"
                    radioButtons={this.state.outstation}
                    onPress={outstation => {
                      let selectedOutstation = outstation.find(e => e.selected);
                      let so = selectedOutstation
                        ? selectedOutstation.value
                        : this.state.outstation[0].value;
                      getFareChart(so).then(fare => {
                        const pc = getCity(PickupData.address);
                        const dc = getCity(DropoffData.address);
                        console.log(fare, pc, dc);
                        if (pc && dc) {
                          if (pc == dc) {
                            this.setState({isDisabled: true});
                            alert(
                              'Outstation rides not available between same city. Please choose a city ride',
                            );
                          } else {
                            for (let i = 0; i < fare.fareChart.length; i++) {
                              if (
                                fare.fareChart[i].to == dc &&
                                fare.fareChart[i].from == pc
                              ) {
                                this.setState({
                                  fare: fare.fareChart[i].fare,
                                  isDisabled: false,
                                });
                              } else {
                                this.setState({fare: 0, isDisabled: true});
                                alert(
                                  `${so} rides not available for given source and destination`,
                                );
                              }
                            }
                          }
                        } else {
                          this.setState({
                            showMessage: true,
                            modalVisible: false,
                          });
                          alert('Service not available in given drop location');
                        }
                      });
                    }}
                    style={{paddingTop: 20}}
                  />
                )}
                {this.state.isDisabled ? null : (
                  <View style={styles.text}>
                    <Text
                      style={{
                        color: '#46ACF1',
                        fontSize: 18,
                      }}>
                      Estimated Fare:
                    </Text>
                    {this.state.fare ? (
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 18,
                        }}>
                        {' '}
                        {'NA $' + this.state.fare}
                      </Text>
                    ) : (
                      <Flow size={48} style={{margin: 10}} color="#000" />
                    )}
                  </View>
                )}
              </View>
              <View style={styles.footer}>
                <TouchableHighlight
                  disabled={this.state.isDisabled}
                  onPress={() =>
                    this.setState(
                      {modalVisible: false, isDisabled: true, showLoader: true},
                      () => {
                        toggleConfirmDropoff();
                        bookRide(
                          PickupData,
                          DropoffData,
                          this.state.distance,
                          this.state.duration,
                          this.state.fare,
                        ).then(data => {
                          console.log(data);
                          this.setState(
                            {
                              showLoader: false,
                              showBottomButton: false,
                            },
                            () => {
                              this.setState({showPopup: true});
                              this.timeout = setTimeout(() => {
                                this.setState({showPopup: false});
                                clearTimeout(this.timeout);
                                alert('Ride not available');
                              }, 30000);
                            },
                          );
                        });
                      },
                    )
                  }
                  underlayColor="none"
                  style={[styles.btn, {backgroundColor: '#46ACF1'}]}>
                  {this.state.showLoader ? (
                    <Flow size={48} color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>confirm ride</Text>
                  )}
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="none"
                  style={[styles.btn, {backgroundColor: 'gray'}]}
                  onPress={() =>
                    this.setState({modalVisible: false, showBottomButton: true})
                  }>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        ) : null}
        {ConfirmPickup && ConfirmDropoff ? (
          <TouchableHighlight
            onPress={() => this.setState({modalVisible: true})}
            style={styles.bottomButton}>
            <Text style={styles.btnText}>Book Ride</Text>
          </TouchableHighlight>
        ) : null}
        <Modal
          animationType="slide"
          style={{
            flex: 1,
          }}
          transparent={true}
          visible={this.state.showPopup}>
          <View style={styles.popup}>
            <Bounce size={65} color="#46ACF1" />
            <Text style={styles.popupText}>Searching Cabs</Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  box1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCenter: {
    width: 30,
    height: 45,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 5,
    backgroundColor: '#46ACF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 0.9,
    marginHorizontal: 15,
    marginTop: '40%',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#46ACF1',
  },
  modalContent: {
    flex: 1,
  },
  footer: {
    flex: 0.4,
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    margin: 5,
    borderRadius: 7,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
  },
  text: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  tabBtn: {
    padding: 5,
    backgroundColor: '#46ACF1',
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 7,
    marginTop: 10,
  },
  messageText: {
    fontSize: 18,
    color: '#FD6868',
  },
  popup: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: '50%',
    marginHorizontal: 7,
    padding: 5,
  },
  popupText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#424242',
  },
});

export default inject('rideStore')(observer(Home));
