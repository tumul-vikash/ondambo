export const searchPlace = query => {
  return fetch(
    `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=AIzaSyD2oyUBA8L7BKlnDFYbNQGTGG1i5UZnHGI&input=${query}`,
  )
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    });
};

export const getPlaceDetails = place_id => {
  return fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_address,geometry,name&key=AIzaSyD2oyUBA8L7BKlnDFYbNQGTGG1i5UZnHGI`,
  )
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    });
};
