//CREATE MAP

var mapObj;
var continents = [];

$(document).ready(function () {
	$("#search").focus();
	$('#world-map').vectorMap(wrld);
	mapObj = $('#world-map').vectorMap('get', 'mapObject');
	
	$("#search").autocomplete({
		source: function (request, response) {
            var re = $.ui.autocomplete.escapeRegex(request.term);
            var matcher = new RegExp("^" + re, "i");
            response($.grep(($.map(jvmCountries, function (v, i) {
                return {
                    label: v.name,
                    value: i
                };
            })), function (item) {
                return matcher.test(item.label);
            }));

        },
        select: function(event, ui) {
	        mapObj.setSelectedRegions(ui.item.value);
	        count();
	        $(this).val(''); return false;
        },
        focus: function (event, ui) {
			this.value = ui.item.label;
			event.preventDefault(); // Prevent the default focus behavior.
		},
        minLength:1,
        
 	}).data( "uiAutocomplete" )._renderItem = function( ul, item ) {
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( item.label )
            .appendTo( ul );
    };
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
    	"fill-opacity": 1,
    },
    selectedHover: {
    	fill: '#FFCDC3',
  	}
  },
  backgroundColor: '#1cb6ea',
  onRegionSelected: function(e, code){
		log_session();
	},
  onRegionTipShow: function(e, el, code){
    el.html(el.html());
  },
};

//FACEBOOK


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
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      window.location="/mymap.html";
      
    } 
    /*else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      $(".login").html('Please log ' +
        'into this app.');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      $(".login").html('Please log ' +
        'into Facebook.');
    }*/
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected'){
      	window.location = "/mymap.html?logged=1";
      }
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

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };
  


function count(){
	//change values in page
	continents = [];
	var selected = mapObj.getSelectedRegions();
	var total_countries = Object.keys(jvmCountries).length;
	var total_selected = selected.length;
	var perc = Number((total_selected * 100) / total_countries).toFixed(0);
	
	for(i=0;i< selected.length; i++){
		if(continents.length == 0 || continents.indexOf(contis[selected[i]]) == -1){
			continents.push(contis[selected[i]]);
		}	
	}
	
	
	$(".percentage").html(perc + "%");
	$("#percentage_footer").html(perc +"%");
	$("#percentage_left_footer").html((100 - perc) +"%");
	$("#continent_count").html(continents.length);
	$("#country_count").html(mapObj.getSelectedRegions().length);	
}

function add_country(fb_id, code){
	//save to db
	save_country(fb_id, fb_name, code);
	count();
}

function remove_country(fb_id, code){
	//save to db
	delete_country(fb_id, code);
	count();
}

function save_country(fb_id, fb_name, code){
	$.ajax({
		async: true,
		url:'back/save.php',
		type: 'POST',
		data: {'facebook_id': fb_id, 'name' : fb_name, 'country_code': code},
	});
}

function log_session(){
	$.ajax({
		async: true,
		url:'back/session.php',
		type: 'POST',
		data: {'selectedRegions' : JSON.stringify(mapObj.getSelectedRegions())},
	});
	count();
}


//FUNCTIONS
