<?php

/**
 * index
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: index.php UTF-8 , 21-Jun-2013 | 22:54:11 nwdo ε
 */
if (!defined("_SECURE_PHP")) {
    die('Direct access to this location is not allowed.');
}
//$core->fdirect();
if (get("logout")) {
    if (isset($_SESSION['fb_logout_url'])) {
        redirectPage_to($_SESSION['fb_logout_url']);
    } else {
        redirectPage_to(CLO_URL . '/logout.php?' . $_SERVER['QUERY_STRING']);
    }
    if ($this->loggedout) {

        if (get("return_to")) {
            redirectPage_to($_GET['return_to']);
        } else {
            redirectPage_to("/#page=login");
        }
    }
} else {
    if ((!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') || (isset($_POST['uploadme']) && $_POST['utoken'] == $encryption->encode($user->userid)
    )) { //handles ie, android iframe /post Uploads. it's a big joke huh!
        require_once APP_PATH . 'ajax/controller.php';
    } else {
        if (isset($_GET['octet']) && isset($_GET['file'])) {
            $fhand->download();
        } else if (get("auth")) {
            //twitter login
            if (get("denied")) {
                //closeAndRedirect(false);
            } else {
                if (file_exists(LIB_PATH . 'auth' . DS . get("auth") . DS . get("auth") . '.php')) {
                    require_once LIB_PATH . 'auth' . DS . get("auth") . DS . get("auth") . '.php';
                } else {
                    die("There is a misunderstanding with auth2! The resource that you have been looking for doesn't exists or moved to another location.");
                }
            }
        } else {

            $themePath = (($mobile->isMobile() || $mobile->isTablet()) && file_exists(THEME_PATH . 'mobile' . DS . 'index.php')) ? (THEME_PATH . 'mobile' . DS) : THEME_PATH;

            include_once THEME_PATH . 'header.php';

            /**
             * @uses login-register-recovery forms
             */
            if (!$user->logged_in) {

                include_once THEME_PATH . 'welcome.php';

                /**
                 * @name $user->logged_in;
                 */
            } else {
                if (empty($_GET)) {
                    require_once THEME_PATH . 'default.php';
                } else {
                    redirectPage_to(CLO_URL);
                }
            }

            include_once THEME_PATH . 'footer.php';
        }
    }
}
