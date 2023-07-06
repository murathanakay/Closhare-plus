<?php

define("_SECURE_PHP", true);

include_once realpath(__DIR__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'init.php';

$requiredTypeViewerAppPath = realpath(__DIR__) . DS . get("type") . DS . "app.php";

if (file_exists($requiredTypeViewerAppPath)) {

    include $requiredTypeViewerAppPath;
    
    
    //local viwer
    if (isset($ViewerConfig) && !$ViewerConfig->remote) {
        
     $header = $content->printCssFiles(array("base" => "", "default" => "", "document" => ""));

    if (isset($ViewerConfig) && isset($ViewerConfig->css) && !empty($ViewerConfig->css)) {

        $header .= $content->printCssFiles((array) $ViewerConfig->css);
    }

    if (isset($ViewerConfig) && isset($ViewerConfig->js) && !empty($ViewerConfig->js)) {

        $header .= $content->printJsFiles(true, (array) $ViewerConfig->js);
    }

        echo viewer_header($header);
        
    }
    
    include $viewerHelperPath;
    
} else {
    echo $content->errorPages(404);
}

function viewer_header($header) {

    $html = '<!DOCTYPE html>'
            . '<head>'
            . $header
            . '<script>'
            . 'if (top != self) {'
            . 'console.log("Log: viewer is on")'
            . '}'
            . '</script>'
            . '</head>';

    return $html;
}
