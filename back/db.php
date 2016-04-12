<?php

//$server = 'travelpins.world';
$server = 'localhost';
$db = 'travelpins';
$user = 'root';
//$pass = 'Tr4v3lp1ns!2522';
$pass = '';


function save_countries($facebook_id, $country_code, $lat = "", $lang = ""){
	global $server, $db, $user, $pass;

	$db_con = mysqli_connect($server, $user, $pass, $db);
	
	$SQL = "INSERT INTO travelpins_data (facebook_id, country_code, lat, lang)
	VALUES ('$facebook_id', '$country_code', '$lat', '$lang');";

	$res = mysqli_query($db_con, $SQL);
	mysqli_close($db_con);

	return $res;
}

function get_countries($facebook_id){
	global $server, $db, $user, $pass;

	$db_con = mysqli_connect($server, $user, $pass, $db);
	
	$SQL = "SELECT id, facebook_id, country_code, lat, lang FROM travelpins_data WHERE facebook_id = '$facebook_id' ORDER BY id;";

	$res = mysqli_query($db_con, $SQL);
	$return = mysqli_fetch_all($res,MYSQLI_ASSOC);
	
	mysqli_close($db_con);

	return $return;
}



?>