window.fbAsyncInit = function() {
    FB.init({
      appId      : '1702480320040341',
      xfbml      : true,
      version    : 'v2.5'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
      
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1702480320040341',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };
  
  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
  	window.location="/stats.html";
  	/*
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
    });
    console.log("Fetching friends...");
    FB.api('/me/friends', function (response) {
        console.log(response);
    });*/
  }
  
var mapObj;
var continents = [];

$(document).ready(function () {
	$('#world-map').vectorMap(wrld);
	mapObj = $('#world-map').vectorMap('get', 'mapObject');
	
	$("#search").autocomplete({
		autoFocus: true,
		source:jvmCountries,
        minLength:2
 	});
});

var wrld = {
  map: 'world_mill_en',
  regionsSelectable: true,
  regionStyle: {
  	selected: {
        fill: '#EC684E'
      },
    hover : {
    	fill: '#FFCDC3',
    },
  },
  backgroundColor: '#1cb6ea',
  onRegionClick: function(e, code){
  	console.log(e);
		add_country(code);
	},
  onRegionTipShow: function(e, el, code){
    el.html(el.html());
  },
};

function add_country(code){
	var selected = mapObj.getSelectedRegions();
	var total_countries = Object.keys(jvmCountries).length;
	var total_selected = selected.length;
	var perc = Number((total_selected * 100) / total_countries).toFixed(0);
	
	if(continents.length == 0 || continents.indexOf(contis[code]) == -1){
		continents.push(contis[code]);
	}
	
	$(".percentage").html(perc + "%");
	$("#percentage_footer").html(perc +"%");
	$("#percentage_left_footer").html((100 - perc) +"%");
	$("#continent_count").html(continents.length);
	$("#country_count").html(mapObj.getSelectedRegions().length);
}