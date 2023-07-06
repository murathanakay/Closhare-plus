<?php

/*
 * logout
 * @package      Closhare v1.xx
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: logout.php UTF-8 , Jan 27, 2014 | 3:26:33 AM nwdo ε
 */

define("_SECURE_PHP", true);
define("_PAGE_", true);
require_once("init.php");
@session_start();

if ($core->enable_facebook) {
    $facebook->destroySession();
    setcookie('fbs_' . $facebook->getAppId(), '', time() - 100, '/', '');
    setcookie('fbsr_' . $facebook->getAppId(), '', time() - 100, '/', '');
}

$user->logout();

if (get("return_to")) {
    redirectPage_to($_GET['return_to']);
} else {
    redirectPage_to(CLO_URL . "/#page=login");
}
