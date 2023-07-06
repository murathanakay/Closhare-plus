<?php

$ViewerConfig = (object) array(
    "local" => true,
    "remote" => false,
    "fileSize" => filesize($file_full_path),
    "loadMore" => (filesize($file_full_path) > (8 * 1024) ) ? filesize($file_full_path)-(8 * 1024) : false,
    "restSize" => (filesize($file_full_path) > (8 * 1024) ) ? filesize($file_full_path)-(8 * 1024) : filesize($file_full_path),
    "minimalLoad" => ( ( filesize($file_full_path) > (8 *1024) ) ? true : false ) //load only first 512KB of a file...
);
