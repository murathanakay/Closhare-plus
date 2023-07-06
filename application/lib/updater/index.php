<?php

/**
 * index
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: index.php UTF-8 , 05-Oct-2014 | 23:02:46 nwdo ε
 */

define("_SECURE_PHP", true);
require_once '../config.ini.php';

@apache_setenv('no-gzip', 1);
@ini_set('zlib.output_compression', 0);
@ini_set('implicit_flush', 1);
date_default_timezone_set("UTC");

for ($i = 0; $i < ob_get_level(); $i++) {
    ob_end_flush();
}
ob_implicit_flush(1);

$updateKeyFile = LIB_PATH . 'updater' . DS . '.updatekey';

if (!file_exists($updateKeyFile)) {
    print "unable to read .updatekey file! <br>File does not exist! $updateKeyFile";
} else {
    $updateKey = file_get_contents($updateKeyFile);
}

require_once('class.update.php');

$update = new AutoUpdate(true);

print '<html>';
print '<head>';
print '<script type="text/javascript">
<!--
pageScroll();
function pageScroll() {
window.scrollBy(0,20);
scrolldelay = setTimeout("pageScroll()",100); // scrolls every 100 milliseconds
}
function myStopFunction() {
window.scrollBy(0,100);
clearTimeout(scrolldelay);
}
//-->
</script>';
//bootstrap & default css
print '<link rel="stylesheet" href="/assets/css/base.css">'
    . '<link rel="stylesheet" href="/assets/css/default.css">'
    . '<link rel="stylesheet" href="/assets/css/font-awesome.css">';
print '<style type="text/css">'
    .
    'body {
    min-height: 100%;
    font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
    background-color: #f5f5f5;
    color: #333333 !important;
    display: block;
    font-size: 13px;
    padding:10px;
    line-height: 1.4
}
</style>';

print '</head>';

print '<body onload="myStopFunction()">';

print(str_repeat(" ", 1024) . "\n");

$update->currentVersion = $updateKey; //Must be an integer - you can't compare strings

//$update->updateUrl = 'http://static.closhare.net/update_server'; //Replace with your server update directory


//Check for a new update
$latest = $update->checkUpdate();

if ($latest !== false) {
    if ($latest > $update->currentVersion) {
        //Install new update
        echo "New version found: " . $update->latestVersionName . "<br>";
        usleep(700000);
        echo "Installing Update...<br>";
        usleep(700000);
        if ($update->update()) {
            echo '<strong class="text-success"><i class="icon icon-check"></i> Update successful!</strong>';
        } else {
            echo '<strong class="text-danger"><i class="icon icon-times"></i> Update failed!</strong><br>'
                . 'Please check the log file for more information.<br><code>' . LIB_PATH . 'uploader' . DS . '.updatelog</code>.';
        }
    } else {
        echo '<strong class="text-info"><i class="icon icon-check"></i> Current version of Closhare+plus(v' . $update->latestVersionName . ') is up to date!</strong>';
    }
} else {
    echo $update->getLastError();
}

print '</body>';
print '</html>';
