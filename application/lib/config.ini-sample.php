<?php

/**
 * config
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: config.ini UTF-8 , 21-Jun-2013 | 23:02:21 nwdo ε
 */
?>
<?php

if (!defined("_SECURE_PHP"))
   die('Direct access to this location is not allowed.');
/**
 * Database Constants - these constants refer to
 * the database configuration settings.
 */
####
###Closhare default language###
$lang = 'en';
####
###Closhare version###
define('VERSION', 'version_here');
####
###DB server###
define('DB_SERVER', 'db_server_here');
####
###DB user###
define('DB_USER', 'db_user_here');
####
###DB password###
define('DB_PASS', 'db_pass_here');
####
###Which DB should I use?###
define('DB_DATABASE', 'db_name_here');
####
###TABLE prefix
define('DB_PFX', 'db_prefix_here');
####
###predefined secret key for all encryptions for file-user_passwords etc...Cannot be changed after a fresh installation###
define("ENC_KEY", "enc_key_here");
define("NUM_ENC_KEY", 565);
###
###TIMEZONE CONFIGURATION (Currently there is no other way to define timezone. @todo: a dropdown menu will be added to the setup and settings page)
define('TIMEZONE', 'UTC');
date_default_timezone_set('UTC');
###
#
//Directory_separator
define("DS", DIRECTORY_SEPARATOR);
//find the real path of the init.php file.
$NEDOX = str_replace("application" . DS . "lib" . DS . "config.ini.php", "", realpath(__FILE__));
//Base path of Closhare.
define("NEDOXROOT", $NEDOX);
//Application directory path / default is "application"
define("APP_PATH", NEDOXROOT . "application" . DS);
//Application cache path / default is "application/cache"
define("CACHE_PATH", NEDOXROOT . "application" . DS . "cache");
//Application library path / default is "lib"
define("LIB_PATH", APP_PATH . "lib" . DS);
//Application include path / default is "inc"
define("VIEW_PATH", APP_PATH . "view" . DS);
//Application controller path / default is "controller"
define("CON_PATH", APP_PATH . "controller" . DS);
//Application ASSET path / default is "assets"
define("ASS_PATH", APP_PATH . "assets" . DS);
//Application THEME path / default is "views/themes/"
define("THEME_ROOT_PATH", APP_PATH . "views" . DS . "themes" . DS);
//Upload path / default is "files/"
define("UPLOAD_PATH", NEDOXROOT . "files" . DS);
//update path
define('UPDATE_PATH', LIB_PATH . 'updater' . DS);
// Should I Show Php, MySql Errors?
// Not recomended for live site. true/false
$DEBUG = false;
?>