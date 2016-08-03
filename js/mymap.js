//CREATE MAP

var mapObj;
var continents = [];
var image_data;
var context;

$(document).ready(function () {
  document.querySelector("canvas").style.fill = "#1cb6ea";
	$("#search").focus();
	$('#world-map').vectorMap(wrld);
  $("svg").css("backgroundColor", "#1cb6ea");
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
	        //mapObj.setSelectedRegions(ui.item.value);
          if(!mapObj.regions[ui.item.value].element.isSelected || mapObj.regions[ui.item.value].element.isSelected == undefined){
            mapObj.setSelectedRegions(ui.item.value);
            add_country(fb_id, ui.item.value);
            
          }else if(mapObj.regions[ui.item.value].element.isSelected){
            mapObj.regions[ui.item.value].element.setSelected(false);
            remove_country(fb_id, ui.item.value);
          }
	        count();
	        check_friends();
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

    $("#fb-share-map").click(function(){

      var oSerializer = new XMLSerializer();
      
      var sXML = oSerializer.serializeToString(document.querySelector("#world-map svg"));

      $.when(canvg(document.getElementById('canvas'), sXML,{ ignoreMouse: true, ignoreAnimation: true }))
  .done(function(){
        var c = document.querySelector("canvas");
        context = c.getContext("2d");
        //create base64 data and set background color
        var imgData = canvasToImage("#1cb6ea");
        //send base64 data to server and create the png image
        save_map_image(imgData);
      });
      
    });
});

//function to create png from canvas and add background color
function canvasToImage(backgroundColor)
{
  //cache height and width    
  var w = canvas.width;
  var h = canvas.height;

  var data;   

  if(backgroundColor)
  {
    //get the current ImageData for the canvas.
    data = context.getImageData(0, 0, w, h);
    
    //store the current globalCompositeOperation
    var compositeOperation = context.globalCompositeOperation;

    //set to draw behind current content
    context.globalCompositeOperation = "destination-over";

    //set background color
    context.fillStyle = backgroundColor;

    //draw background / rect on entire canvas
    context.fillRect(0,0,w,h);
  }

  //get the image data from the canvas
  var imageData = this.canvas.toDataURL("image/png");

  if(backgroundColor)
  {
    //clear the canvas
    context.clearRect (0,0,w,h);

    //restore it with original / cached ImageData
    context.putImageData(data, 0,0);    

    //reset the globalCompositeOperation to what it was
    context.globalCompositeOperation = compositeOperation;
  }

  //return the Base64 encoded data url string
  return imageData;
}

var wrld = {
  map: 'world_mill_en',
  regionStyle: {
    initial: {
        fill: "#eeeeee",
        stroke: 'none'
      },
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
  onRegionClick: function(e, code){
		if(!mapObj.regions[code].element.isSelected || mapObj.regions[code].element.isSelected == undefined){
			mapObj.setSelectedRegions(code);
			add_country(fb_id, code);
			
		}else if(mapObj.regions[code].element.isSelected){
			mapObj.regions[code].element.setSelected(false);
			remove_country(fb_id, code);
		}
		check_friends();
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
	      //$(".login").html(response.name + ' - <a href="javascript:logout()">log out</a>');
        $(".login").html(response.name);
	      fb_name = response.name;
	    });
	    if(getParameterByName('logged')){
	    	get_session();
	    }else{
	    	get_countries();
	    }
    	
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
  	
  	$("#friends_ranking").block({message:"Loading Friends List..."});
  	$("#friends_ranking").empty();
  	$("#friends_ranking").html("Loading Friends Ranking...");
  	friends_list = [];
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
			
			//sort friends
        	friends_list = friends_list.sort(function(a, b) { return b.percentage - a.percentage; } );
        	$("#friends_ranking").empty();
        	$(document).ready(function(){
        		var all_users = "";
	        	$.each(friends_list, function(i, item){
	        		var user_type = "user-box";
	        		if(item.id == fb_id){
	        			user_type = 'user-box-current';
	        		}
	        		user_div = "<div class='"+ user_type +"'>";
	        		user_div +="<div class='user-position'>" + parseInt(i+1) + "</div>";
	        		user_div +="<img width='50' height='50' src='"+ item.picture +"'>" + item.name;
	        		user_div += "<div class='user-percentage'>" + item.percentage + "%</div></div>";
	        		all_users += user_div;
	        	});
	        	$("#friends_ranking").append(all_users);
        	});
        	
        }
    });
    $("#friends_ranking").unblock();
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
		url:'back/save.php',
		type: 'POST',
		data: {'facebook_id': fb_id, 'name' : fb_name, 'country_code': code},
	});
}

function save_map_image(data){
	$.blockUI({message: "Generating Map..."});
	$.ajax({
		async: false,
		url:'back/save_image.php',
		type: 'POST',
		data: {'facebook_id': fb_id, 'data' : data},
		success: function(response){
			share_map_fb(response);
		}
	});
	$.unblockUI();
}

function share_map_fb(data){
	console.log(data);
	FB.ui({
		        method: 'share',
		        href: 'https://travelpins.world/',
		        picture: 'https://travelpins.world' + data.image_url,
		        //caption: fb_name + " has seen " + $("#percentage_footer").html() + " of the world.",
		        description: fb_name + " has seen " + $("#percentage_footer").html() + " of the world. How much have you?",
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
function dynamicSort(objArray, prop, direction) {
    friends_list = friends_list.sort(function(a, b) {
        return (a['percentage'] > b['percentage']) ? 1 : ((a['percentage'] < b['percentage']) ? -1 : 0);
    });
}


function getParameterByName(name) {
	var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function get_session(){
	$.ajax({
		url:'back/getsession.php',
		type: 'POST',
		data:{'facebook_id':fb_id, 'name' : fb_name},
		success: function(data){
			mapObj.setSelectedRegions($.map(data, function(codes) { return codes.country_code; }));
			count();
		}
	});
}
