<?php

/**
 * index
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: index.php UTF-8 , 24-Oct-2013 | 00:55:15 nwdo ε / created automatically.
 */
define("_SECURE_PHP", true);

use Nedo\Image\Image;

?>
<?php

include_once '../../../../init.php';

if (!get("get"))
    echo $content->errorPages(404);

$currentDir = __DIR__;

$path = $currentDir . DS . get("get");

if ($fhand->checkFile($path)) {
    $file_time = filemtime($path);

    header('Cache-Control: must-revalidate');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $file_time) . ' GMT');
    header("Content-Type: image/png");

    if (function_exists("apache_request_headers")) {

        $headers = apache_request_headers();

        if ((isset($headers['If-Modified-Since']) && (strtotime($headers['If-Modified-Since']) == $file_time)) /* && !isset($sizeCode) */) {

            header('HTTP/1.1 304 Not Modified');
            header("Content-Type: image/png");
            header('Connection: close');
        } else {

            header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));

            $data = Image::open($path)
                ->get();
        }
    } else {

        $data = Image::open($path)
            ->get();
    }
} else {
    //unknown type
    $data = Image::open($currentDir . DS . "unknown.png")
        ->get();
}

echo $data;
?>