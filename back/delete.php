<?php

require_once('db.php');

$facebook_id = $_POST['facebook_id'];
$country_code = $_POST['country_code'];

$res = delete_country($facebook_id, $country_code);

echo json_encode($res);

?>