
const googleMap = googleMap || {};
const App = App || {};

googleMap.mapSetup = function(){
  let canvas = document.getElementById('map-canvas');
  let mapOptions = {
    zoom: 6,
    center: new google.maps.LatLng(54.622192, -4.621823),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"stylers":[{"saturation":-45},{"lightness":13}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#8fa7b3"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#667780"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#8fa7b3"},{"gamma":2}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#a3becc"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7a8f99"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#a3becc"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7a8f99"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#bbd9e9"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#525f66"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#bbd9e9"},{"gamma":2}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"color":"#a3aeb5"}]}]
  };

  this.map = new google.maps.Map(canvas, mapOptions);
  this.directionsService = new google.maps.DirectionsService();
  this.directionsDisplay = new google.maps.DirectionsRenderer();
  this.directionsDisplay.setMap(this.map);

  this.autocomplete();
  // this.getChargers();
};

googleMap.autocomplete = function(){
  googleMap.origin      = new google.maps.places.Autocomplete(document.getElementById('origin'));
  googleMap.destination =  new google.maps.places.Autocomplete(document.getElementById('destination'));

  this.origin.bindTo('bounds', this.map);
  this.destination.bindTo('bounds', this.map);

  this.origin.addListener('place_changed', () => {
    this.place = googleMap.origin.getPlace();
    this.originPlace = this.place.place_id;
  });

  this.destination.addListener('place_changed', () => {
    let place = googleMap.destination.getPlace();
    this.destinationPlace = place.place_id;
  });
};


googleMap.calcRoute = function() {
  if(event) event.preventDefault();

  App.toggle();

  googleMap.map.setCenter(googleMap.place.geometry.location);
  googleMap.map.setZoom(13);

  googleMap.directionsService.route({
    origin: {'placeId': googleMap.originPlace},
    destination: {'placeId': googleMap.destinationPlace},
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === 'OK') {
      googleMap.directionsDisplay.setOptions({ preserveViewport: true });
      googleMap.directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};

googleMap.getChargers = function(){
  $.get("http://api.openchargemap.io/v2/poi/?output=json&countrycode=GB&maxresults=500").done(this.loopThroughChargers.bind(this));
};

googleMap.loopThroughChargers = function(data){
  for (var i = 0; i < data.length; i++) {
    let myLatLng = {lat: data[i].AddressInfo.Latitude, lng: data[i].AddressInfo.Longitude};

    let icon = {
      url: "/images/ohm-icon.png", // url
      scaledSize: new google.maps.Size(25, 35), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    let marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      icon
    });
  }
};

$(googleMap.mapSetup.bind(googleMap));


// GEOLOCATION
googleMap.currentLocation = function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map: googleMap.map,
      animation: google.maps.Animation.DROP,
    });

    googleMap.map.setCenter(marker.getPosition());
  });
};


//  REGISTRATION AND LOGIN
App.init = function(){

  this.apiUrl = "http://localhost:3000/api";
  this.$modal  = $(".modal");

  $(".logout").on("click", this.logout.bind(this));
  $(".route").on("click", this.toggle);
  this.$modal.on("submit", "form", this.handleForm);
  $('.form-inline').on("submit", googleMap.calcRoute);
  $('.findMe').on('click', this.currentLocation);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.toggle = function() {
  $('.form-inline').slideToggle();
};

App.loggedInState = function(){
  $(".loggedOut").hide();
  $(".loggedIn").show();
  // this.usersIndex();
};

App.loggedOutState = function(){
  $(".loggedOut").show();
  $(".loggedIn").hide();
  $(".form-inline").hide();
};

App.logout = function() {
  event.preventDefault();
  this.removeToken();
  this.loggedOutState();
  $(location).attr('href', 'http://localhost:3000');

};

App.handleForm = function(){
  event.preventDefault();

  let url    = `${App.apiUrl}${$(this).attr("action")}`;
  let method = $(this).attr("method");
  let data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, (data) => {
    if (data.token) App.setToken(data.token);
    $(this).parents(".modal").modal("hide");
    App.loggedInState();
  });
};

App.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

App.setRequestHeader = function(xhr, settings) {
  return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
};

App.setToken = function(token){
  return window.localStorage.setItem("token", token);
};

App.getToken = function(){
  return window.localStorage.getItem("token");
};

App.removeToken = function(){
  return window.localStorage.clear();
};

$(App.init.bind(App));

$().button('toggle');
