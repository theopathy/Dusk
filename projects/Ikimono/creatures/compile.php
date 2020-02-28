<?php 
$files = array();
foreach (glob("*.json") as $file) {
  $files[] = $file;
}

echo json_encode($files);
file_put_contents("fake-compile.txt",json_encode($files));