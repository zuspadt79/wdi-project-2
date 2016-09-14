
const googleMap = googleMap || {};
const App = App || {};

googleMap.mapSetup = function(){
  let canvas = document.getElementById('map-canvas');
  let mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.515236,-0.072214),
    mapTypeId: google.maps.MapTypeId.ROADMAP

  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getChargers();
};

googleMap.getChargers = function(){
  $.get("http://api.openchargemap.io/v2/poi/?output=json&countrycode=GB&maxresults=500").done(this.loopThroughChargers.bind(this));
};

googleMap.loopThroughChargers = function(data){
  for (var i = 0; i < data.length; i++) {
  let myLatLng = {lat: data[i].AddressInfo.Latitude, lng: data[i].AddressInfo.Longitude};

     let marker = new google.maps.Marker({
       position: myLatLng,
       map: this.map,
     });
  }
};

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
  this.apiUrl = "http://localhost:3000/api";
  this.$main  = $("main");

  $(".register").on("click", this.register.bind(this));
  $(".login").on("click", this.login.bind(this));
  $(".logout").on("click", this.logout.bind(this));
  $(".usersIndex").on("click", this.usersIndex.bind(this));
  this.$main.on("submit", "form", this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  $(".loggedOut").hide();
  $(".loggedIn").show();
  this.usersIndex();
};

App.loggedOutState = function(){
  $(".loggedOut").show();
  $(".loggedIn").hide();
  this.register();
};

App.register = function() {
  if (event) event.preventDefault();
  this.$index.html(`
    <h2>Register</h2>
    <form method="post" action="/register">
      <div class="form-group">
        <input class="form-control" type="text" name="user[username]" placeholder="Username">
      </div>
      <div class="form-group">
        <input class="form-control" type="email" name="user[email]" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[password]" placeholder="Password">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
      </div>
      <input class="btn btn-primary" type="submit" value="Register">
    </form>
  `);
};

App.login = function() {
  event.preventDefault();
  this.$index.html(`
    <h2>Login</h2>
    <form method="post" action="/login">
      <div class="form-group">
        <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
    </form>
  `);
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
