<?php
session_start();

$_SESSION[session_id()]['selectedRegions'] = $_POST['selectedRegions'];

echo $_SESSION[session_id()]['selectedRegions'];

?>