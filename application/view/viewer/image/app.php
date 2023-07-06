<?php

/**
 * Create/return Images with or without cache
 * Image
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: Image.php UTF-8 , 02-May-2013 | 01:54:52 nwdo ε
 */

use Nedo\Image\Image;
use Nedo\Cache\Cache;
use Nedo\Bmp\Bmp;
use Nedo\Psd\Psd;

$typeArr = array(
    "small" => array(
        "dir" => "thumbnail",
        "width" => $core->upload_thumb_w,
        "height" => $core->upload_thumb_h
    ),
    "large" => array(
        "dir" => "view",
        "width" => 800,
        "height" => 600
    )
);

$sizes = array(
    "t" => array(
        "width"  => 100,
        "height" => 100,
        "fn" => "zoomCrop"
    ),
    "q"  => array(
        "width"  => 150,
        "height" => 150,
        "fn" => "zoomCrop"
    ),
    "s"  => array(
        "width"  => 75,
        "height" => 75,
        "fn" => "zoomCrop"
    ),
    "m"  => array(
        "width"  => 240,
        "height" => null,
        "fn" => "scaleResize"
    ),
    "n"  => array(
        "width"  => 320,
        "height" => 320,
        "fn" => "cropResize"
    ),
    "z"  => array(
        "width"  => 640,
        "height" => 640,
        "fn" => "cropResize"
    ),
    "b"  => array(
        "width"  => 1024,
        "height" => 1024,
        "fn" => "cropResize"
    ),
    "h"  => array(
        "width"  => 1600,
        "height" => null,
        "fn" => "cropResize"
    )
);

$typeArr["default"] = $typeArr["small"];

$type = null; //thumb or view type of an image file

$user_dir = get("user_dir");

$userInfo = $user->getUserInfoDir($user_dir, "id");

$user_full_path = UPLOAD_PATH . $user_dir;

$pure_requested_url = "/" . ltrim(mb_str_replace(CLO_URL, "", $core->current_page_url(true)), "/");

$Qitem = mb_str_replace("/" . $user_dir . "/", "", $pure_requested_url);


if (strpos($Qitem, "/") !== false) {
    $QitemParts = explode("/", $Qitem);
} else {
    $QitemParts = array(
        $user_dir, $Qitem
    );
}
//check directory!!!
if (!isset($QitemParts[0]) || (!is_dir(UPLOAD_PATH . $user_dir))) {
    echo $content->errorPages(404);
}
if (($QitemParts[0] != $user_dir)) {
    $real_image_dir = (($QitemParts[0] == $user_dir) ? "" : ($QitemParts[0] . '/'));
    $dirInfo = $fhand->getFolderInfoDB(false, $userInfo['id'], $QitemParts[0]);
} else {
    $dirInfo = array(
        "folder_id" => 1
    );
}
$QimageParts = explode(":", (isset($QitemParts[2]) ? $QitemParts[2] : $QitemParts[1]));


//if ((strpos($QitemParts[1], ":") !== false)){
//    $QimageParts = explode(":", $QitemParts[1]);
//}else{    
//    $QimageParts[1] = "small";
//}

//check if image name contains any - minus or underscore ,if so image must be created on the fly with the predefined sizes
if ((strpos($QimageParts[0], "_") !== false)) {
    //explode -
    $temp2 = explode("_", $QimageParts[0]);

    //get extensions of image
    $parts = explode('.', $temp2[1]);
    $ext = strtolower($parts[count($parts) - 1]);

    $sizeCode = substr($temp2[1], 0, ((strlen($ext) + 1) * -1));

    $QimageParts[0] = $temp2[0] . '.' . $ext;
}

if ((strpos($QimageParts[0], "?") !== false)) {
    $temp = explode("?", $QimageParts[0]);

    $QimageParts[0] = $temp[0];
}

//get image key and real extension only from its name;
$imageKey = substr($QimageParts[0], 0, -4); //image view types has only 3 extension types jpg,png,gif
//Now we have user_dir (unique) , image key ( md5_file ) and directory hash of image (real image file)(unique)
//get image info from DB;
$imageInfo = $fhand->getFileInfoOnFly($userInfo['id'], $imageKey, false/*$dirInfo['folder_id']*/);

$itemParts = @explode(":", $Qitem);

$type = isset($QimageParts[1]) ? (array_key_exists($QimageParts[1], $typeArr) ? $QimageParts[1] : "small") : "small"; //thumb or view type of an image file

$imagDir = $typeArr[$type]["dir"];

$imagPath = rtrim($imageInfo['file_path'], "/");

//create image full path to read it;
$image_full_path = $user_full_path . $imagPath . DS . $imageInfo['full_name'];


if (file_exists($image_full_path)) {
    //    var_dump($image_full_path);
    $file_time = filemtime($image_full_path);
} else {
    $file_time = filemtime($user_full_path . DS . $imagDir . DS . $imageKey . '.jpg');
}
header('Cache-Control: must-revalidate');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $file_time) . ' GMT');

$extension = strtolower(pathinfo($image_full_path, PATHINFO_EXTENSION));
$headImg = array('jpg', 'png', 'gif', 'jpeg');

$imghead = 'jpeg';

if ($extension == 'jpg' || $extension == 'bmp' || $extension == 'psd') {
    $imghead = 'jpeg';
} else {
    $imghead = $extension;
}

$headers = function_exists("apache_request_headers") ? apache_request_headers() : null;

if ($headers !== null && ((isset($headers['If-Modified-Since']) && (strtotime($headers['If-Modified-Since']) == $file_time))) /* && !isset($sizeCode)*/) {

    header('HTTP/1.1 304 Not Modified');
    header("Content-Type: image/" . $imghead);
    header('Connection: close');
} else {

    header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));
    header("Content-Type: image/" . $imghead);

    if (isset($sizeCode)) {
        //    var_dump($image_full_path);

        $data = Image::open($image_full_path)
            ->{$sizes[$sizeCode]["fn"]}($sizes[$sizeCode]["width"], $sizes[$sizeCode]["height"])
            ->get();
    } else {
        $cache = new Cache;
        $cache->setCacheDirectory($user_full_path . DS . $imagDir); // This is the default

        $data = $cache->getOrCreate($QimageParts[0], array(), function ($image) {
            global $core, $user_full_path, $image_full_path, $imageKey, $image, $imagDir, $type, $typeArr;

            $image = Image::open($image_full_path)
                ->setCacheDir($user_full_path . DS . $imagDir)
                ->setPrettyName($imageKey, false);

            if ($core->upload_thumb_crop) {
                $image->cropResize($typeArr[$type]["width"], $typeArr[$type]["height"]);
            } else {
                $image->scaleResize($typeArr[$type]["width"], $typeArr[$type]["height"]);
            }

            return $image->get();
        });
    }
    echo $data;
}
