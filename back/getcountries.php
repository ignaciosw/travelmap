<?php

require_once('db.php');

$facebook_id = (isset($_POST['facebook_id']) ? $_POST['facebook_id'] : '');

$res = get_countries($facebook_id);

echo json_encode($res);


?>