<?php
header('Content-Type: application/json');
$facebook_id = $_POST['facebook_id'];
$data = $_POST['data'];
$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data));

if(!is_dir('../images/user_maps/' . date("Y") ."/". date("m"))){
	mkdir('../images/user_maps/' . date("Y") ."/". date("m"), 0755, true);
}

$filename = '/images/user_maps/' . date("Y") ."/". date("m") ."/". $facebook_id . "_". hash("md5", $data) .".png";

if (file_put_contents("..".$filename, $data)){
	echo json_encode(array("status"=>"OK","image_url"=>$filename));
}else{
	echo json_encode(array("status"=>"NO"));
}
	


?>