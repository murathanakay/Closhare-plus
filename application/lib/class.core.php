<?php

/**
 * core
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: class.core.php UTF-8 , 22-Jun-2013 | 01:45:22 nwdo ε
 */

namespace Nedo;

use Nedo\Image\GarbageCollect;
use Nedo\Upgrade;
use Nedo\Content;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

/**
 * Contains core functions of the app.
 */
class Core
{

    public $msgs = array();
    public $showMsg;
    public $jsonE = array();
    public $jsonEA = array(); //errors to show for only admin. "feature".
    public $jsonMsg = array();
    public $sTable = "options";
    public $uTable = "users";
    public $vTable = "userdata";
    public $fTable = "uploads";
    public $dTable = "folders";
    public $aTable = "attempts";
    public $sID = null;
    public $ajaxReq = null;
    public $settings = null;
    public $window = array();
    private $implod = array("share_options");


    /**
     * __construct()
     * 
     * @return
     */
    function __construct()
    {
        $this->sTable = DB_PFX . $this->sTable;
        $this->uTable = DB_PFX . $this->uTable;
        $this->vTable = DB_PFX . $this->vTable;
        $this->fTable = DB_PFX . $this->fTable;
        $this->dTable = DB_PFX . $this->dTable;
        $this->aTable = DB_PFX . $this->aTable;
        //get default settings from DB
        $this->settings = $this->getSettings(false);
    }

    /**
     * Return PHP running os
     * 
     * @return string
     */
    public function os()
    {

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            return "WIN";
        } else if (strtoupper(substr(PHP_OS, 0, 3)) === 'LIN') {
            return "LINUX";
        } else {
            return "OTHER";
        }
    }

    /**
     * return if exec function is enable or not on the server
     * @return type
     */
    public function exe()
    {

        return function_exists('exec');
    }
    /**
     * getSettings()
     *
     * @return

     */
    public function getSettings($filter = false)
    {
        global $db;

        //        $sql = "SELECT * FROM " . $this->sTable;
        //        $rows = $db->fetch_all($sql);

        $rows = $db->query("SELECT * FROM " . $this->sTable);

        /**
         * loop and retrieve all settings into $core object by using their default keys
         */
        $settings = array();

        foreach ($rows as $key => $row) {

            //edit site_url if needed
            if ($row["setting_name"] == 'site_url' && substr($row["setting_value"], -1) == '/') {
                $row["setting_value"] = rtrim($row["setting_value"], "/");
            }

            if ($filter) {
                if (strpos($row["setting_name"], $filter) !== false) {
                    $settings[$row["setting_name"]] = $row["setting_value"];
                    $setting_name = $row["setting_name"];
                    $setting_value = $row["setting_value"];
                    $this->$setting_name = $setting_value;
                }
            } else {
                $settings[$row["setting_name"]] = $row["setting_value"];
                $setting_name = $row["setting_name"];
                $setting_value = $row["setting_value"];
                $this->$setting_name = $setting_value;
            }
        }

        if (!isset($this->site_theme))
            $this->site_theme = "default";

        $this->settings = $settings;

        return $this->settings;
    }

    /**
     * 
     * @global \Nedo\type $db
     * @global type $fhand
     * @return type
     */
    public function setSettings()
    {
        global $db, $fhand;
        $data = array();
        $insettings = $this->getSettings();
        foreach ($_POST as $key => $value) {
            $keyo = $key;
            if (array_key_exists($keyo, $insettings) === true && ($insettings[$key] != $value)) {

                $use = (is_array($value) && isset($value[0]) && isset($value[1])) ? (((count($value) > 1) ? ($value[0] . $value[1]) : ($value[0]))) : $value;

                if (in_array($keyo, $this->implod)) {
                    $use = implode(',', $value);

                    if (!post("share_options")) {
                        $use = NULL;
                    }
                }
                if (strpos($keyo, 'types') !== false) {
                    $use = $fhand->getAllowedTypesRegex($use, false);
                }
                if (strpos($keyo, 'limit') !== false && $keyo != "register_user_limit") {
                    $use = $fhand->formatToBytes($use);
                }
                if (strpos($keyo, 'template') !== false) {
                    $data[$keyo] = htmlspecialchars($use);
                } else {
                    $data[$keyo] = sanitise($use);
                }

                if ($data[$keyo] == $insettings[$keyo]) {
                    unset($data[$keyo]);
                }

                //var_dump($data[$keyo], $insettings[$keyo]);    
            }
        }
        unset($data["site_logo"]);
        unset($data["page_welcome_bg"]);


        //upload images
        if (isset($_FILES) && !empty($_FILES))
            foreach ($_FILES as $key => $value) {
                $valid_file = true;
                if (!empty($_FILES[$key]) && $_FILES[$key]['name']) {
                    //if no errors...
                    if (!$_FILES[$key]['error']) {
                        //now is the time to modify the future file name and validate the file
                        $new_file_name = strtolower($_FILES[$key]['tmp_name']); //rename file
                        if ($_FILES[$key]['size'] > (4096000)) { //can't be larger than 4 MB
                            $valid_file = false;
                            $this->jsonE["result"] = 0;
                            $this->jsonE["message"] = "Oops!  Image size is too large(Max allowed size is 4MB).";
                            unset($data[$key]);
                        }

                        if ($valid_file) {
                            //move it to where we want it to be
                            move_uploaded_file($_FILES[$key]['tmp_name'], ASS_PATH . 'img' . DS . 'uploads' . DS . $_FILES[$key]['name']);
                            $data[$key] = $_FILES[$key]['name'];
                        }
                    } else {
                        $this->jsonE["result"] = 0;
                        $this->jsonE["message"] = 'Ooops!  Your upload triggered the following error:  ' . $_FILES[$key]['error'];
                    }
                } else {
                    unset($data[$key]);
                }
            }

        if ((post("page_welcome_bg_0") == "remove")) {
            $data["page_welcome_bg"] = "";
        }

        foreach ($data as $name => $value) {

            $idata = array(
                "setting_name" => $name,
                "setting_value" => $value
            );

            $updated = $db->update($this->sTable, $idata, "setting_name='{$name}'");
        }

        $this->jsonE["result"] = 1;
        $this->jsonE["message"] = '<strong>Configurations saved successfully. <a href="javascript:fullreload(\'settings\')">Reload</a> recomended.</strong>';
    }

    /**
     * get current upload settings
     */
    public function getUploadOptions()
    {
        global $user, $mobile;

        $this->jsonE = array(
            "result" => 1,
            "dataType" => "json",
            "maxFileSize" => $user->getUserFileUploadSizeLimit(true),
            "loadImageMaxFileSize" => sanitise($this->upload_preview_max_file_size_limit),
            "maxNumberOfFiles" => $user->getUserFileUploadItems() == 'N/A' ? 'undefined' : $user->getUserFileUploadItems(),
            "maxChunkSize" => $this->upload_max_chunk_size_limit,
            "forceIframeTransport" => ($mobile->isAndroidOS()) ? 1 : 0,
            "allowedTypes" => (!$user->getUserAllowedFileTypes("js") ? 0 : "'" . $user->getUserAllowedFileTypes("js") . "'"),
            "imageMaxWidth" => sanitise((int) $this->upload_preview_allowed_hdim),
            "imageMaxHeight" => sanitise((int) $this->upload_preview_allowed_vdim),
            "previewCrop" => sanitise((int) $this->upload_thumb_crop)
        );

        return $this->jsonE;
    }

    /**
     * 
     * @global \Nedo\type $db
     * @global type $user
     * @param type $type
     * @param type $to
     * @param type $username
     * @param type $pass
     * @param type $hash
     * @return type
     */
    public function sendSingleMail($type, $to = false, $username, $pass, $hash = false, $from = false)
    {
        global $db, $user;

        $sentFrom = /* $from ? array($from => $username) : */ array($this->site_email => $this->site_name);

        $sentTo = $from ? "" : $username;

        if (is_array($type)) {
            $body = $type["body"];
            $subject = $type["subject"];
        } else {
            if ($type == "welcome") {
                //prepare welcome mail.
                $template = htmlspecialchars_decode($this->register_welcome_mail_template);

                $body = str_replace(
                    array('{NAME}', '{USERPASS}', '{USERMAIL}', '{SITEURL}', '{SITENAME}'),
                    array($username, $pass, $to, $this->site_url, $this->site_name),
                    $template
                );
                $subject = mb_str_replace("###", $username, \Nedo\Lang::get("emailWelcomeSubject", array($this->site_name)));
            } else if ($type == 'reset') {

                $template = htmlspecialchars_decode($this->recover_mail_template);

                $body = str_replace(
                    array('{NAME}', '{HASHV}', '{USERMAIL}', '{SITEURL}', '{SITENAME}'),
                    array($username, $hash, $to, $this->site_url, $this->site_name),
                    $template
                );
                $subject = mb_str_replace("###", $username, \Nedo\Lang::get("emailPasswordRequestedSubject", array($this->site_name)));
            } else if ($type == 'resetResult') {

                $template = htmlspecialchars_decode($this->recover_mail_template_res);

                $body = str_replace(
                    array('{NAME}', '{USERPASS}', '{USERMAIL}', '{SITEURL}', '{SITENAME}'),
                    array($username, $pass, $to, $this->site_url, $this->site_name),
                    $template
                );
                $subject = mb_str_replace("###", $username, \Nedo\Lang::get("emailPasswordRequestedNewCredentials", array($this->site_name)));
            } else {

                die("sorry I got lost");
            }
        }

        try {

            require_once(LIB_PATH . "mail/class.mail.php");

            $mailer = $mail->_prepare();
            $message = \Swift_Message::newInstance();
            $message
                ->setSubject($subject)
                ->setTo(is_array($to) ? $to : array($to => $sentTo))
                ->setFrom($sentFrom);

            if ($from) {
                $message->setReplyTo($from, $username);
            } else {
                $message->setReplyTo(defined("CLO_NOREPLY") ? CLO_NOREPLY : ($this->site_email), "");
            }

            $message->setBody($body, 'text/html');

            $mailer->send($message);

            return true;
        } catch (Swift_RfcComplianceException $e) {
            print('Email address not valid:' . $e->getMessage());
            return false;
        }
    }

    /**
     * formatDate()
     * 
     * @param mixed $date
     * @return
     */
    function formatDate($date, $day = true, $long = true)
    {
        $datetime = strtotime($date);
        $format = $long ? "M-d-Y" : "m.d.Y";
        $format .= ($day) ? " - g:i:s" : "";

        return date($format, $datetime);
    }

    /**
     * push_before()
     * 
     * @param type $key
     * @param array $array
     * @param type $new_key
     * @param type $new_value
     * @return array|boolean
     */
    function push_before($key, $array, $new_key, $new_value)
    {
        if (array_key_exists($key, $array)) {
            $new = array();
            foreach ($array as $k => $value) {
                if ($k === $key) {
                    $new[$new_key] = $new_value;
                }
                $new[$k] = $value;
            }
            return $new;
        }
        return false;
    }

    /**
     * push_after()
     * 
     * @param type $key
     * @param array $array
     * @param type $new_key
     * @param type $new_value
     * @return boolean
     */
    function push_after($key, $array, $new_key, $new_value)
    {
        if (array_key_exists($key, $array)) {
            $new = array();
            foreach ($array as $k => $value) {
                $new[$k] = $value;
                if ($k == $key) {
                    $new[$new_key] = $new_value;
                }
            }
            return $new;
        }
        return false;
    }

    /**
     * getUniqueCode()
     * 
     * @param string $length
     * @return
     */
    public function getUniqueCode($length = "", $uppercase = false)
    {
        $code = sha1(uniqid(rand(), true));
        if ($length != "") {
            $code = substr($code, 0, $length);
        } else {
            $code = $code;
        }

        return ($uppercase) ? strtoupper($code) : $code;
    }

    /**
     * generateRandID()
     * 
     * @return
     */
    public function generateRandID()
    {
        global $encryption;
        return $encryption->encode($this->getUniqueCode(24));
    }

    /**
     * returnJson()
     * 
     * @return
     */
    public function returnJson($setheader = true)
    {

        if ($setheader) {
            header('Cache-Control: no-cache, must-revalidate');
            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
            header('Content-type: application/json');
        }

        return json_encode($this->jsonE);
    }

    /**
     * 
     * @param type $message
     * @param type $suffix
     * @param type $itemArr
     * @return type
     */
    public function doErrList($message, $itemArr = false, $suffix = false)
    {

        $str = $itemArr ? (sprintf($message, implode(",", $itemArr))) : $message;

        $return = addLiItems($str);

        if ($suffix) {
            if ($suffix == 1) {
                $return .= 'What do you want me to do?';
            } else {
                $return .= $suffix;
            }
        }

        return $return;
    }

    /**
     * ucfirstStr()
     * 
     * @return
     */
    public function ucfirstStr($string)
    {
        if (strpos($string, ",") != false) {
            $temp = explode(",", $string);
            $str = '';
            foreach ($temp as $val) {
                $str .= ',' . mb_convert_case(str_replace(array("i", "I"), array("İ", "ı"), $val), MB_CASE_TITLE, "UTF-8");
            }
            $str = ltrim($str, ",");
        } else {
            $str = mb_convert_case(str_replace(array("i", "I"), array("İ", "ı"), $string), MB_CASE_TITLE, "UTF-8");
        }

        return $str;
    }

    /**
     * getNumbersOnly()
     * 
     * @return
     */
    public function getNumbersOnly($string, $int = true)
    {

        if ($string) {
            if (is_numeric($string)) {
                return $string;
            }

            if ($int) {
                return (float) $string;
            } else {
                preg_match_all('/\d+/', $string, $matches);
                return $matches[0][0];
            }
        }
        return 0;
    }

    /**
     * getDateOnly()
     * 
     * @return
     */
    public function getDateOnly($date)
    {
        $datetime = strtotime($date);
        return date("d.m.Y", $datetime);
    }

    public function upcount_name_callback($matches)
    {
        $index = isset($matches[1]) ? intval($matches[1]) + 1 : 1;
        $ext = isset($matches[2]) ? $matches[2] : '';
        return ' (' . $index . ')' . $ext;
    }

    public function upcount_name($name)
    {
        return preg_replace_callback(
            '/(?:(?: \(([\d]+)\))?(\.[^.]+))?$/',
            array($this, 'upcount_name_callback'),
            $name,
            1
        );
    }

    /**
     * 
     * @global type $db
     * @return type
     */
    public function defaultRecoverMailTemplate()
    {
        global $db;
        $template = 'Hello, <b>{NAME}</b><br><br>You have just requested a password reset from {SITENAME}.<br>If you think this is on you. Please <a href="{SITEURL}/?reset={HASHV}">click here</a> to go on.<br>If not please ignore this mail and do nothing.<br><p align="right">{SITENAME}.<br></p>';

        $idata = array(
            "setting_value" => $template
        );

        $updated = $db->update($this->sTable, $idata, "setting_name='recover_mail_template'");

        if ($updated) {
            $this->jsonE["result"] = 1;
            $this->jsonE["message"]["title"] = \Nedo\Lang::get("Success");
            $this->jsonE["message"]["txt"] = \Nedo\Lang::get("Recovery mail template was returned to its defaults successfully");
            $this->jsonE["newVal"] = \clear($data["setting_value"]);
        } else {
            $this->jsonE["result"] = 0;
            $this->jsonE["message"]["title"] = \Nedo\Lang::get("Warning");
            $this->jsonE["message"]["txt"] = \Nedo\Lang::get("I couldn't find any changes to update");
        }
        return $this->jsonE;
    }

    /**
     * 
     * @global type $db
     * @return type
     */
    public function defaultRecoverResMailTemplate()
    {
        global $db;
        $template = 'Hello, <b>{NAME}</b><br><br>Here your new login details you have just set:<br><br>E-mail: <b>{USERMAIL}</b><br>  Password: <b>{USERPASS}</b><br><br><p align="right">{SITENAME}.<br></p>';

        $idata = array(
            "setting_value" => $template
        );

        $updated = $db->update($this->sTable, $idata, "setting_name='recover_mail_template_res'");


        if ($updated) {
            $this->jsonE["result"] = 1;
            $this->jsonE["message"]["title"] = \Nedo\Lang::get("Success");
            $this->jsonE["message"]["txt"] = \Nedo\Lang::get("After-Recovery mail template was returned to its defaults successfully");
            $this->jsonE["newVal"] = \clear($template);
        } else {
            $this->jsonE["result"] = 0;
            $this->jsonE["message"]["title"] = \Nedo\Lang::get("Error");
            $this->jsonE["message"]["txt"] = \Nedo\Lang::get("I couldn't find any changes to update");;
        }
        return $this->jsonE;
    }

    /**
     * 
     * @global type $db
     * @return type
     */
    public function defaulWelcometMailTemplate()
    {
        global $db;

        $template = 'Hello, <b>{NAME}</b><p></p> <br>  We want to say that we are pleased to see you among us!<br> <br>  Now you can easily store/share your files with simple clicks on <a href="{SITEURL}">{SITENAME}</a>.<br>  You can login to your {SITENAME} account using details below.<br> <br>  E-mail: {USERMAIL}<br>  Password: {USERPASS}<p></p><br> <a href="{SITEURL}" target="_blank">Click here</a> to go to your account.<p></p><p align="right">{SITENAME}.<br></p>';

        $idata = array(
            "setting_value" => $template
        );

        $updated = $db->update($this->sTable, $idata, "setting_name='register_welcome_mail_template'");


        if ($updated) {
            $this->jsonE["result"] = 1;
            $this->jsonE["message"]["title"] = \Nedo\Lang::get("Success");
            $this->jsonE["message"]["txt"] = \Nedo\Lang::get("Welcome mail template was returned to its defaults successfully");
            $this->jsonE["newVal"] = \clear($template);
        } else {
            $this->jsonE["result"] = 0;
            $this->jsonE["message"]["title"] = \Nedo\Lang::get("Error");
            $this->jsonE["message"]["txt"] = \Nedo\Lang::get("I couldn't find any changes to update");;
        }

        return $this->jsonE;
    }

    /**
     * check if it's shared page
     * 
     * @return type
     */
    public function isShareUrI()
    {
        $URI = $this->current_page_url();
        $lastpart = \mb_str_replace(rtrim($this->site_url, "/") . "/", "", $URI);

        return substr($lastpart, 0, 5) == "share" ? true : false;
    }

    /**
     * get some server information
     * 
     * @return array
     */
    public function getServerInfo()
    {

        global $fhand;

        $Arr = array(
            "file_uploads" => array("required" => 1, "name" => \Nedo\Lang::get("File Uploads"), "value" => ini_get("file_uploads") ? 'on' : 'off'),
            //"allow_url_fopen" => array(),
            "upload_tmp_dir" => array("required" => ">0755", "name" => \Nedo\Lang::get("Upload Temporary Directory")),
            "upload_max_filesize" => array("required" => $this->upload_max_file_size_limit, "current" => $fhand->formatToBytes(ini_get('upload_max_filesize')), "name" => \Nedo\Lang::get("Upload Maximum File Size")),
            "max_execution_time" => array("required" => 300, "name" => \Nedo\Lang::get("Maximum Execution Time")),
            "max_input_time" => array("required" => 300, "name" => \Nedo\Lang::get("Maximum Input Time")),
            "post_max_size" => array("required" => 300, "name" => \Nedo\Lang::get("Post Max Time")),
            "memory_limit" => array("required" => 300, "name" => \Nedo\Lang::get("Memory Limit"))
        );
        return $Arr;
    }

    /**
     * get & store client viewport resolution(deprecated)
     * @return type
     */
    public function client_resolution($nocookie = false)
    {
        $resolution = array();
        $resolution_cook = (($nocookie) ? $nocookie : ((isset($_SESSION['CLO_RES']) ? $_SESSION['CLO_RES'] : (isset($_COOKIE['CLO_RES']) ? $_COOKIE['CLO_RES'] : false))));
        $res = explode("x", $resolution_cook);
        if ($resolution_cook) {
            $resolution[0] = sanitise($this->getNumbersOnly($res[0]));
            $resolution[1] = sanitise($this->getNumbersOnly($res[1]));
            $resolution[2] = $resolution_cook ? sanitise($resolution[0] . 'x' . $resolution[1]) : '';
        }
        return $resolution;
    }

    /**
     * get current page url(deprecated)
     * 
     * @param type $p
     * @return string
     */
    public function current_page_url($p = true)
    {
        $pageURL = $p ? 'http' : '';
        if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
            $pageURL .= "s";
        }
        $pageURL .= $p ? "://" : "";
        if ($_SERVER["SERVER_PORT"] != "80") {
            $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
        } else {
            $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
        }
        return $pageURL;
    }

    /**
     * Direct to the correct url with www or without www
     */
    public function fdirect()
    {
        $host = $_SERVER['HTTP_HOST'];
        $newURI = false;

        if ((strpos($host, "www.") === false) && (strpos($this->site_url, "www.") !== false)) {
            $newURI = 'http://www.' . $this->current_page_url(false);
        } else if ((strpos($this->site_url, "www.") === false) && (strpos($host, "www.") !== false)) {

            $parse = parse_url($this->current_page_url(true));
            $newURI = "http://" . preg_replace('#^www\.(.+\.)#i', '$1', $parse['host']) . $parse['path'];
        }
        if ($newURI) {
            redirectPage_to($newURI);
        }
    }

    /**
     * Check platform settings (beta)
     * 
     * @param type $all
     * @return int
     */
    public function checkplatformSettings($all = false)
    {
        $score = 1;

        $unvalid = array();

        if (empty($this->twitter_key) || ($this->twitter_key == "") || ($this->twitter_key == 'nIbbWGgB9bKNuJoCX78aRA')) {
            $score += 5;
            $unvalid["tw_key"] = 1;
        }
        if (empty($this->twitter_secret) || ($this->twitter_secret == "")) {
            $score += 5;
            $unvalid["tw_secret"] = 1;
        }
        if (empty($this->facebook_secret) || ($this->facebook_secret == "")) {
            $score += 5;
            $unvalid["fb_secret"] = 1;
        }
        if (empty($core->facebook_id) || ($this->facebook_id == "") || ($this->facebook_id == '483839921735754')) {
            $score += 5;
            $unvalid["fb_id"] = 1;
        }

        if ($all) {
            return ($score > 1) ? false : true;
        } else {
            return $unvalid;
        }
    }

    /**
     * 
     * @return type
     */
    public function checkGoogleKeys()
    {

        return ($this->google_client_id && $this->google_client_secret);
    }

    /**
     * check attempts (this feature will be implemented to user login in the next version)
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $value
     * @return int
     */
    public function checkAttempts($where = false, $value = false, $reset = true)
    {
        global $db;

        $interval = 1;

        $ip = $_SERVER["REMOTE_ADDR"];

        $sql = "SELECT attempts, ltime, (CASE when ltime is not NULL and DATE_ADD(ltime, INTERVAL "
            . $interval
            . "\n MINUTE)>NOW() then 1 else 0 end) as Denied FROM $this->aTable WHERE ip = :IP"
            . (($where) ? "\n AND $where = :value" : "");

        if ($where) {
            $db->bind("value", $value);
            $db->bind("IP", $ip);
        } else {
            $db->bind("IP", $ip);
        }

        $data = $db->row($sql);

        if (!$data) {
            return 0;
        }
        if ($data["attempts"] >= 5) {
            if ($data["Denied"] == 1) {

                if ($reset) {

                    $data = array(
                        'ltime' => ":now()",
                    );

                    $db->update(
                        $this->aTable,
                        $data,
                        "IP = '$ip'"
                            . (($where) ? "\n AND $where = {$value}" : "")
                    );
                } else {
                    $timeFirst = strtotime($data["ltime"]);
                    $timeSecond = strtotime(date("Y-m-d H:i:s"));
                    //var_dump($timeFirst, $timeSecond, $data["ltime"], date("Y-m-d H:i:s"));

                    $differenceInSeconds = ($timeSecond - $timeFirst);
                    if ($differenceInSeconds > $interval * 60) {
                        $difto = $interval;
                    } else {
                        $difto = ($interval * 60 - $differenceInSeconds) / 60;
                    }
                }

                return (isset($differenceInSeconds) ? $difto : $interval) * 60;
            } else {
                $this->clearAttempts($where, $value);
                return 0;
            }
        }

        return 0;
    }

    /**
     * Add attempt to DB
     * 
     * @global \Nedo\type $db
     * @param type $where
     * @param type $value
     */
    function addAttempt($where = false, $value = false)
    {

        global $db;
        $ip = $_SERVER["REMOTE_ADDR"];

        //Increase number of attempts. Set last login attempt if required.

        $sql = "SELECT * FROM $this->aTable WHERE ip = :IP"
            . (($where) ? "\n AND $where = :value" : "");

        $bind = array();
        if ($where) {
            $bind = array("value" => $value, "IP" => $ip);
        } else {
            $bind["IP"] = $ip;
        }

        $data = $db->row($sql, $bind);

        if ($data) {
            $attempts = $data["attempts"] + 1;

            if ($attempts == 3) {

                $data = array(
                    'attempts' => $attempts,
                    'ltime' => ":now()",
                );
                $db->update(
                    $this->aTable,
                    $data,
                    "IP = :IP"
                        . (($where) ? "\n AND $where = :value" : ""),
                    $bind
                );
            } else {

                $data = array(
                    'attempts' => $attempts,
                    'ltime' => ":now()",
                );
                $db->update(
                    $this->aTable,
                    $data,
                    "IP = :IP"
                        . (($where) ? "\n AND $where = :value" : ""),
                    $bind
                );
            }
        } else {

            $data = array(
                'attempts' => 1,
                'IP' => $ip,
                'ltime' => ":now()"
            );
            if ($where) {
                $data[$where] = $value;
            }
            $db->insert($this->aTable, $data);
        }
    }

    /**
     * Clear attempts (this feature will be implemented to user login)
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $value
     * @return type
     */
    function clearAttempts($where = false, $value = false)
    {
        global $db;

        $ip = $_SERVER["REMOTE_ADDR"];

        $whClause = ($where) ? "\n AND $where = :value" : "";

        if ($where) {
            $db->bind("value", $value);
            $db->bind("IP", $ip);
        } else {
            $db->bind("IP", $ip);
        }

        $deleted = $db->delete($this->aTable, "IP = :IP $whClause");

        return $deleted;
    }
}
