<?php
require_once("db.config.php");


function save_countries($facebook_id, $name, $country_code, $lat = "", $lang = ""){
	global $server, $db, $user, $pass;

	$db_con = mysqli_connect($server, $user, $pass, $db);
	
	$SQL = "INSERT INTO travelpins_data (facebook_id, name, country_code, lat, lang)
	VALUES ('$facebook_id', '$name', '$country_code', '$lat', '$lang');";

	$res = mysqli_query($db_con, $SQL);
	mysqli_close($db_con);

	return $res;
}

function get_countries($facebook_id){
	global $server, $db, $user, $pass;

	$db_con = mysqli_connect($server, $user, $pass, $db);
	
	$SQL = "SELECT country_code FROM travelpins_data WHERE facebook_id = '$facebook_id';";

	$res = mysqli_query($db_con, $SQL);
	$return = mysqli_fetch_all($res,MYSQLI_ASSOC);
	
	mysqli_close($db_con);

	return $return;
}

function delete_country($facebook_id, $country_code){
	global $server, $db, $user, $pass;

	$db_con = mysqli_connect($server, $user, $pass, $db);
	
	$SQL = "DELETE FROM travelpins_data WHERE facebook_id = '$facebook_id' AND country_code = '$country_code';";

	$return = mysqli_query($db_con, $SQL);
	
	mysqli_close($db_con);

	return $return;
}

?>