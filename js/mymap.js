//CREATE MAP

var mapObj;
var continents = [];

$(document).ready(function () {
	$('#world-map').vectorMap(wrld);
	mapObj = $('#world-map').vectorMap('get', 'mapObject');
	
	var countries_arr = Object.keys(jvmCountries).map(function(k) { return jvmCountries[k]; });
	//console.log(countries_arr);
	
	$("#search").autocomplete({
		source: jvmCountries,
        minLength:2
        
 	});
});


var wrld = {
  map: 'world_mill_en',
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
		if(!mapObj.regions[code].element.isSelected || mapObj.regions[code].element.isSelected == undefined){
			mapObj.setSelectedRegions(code);
			add_country(fb_id, code);
			
		}else if(mapObj.regions[code].element.isSelected){
			mapObj.regions[code].element.setSelected(false);
			remove_country(fb_id, code);
		}
	},
  onRegionTipShow: function(e, el, code){
    el.html(el.html());
  },
};




//FACEBOOK
var fb_id = "";
var fb_name = "";
var friends = {};
var friends_list = [];

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
    	fb_id = response.authResponse.userID;
    	FB.api('/me', function(response) {
	      $(".login").html(response.name + ' - <a href="javascript:logout()">log out</a>');
	      fb_name = response.name;
	    });
    	get_countries();
    	check_friends();
      // Logged into your app and Facebook.
      
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      window.location = "https://travelpins.world";
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      window.location = "https://travelpins.world";
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

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };
  
  function check_friends(){
  	FB.api('/me/friends', function (response) {
        if(response.data.length == 0){
        	$("#friends_ranking").html("None of your friends have used this app yet! Share it!");
        }else{        	
        	friends = response.data;
        	for(var i=0; i < friends.length ; i++){
        		friends_list.push({
        			id: friends[i].id,
        			name: friends[i].name,
        			picture: '//graph.facebook.com/'+friends[i].id+'/picture?type=small',
        			percentage: get_friend_percentage(friends[i].id),
        		});
        	}
        	friends_list.push({
        		id: fb_id,
        		name: fb_name,
        		picture: '//graph.facebook.com/'+fb_id+'/picture?type=small',
        		percentage: get_my_percentage()
        	});

        	
        	friends_list = friends_list.sort(dynamicSort("percentage"));
        	
        	$(document).ready(function(){
        		var all_users = "";
	        	$.each(friends_list, function(i, item){
	        		var user_div = document.createElement("div");
	        		var position_div = document.createElement("div");
	        		var img_element = document.createElement("img");
	        		var user_type = "user-box";
	        		if(item.id == fb_id){
	        			user_type = 'user-box-current';
	        		}
	        		user_div = "<div class='"+ user_type +"'><div class='user-position'>" + parseInt(i+1) + "</div><img src='"+ item.picture +"'>" + item.name + "<div class='user-percentage'>" + item.percentage + "%</div></div>";
	        		all_users += user_div;
	        	});
	        	$("#friends_ranking").append(all_users);
        	});
        	
        }
    });
  }
  
  function logout(){
  	FB.logout(function(response) {  
  		statusChangeCallback(response);		
	});
	
  }
  
//END FACEBOOK
  
  
//DATABASE WORK

function get_friend_percentage(friend_fb_id){
	var perc;
	$.ajax({
		url:'back/getcountries.php',
		async: false,
		type: 'POST',
		data:{'facebook_id':friend_fb_id},
		success: function(data){
			var selected = $.map(data, function(codes) { return codes.country_code; });
			var total_countries = Object.keys(jvmCountries).length;
			var total_selected = selected.length;
			perc = Number((total_selected * 100) / total_countries).toFixed(0);
		}
	});
	return perc;
}

function get_my_percentage(){
	var selected = mapObj.getSelectedRegions();
	var total_countries = Object.keys(jvmCountries).length;
	var total_selected = selected.length;
	var perc = Number((total_selected * 100) / total_countries).toFixed(0);
	return perc;
}

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

function delete_country(fb_id, code){
	$.ajax({
		async: true,
		url:'back/delete.php',
		type: 'POST',
		data: {'facebook_id': fb_id, 'country_code': code},
	});
}

function get_countries(){
	$.ajax({
		url:'back/getcountries.php',
		type: 'POST',
		data:{'facebook_id':fb_id},
		success: function(data){
			mapObj.setSelectedRegions($.map(data, function(codes) { return codes.country_code; }));
			count();
		}
	});
}

//END DATABASE

//FUNCTIONS
function dynamicSort(property) {
    var sortOrder = -1;
    if(property[0] === "-") {
        sortOrder = 1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}