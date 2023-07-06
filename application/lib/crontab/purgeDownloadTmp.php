<?php

if (defined("UPLOAD_PATH")) {
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');
    $manual = true;
}else{
    $manual = false;
}

$ROOT_PATH 
        = str_replace("application".DIRECTORY_SEPARATOR."lib". DIRECTORY_SEPARATOR ."crontab". DIRECTORY_SEPARATOR . "purgeDownloadTmp.php", "", realpath(__FILE__));
try {
    
    $files = glob($ROOT_PATH . 'files'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR.'*'); // get all file names

    foreach ($files as $file) { // iterate files
        $basename = basename($file);
        if (is_file($file) && $basename != "index.php" && $basename != ".htaccess")
            unlink($file); // delete file
    }
    
    $log = "Last crontab run on ". date("Y-m-d H:s:i").($manual ? " manually" : " automatically").".";

    echo json_encode(array(
        "result" => 1,
        "message" => array(
            "title" => "Success!",
            "txt" => "Temp folder purged successfuly."
        )
    ));
} catch (Exception $exc) {
    echo json_encode(array(
        "result" => 0,
        "message" => array(
            "title" => "Error!",
            "txt" => $exc->getTraceAsString()
        )
    ));
    
    $log = "Last crontab run on ". date("Y-m-d H:s:i")." with ERROR: ".$exc->getTraceAsString().($manual ? " manually" : " automatically").".";
}

file_put_contents($ROOT_PATH . 'files'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR.'purged_log-'.time().'.txt', $log);