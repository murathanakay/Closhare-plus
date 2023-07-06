<?php

/**
 * 
 * app
 * @package      Closhare+plus app
 * @copyright    2015
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: app.php UTF-8 , 11-Mar-2015 | 23:02:02 nwdo ε
 */

$user_dir = get("user_dir");

$userInfo = $user->getUserInfoDir($user_dir, "id");

$user_full_path = UPLOAD_PATH . $user_dir;

$Qitem = mb_str_replace("/" . $user_dir . "/", "", $_SERVER['REQUEST_URI']);



if (strpos($Qitem, "/") !== false) {
    $QitemParts = explode("/", $Qitem);
} else {
    $QitemParts = array(
        $user_dir, $Qitem
    );
}

if (!isset($QitemParts[0]) || (!is_dir(UPLOAD_PATH . $user_dir))) {
    echo $content->errorPages(404);
}
if (($QitemParts[0] != $user_dir)) {
    $real_file_dir = (($QitemParts[0] == $user_dir) ? "" : ($QitemParts[0] . '/'));
    $dirInfo = $fhand->getFolderInfoDB(false, $userInfo['id'], $QitemParts[0]);
} else {
    $dirInfo = array(
        "folder_id" => 1
    );
}

$QfileParts = isset($QitemParts[2]) ? $QitemParts[2] : $QitemParts[1];

if ((strpos($QfileParts, "?") !== false)) {
    $temp = explode("?", $QfileParts);

    $QfileParts = $temp[0];
}

//get file key and real extension only from its name;
$ext = @pathinfo($QfileParts, PATHINFO_EXTENSION);
$fileKey = basename($QfileParts, "." . $ext); // $file is set to "home"
//Now we have user_dir (unique) , image key ( md5_file ) and directory hash of file
//get image info from DB;
$fileInfo = $fhand->getFileInfoOnFly($userInfo['id'], $fileKey, false/*$dirInfo['folder_id']*/);

$filePath = rtrim($fileInfo['file_path'], "/");

//create file full path to read it;
$file_full_path = $user_full_path . $filePath . '/' . $fileInfo['full_name'];
$mime = $fhand->getMimeType($file_full_path, $fileInfo["file_extension"]);



$file_base = rtrim($user_dir, "/") . '/' . ltrim($fileInfo['file_path'], "/");

$fileDownloadUrl = (CLO_URL . "/files/" . $file_base . "/" . $fileInfo['full_name']) . "&embedded=true&hl=en"; //CLO_URL . '/?octet=download&file=' .$fileInfo['full_name'] . '&store='.$encryption->encode(( rtrim($file_base, "/")."/")).'&uid='.$encryption->encode($userInfo["id"])."&embedded=true&hl=en"; 

$viewerConfigPath = dirname(__FILE__) . DS . $fileInfo["file_extension"] . DS . "config.php";
$viewerHelperPath = dirname(__FILE__) . DS . $fileInfo["file_extension"] . DS . "file.php";

if (file_exists($viewerConfigPath)) {

    require_once $viewerConfigPath;
}
