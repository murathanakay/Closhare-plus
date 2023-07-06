<?php

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

@apache_setenv('no-gzip', 1);
@ini_set('zlib.output_compression', 0);
@ini_set('implicit_flush', 1);
date_default_timezone_set("UTC");

for ($i = 0; $i < ob_get_level(); $i++) {
    ob_end_flush();
}
ob_implicit_flush(1);

$file = @fopen($file_full_path, "r");

echo '<div class="frame_container col-xs-12 col-md-10 mlrauto">';

if(get("load") >= $ViewerConfig->fileSize-1){
    while (!feof($file)) {
        $fget .= (@fread($file, 1024 * 512));
        ob_flush();
        flush();
    }
}else{

if (get("load") && $ViewerConfig->loadMore) {
    
    $fget = @fread($file, get("load")+512*1024 );

} else {
    
    $fget = @fread($file, 512*1024);
}
}
$loaded = @ftell($file);
fclose($file);

ob_flush();
flush();

//file content
echo '<pre class="syntax">'. htmlspecialchars($fget).'</pre>';

if ($ViewerConfig->fileSize > $loaded) {
    echo '<br>...';
    
    echo '<div class="viewMore">Viewing first '.$fhand->formatBytes($loaded).'KB of file. '
            . 'Load '
            . '<a href="' . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) . '?load='.$loaded.'">' . $fhand->formatBytes($loaded+8*1024, 2, true) . '</a>'
            . ' or '
            . '<a href="' . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) . '?load='.$ViewerConfig->fileSize.'">entire file('.$fhand->formatBytes($ViewerConfig->fileSize, 2, true).')</a>'
    . '</div>';
}

echo '</div>';


?>