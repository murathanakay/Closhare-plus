<?php

/**
 * init
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: init.php UTF-8 , 21-Jun-2013 | 23:07:15 nwdo ε
 */
if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

//date_default_timezone_set ("UTC");
//sleep(1);
//Save POST_GET_COOKIE from magic!!! - thanks to Alice
if (ini_get('magic_quotes_gpc')) {

    function clean($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[clean($key)] = clean($value);
            }
        } else {
            $data = stripslashes($data);
        }
        return $data;
    }

    $_GET = clean($_GET);
    $_POST = clean($_POST);
    $_COOKIE = clean($_COOKIE);
}

//find the real path of the init.php file.
$ROOT = str_replace("init.php", "", realpath(__FILE__));
$configFile = $ROOT . DIRECTORY_SEPARATOR . "application" . DIRECTORY_SEPARATOR . "lib" . DIRECTORY_SEPARATOR . "config.ini.php";

if (file_exists($configFile)) {
    require_once($configFile);
}

require_once(LIB_PATH . "/autoload.php");

require_once(LIB_PATH . "lang/class.lang.php");
$language = new Nedo\Lang;

if (!file_exists($configFile)) {
    header("Location: ?setup");
}

if (file_exists(NEDOXROOT . "maintenance.php") && !defined("_MAINTENANCE") && !$DEBUG) {
    header("Location: /maintenance.php");
}

define("CLO_DEBUG", $DEBUG);
//To send errors-warnings to browser - set on/off in "/application/lib/config.ini.php" dev: on, prod: off
if (CLO_DEBUG) {
    //set php.ini ready for detailed error_reporting
    error_reporting(E_ALL | E_STRICT);
    ini_set('display_errors', 1);
} else {
    ini_set("display_errors", 0);
}

#################################################################
require_once(LIB_PATH . "DB" . DS . "class.db.php");
$db = new Nedo\DB();
////prepare headers for redirecting pages in need.
include(LIB_PATH . "redirect.php");
require_once(LIB_PATH . "functions.php"); // general global functions
//Pagination Class
require_once(LIB_PATH . "class.paginate.php"); // pagination.
//Image Class
require_once(LIB_PATH . "image" . DS . "autoload.php"); //crop /resize /create versions /cache images etc...
//Audio Class
require_once(LIB_PATH . "audio" . DS . "Audio.php"); //Read/Guess basic Id3 tags from a supported audio file
$audio = new Nedo\Audio;
//Encryption Class
require_once(LIB_PATH . "class.encryption.php"); //security and other stuff
$encryption = new Nedo\Encryption();
//Include Functions
//Core Class
require_once(LIB_PATH . "class.core.php"); // core functions settings-system etc...
$core = new Nedo\Core;
//set THEME CURRENT PATH
define("THEME_PATH", THEMES_PATH . $core->site_theme . DS);
/**
 * Define other constants after core.class,user.class etc.. loaded.
 * Do not edit values below!
 */
//Closhare URI / default is "http://example.com"
define("CLO_URL", (rtrim($core->site_url, "/"))); //without trailing slash /
define("FILE_URL", $core->site_url); //without trailing slash /
//Closhare SITE NAME / default is "Clo&Share"
define("CLO_SITE_NAME", $core->site_name);
//Closhare SITE_SLOGAN / default is "Optional"
define("CLO_SITE_SLOGAN", $core->site_slogan);
//Closhare DEFAULT ASSETS URI-path preparation & for security reasons and pretty URI it uses .htaccess to handle requests
$CLO_ASSETS_ROOT_URI = CLO_URL . "/application";
//Closhare DEFAULT ASSET URI / default is "/application/assets/js/" it uses .htaccess
define("CLO_DEF_ASS_URI", $CLO_ASSETS_ROOT_URI . '/assets/');
//Closhare DEFAULT CSS URI / default is "/application/assets/js/" it uses .htaccess
define("CLO_DEF_CSS_URI", $CLO_ASSETS_ROOT_URI . '/assets/css/');
//Closhare DEFAULT JS URI / default is "/application/assets/js/" it uses .htaccess
define("CLO_DEF_JS_URI", $CLO_ASSETS_ROOT_URI . '/assets/js/');

define("THEMES_URL", $CLO_ASSETS_ROOT_URI . "/view/theme/");

define("THEME_URL", CLO_URL . "/application/view/theme/" . $core->site_theme . "/");
define("CSS_URL", CLO_URL . "/application/view/theme/" . $core->site_theme . "/css/");
define("JS_URL", CLO_URL . "/application/view/theme/" . $core->site_theme . "/js/");

//Facebook Login Class
if ($core->enable_facebook && defined("_PAGE_")) {
    require_once(LIB_PATH . "auth/facebook/facebook.php");
    $facebook = new Facebook(array(
        'appId' => $core->facebook_id,
        'secret' => $core->facebook_secret,
        'cookie' => true,
    ));
    //2. retrieving session
    $fbsession = $facebook->getUser();

    //3. requesting 'me' to API
    $fbme = null;
    if ($fbsession) {
        try {
            $fbuid = $facebook->getUser();
            $fbme = $facebook->api('/me');
        } catch (FacebookApiException $e) {
            error_log($e);
            $facebook->destroySession();
            $_SESSION['fb_logout_url'] = 'logout.php';
        }
    }
}
//User Class
require_once(LIB_PATH . "class.user.php"); // user management functions.
$user = new Nedo\User();

//Mobile Detector Class
include(LIB_PATH . "vendor" . DS . "class.mobile.php"); // to mobile mobility.
$mobile = new Nedo\Mobile;
$phone = $mobile->isMobile() && !$mobile->isTablet();
$tablet = $mobile->isTablet();
//Share Class
require_once(LIB_PATH . "class.share.php"); // sharing functions.
$share = new Nedo\Share();
//Buildtree Class
require_once(LIB_PATH . "file.handler" . DS . "class.buildtree.php"); // sharing functions.
$buildtree = new Nedo\Buildtree();
//Content Class
include_once(LIB_PATH . "class.content.php"); // printing html contents.
$content = new Nedo\Content();
//FileHandler Class
include_once(LIB_PATH . "file.handler" . DS . "class.filehandler.php"); // handling files/folders all stuff.
$fhand = new Nedo\FileHandler();
//Upload Class
if (isset($_POST["uploadme"]) || isset($_GET['cancel'])) : //require only while upload request is mobileed... else nope.
    require_once(LIB_PATH . "file.handler" . DS . "class.upload.php");
    $uploader = new Nedo\Upload(null, true);
endif;

//$user_agent = $_SERVER['HTTP_USER_AGENT'];
//Include Runtime Functions
require_once(LIB_PATH . "runtime.php");


if ($core->enable_facebook && defined("_PAGE_")) {

    if ($fbme) {
        $fblogoutUrl =
            $_SESSION['fb_logout_url'] = $facebook->getLogoutUrl(array(
                'next' => CLO_URL . '/logout.php?' . $_SERVER['QUERY_STRING']
            ));

        if ($user->fbLogin($fbme)) {
            if (!$user->logged_in)
                redirectPage_to(CLO_URL);
        }
    } else {
        $fbloginUrl = $_SESSION['fb_login_url'] = $facebook->getLoginUrl(array(
            'scope' => 'email, read_stream',
            'next' => CLO_URL
        ));
    }
}

$ajaxed = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') ? true : false;
