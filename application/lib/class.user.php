<?php

/**
 * user
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: user.class.php UTF-8 , 22.AGU.2011 | 04:24:37 nwdo ε
 */ ?>
<?php

namespace Nedo;

use Nedo\Content;
use Nedo\FileHandler;
use Nedo\Paginate;
use \stdClass;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');
/**
 * User action class. Login/register/reset/Social Login etc...
 */
class User
{

    private $uTable = "users";
    public $logged_in = null;
    public $userid = 0;
    public $fbid = 0;
    public $twid = 0;
    public $user_email;
    public $user_name; //user name and surname
    public $user_rights = array();
    public $user_role;
    public $user_dir;
    public $fb_token = null;
    public $tw_token = null;
    private $lastlogin = "NOW()";
    private $permitAll = array(
        "download" => 1,
        "compress" => 1,
        "share" => 1,
        "rename" => 1,
        "copy" => 1,
        "move" => 1,
        "delete" => 1,
        "email" => 1,
        "describe" => 1,
        "sync" => 1,
        "create" => 1
    );
    public $privileges = array();
    public $jsperms = array();
    public $uilogin = null;
    public $uiregister = null;
    public $loggedout = null;
    private $dpfu = "user_";

    /**
     * User::__construct Function
     * 
     * @return none
     */
    function __construct()
    {

        include_once(LIB_PATH . "class.content.php");
        include_once(LIB_PATH . "file.handler" . DS . "class.filehandler.php");
        $this->startSession();
        /**
         * Handle user get-post-cookie requests!
         */
        if (post("loginme")) :
            $this->uilogin = $this->login();
        endif;
        if (post("registerme")) :
            $this->uiregister = $this->register();
        endif;
        if (post("resetme") && (isset($_POST["reset-email"]))) :
            $this->uireset = $this->reset();
        endif;
        if (post("resetme") && isset($_POST["reset-passw"])) :
            $this->uireset = $this->resetProcess();
        endif;
    }
    /**
     * Start user session.
     * @return boolean
     */
    private function startSession()
    {
        @session_start();
        $this->logged_in = $this->checkLogin();

        if (!$this->logged_in) {
            $this->userid = $_SESSION['user_id'] = 0;
            $this->user_role = 0;

            $this->checkCookie();
        }
        return true;
    }

    /**
     * Check for a cookie if remember me is exists.
     * 
     * @global \Nedo\type $encryption
     * @return boolean
     */
    private function checkCookie()
    {
        global $encryption;

        if (!$this->logged_in && !post("loginme") && !post("registerme") && !post("resetme") && !isset($_GET["logout"]) && !isset($_SESSION['fb_token'])) {
            $auth = (isset($_COOKIE['CLO_UINF0']) && !empty($_COOKIE['CLO_UINF0'])) ?
                array(
                    "email" => $encryption->decode($encryption->decode($_COOKIE['CLO_UINF0'])),
                    "pass" => $encryption->decode($encryption->decode($_COOKIE['CLO_UINF1']))
                ) : false;
            if ($auth) {
                $this->login($auth['email'], $auth['pass'], true);
                $this->startSession();
                return true;
            }
        }
        return false;
    }

    /**
     * Check if login is alive or not.
     * @return boolean
     */
    private function checkLogin()
    {
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] != 0) {

            if (isset($_SESSION['fb_token']) && $_SESSION['fbid'] != "") {
                $row = $this->getUserFBInfo($_SESSION['fbid']);
            } elseif (isset($_SESSION['tw_token']) && $_SESSION['twid'] != "") {
                $row = $this->getUserTWInfo($_SESSION['twid']);
            } else {
                $row = $this->getUserInfo($_SESSION['user_id']);
            }

            $this->userid = $row['id'];
            $this->fbid = $row['fbid'];
            $this->twid = $row['twid'];
            $this->user_email = $row['email'];
            $this->user_name = $row['name'];
            $this->user_role = $row['role'];
            $this->user_limit = $row['disklimit'];
            $this->user_dir = $row['dir'];
            $this->privileges = $this->getUserPrivileges($row["privileges"], $row['role']);

            if ($this->twid && !$this->user_email) {
                setcookie("CLO_TWMA", 1, time() + 3600 * 24 * 7);
            } else {
                setcookie("CLO_TWMA", 0, time() + 1);
            }

            $this->full_path = UPLOAD_PATH . $this->user_dir;

            $this->user_created = $_SESSION['created'] = date("d F, Y / H:s:i", strtotime($row['created']));
            $this->last_logged_on = $_SESSION['lastlogin'] = date("d F, Y / H:s:i", strtotime($row['lastlogin']));
            $this->last_logged_from = $_SESSION['lastloginfrom'] = $row['lastloginfrom'];
            $this->user_dir = \return6charsha1($row['id']);
            $this->fb_token = isset($_SESSION['fb_token']) ? $_SESSION['fb_token'] : 0;
            $this->tw_token = isset($_SESSION['tw_token']) ? $_SESSION['tw_token'] : 0;
            return true;
        } else {
            return false;
        }
    }
    /**
     * Login user with the given credentials.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global type $content
     * @global \Nedo\type $encryption
     * @param type $email
     * @param type $pass
     * @param type $cookie
     * @param type $social
     * @return boolean
     */
    public function login($email = false, $pass = false, $cookie = false, $social = false)
    {
        global $db, $core, $content, $encryption;

        $user_email = ($social) ? $social['val'] : ($email ? $email : filter_input(INPUT_POST, "login-email"));
        $password = $pass ? $pass : post("login-passw");

        if ((isset($_POST["loginme"]) && $encryption->decode($_POST["loginme"]) == date("Ymd")) || ($email && $pass) || $social) {
            //            if ($user_email != "" && $password != "") {
            $check = $this->checkUserStatus($user_email, $password, $social);

            switch ($check["status"]) {
                case 0:
                    $core->msgs['no_login'] = \Nedo\Lang::get("Incorrect email/password combination");
                    break;
                case 11:
                    $core->msgs = $core->msgs;
                    break;
                case 22:
                    $core->msgs['account_suspended'] = 'Your account has been suspended by the system administrator.';
                    break;
                case 33:
                    $core->msgs['email'] = 'Please enter a valid Email Address.';
                    break;
                case 34:
                    $core->msgs['password'] = 'Please enter your password.';
                    break;
            }
            //            }

            if ($check["status"] == 11) {

                $infnc = $social ? $social["infnc"] : "";
                $row = $social ? $this->$infnc($social["val"]) : $this->getUserInfo($check["id"]);

                $this->userid = $_SESSION["user_id"] = $row["id"];
                $this->fbid = $_SESSION["fbid"] = $row["fbid"];
                $this->twid = $_SESSION["twid"] = $row["twid"];
                $this->user_name = $_SESSION["name"] = $row["name"];
                $this->user_role = $_SESSION["role"] = $row["role"];
                $this->user_limit = $_SESSION["disklimit"] = ($row["disklimit"]);
                $this->user_dir = $_SESSION["dir"] = $row["dir"];
                $this->full_path = $_SESSION["full_path"] = UPLOAD_PATH . $row["dir"];
                $this->user_created = $_SESSION["created"] = date("d F, Y / H:s:i", strtotime($row["created"]));
                $this->last_logged_on = $_SESSION["lastlogin"] = date("d F, Y / H:s:i", strtotime($row["lastlogin"]));
                $this->last_logged_from = $_SESSION["lastloginfrom"] = $row["lastloginfrom"];

                $this->privileges = $this->getUserPrivileges($row["privileges"], $row["role"]);

                $data = array(
                    "lastloginfrom" => sanitise($_SERVER["REMOTE_ADDR"]),
                    "id" => $check['id']
                );

                $update = $db->query("UPDATE $core->uTable SET lastlogin = NOW(), lastloginfrom = :lastloginfrom WHERE id = :id", $data);

                $this->logged_in = true;

                //remember him/her
                if (isset($_POST['remember-me']) && !empty($_POST['remember-me'])) {

                    setcookie("CLO_UINF0", $encryption->encode($encryption->encode($user_email)), time() + 3600 * 24 * 7); //encode $user_email twice
                    setcookie("CLO_UINF1", $encryption->encode($encryption->encode($password)), time() + 3600 * 24 * 7); //encode $password twice
                }

                $return = true;
            }
        } else {
            $core->msgs['session'] = "Something wrong with your session!
                ###refresh this page and try again.###always use usual ways.";
        }

        if (isset($check['status']))
            unset($check['status']);

        setcookie("CLO_FBASK", 0, 1);

        if ($social) {
            return empty($core->msgs) ? true : false;
        }

        $protocol = 'http';
        $port = '';

        if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
            $protocol .= "s";
        }

        if (!$email || ($cookie && $email)) {
            return (empty($core->msgs) ? redirectPage_to($protocol . ltrim($core->site_url, $protocol) . "/#dir=" . $this->user_dir) : \Nedo\Content::alertMessage("danger", true, true, true));
        } else
            return true;
    }
    /**
     * Logout user.
     * 
     * @global \Nedo\type $core
     * @global type $facebook
     * @return boolean
     */
    public function logout()
    {
        global $core, $facebook;

        unset($_SESSION['user_id']);
        unset($_SESSION['user_dir']);
        unset($_SESSION['user_name']);
        unset($_SESSION['user_role']);
        unset($_SESSION['email']);
        if (isset($_COOKIE['CLO_UINF0']) || isset($_COOKIE['CLO_UINF1'])) {
            unset($_COOKIE['CLO_UINF0']);
            unset($_COOKIE['CLO_UINF1']);
            setcookie('CLO_UINF0', null, -1, '/');
            setcookie('CLO_UINF1', null, -1, '/');
        }


        unset($_SESSION['twid']);
        unset($_SESSION['oauth_verifier']);
        unset($_SESSION['oauth_token']);
        unset($_SESSION['oauth_token_secret']);


        session_destroy();
        session_regenerate_id();

        $this->logged_in = false;
        $this->fbid = 0;
        $this->user_id = 0;
        $this->user_role = 0;

        return true;
    }
    /**
     * Login user with their Facebook account.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $facebook
     * @global \Nedo\type $encryption
     * @global \Nedo\type $fhand
     * @param type $me
     * @return boolean
     */
    public function fbLogin($me)
    {

        global $db, $core, $facebook, $encryption, $fhand;

        if (!empty($me) && !$this->logged_in) {

            $sql = "SELECT fbid FROM " . $core->uTable . " WHERE fbid = :fbid";

            $result = $db->row($sql, array(
                "fbid" => $me['id']
            ));

            //there is no account related with FB id check for an account on the returned email.
            $mailexists = $this->emailExists($me['email']);

            if ($mailexists) {
                //there is an account so update fbid of this user and log her in.
                $datae = array(
                    "fbid" => $me["id"]
                );

                $db->update($core->uTable, $datae, "id= :user_id", array(
                    "user_id" => $mailexists['id']
                ));

                $pass = $encryption->decode($mailexists['password']);
            } else {

                if (!$result) {

                    //create an account
                    $passw = return6charsha1($me['id']);

                    $pass = $passw;

                    $encodedpassword = $encryption->encode($passw);

                    $full_name = sanitise($me['name']);

                    $dataf = array(
                        'id' => "",
                        'fbid' => (int) $me['id'],
                        'name' => $full_name,
                        'password' => $encodedpassword,
                        'email' => sanitise($me['email']),
                        'disklimit' => $core->upload_user_default_disk_limit,
                        'lastlogin' => ":now()",
                        'lastloginfrom' => sanitise($_SERVER['REMOTE_ADDR']),
                        'status' => "active",
                        'created' => ":now()"
                    );

                    $insert = $db->insert($core->uTable, $dataf);

                    $useridf = $db->lastInsertId();

                    if ($insert) {

                        //user was created so touch some additional things...
                        //create user physical folder and put inside an index.php file
                        $uidirname = return6charsha1($useridf);
                        $uipath = UPLOAD_PATH . $uidirname;
                        $uidir = @mkdir($uipath . '/thumbnail/', 0755, true);
                        $uidir = @mkdir($uipath . '/view/', 0755, true);

                        $udird = array(
                            'dir' => $uidirname
                        );

                        $db->update($core->uTable, $udird, "id = :user_id", array(
                            "user_id" => $useridf
                        ));

                        if ($uidir) {

                            createIndexFile(2, $uipath);
                            createIndexFile(3, $uipath . '/thumbnail/');
                            createIndexFile(3, $uipath . '/view/');
                            $fhand = new \Nedo\FileHandler();

                            $fhand->createSampleData($useridf);
                        }

                        if ($core->register_send_welcome_mail) {
                            $welcome = $core->sendSingleMail('welcome', $dataf['email'], $dataf['name'], $pass);
                        }
                    }
                } else {
                    $pass = return6charsha1($me['id']);
                }
            }

            $datat = array(
                "lastlogin" => ":now()",
                'lastloginfrom' => sanitise(
                    $_SERVER['REMOTE_ADDR']
                )
            );

            $db->update($core->uTable, $datat, "fbid= :fbid", array(
                "fbid" => $me['id']
            ));


            $this->fb_token = $_SESSION['fb_token'] = $facebook->getAccessToken();

            $logined = $this->login(sanitise($me['email']), $pass);

            $_SESSION['fb_logoutURL'] = $facebook->getLogoutUrl(array('next' => (CLO_URL . '/?logout=facebook')));

            if ($logined)
                return true;
        }
    }
    /**
     * Login user with their Twitter account.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $encryption
     * @global \Nedo\type $fhand
     * @param type $me
     * @return boolean
     */
    public function twLogin($me)
    {

        global $db, $core, $encryption, $fhand;

        if (is_object($me) && !empty($me) && !$this->logged_in) {

            $sql = "SELECT twid FROM " . $core->uTable . " WHERE twid = :twid";

            $result = $db->row($sql, array(
                "twid" => (isset($_SESSION['twid']) ? $_SESSION['twid'] : is_object($me) ? $me->id : $me['id'])
            ));

            if (!$result) {

                $password = return6charsha1($me->id);
                $pass = $password;
                $password = $encryption->encode($password);
                $full_name = sanitise($me->name);

                $dataf = array(
                    'id' => "",
                    'twid' => (int) $me->id,
                    'name' => $full_name,
                    'password' => $password,
                    'email' => "",
                    'disklimit' => $core->upload_user_default_disk_limit,
                    'latlogin' => "NOW()",
                    'latloginfrom' => sanitise($_SERVER['REMOTE_ADDR']),
                    'status' => "active",
                    'created' => ":now()"
                );

                $insert = $db->insert($core->uTable, $dataf);


                $useridf = $db->lastInsertId();


                if ($insert) {

                    //user was created so touch some additional things...
                    //create user physical folder and put inside an index.php file
                    $uidirname = return6charsha1($useridf);
                    $uipath = UPLOAD_PATH . $uidirname;
                    $uidir = @mkdir($uipath . '/thumbnail/', 0755, true);
                    $uidir = @mkdir($uipath . '/view/', 0755, true);

                    $udird = array(
                        'dir' => $uidirname
                    );

                    $db->update($core->uTable, $udird, "id = :user_id", array(
                        "user_id" => $useridf
                    ));

                    if ($uidir) {

                        createIndexFile(2, $uipath);
                        createIndexFile(3, $uipath . '/thumbnail/');
                        createIndexFile(3, $uipath . '/view/');
                        $fhand = new \Nedo\FileHandler();

                        $fhand->createSampleData($useridf);
                    }

                    //twitter doesn't supply email address so we can't send welcome email.
                    //                    if ($core->register_send_welcome_mail) {
                    //                        $welcome = $core->sendSingleMail('welcome', $dataf['user_email'], $dataf['user_name'], $pass);
                    //                    }
                }
            } else {

                $datat = array(
                    "lastlogin" => ":now()",
                    'lastloginfrom' => sanitise(
                        $_SERVER['REMOTE_ADDR']
                    )
                );

                $db->update($core->uTable, $datat, "twid= :twid", array(
                    "twid" => (isset($_SESSION['twid']) ? $_SESSION['twid'] : is_object($me) ? $me->id : $me['id'])
                ));
            }

            $pass = return6charsha1($me->id);

            $this->tw_token = $_SESSION['tw_token'] = get("oauth_token");

            $logined = $this->login(NULL, $pass, false, array(
                "key" => "twid",
                "val" => isset($_SESSION['twid']) ? $_SESSION['twid'] : $me->id,
                "infnc" => "getUserTWInfo"
            ));


            if ($logined) {
                return true;
            } else
                return false;
        } else {
            return false;
        }
    }
    /**
     * Get logged user information from DB.( with username and password )
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $user_id
     * @return boolean
     */
    public function getUserInfo($value)
    {

        global $db, $core;

        if (is_numeric($value)) {
            $db->bind("id", $value);
            $case = "id";
        } else {
            $db->bind("email", $value);
            $case = "email";
        }

        $row = $db->row("SELECT * FROM $core->uTable WHERE $case = :$case");

        if (!$value)
            return false;

        return ($row) ? $row : 0;
    }

    /**
     * Get user info by their root directory name( unique )
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $user_dir
     * @param type $select
     * @return boolean
     */
    public function getUserInfoDir($user_dir, $select)
    {

        global $db, $core;
        $db->bind("user_dir", $user_dir);

        $row = $db->row("SELECT "
            . ($select ? $select : "*")
            . "\n FROM " . $core->uTable . ""
            . "\n WHERE dir = :user_dir LIMIT 1");

        if (!$user_dir)
            return false;

        return !empty($row) ? $row : false;
    }
    /**
     * Get logged user information from DB.( with facebook account )
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $fbid
     * @return boolean
     */
    public function getUserFBInfo($fbid)
    {
        global $db, $core;
        $fbid = sanitise($fbid);
        $fbid = sanitise($fbid);

        $sql = "SELECT * FROM $core->uTable WHERE fbid = :fbid";
        $row = $db->row($sql, array(
            "fbid" => $fbid
        ));

        if (!$fbid)
            return false;

        return !empty($row) ? $row : 0;
    }
    /**
     * Get logged user information from DB.( with twitter account )
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $twid
     * @return boolean
     */
    public function getUserTWInfo($twid)
    {
        global $db, $core;
        $twid = sanitise($twid);
        $twid = sanitise($twid);

        $sql = "SELECT * FROM $core->uTable WHERE twid = :twid";
        $row = $db->row($sql, array(
            "twid" => $twid
        ));

        if (!$twid)
            return false;

        return !empty($row) ? $row : 0;
    }
    /**
     * Check logged user status. return status code.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $encryption
     * @param type $user_email
     * @param type $password
     * @param type $social
     * @return int
     */
    public function checkUserStatus($user_email, $password, $social = false)
    {
        global $db, $core, $encryption;

        if ($social) {
            $identity = $social['val'];
            $where = $social['key'];
        } else {
            $identity = sanitise($user_email);
            $where = 'email';
        }

        $password = sanitise($password);
        $res = array();

        if (!isValidEmail($user_email) && !$social) {
            $res["status"] = 33;
        }

        if (($password == "" || empty($password)) && empty($res)) {
            $res["status"] = 34;
        }

        if (empty($res)) {


            $row = $db->row(
                "SELECT id, password, status FROM $core->uTable WHERE $where = :where",
                array(
                    "where" => $identity,
                )
            );

            if (count($row) > 0) {

                $enc_password = $encryption->encode($password);

                //            var_dump($row, $password, $encryption->decode($row['user_password']), $enc_password, $row['user_password']);

                if ($enc_password != $row["password"]) {
                    $res["status"] = 0;
                }
                //check for user active or inactive
                switch ($row["status"]) {
                    case "active":


                        if ($enc_password == $row["password"]) {
                            $res["status"] = 11;
                            $res["id"] = $row["id"];
                        } else {
                            $res["status"] = 0;
                        }

                        break;
                    case "inactive":
                        $res["status"] = 22;
                        break;
                }
            } else {
                $res["status"] = 0;
            }
        }
        return $res;
    }
    /**
     * Check if user is administrator or not.
     * @return boolean
     */
    public function isAdmin()
    {
        if ($this->logged_in)
            return ($this->user_role == "admin");
        else
            return false;
    }
    /**
     * Get paginated users.
     * 
     * @global \Nedo\type $db
     * @global Paginate $pager
     * @global \Nedo\type $core
     * @param type $from
     * @param type $p
     * @param type $ipp
     * @param type $currpage
     * @param type $searchMode
     * @return type
     */
    public function getUsers($from = false, $p, $ipp, $currpage, $searchMode = false)
    {
        global $db, $pager, $core;
        $pager = new \Nedo\Paginate($p, $currpage);

        if ($searchMode) {

            $counter = countDataDB($core->uTable, "name, email", $searchMode, false, true);
        } else {
            $counter = countDataDB($core->uTable);
        }


        $pager->items_total = $counter;
        $pager->default_ipp = $ipp;
        $pager->paginate();

        if ($counter == 0) {
            $pager->limit = null;
        }

        if (isset($_GET['sort'])) {
            list($sort, $order) = explode("-", $_GET['sort']);
            $sort = sanitise($sort);
            $order = sanitise($order);
            if (in_array($sort, array("name", "email", "role", "email", "created"))) {
                $ord = ($order == 'DESC') ? " DESC" : " ASC";
                $sorting = " u." . $sort . $ord;
            } else {
                $sorting = " u.created DESC";
            }
        } else {
            $sorting = " u.id ASC";
        }

        $clause = (isset($clause)) ? $clause : null;

        if (isset($_POST['fromdate']) && $_POST['fromdate'] <> "" || isset($from) && $from != '') {
            $enddate = date("Y-m-d");
            $fromdate = (empty($from)) ? $_POST['fromdate'] : $from;
            if (isset($_POST['enddate']) && $_POST['enddate'] <> "") {
                $enddate = $_POST['enddate'];
            }
            $clause .= " WHERE u.created BETWEEN :fromdate AND :enddate";

            $db->bindMore(array("fromdate" => trim($fromdate), "enddate" => trim($enddate) . " 23:59:59"));
        }

        if ($searchMode) {
            $clause = " WHERE MATCH (u.name, u.email) AGAINST ('{$searchMode}*' IN BOOLEAN MODE)";
        }

        $sql = "SELECT "
            . "\n u.id,"
            . "\n u.name,"
            . "\n u.email,"
            . "\n u.disklimit,"
            . "\n u.privileges as permissions,"
            . "\n u.role,"
            . "\n u.lastlogin,"
            . "\n u.created,"
            . "\n u.lastloginfrom,"
            . "\n u.status"
            . "\n FROM $core->uTable u"
            . "\n " . $clause
            . "\n ORDER BY " . $sorting . $pager->limit;

        $row = $db->query($sql);

        //        foreach ($row as $key => $value):
        //            $row[$key]["permissions"] = unserialize($row[$key]["permissions"]);
        //        endforeach;

        return !empty($row) ? $row : 0;
    }
    /**
     * Arange users DB data to create HTML TABLE output.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @param type $data
     * @return string
     */
    function arrangeUserTableData($data)
    {
        global $core, $fhand;

        $temp = array();
        $temp['th'] = $temp['body'] = null;
        $i = 0;
        foreach ($data[0] as $key => $value) {
            $i++;
            $tte = @$temp['th'][$key];

            if (@in_array($key, $tte))
                continue;

            $temp['th'][$key] = $key;
        }
        $temp['th']['user_actions'] = 'user_actions';
        $temp['th'] = $core->push_before('status', $temp['th'], 'disk_usage', 'disk_usage');


        foreach ($data as $key => $value) {
            $temp['body'][$key] = $value;

            if (!isset($temp['body'][$key]['disk_usage']) && isset($temp['body'][$key]['status']))
                $temp['body'][$key] = $core->push_before('status', $temp['body'][$key], 'disk_usage', $fhand->calcUserUsagePercentage($value['id'], $value['disklimit']));

            if (!isset($temp['body'][$key]['user_actions'])) {
                $temp['body'][$key]['user_actions'] = '<span class="foacts">'
                    . '<button type="button" class="deleteuser btn btn-xs ' . ($value['id'] == 1 ? 'btn-default disabled' : 'btn-maroon') . '" data-id="' . $value['id'] . '" data-name="' . $value["name"] . '" data-action="uf_delete" title="Remove user"  rel="tip" data-container="item">'
                    . '<i class="icon icon-trash-o"></i>'
                    . '</button>'
                    . '</span>';
            }
        }
        return $temp;
    }

    /**
     * Create user status change button.
     * @todo this function will be placed on class.content.php
     * @param type $status
     * @return string
     */
    public function userStatusSignBtn($status)
    {

        if ($status == "admin") {

            $display = '<button class="btn btn-xs btn-default active disabled">'
                . '<i class="icon icon-check"></i>'
                . '</button>';
        } else {


            if ($status == "active") {
                $attr = 'title="Click to deactivate user."';
                $cls = 'btn-lightblue';
                $icon = 'icon-check-square';
            } else {
                $attr = 'title="Click to activate user."';
                $cls = 'btn-orange';
                $icon = 'icon-minus-square';
            }

            $display = '<button type="button" class="changestatus btn btn-xs ' . $cls . '" ' . $attr . ' data-toggle="button" rel="tip" data-container="item">';
            $display .= ' <i class="icon ' . $icon . '"></i>';
            $display .= '</button>';
        }

        return $display;
    }
    /**
     * What is the total size of user
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @param type $user_id
     * @param type $newsize
     */
    public function disklimitUser($user_id, $newsize)
    {
        global $db, $core, $fhand, $content;

        if ($this->isAdmin()) {

            $size = $core->getNumbersOnly($newsize);

            if ($newsize == "" || $size == 0) {

                $core->jsonE["result"] = 0;
                $core->jsonE['msg'] = "Error! Given value can not be equal to zero.";
            }

            if (empty($core->jsonE['msg'])) {

                $unit = $fhand->getUnitFromString($newsize);

                $bytes = $fhand->formatToBytes($newsize);

                $sysFreeSpace = $fhand->getSystemDiskSize();


                if ($sysFreeSpace != 0 && $bytes >= $sysFreeSpace) {

                    $core->jsonE["result"] = 0;
                    $core->jsonE['msg'] = "Error! Given value ($size$unit) can not be bigger than free disk space.";
                }
            }

            if (empty($core->jsonE['msg'])) {
                $data = array(
                    "disklimit" => $bytes
                );
                $updated = $db->update($core->uTable, $data, "id = :user_id", array("user_id" => $user_id));

                if ($updated) {
                    $core->jsonE["result"] = 1;
                    $core->jsonE['newValue'] = "$size$unit";
                    $core->jsonE['data'] = array(
                        "user_usage_percentage_{$user_id}" => $content->createProgressBarHTML($fhand->calcUserUsagePercentage($user_id, $fhand->formatToBytes("$size$unit")), false, "usage no-round user_usage_percentage", "margin: 0")
                    );
                    $core->jsonE['message']['title'] = \Nedo\Lang::get("Success");
                    $core->jsonE['message']['txt'] = '<strong>User Disk Quota updated successfully.</strong>';
                } else {
                    $core->jsonE["result"] = 0;
                    $core->jsonE['newValue'] = "$size$unit";
                    $core->jsonE['msg'] = "Sorry! The given value is the same.";
                }
            }
        } else {
            redirectPage_to(CLO_URL);
        }
    }

    /**
     * Active/inactive user.
     * 
     * @global type $db
     * @global type $core
     * @param type $user_id
     * @param type $status
     */
    public function toggleStatus($user_id, $status)
    {
        global $db, $core;

        if ($this->isAdmin()) {

            if ($user_id == 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Error");
                $core->jsonE['message']['txt'] = "Sorry! You can not change the administrator account status!";
                return false;
            }

            $data = array("status" => $status);

            $updated = $db->update($core->uTable, $data, "id= :user_id", array("user_id" => $user_id));

            if ($updated) {
                $core->jsonE["result"] = 1;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Success");
                $core->jsonE['message']['txt'] = "<strong>" . \Nedo\Lang::get("User status updated successfully") . "</strong>";
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Error");
                $core->jsonE['message']['txt'] = \Nedo\Lang::getMulti(array("Sorry", "I encountered an error", "Please try again"));
            }
        } else {
            redirectPage_to(CLO_URL);
        }
    }
    /**
     * Delete/remove user with all files and folders.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @param type $user_id
     * @return boolean
     */
    public function deleteUser($user_id)
    {
        global $db, $core, $fhand;

        if ($this->isAdmin()) {
            if ($user_id == 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Error");
                $core->jsonE['message']['txt'] = \Nedo\Lang::getMulti(array("Sorry", "You can not delete the administrator account"));
                return false;
            }

            $deleted = $db->delete($core->uTable, "id = :id", array("id" => $user_id));

            if ($deleted) {

                //remove userdata if any exists
                $deleted = $db->delete($core->vTable, "{$this->dpfu}id = :id", array("id" => $user_id));

                $userdir = UPLOAD_PATH . return6charsha1($user_id);

                //delete user files and folders from DB.
                $fhand->deleteUserAllFoldersDB($user_id);
                $fhand->deleteUserAllFilesDB($user_id);
                //delete user physical files and personal directory.
                $fhand->removeDirectory($userdir);

                //thats all ok return true.         
                $core->jsonE["result"] = 1;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Success");
                $core->jsonE["message"]['txt'] = '<strong>' . \Nedo\Lang::get("User deleted successfully") . '</strong>';
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Error");
                $core->jsonE['message']['txt'] = \Nedo\Lang::getMulti(array("Sorry", "I encountered an error", "Please try again"));
            }
        } else {
            redirectPage_to(CLO_URL);
        }
    }
    /**
     * Updates currently logged user profile.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $encryption
     * @return type
     */
    public function updateProfile()
    {
        global $db, $core, $encryption;

        $core->msgs = array();

        if (empty($_POST['user_name']))
            $core->msgs['user_name'] = \Nedo\Lang::get("Please enter your name");

        if (!checkAlphabetic($_POST['user_name']))
            $core->msgs['user_name'] = \Nedo\Lang::get("Please check your name that should be alphabetic only");

        if ($this->isAdmin()) {
            $email = sanitise($_POST['email']);
            if (empty($email)) {

                $core->msgs['user_email'] = \Nedo\Lang::get("Please enter your email");
            }
        }

        if (empty($core->msgs)) {

            $data = array(
                'name' => sanitise($_POST['user_name']),
            );

            if ($this->isAdmin()) {
                $data["email"] = sanitise($_POST["email"]);
            }

            /*
            if ( !empty($_POST['user_password']) ) {
                $data['password'] = $encryption->encode($_POST['user_password']);
            }*/

            $updated = $db->update($core->uTable, $data, "id= :user_id", array("user_id" => $this->userid));

            if ($updated) {
                $core->jsonE["result"] = 1;
                $core->jsonE["title"] = \Nedo\Lang::get("Success");
                $core->jsonE["message"] = '<strong>' . \Nedo\Lang::get("Your profile updated successfully") . '</strong>';
            } else {
                $core->jsonE["result"] = 2;
                $core->jsonE["title"] = \Nedo\Lang::get("Warning");
                $core->jsonE['message'] = \Nedo\Lang::get("I couldn't find any changes to edit");
            }
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE["title"] = \Nedo\Lang::get("Error");
            $core->jsonE["message"] = \Nedo\Content::implodeMessages();
        }
        return $core->jsonE;
    }
    /**
     * Update only email address of currently logged user.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $encryption
     * @param type $userid
     */
    public function updateUserEmail($userid = false)
    {
        global $db, $core, $encryption;

        $user_email = sanitise(post("email"));

        $exist = $this->emailExists($user_email);
        if (!$exist) {
            $data = array("email" => $user_email);

            $updated = $db->update($core->uTable, $data, "{$this->dpfu}id= :id", array(
                "id" => ($userid ? $userid : $this->userid)
            ));

            if ($updated) {
                $core->jsonE["result"] = 1;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Thank you");
                $core->jsonE['message']['txt'] = '<strong>' . \Nedo\Lang::get("Your email was updated successfully") . '</strong>';
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE['message']['title'] = \Nedo\Lang::get("Error");
                $core->jsonE['message']['txt'] = \Nedo\Lang::getMulti(array("Sorry", "I encountered an error", "Please refresh the page and try again"));
            }
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE["callback"] = 'fullreload()';
        }
    }
    /**
     * Register process will passed on this function.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @global \Nedo\type $encryption
     * @param type $info
     * @return boolean
     */
    public function register($info = false)
    {
        global $db, $core, $fhand, $encryption;
        if ((isset($_POST["registerme"]) && $encryption->decode($_POST["registerme"]) == date("Ymd")) || (is_array($info) && !empty($info))) {

            $welcome = false;
            $pass = sanitise($info ? $info['passw'] : $_POST['register-passw']);
            $name = sanitise($info ? $info['register-fname'] : $_POST['register-fname']);
            $email = sanitise($info ? $info['register-email'] : $_POST['register-email']);

            if (!$info) {

                if (empty($_POST['register-terms']))
                    $core->msgs['register-terms'] = \Nedo\Lang::get("Please check the user agreement");
                if (empty($_POST['register-email']))
                    $core->msgs['register-email'] = \Nedo\Lang::get("Please enter valid email address");
                if ($_POST['register-email'] == $core->site_email)
                    $core->msgs['register-email'] = \Nedo\Lang::get("Please enter valid email address");
                if (empty($_POST['register-fname']))
                    $core->msgs['register-fname'] = \Nedo\Lang::get("Please enter your name");
                if (empty($_POST['register-passw']))
                    $core->msgs['register-passw'] = "Please specify a password.";
                if ($_POST['register-passw'] != $_POST['register-passws'])
                    $core->msgs['register-passw'] = "Passwords does not match.";
                if (empty($_POST['captcha']))
                    $core->msgs['captcha'] = "Please enter the security code.";
                if ($_POST['captcha'] != $_SESSION['uscaptcha'])
                    $core->msgs['captcha'] = "Please check the security code.";
                if (isset($_POST['register-email']) && $this->emailExists($_POST['register-email']) !== false) {
                    $core->msgs['register-email'] = 'There is an account associated with this email. <a href="#page=recover">Forgot</a> your password?';
                }
            } //is not auto register

            if (empty($core->msgs) && $_POST['captcha'] == $_SESSION['uscaptcha']) {
                $data = array(
                    'name' => sanitise($name),
                    'password' => $encryption->encode($pass),
                    'email' => sanitise($email),
                    'disklimit' => $core->upload_user_default_disk_limit,
                    'status' => 'active',
                    'created' => ":now()"
                );

                $insert = $db->insert($core->uTable, $data);

                $useridf = $db->lastInsertId();

                if ($insert) {

                    //user was created so touch some additional things...
                    //create user physical folder and put inside an index.php file
                    $ui_dir = return6charsha1($useridf);
                    $uipath = UPLOAD_PATH . $ui_dir;
                    $uidir = @mkdir($uipath . '/thumbnail/', 0777, true);
                    $uidir = @mkdir($uipath . '/view/', 0777, true);

                    if ($uidir) {

                        createIndexFile(2, $uipath);
                        createIndexFile(3, $uipath . '/thumbnail/');
                        createIndexFile(3, $uipath . '/view/');
                        //add .htaccess
                        file_put_contents($uipath . DS . '.htaccess', "<IfModule mod_php5.c>\n php_flag engine off \n</IfModule>");

                        $fhand = new \Nedo\FileHandler();

                        $fhand->createSampleData($useridf);

                        $datau = array(
                            "dir" => $ui_dir
                        );

                        //update user dir;
                        $db->update($core->uTable, $datau, "id = :user_id", array(
                            "user_id" => $useridf
                        ));
                    }

                    $this->login($data['email'], $pass);

                    if ($core->register_send_welcome_mail) {
                        $welcome = $core->sendSingleMail('welcome', $data['email'], $data['name'], $pass);
                    }

                    if (!$info) {
                        $core->msgs = array("message" => '
                             <script>
                             // <![CDATA[
                             $(function() {
                             $("#form-login").blockit({message : "Your account has been created!<br>Please wait while being redirected in <span id=\"countrd\"></span> or click <a href=\"' . $core->site_url . '\" >here</a>"}); $("#countrd").countdown(6, "s", function() {  window.location.href = "/";});
                             });
                             // ]]>
                             </script>');
                    } else {
                        //auto register is ok;
                        return $useridf;
                    }
                }
            }
        } else {
            if ($info)
                return false;

            $core->msgs = array("title" => false, "message" => "Something wrong with your session!
                ###refresh this page and try again.###always use usual ways.");
        }
        return (!$welcome ? \Nedo\Content::alertMessage("danger", true, true, true) : \Nedo\Content::returnMessage());
    }

    /**
     * Create user directories and prepare to login
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $useridf
     */
    public function createUserDirs($useridf)
    {
        global $db, $core;

        $ui_dir = return6charsha1($useridf);
        createIndexFile(2, $uipath);
        createIndexFile(3, $uipath . '/thumbnail/');
        createIndexFile(3, $uipath . '/view/');
        //add .htaccess
        file_put_contents($uipath . DS . '.htaccess', "<IfModule mod_php5.c>\n php_flag engine off \n</IfModule>");

        $fhand = new \Nedo\FileHandler();

        $fhand->createSampleData($useridf);
        $data = array(
            "dir" => $ui_dir
        );

        //update user dir;
        $db->update($core->uTable, $data, "id= :id", array(
            "id" => $useridf
        ));
    }

    /**
     * Start to reset user password.
     * 
     * @global type $db
     * @global type $core
     * @return type
     */
    public function reset()
    {
        if (!$this->logged_in) {
            global $db, $core, $encryption;
            $result = 0;
            if ($encryption->decode($_POST["resetme"]) == date("Ymd")) {
                $core->jsonE["result"] = 0;

                if (empty($_POST['captcha']))
                    $core->msgs[] = "Please enter the security Code!";
                if ($_POST['captcha'] != $_SESSION['uscaptcha'])
                    $core->msgs['captcha'] = "Please check the security Code!";

                if (empty($core->msgs)) {

                    $mail = sanitise($_POST['reset-email']);

                    $row = $this->getUserInfo($_POST['reset-email']);
                    $data = array(
                        "token" => $encryption->encode($mail . '!' . time())
                    );
                    if ($row) {

                        $recover = $core->sendSingleMail('reset', $row['email'], $row['name'], false, $data['token']);

                        if ($recover) {
                            //set user_token
                            $db->update($core->uTable, $data, "id = :id", array(
                                "id" => $row['id']
                            ));

                            $core->jsonE["result"] = 1;
                            $core->msgs['result'] = "We have sent an e-mail to you, check your email please.";
                        } else {
                            $core->jsonE["result"] = 0;
                            $core->msgs['error'] = \Nedo\Lang::getMulti(array("Sorry", "I encountered an error", "Please try again"));
                        }
                    } else {
                        $core->jsonE["result"] = 2;
                        $core->msgs['error'] = "Sorry! I encountered an error. Please check your email address and try again.";
                    }
                }
            } else {
                $core->jsonE["result"] = 0;
                $core->msgs['session'] = "Something wrong with your session!
                ###refresh this page and try again.###always use usual ways.";
            }
            return \Nedo\Content::alertMessage("danger", true, true, true);
        }
    }

    /**
     * Continue reset process after user follow the email which sent on ::reset() function.
     * 
     * @global type $db
     * @global type $core
     * @global type $encryption
     * @return type
     */
    public function resetProcess()
    {
        if (!$this->logged_in) {
            global $db, $core, $encryption;
            $login = false;
            if ($encryption->decode($_POST["resetme"]) == date("Ymd")) {

                if (empty($_POST['reset-passw']))
                    $core->msgs = array("title" => "Error! ", "message" => "Please enter your new password!");

                if ($_POST['reset-passw'] != $_POST['reset-passws'])
                    $core->msgs = array("title" => "Error! ", "message" => "Please confirm your password!");

                if (empty($_POST['captcha']))
                    $core->msgs = array("title" => "Error! ", "message" => "Please enter the security Code!");
                if ($_POST['captcha'] != $_SESSION['uscaptcha'])
                    $core->msgs = array("title" => "Error! ", "message" => "Please check the security Code!");

                if (empty($core->msgs)) {

                    $uin = $encryption->decode($_POST['reset']);

                    $uin = explode("!", $uin);

                    $mail = sanitise($uin[0]);
                    $newpass = $_POST['reset-passw'];

                    $newPassHash = $encryption->encode($newpass);

                    $row = $this->getUserInfo($mail);

                    $data = array(
                        "password" => $newPassHash
                    );
                    if ($row) {

                        //set user_token
                        $recover = $db->update($core->uTable, $data, "id= :id", array(
                            "id" => $row['id']
                        ));

                        if ($recover) {

                            $core->sendSingleMail('resetResult', $row['email'], $row['name'], $newpass, false);

                            $login = $this->login($mail, $newpass);
                            $core->msgs = '';

                            $core->msgs = array("message" => '
                                <script>
                                // <![CDATA[
                                $(function() {
                                $("#reset_form").closest(".well:first").blockit({message : "You have set your new password successfuly you will be redirected in <span id=\"countrdr\"></span> or click <a href=\"' . $core->site_url . '\" ><b>here</b></a>."}); $("#countrdr").countdown(6, "s", function() { window.location.href = "/";});
                                });
                                // ]]>
                                </script>');
                        } else {
                            $core->msgs = array("title" => false, "message" => \Nedo\Lang::getMulti(array("Sorry", "I encountered an error", "Please try again")));
                        }
                    } else {
                        $core->msgs = array("title" => false, "message" => "Sorry! I encountered an error. Please check your e-mail twice and try again.");
                    }
                }
            } else {
                $core->msgs = array("title" => false, "message" => "Something wrong with your session!
                ###refresh this page and try again.###always use usual ways.");
            }
        }

        return (!$login ? \Nedo\Content::alertMessage() : \Nedo\Content::returnMessage());
    }

    /**
     * Check User toket which was sent on ::reset() function
     * 
     * @global type $db
     * @global type $core
     * @param type $token
     * @return boolean
     */
    public function checkUserToken($token)
    {
        global $db, $core;

        $sql = "SELECT email,id FROM $core->uTable WHERE token = :token LIMIT 1";

        $row = $db->row($sql, array(
            "token" => sanitise($token)
        ));

        if (count($row) > 0) {
            return $row;
        } else {
            return false;
        }
    }

    /**
     * Get user quota
     * 
     * @global type $core
     * @global type $fhand
     * @return type
     * feautered.
     */
    public function getUserSpaceLimit($notformat = false)
    {
        global $core, $fhand;

        $globalLimit = $core->upload_user_default_disk_limit;

        $adminLimit = $fhand->formatBytes(0, 2, true);

        if ($this->isAdmin()) {
            return $notformat;
        } else {
            return $globalLimit;
        }
    }


    public function setUserPrivileges($user_id)
    {
        global $db, $core;

        $permissions = post("value");

        $tempPermissions = array();

        $newPermissionsArr = array();

        if ($permissions)
            foreach ($permissions as $key => $permission) {

                $tempPermissions[$permission] = 1;

                array_push($newPermissionsArr, $permission);
            }

        foreach ($this->permitAll as $key => $value) {
            if (!isset($tempPermissions[$key])) {
                $tempPermissions[$key] = 0;
            }
        }

        $data = array(
            "privileges" => serialize($tempPermissions)
        );

        $updated = $db->update($core->uTable, $data, "id = :user_id", array("user_id" => $user_id));

        if ($updated) {
            $core->jsonE["result"] = 1;
            $core->jsonE['newValue'] = $newPermissionsArr;
            $core->jsonE['data'] = "";
            $core->jsonE['message']['title'] = \Nedo\Lang::get("Success");
            $core->jsonE['message']['txt'] = '<strong>User permissions edited as the following</strong>'
                . '<ul>';
            foreach ($tempPermissions as $k => $p) :
                $text = mb_convert_case($k, MB_CASE_TITLE, "UTF-8");
                $core->jsonE['message']['txt'] .= "<li>{$text}: " . ($p ? '<i class="icon icon-check"></i>' : '<i class="icon icon-times"></i>') . "</li>";
            endforeach;

            $core->jsonE['message']['txt'] .= '</ul>';
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE['newValue'] = "$size$unit";
            $core->jsonE['msg'] = "Sorry! The given value is the same.";
        }
    }

    /**
     * Return user privileges with combining user table and options table
     * 
     * @global \Nedo\type $core
     * @param type $permSerialized
     * @return type
     */

    public function getUserPrivileges($permSerialized = false, $role = false)
    {
        global $core;

        if ($role == "admin") {
            foreach ($this->permitAll as $key => $value) {
                $this->jsperms[] = $key;
            }
            return $this->permitAll;
        }

        $privileges = array();

        $coreItemPrivileges = array();


        foreach ($core->settings as $key => $value) {
            //get only item permissions from options
            if (substr($key, 0, 5) == "item_") {
                $coreItemPrivileges[$key] = $value;
            }
        }

        if ($permSerialized) {

            //check if items readonly is on/off generally
            if ($core->items_readonly) {
                $privileges = array();
                foreach ($this->permitAll as $key => $value) {
                    $privileges[$key] = 0;
                }
            } else {

                $privileges = unserialize($permSerialized);
                //complete undefined permissions from options permissions
                foreach ($coreItemPrivileges as $key => $value) {
                    if (array_key_exists(str_replace("item_", "", $key), $privileges) === false) {
                        $privileges[str_replace("item_", "", $key)] = $value;
                    }
                }
            }
        } else {
            //check if items readonly is on/off generally
            if ($core->items_readonly) {
                $privileges = array();
                foreach ($this->permitAll as $key => $value) {
                    $privileges[$key] = 0;
                }
            } else {

                $privileges = array(
                    "download" => $core->item_download,
                    "compress" => $core->item_compress,
                    "share" => $core->item_share,
                    "rename" => $core->item_rename,
                    "copy" => $core->item_copy,
                    "move" => $core->item_move,
                    "delete" => $core->item_delete,
                    "email" => $core->item_email,
                    "describe" => $core->item_describe,
                    "sync" => $core->item_sync,
                    "create" => $core->item_create
                );
            }
        }

        foreach ($privileges as $key => $perm) {
            if ($perm)
                $this->jsperms[] = $key;
        }

        return $privileges;
    }

    /**
     * 
     * @return int
     */
    public function countPermissions($user_id = false)
    {
        $total = 0;
        if ($user_id) {
            $userInfo = $this->getUserInfo($user_id);
            $privileges = $userInfo["privileges"];
        } else {
            $privileges = $this->privileges;
        }
        foreach ($privileges as $key => $value) {
            if ($value) {
                $total++;
            }
        }
        return $total;
    }

    /**
     * 
     * @param type $privilege
     * @return boolean
     */
    public function checkUserPrivilege($privilege)
    {

        if (array_key_exists($privilege, $this->privileges) && $this->privileges[$privilege])
            return true;
        else
            return false;
    }

    /**
     * Get maximum allowed size of single file on upload process.
     * 
     * @global type $core
     * @global type $fhand
     * @return type
     * feautered.
     */
    public function getUserFileUploadSizeLimit($notformat = false)
    {
        global $core, $fhand;
        return $notformat ? $core->upload_max_file_size_limit : ($fhand->formatBytes($core->upload_max_file_size_limit, 2, true));
    }

    /**
     * Get maximum allowed item limit on upload process.
     * 
     * @global type $core
     * @return type
     * feautered.
     */
    public function getUserFileUploadItems()
    {
        global $core;
        $limit = sanitise($core->upload_user_default_up_items);
        return $limit == 0 ? 'N/A' : $limit;
    }

    public function getUserAllowedFileTypes($type = false)
    {
        global $core, $fhand;
        $types = $fhand->getAllowedTypesRegex($core->upload_allowed_file_types, $type);
        return mb_strtolower($types) == 'all' ? false : $types;
    }

    /**
     * Checks if this email exists on DB
     * 
     * @global type $db
     * @global type $core
     * @param type $user_email
     * @return boolean
     */
    public function emailExists($user_email)
    {
        global $db, $core;

        $sql = "SELECT * FROM $core->uTable WHERE email = :email LIMIT 1";

        $row = $db->row($sql, array(
            "email" => sanitise($user_email)
        ));

        if (count($row) > 0) {
            $core->jsonE["message"] = "Entered e-mail address is already in use.";
            return $row;
        } else {
            return false;
        }
    }

    /**
     * Returns user data such as email suggestion objects
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $q
     * @param type $type
     * @return type
     */
    public function getuserData($q, $type = false)
    {
        global $db, $core;

        $sql = "SELECT value FROM $core->vTable WHERE user_id = :user_id AND type = :type AND value LIKE :value";

        $data = $db->query($sql, array(
            "value" => "%" . ($q) . "%",
            "type" => $type,
            "user_id" => $this->userid
        ));

        return (!empty($data)) ? $data : false;
    }
}
//user class ends
?>