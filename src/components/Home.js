/* eslint-disable no-alert */
import {PermissionsAndroid} from 'react-native';
import RNLocation from 'react-native-location';
import firestore from '@react-native-firebase/firestore';

export const getCurrentPosition = async mapRef => {
  RNLocation.configure({
    distanceFilter: 5.0,
  });

  await RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'fine',
    },
  }).then(granted => {
    if (granted) {
      RNLocation.subscribeToLocationUpdates(locations => {
        console.log(locations);
        var coordinates = {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
        };
        animateToRegion(mapRef, coordinates);
      });
    }
  });
};

export const reverseGeocode = coordinates => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=AIzaSyD2oyUBA8L7BKlnDFYbNQGTGG1i5UZnHGI`,
  )
    .then(response => response.json())
    .then(responseJson => {
      return responseJson.results[0];
    });
};

export const searchCity = address => {
  console.log(address);
  const cities = [
    'windhoek',
    'rundu',
    'walvisbaai',
    'swakopmund',
    'rehoboth',
    'ongwediva',
    'katima mulilo',
    'opuwo',
    'otjiwarongo',
    'grootfontein',
    'okahandja',
    'keetmanshoop',
    'oshakati',
    //'ca',
  ];
  const add = address.toLowerCase();
  for (let i = 0; i < cities.length; i++) {
    if (add.includes(cities[i])) {
      return true;
    }
  }
};

export const getCity = address => {
  const cities = [
    'windhoek',
    'rundu',
    'walvisbaai',
    'swakopmund',
    'rehoboth',
    'ongwediva',
    'katima mulilo',
    'opuwo',
    'otjiwarongo',
    'grootfontein',
    'okahandja',
    'keetmanshoop',
    'oshakati',
    //'ca',
  ];
  const add = address.toLowerCase();
  for (let i = 0; i < cities.length; i++) {
    if (add.includes(cities[i])) {
      return cities[i];
    }
  }
};

export const getFareChart = async type => {
  const fare = await firestore()
    .collection('fares')
    .where('type', '==', type)
    .get();

  return fare.docs[0].data();
};

export const calculateFare = async (distance, duration, fareChart) => {
  const d = distance.toFixed();
  const t = duration.toFixed();
  const fare =
    (d * fareChart.perKm + t * fareChart.perMin + fareChart.baseFare) *
    fareChart.surge;
  return fare;
};

export const bookRide = async (pickup, dropoff, distance, duration, fare) => {
  const rideDetails = {
    pickupDetails: pickup,
    dropoffDetails: dropoff,
    distance: distance,
    duration: duration,
    fare: fare,
    status: 0,
  };

  const data = await firestore()
    .collection('bookings')
    .add({rideDetails: rideDetails});

  await firestore().collection('bookings').doc(data.id).update({bid: data.id});
  return data;
};

export const animateToRegion = async (mapRef, coordinates) => {
  const camera = await mapRef.getCamera();
  camera.zoom = 21;
  camera.center.latitude = coordinates.latitude;
  camera.center.longitude = coordinates.longitude;
  mapRef.animateCamera(camera, {duration: 4000});
};

export const zoomOut = async (mapRef, coordinates) => {
  const camera = await mapRef.getCamera();
  camera.center.latitude = coordinates.latitude;
  camera.center.longitude = coordinates.longitude;
  camera.zoom = 11;
  mapRef.animateCamera(camera, {duration: 3000});
};
