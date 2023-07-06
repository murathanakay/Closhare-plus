<?php

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');


header('Location: '.$ViewerConfig->remote.($fileDownloadUrl), true, 302);
