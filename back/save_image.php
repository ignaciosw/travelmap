<?php

error_reporting(-1);
header('Content-Type: application/json');
$facebook_id = $_POST['facebook_id'];
$post_data = $_POST['data'];
$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $post_data));

if(!is_dir('../images/user_maps/' . date("Y") ."/". date("m") . "/" . date("d"))){
	mkdir('../images/user_maps/' . date("Y") ."/". date("m") . "/" . date("d"), 0755, true);
}

$filename = '/images/user_maps/' . date("Y") ."/". date("m") . "/" . date("d") ."/". $facebook_id . "_". hash("md5", $data) .".png";
$fb_filename = '/images/user_maps/' . date("Y") ."/". date("m") . "/" . date("d") . "/new_". $facebook_id . "_". hash("md5", $data) .".png";

if (file_put_contents("..".$filename, $data)){
	$image_size = getimagesize("..".$filename, $data);

	echo json_encode(array(
		"status"=>"OK",
		"image_url"=>$filename,
		"width" => $image_size[0],
		"height" => $image_size[1],
		));
}else{
	echo json_encode(array("status"=>"NO"));
}
	


?>