
const googleMap = googleMap || {};
const App = App || {};

googleMap.mapSetup = function(){
  let canvas = document.getElementById('map-canvas');
  let mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.515236,-0.072214),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"stylers":[{"saturation":-45},{"lightness":13}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#8fa7b3"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#667780"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#8fa7b3"},{"gamma":2}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#a3becc"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7a8f99"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#a3becc"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7a8f99"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#bbd9e9"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#525f66"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#bbd9e9"},{"gamma":2}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"color":"#a3aeb5"}]}]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.directionsService = new google.maps.DirectionsService();
  this.directionsDisplay = new google.maps.DirectionsRenderer();
  this.directionsDisplay.setMap(this.map);
  // this.calcRoute();

  this.autocomplete();
  // this.getChargers();
};

googleMap.autocomplete = function(){

  googleMap.origin      = new google.maps.places.Autocomplete(document.getElementById('origin'));
  googleMap.destination =  new google.maps.places.Autocomplete(document.getElementById('destination'));

  this.origin.bindTo('bounds', this.map);
  this.destination.bindTo('bounds', this.map);

  console.log(this.origin, this.destination);
};

googleMap.calcRoute = function() {
  if(event) event.preventDefault();

  // let marker1 = new google.maps.Marker({
  //   position: new google.maps.LatLng(googleMap.origin.getPlace()),
  //   map: googleMap.map
  // });
  //
  // let marker2 = new google.maps.Marker({
  //   position: new google.maps.LatLng(googleMap.destination.getPlace()),
  //   map: googleMap.map
  // });

  let start = new google.maps.LatLng(51.5074, 0.1278);
  let end   = new google.maps.LatLng(54.9783, 1.6178);
  let request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    googleMap.directionsService.route(request, function(response, status) {
      console.log(status)
        if (status == google.maps.DirectionsStatus.OK) {
          googleMap.directionsDisplay.setDirections(response);
        } else {
          alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
      });
};

googleMap.getChargers = function(){
  $.get("http://api.openchargemap.io/v2/poi/?output=json&countrycode=GB&maxresults=5000").done(this.loopThroughChargers.bind(this));
};

googleMap.loopThroughChargers = function(data){
  for (var i = 0; i < data.length; i++) {
    let myLatLng = {lat: data[i].AddressInfo.Latitude, lng: data[i].AddressInfo.Longitude};

    var icon = {
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

//DIRECTIONS
//
//
//
//
// function initMap() {
//     var pointA = new google.maps.LatLng(51.7519, -1.2578),
//         pointB = new google.maps.LatLng(50.8429, -0.1313),
//         myOptions = {
//             zoom: 7,
//             center: pointA
//         },
//         map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
//         // Instantiate a directions service.
//         directionsService = new google.maps.DirectionsService(),
//         directionsDisplay = new google.maps.DirectionsRenderer({
//             map: map
//         }),
//         markerA = new google.maps.Marker({
//             position: pointA,
//             title: "point A",
//             label: "A",
//             map: map
//         }),
//         markerB = new google.maps.Marker({
//             position: pointB,
//             title: "point B",
//             label: "B",
//             map: map
//         });
//
//     // get route from A to B
//     calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
//
// }
//
//
//
// function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
//
// $.ajax({
//   url: `https://maps.googleapis.com/maps/api/directions/json?origin=${pointA}&destination=${pointB}&key=AIzaSyDTR_XHfE_C0us3kuO6i_uXrHYmh-JDEsU`,
//   method:'get',
//   dataType: 'json',
// }).done((data) => { console.log(data);});
//
//     directionsService.route({
//         origin: pointA,
//         destination: pointB,
//         avoidTolls: true,
//         avoidHighways: false,
//         travelMode: google.maps.TravelMode.DRIVING
//     }, function (response, status) {
//         if (status == google.maps.DirectionsStatus.OK) {
//             directionsDisplay.setDirections(response);
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }
//
// initMap();
// GEOLOCATION
// googleMap.getCurrentLocation = function() {
//   navigator.geolocation.getCurrentPosition(function(position) {
//     let marker = new google.maps.Marker({
//       position: new google.maps.LatLng(position.coords.Latitude, position.coords.Longitude),
//       map: googleMap.map,
//       animation: google.maps.Animation.DROP,
//       icon: {
//         url: "http://furtaev.ru/preview/user_on_map_2_small.png",
//         scaledSize: new google.maps.Size(56, 56)
//       }
//     });
//
//     googleMap.map.setCenter(marker.getPosition());
//   });
// };
//


$(googleMap.mapSetup.bind(googleMap));


//  REGISTRATION AND LOGIN

App.init = function(){
  // console.log(this);


  this.apiUrl = "http://localhost:3000/api";
  this.$modal  = $(".modal");

  $(".logout").on("click", this.logout.bind(this));
  // $(".usersIndex").on("click", this.usersIndex.bind(this));
  this.$modal.on("submit", "form", this.handleForm);
  $('.calc-route').on("submit", googleMap.calcRoute);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  $(".loggedOut").hide();
  $(".loggedIn").show();
  // this.usersIndex();
};

App.loggedOutState = function(){
  $(".loggedOut").show();
  $(".loggedIn").hide();
};

App.logout = function() {
  event.preventDefault();
  this.removeToken();
  this.loggedOutState();
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
