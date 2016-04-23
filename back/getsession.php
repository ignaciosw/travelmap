<?php
header('Content-Type: application/json');

require_once('db.php');

$facebook_id = $_POST['facebook_id'];
$name = $_POST['name'];

$res = get_countries($_POST['facebook_id']);

if (count($res)==0){
	$sess = json_decode($_SESSION[session_id()]['selectedRegions']);
	$return = "";
	for($i=0;$i < count($sess);$i++){
		save_countries($facebook_id, $name, $sess[$i]);
	}
	echo json_encode(get_countries($_POST['facebook_id']));
}else{
	echo json_encode($res);
}

?>