<?php

require_once('db.php');

$facebook_id = "";

if(isset($_POST['facebook_id'])){
	$facebook_id = $_POST['facebook_id'];
}

$res = get_countries($facebook_id);

header('Content-Type: application/json');
echo json_encode($res);


?>