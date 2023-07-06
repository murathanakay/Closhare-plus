<?php

/**
 * setup
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: setup.php UTF-8 , 11-Oct-2013 | 01:07:15 nwdo ε
 */
function connect()
{
    global $DB_HOST, $DB_USER, $DB_PASS;
    return mysql_connect($DB_HOST, $DB_USER, $DB_PASS);
}

function select()
{
    global $DB_NAME;
    if ($con = connect()) {
        return mysql_select_db($DB_NAME, $con);
    }
    return false;
}

function getDBTables($db_name)
{

    $found_tables = array();

    if (connect()) {
        $sql = "SHOW TABLES FROM {$db_name}";

        if ($result = mysql_query($sql)) {
            while ($row = mysql_fetch_row($result)) {
                $found_tables[] = $row[0];
            }
        } else {
            return "Error while trying to get table schema of target database, please check your user permissions.<br>MySQL Error: " . mysql_error();
        }
        return !empty($found_tables) ? $found_tables : null;
    } else {
        return false;
    }
}

function clearDB($db_name)
{

    $ret = true;

    if (connect()) {

        $found_tables = getDBTables($db_name);

        /* loop through and drop each table */
        if ($found_tables != null) {
            foreach ($found_tables as $table_name) {

                $sql = "DROP TABLE $db_name.$table_name";
                if ($result = mysql_query($sql)) {
                    $ret = true;
                } else {
                    return "Error while trying to delete table: $table_name. You may have not enough permission or table may be locked. Please clear all tables inside '{$db_name}' first and try again. You can do this using some web interfaces like phpMyAdmin.<br>MySQL Error: " . mysql_error() . "";
                }
            }
        } else {
            return true;
        }
    }
    return $ret;
}

function execute_SQL()
{
    global $APP_PATH, $DB_NAME, $DB_PREFIX;
    $result = null;
    if ($content = file_get_contents($APP_PATH . DIRECTORY_SEPARATOR . 'setup' . DIRECTORY_SEPARATOR . 'setup.sql')) {
        $sql = str_replace(
            array('##!DBNAME##', '##!DBPREFIX##_'),
            array($DB_NAME, $DB_PREFIX),
            $content
        );

        $queryArr = explode("-- --------------------------------------------------------", $sql);
        foreach ($queryArr as $key => $query) {
            $result = mysql_query($query);
        }
        return ($result) ? true : "Error while trying to execute .sql file.<br>Please be sure your MySQL server is alive.<br>please be sure<br>MySQL Error: " . mysql_error();
    } else {
        return "Error while trying to get setup.sql file. Please be sure setup.sql file is in the setup directory.";
    }
}

function makeConfig()
{
    global $APP_PATH, $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PREFIX;

    $r = array();

    $path = $APP_PATH . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR;
    $ENC_KEY = (isset($_POST['screet_key']) && $_POST['screet_key'] != '') ? $_POST['screet_key'] : 'Duffy' . rand(pow(10, 1), pow(10, 1));

    if ($content = file_get_contents($path . "config.ini-sample.php")) {

        $string = str_replace(
            array('version_here', 'db_server_here', 'db_user_here', 'db_pass_here', 'db_name_here', 'db_prefix_here', 'enc_key_here'),
            array("1.5", $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PREFIX, $ENC_KEY),
            $content
        );
    } else {
        $r['result'] = 0;
        $r['msg'] = 'Error while trying to read config.ini-sample file. Please be sure that you have the rights to read this file.';
    }

    if (updateSiteInfo($ENC_KEY)) {
        $createConfigFile = file_put_contents($path . 'config.ini.php', $string);

        if ($createConfigFile !== false) {

            require_once $APP_PATH . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'class.encryption.php';

            $encryption = new \Nedo\Encryption($ENC_KEY);

            @chmod($path . 'config.ini.php', 0644);
            $renameSetupFolder = rename($APP_PATH . DIRECTORY_SEPARATOR . 'setup/', $APP_PATH . DIRECTORY_SEPARATOR . 'clo_' . rand(0, 1999) . '_setup/');
            if ($renameSetupFolder != true) {
                $r['result'] = 2;
                $r['msg'] = "I have <b>failed</b> while trying to rename the setup folder!<br>Please rename or delete it manually.";
            } else {
                return true;
            }
        } else {
            $r['result'] = 0;
            $r['msg'] = "<b>Error while trying to create configuration file.</b><br>Please consider that you have the right permissions.";
        }
    } else {
        $r['result'] = 0;
        $r['msg'] = "Error while trying to make personal changes. Please delete the config file (if exist) and restart the installation.";
    }

    return $r;
}

function updateSiteInfo($ENC_KEY)
{
    global $APP_PATH, $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PREFIX;
    connect();

    require_once $APP_PATH . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'class.encryption.php';
    $encryption = new \Nedo\Encryption($ENC_KEY);
    //update settings
    $settings = array(
        "site_name" => mysql_real_escape_string($_POST['site_name']),
        "site_url" => siteURL(),
        "site_slogan" => mysql_real_escape_string($_POST['site_desc']),
        "meta_description" => mysql_real_escape_string($_POST['mete_desc']),
        "clo_version" => "1.5.9",
    );

    foreach ($settings as $name => $value) {

        $idata = array(
            "setting_name" => $name,
            "setting_value" => $value
        );

        updateDB($DB_PREFIX . 'options', $idata, "setting_name='{$name}'");
    }

    //set admin
    $data = array(
        "user_name" => mysql_real_escape_string($_POST['admin_name']),
        "user_email" => mysql_real_escape_string($_POST['admin_mail']),
        "user_password" => $encryption->encode(mysql_real_escape_string($_POST['admin_pass'])),
        "user_created" => "NOW()",
    );
    updateDB($DB_PREFIX . 'users', $data, "user_id=" . (int) 1);
    return true;
}

function updateDB($table = null, $data, $where = '1')
{

    if ($table === null or empty($data) || !is_array($data)) {
        $this->error("Invalid array for the following table : <b>" . $table . "</b>.");
        return false;
    }
    if (select()) {
        $query = "UPDATE `" . $table . "` SET ";
        foreach ($data as $key => $val) {
            if (strtolower($val) == 'null')
                $query .= "`$key` = NULL, ";
            elseif (strtolower($val) == 'now()')
                $query .= "`$key` = NOW(), ";
            elseif (strtolower($val) == 'default()')
                $query .= "`$key` = DEFAULT($val), ";
            elseif (preg_match("/^inc\((\-?\d+)\)$/i", $val, $m))
                $query .= "`$key` = `$key` + $m[1], ";
            else
                $query .= "`$key`='" . mysql_real_escape_string($val) . "', ";
        }
        $query = rtrim($query, ', ') . ' WHERE ' . $where . ';';

        return mysql_query($query);
    } else {
        return false;
    }
}

function siteURL()
{
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $domainName = $_SERVER['HTTP_HOST'];
    $lastpart = $_SERVER['REQUEST_URI'];
    $lastpart = str_replace("application/setup/", "", $lastpart);

    if (!empty($_SERVER['QUERY_STRING'])) {
        $lastpart = str_replace($_SERVER['QUERY_STRING'], "", $lastpart);
        $lastpart = str_replace("?", "", $lastpart);
    }
    return rtrim($protocol . $domainName . $lastpart, "/");
}

function add2star($str)
{
    if (strlen($str) > 2) {
        $newstr = substr($str, 0, -2) . "**";
    } else {
        $newstr = $str;
    }
    return $newstr;
}
