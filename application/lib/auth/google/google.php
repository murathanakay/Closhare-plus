<?php

/*
 * twitter
 * @package      closhare v1.00
 * @copyright    2014
 * @license      MIT
 * @contact      contact@closhare.com
 * @version $Id: twitter.php UTF-8 , Jan 22, 2014 | 12:36:38 AM nwdo ε
 */

require_once LIB_PATH.'vendor'.DS.'Google'.DS.'GoogleServices.php';

$gServices = new GoogleServices();

if (isset($_REQUEST['logout'])) {
    unset($_SESSION['google_drive_token']);
}

if (isset($_GET['code'])) {
    if($gServices->connect()){
        closeAndRedirect(CLO_URL);
        //header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
    }
}

if (isset($_SESSION['google_drive_token']) && $_SESSION['google_drive_token']) {
    $gServices->client->setAccessToken($_SESSION['google_drive_token']);
    if ($gServices->client->isAccessTokenExpired()) {
        unset($_SESSION['google_drive_token']);
        $gServices->connect();
    }
} else {
    header('Location: ' . $gServices->createAuthUrl());
}
