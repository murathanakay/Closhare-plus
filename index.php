<?php

/**
 * index
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: index.php UTF-8 , 21-Jun-2013 | 22:54:11 nwdo ε
 * @ignore
 */
define("_SECURE_PHP", true);
define("_PAGE_", true);

if (isset($_GET['errorPage'])) {
    require_once 'init.php';
    $content->errorPages();
}

if (isset($_GET['setup'])) {

    require_once 'application/setup/run.php';
} else {
    require_once 'init.php';
    require_once APP_PATH . 'view' . DS . 'index.php';
}
