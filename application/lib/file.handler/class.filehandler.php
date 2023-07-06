<?php

/**
 * class.filehandler
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: class.filehandler.php UTF-8 , 06-Jul-2013 | 18:53:08 nwdo ε
 */

namespace Nedo;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

use Nedo\Image\Image;

/**
 * All file & folder operations.
 */
class Filehandler
{

    var $f_err;
    /** Error for the upload methods */
    var $lastname = null;
    var $dpfi = 'file_';
    /** prefix for columns of "files" */
    var $dpfo = 'folder_';
    /** prefix for columns of "folders" */
    var $path;
    var $from;
    var $to;
    var $aContent = array();
    var $folder_path = "";
    /** this is a temp path value of requested folder */
    var $debug = false;
    public $static_folder_mime_Arr = array();
    public $filesChanged = false;
    var $foldersArr, $subdirs, $parents, $boundedFoldersUp, $searched_folders = array();
    var $folder_name, $folderPath, $folderLevel = '';
    var $filesum = 0;
    /**
     * Which item extensions are known as viewable on system?
     * @var type 
     */
    public $viewableTypesArr = array(
        "jpg",
        "jpeg",
        "gif",
        "png",
        "bmp",
        "mp4",
        "m4a",
        "ogv",
        "ogg",
        "mov",
        "mp3",
        "avi",
        "wav",
        "wmv",
        "wma",
        "webm",
        "acc",
    ); //etc...
    /**
     * Deny all actions for the following extensions...
     * @var type 
     */
    var $prohibitedTypesArr = array(
        "php",
        "php3",
        "asp",
        "aspx",
        "py",
        "jsf",
        "cgi"
    );
    /**
     * Predefined folder names that a user cannot create the same.
     * @var type 
     */
    private $prohibitedFolderNameArr = array(
        "thumbnail",
        "view",
        "tmp"
    );
    private $userFiles;
    private $countImageFiles = 0;
    private $countVideoFiles = 0;
    private $countAudioFiles = 0;
    private $countDocumentFiles = 0;
    /**
     * generally which mime types can be viewed
     * @var type 
     */
    public $allViewableMimeArr = array(
        "image" => "plus",
        "audio" => "play-circle",
        "video" => "play-sign"
    );
    /**
     * Font-awesome icon array
     * @var type 
     */
    public $typesAvesomeIcons = array(
        "video" => "icon-youtube-play",
        "image" => "icon-picture-o",
        "folder" => "icon-folder",
        "document" => "icon-file-text",
        "other" => "icon-suitcase",
        "audio" => "icon-music"
    );
    /**
     * Colorize by item type
     * @example code file is gray video is orange audio is blue an image is violet and an other file colored as light-orange( dark yellow )
     * @var type 
     */
    public $typesColors = array(
        "file" => "gray",
        "folder" => "dark-gray",
        "image" => "violet",
        "video" => "orange",
        "audio" => "blue",
        "document" => "green",
        "other" => "light-orange"
    );
    /**
     * Which item extensions are known as image on the system?
     * @var type 
     */
    public $imageTypes = array(
        'jpg',
        'jpeg',
        'gif',
        'png',
        'bmp',
        'tiff',
        'psd',
        'eps',
        'svg'
    );
    /**
     * Which item extensions are known as document on the system?
     * @var type 
     */
    public $documentTypes = array(
        'pdf',
        'doc',
        'rtf',
        'docx',
        'xls',
        'xlsx',
        'xltx',
        'potx',
        'pps',
        'ppsx',
        'sldx',
        'ppt',
        'rtf',
        'docx',
        'dotx',
        'xlam',
        'xlsb',
        'txt',
        'odt',
        'ods',
    );

    public $localViewableDocTypes = array(
        "txt",
        "pdf",
        "js",
        "php",
    );

    public $previewable = array(
        "image",
        "audio",
        "video"
    );

    public $countUserFoldersNum;
    var $countCurrViewFiles;
    var $archiveFoldersArr = array();
    var $archive;
    private $current_folder_tree = array();
    private $exclude_files = array("view", "thumbnail", "index.php", "update.clo");

    /**
     * Start to construct file actions
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     */

    function __construct()
    {

        global $core, $user;

        if ($user && $user->logged_in) {
            $this->arrangeIdStaticFoldersType(true);
        }

        /**
         * Add .psd to the viewable extensions array if it's enabled
         */
        if ($core->upload_psd_preview)
            array_push($this->viewableTypesArr, "psd");

        $this->arrangeViewableTypes();

        //fix document files if google api is ok

    }

    function arrangeViewableTypes()
    {

        $viewerPath = VIEW_PATH . 'viewer' . DS;
        $typesArray = $this->createTypesArrays(false);
        unset($typesArray["image"]);

        foreach ($typesArray as $key => $type) {

            foreach ($type as $k => $t) :
                if ($t && file_exists($viewerPath . $key . DS . (string)$t . DS . "config.php")) {

                    array_push($this->viewableTypesArr, (string)$t);
                }
            endforeach;
        }
        //        foreach($typesArray)
    }

    /**
     * Match all physical files in the current directory with Database.
     * Deletes from DB if physical file does not exists
     * Asks user what to do if a folder removed on physical disk and exists on DB.
     * Checks if update mark is alive then updates current directory and fetches information from any .inf file.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $encryption
     * @param type $current_folder_id
     * @param type $path
     * @param type $slient
     * @return boolean
     */

    function matchUserFilesAndFolders($current_folder_id, $path = false, $slient = false)
    {
        global $db, $core, $user, $encryption;

        //try to set time limit 0
        @set_time_limit(0);

        $updateDB = false;

        $path = $path ? $path : post("path");
        $full_path = $user->full_path . $path;
        $full_path = rtrim($full_path, "/") . '/';


        $Rfiles_folders = $this->readFolder($full_path);

        //check and remove update.clo file if exists in the directory!
        if ($this->checkFile($full_path . "update.clo")) {
            unlink($full_path . "update.clo");
            $updateDB = true;
        }

        $Vfolders = $this->getUserFolders($current_folder_id);
        $Vfiles = $this->getFolderFiles($current_folder_id);

        $allfiletypes = array_flip($this->allFileTypes()); //flip array to use them by mime

        foreach ($Rfiles_folders as $key => $item) {

            //match dirs
            if ($item['type'] == "dir") {

                if (!$this->checkFolderExistBySlug($key, $current_folder_id)) {

                    $infile = $full_path . $key . '-inf.inf';
                    $dirdescription = "";
                    if (is_file($infile) && $this->checkFile($infile)) {
                        $infos = $this->parseInfoFile($infile);
                        $dirdescription = $infos["description"];
                    }
                    //create a folder in DB if its not there
                    $this->createFolder($key, $dirdescription, "", $current_folder_id, $path, $item['date']);
                    //add update it mark on first load
                    $create_update_file = $this->recurse_mark_update(rtrim($path, "/") . '/' . $key, true);
                }
            } else {

                //        //match files in DB with the physical ones
                if (!empty($Vfiles)) {
                    foreach ($Vfiles as $key => $file) {
                        //data there but file hence delete it from DB
                        $file_full_path = $full_path . $file['file_name'] . '.' . $file['file_extension'];

                        if (!$this->checkFile($file_full_path)) {

                            $this->deleteFileFromDB($file['file_id']);
                        }
                    }
                }

                //match files
                $extension = isset($allfiletypes[$item['mime']]) ? $allfiletypes[$item['mime']] : "";
                $textension = $item['extension'];
                $extension = ($extension == $textension) ? $extension : $textension;

                $pureName = $item['name'];
                $filename = $pureName . '.' . $extension;

                $key = md5_file($full_path . $filename, false); //$this->generateFileKey($full_path.$item['name']);                

                $file = $this->checkfilexistDB($key, $current_folder_id, false, $user->userid);

                if (!$file) {

                    $file = array(
                        /**
                         * @todo access types = 1: private, 2: public (for future versions of CLOSHARE
                         */
                        "access" => 1,
                        "description" => NULL,
                        "name" => $pureName, //remove extension from name
                        "key" => $key,
                        "extension" => $extension,
                        "folder" => $current_folder_id,
                        "mime_id" => $this->setfilemimeFolderId($item['mime'], $extension),
                        "path" => $path,
                        "size" => $item['size'],
                        "date" => ":now()",
                        "changed" => $item["changed"],
                        "modified" => $item['modified'],
                        "prepend" => 0
                    );

                    //check for an info file
                    $infile = $full_path . $filename . '-inf.inf';

                    if (is_file($infile) && $this->checkFile($infile)) {

                        $infos = $this->parseInfoFile($infile);
                        foreach ($infos as $key => $info) {
                            if (array_key_exists($key, $file))
                                $file[$key] = $info;
                        }
                    }

                    $file = (object) $file;
                    $this->insertFileToDB($file, false);
                } else {

                    if ($updateDB) {
                        $data = array(
                            "file_path" => rtrim($path, "/") . '/'
                        );

                        $db->update($core->fTable, $data, "{$this->dpfi}id='" . (int) $file['file_id'] . "' AND {$this->dpfi}user_id =" . $user->userid);
                    }
                }

                //check for thumbs if its an image
                if ($this->isImage($extension) && strtolower($extension) != "psd"/*&& strtolower($extension) != "bmp"*/) {
                    $extension = $this->fixtnExtensions($extension);
                    $this->createThumb($full_path . $filename, $extension, $key);
                }
            }
        }
        unset($key);
        unset($item);

        //match db files again
        if (!empty($Vfiles)) {

            foreach ($Vfiles as $key => $file) {
                //data there but file hence delete it from DB
                $file_full_path = $full_path . $file['file_name'] . '.' . $file['file_extension'];

                if (!$this->checkFile($file_full_path)) {

                    //$this->deleteFileorFiles("f_" . $file['file_id'], false, $file['file_folder']);
                    $this->deleteFileFromDB($file['file_id']);
                }
            }
        }

        $itemnames = '';
        //if a folder is not exist on the disk ask user what should i do?
        if (is_array($Vfolders) && !empty($Vfolders))
            foreach ($Vfolders as $key => $item) {

                if ($item['folder_parent_id'] == $current_folder_id) {

                    $rdir = $full_path . $item['folder_vpath'];

                    if (!is_dir($rdir) && !isset($_COOKIE['_prevent_121'])) {

                        $core->jsonE['ppop']['items'][] = $item['folder_id'];
                        $itemnames .= $item['folder_name'] . ', ';
                    }
                }
            }

        unset($key);
        unset($file);



        if (!empty($core->jsonE['ppop'])) {
            $core->jsonE['ppop']['id'] = 121; //doesnt match
            $core->jsonE['ppop']['title'] = \Nedo\Lang::get("You need to pay attention");
            $core->jsonE['ppop']['action'] = array(
                array('label' => 'Delete', 'className' => 'btn-danger btn-sm', 'callback' => 'qDirActions:deldir', 'value' => $core->jsonE['ppop']['items']),
                array('label' => 'Re-create', 'className' => 'btn-primary btn-sm', 'callback' => 'qDirActions:recreatedir', 'value' => $core->jsonE['ppop']['items']),
                array('label' => 'Don\'t ask for a while', 'className' => 'btn btn-sm', 'callback' => '$.cookie("_prevent_121", 1);')
            );
            $core->jsonE['ppop']['message'] = 'The following folders are missing on the disk!<b class="uld db well well-small mtb5 p5">' . rtrim($itemnames, ', ') . '</b>What do you want me to do?';
        }

        if (empty($core->jsonE) || (isset($core->jsonE['message']) && !isset($core->jsonE['message']['txt']))) {
            unset($core->jsonE['message']);

            if (!$slient) {
                $core->jsonE['result'] = 1;
                $core->jsonE['message']['title'] = 'Success!';
                $core->jsonE['message']['txt'] = "Sync complete";
                $core->jsonE['message']['icon'] = "check";
            } else {
                return true;
            }
        }

        //show a message to user.
    }

    /**
     * Creates thumbnail image on the given image path( the original image path ). It also look for the cache before creation.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $image_path
     * @param type $ext
     * @param type $md5_key
     */
    function createThumb($image_path, $ext, $md5_key = false)
    {
        global $core, $user;

        $key = ($md5_key) ? $md5_key : md5_file($image_path);

        $extension = ($ext) ? $ext : pathinfo($image_path, PATHINFO_EXTENSION);

        $thumbPath = $user->full_path . '/thumbnail/';

        $thumb_image = $key . '.' . $extension;

        $thumb_image_path = $thumbPath . $thumb_image;

        //if (!$this->checkFile($thumb_image_path)) {

        $image = Image::open($image_path);

        if ($core->upload_thumb_crop) {
            $image->cropResize($core->upload_thumb_w, $core->upload_thumb_h);
        } else {
            $image->scaleResize($core->upload_thumb_w, $core->upload_thumb_h);
        }

        $image->setCacheDir($thumbPath)
            ->setPrettyName($key, false)
            ->guess();
        //}
    }

    /**
     * List files and folders with their attributes/starts and ends with the given path
     * 
     * @param string $dir
     * @return type 
     */
    function readFolder($dir)
    {
        $retval = array();
        if (substr($dir, -1) != "/")
            $dir .= "/";
        if ($handle = opendir($dir)) {

            while (false !== ($entry = readdir($handle))) {

                if ($entry[0] == ".") {
                    continue;
                }

                if (is_dir("$dir$entry")) {
                    if (!in_array($entry, $this->prohibitedFolderNameArr)) {
                        $retval[$entry] = array(
                            "path" => "$dir$entry/",
                            "type" => filetype("$dir$entry"),
                            "size" => 0,
                            "date" => date('Y-m-d H:i:s', filemtime("$dir$entry"))
                        );
                    }
                } elseif (is_readable("$dir$entry")) {

                    if ($entry != "index.php" && $entry != "update.clo" && (substr($entry, -8) != '-inf.inf')) {

                        @list($dirname, $basename, $extension, $filename) = array_values(pathinfo("$dir$entry"));

                        //fix for noname,noextension files (like .htaccess but not it)
                        $fix = $this->fixNonameFile($filename, $extension, $basename);

                        if ($fix) {
                            $filename = $fix['filename'];
                            $extension = $fix['extension'];
                        }

                        $retval[$entry] = array(
                            "path" => "$dir$entry",
                            "name" => $filename,
                            "extension" => $extension,
                            "type" => "file",
                            "mime" => $this->getMimeType("$dir$entry"),
                            "size" => filesize("$dir$entry"),
                            "changed" => date('Y-m-d H:i:s', filectime("$dir$entry")),
                            "modified" => date('Y-m-d H:i:s', filemtime("$dir$entry"))
                        );
                    }
                }
            }

            closedir($handle);
        }
        return $retval;
    }

    /**
     * Recursive directories from the root path to a html output or an array.
     * 
     * @global \Nedo\type $user
     * @param string $root
     * @param type $relative
     * @param type $toSelect
     * @return string
     */
    function recursive_dirs($root, $relative = true, $toSelect = false)
    {

        global $user;

        $iter = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($root, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST,
            \RecursiveIteratorIterator::CATCH_GET_CHILD // Ignore "Permission denied"
        );
        $root = "/";
        $paths = array($root);

        foreach ($iter as $path => $dir) {

            if ($dir->isDir()) {
                if (in_array($dir->getFilename(), $this->exclude_files)) continue;
                $paths[] = "/" . $this->fixPath($relative ? mb_str_replace($user->full_path, "", $path) : $path);
            }
        }

        if ($toSelect) {
            $core->jsonE['html'] = '<select id="' . $toSelect['id'] . '" name="' . $toSelect['name'] . '" class="' . $toSelect['class'] . '">'
                . '<option value="" selected disabled>Please select</option>';
            foreach ($paths as $key => $rpath) {
                $core->jsonE['html'] .= '<option value="' . $rpath . '">' . $rpath . '</option>';
            }

            $core->jsonE['result'] = 1;
            $core->jsonE['html'] .= '</select>';

            return $core->jsonE;
        }

        return $paths;
    }

    /**
     * @todo Future idea / check files before upload if hashes are the same do not continue, just response as uploaded then update file date-add a note etc...
     * 
     * @param type $fn1
     * @param type $fn2
     * @return boolean
     */
    function files_identical($fn1, $fn2)
    {
        if (filetype($fn1) !== filetype($fn2))
            return FALSE;

        if (filesize($fn1) !== filesize($fn2))
            return FALSE;

        if (!$fp1 = fopen($fn1, 'rb'))
            return FALSE;

        if (!$fp2 = fopen($fn2, 'rb')) {
            fclose($fp1);
            return FALSE;
        }

        $same = TRUE;
        while (!feof($fp1) and !feof($fp2))
            if (fread($fp1, 4096) !== fread($fp2, 4096)) {
                $same = FALSE;
                break;
            }

        if (feof($fp1) !== feof($fp2))
            $same = FALSE;

        fclose($fp1);
        fclose($fp2);

        return $same;
    }

    /**
     * Get all files of user of a current folder.
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @global Paginate $pager
     * @param type $current_folder
     * @return type
     */
    function getUserFiles($current_folder = 1, $filter = false, $orderby = false, $sort = false, $folders = false)
    {
        global $db, $core, $user, $pager;

        $order = ($orderby == 'type') ? 'extension' : $orderby;

        $userdir = $user->user_dir;

        $search = sanitise(post("search"));

        $searchFilter = (isset($_COOKIE["CLO_SF"]) ? $_COOKIE["CLO_SF"] : "all");

        $starred = $search && ($searchFilter == "starred");

        if ($starred && !$filter) {
            $filter = 7;
        }
        $deep = (post("deep") === "true" ? true : false);

        $searchBind = array(
            "search0" => "%" . urldecode($search) . "%",
            "search1" => "%" . urldecode($search) . "%",
        );

        $searchQuery = ($search) ? ("\n AND ( CONCAT_WS('.', {$this->dpfi}name, {$this->dpfi}extension) LIKE :search0"
            . "\n OR f.{$this->dpfi}description LIKE :search1 )") : "";

        if ($orderby) {
            switch ($orderby) {
                case "size":
                    $sqlOrder = "ABS({$this->dpfi}" . $order . ") " . ($sort ? $sort : ' DESC');
                    break;
                case "type":
                    $sqlOrder = "f.{$this->dpfi}extension " . (($sort == 'asc') ? "DESC" : "ASC") . " , f.{$this->dpfi}date " . $sort;
                    break;

                default:
                    $sqlOrder = "f.$this->dpfi$orderby " . $sort;
                    break;
            }
        }

        $mimeOrStarred = ($filter > 6) ? 'file_starred' : 'file_mime_folder';

        $fdata = array();
        //preserve items per page for scrolling on big screens.
        $ipp = post("until") ? ($core->items_per_page * post("pg")) : $core->items_per_page;
        //$ipp = ($ipp > 10 ? ($ipp > 30 ? $ipp : $ipp * 1.5) : $ipp * 3);

        $page = post("until") ? 1 : (post("pg") ? post("pg") : 1);

        $pager = new \Nedo\Paginate($page, $ipp);

        $andOr = ($filter && $filter > 1) ? 'AND' : 'OR';

        if ($current_folder == 1) {
            $fileFolderSql = ($filter && $deep) ? "" : ("{$this->dpfi}folder = " . $current_folder);
        } else {
            $fileFolderSql = ($current_folder > 6)  ? ("{$this->dpfi}folder = " . $current_folder) : false;
        }

        $fileFolderSql = ($search) ?  (($current_folder == 1) ? "" : $fileFolderSql) : $fileFolderSql;

        $countWhereClause = "{$this->dpfi}user_id = :user_id" . (
            ($filter && $filter > 1) ?
            ($fileFolderSql ? (' AND ' . $fileFolderSql) : "") . ' ' . $andOr . (" {$mimeOrStarred} = " . $filter) : ($fileFolderSql ? (' AND ' . $fileFolderSql) : "")
        ) . (
            ($search) ? ("\n AND (CONCAT_WS('.', {$this->dpfi}name, {$this->dpfi}extension) LIKE :search0"
                . "\n OR file_description LIKE :search1 )")  : ""
        );

        if ($search) {
            $countBind = array(
                "search0" => "%" . urldecode($search) . "%",
                "search1" => "%" . urldecode($search) . "%",
                "user_id" => $user->userid
            );
        } else {
            $countBind = array(
                "user_id" => $user->userid
            );
        }

        //        var_dump("SELECT COUNT({$this->dpfi}id) FROM $core->fTable WHERE $countWhereClause");
        //count found item SQL
        $counter = $db->single("SELECT COUNT({$this->dpfi}id) FROM $core->fTable WHERE $countWhereClause", $countBind);

        $pager->items_total = $counter;
        $pager->default_ipp = $ipp;
        $pager->paginate();

        if ($counter == 0) {
            $pager->limit = null;
        }

        $mimeSwitch = ($filter && ($filter > 1 || $filter < 0)) ? $filter : $current_folder;

        if ($current_folder == 1) {
            $folder_and_mime_statement =
                ($filter && $deep) ? ($filter < 0 ? "" : ("\n (f.{$mimeOrStarred} = " . $mimeSwitch . ")")) : ("\n (f.{$this->dpfi}folder = " . $current_folder
                    . "\n {$andOr} f.{$mimeOrStarred} = " . $mimeSwitch . ")");
        } else {
            $folder_and_mime_statement =
                //($filter && $deep) ? ("\n (f.{$this->dpfi}mime_folder = " . $mimeSwitch . ")") : 
                ("\n (f.{$this->dpfi}folder = " . $current_folder
                    . "\n {$andOr} f.{$mimeOrStarred} = " . $mimeSwitch . ")");
        }
        if ($search) {
            if ($current_folder == 1) {
                $folder_and_mime_statement = !is_numeric($mimeSwitch) ? ("\n f.{$mimeOrStarred} = " . $mimeSwitch) : "";
            }
        }

        //fetch prepended file
        $sql = $sql1 = "SELECT "
            . "\n f.*,"
            . "\n o.*,"
            . "\n IF(o.{$this->dpfo}id < 6, '" . $user->user_dir . "', o.{$this->dpfo}hash) as folder_hash,"
            . "\n CONCAT(f.{$this->dpfi}name, '.', f.{$this->dpfi}extension) as full_name"
            . "\n FROM " . $core->fTable . " f"
            . "\n LEFT JOIN " . $core->dTable . " as o ON o.{$this->dpfo}id = f.file_folder"
            . "\n WHERE f.{$this->dpfi}prepend = 1 AND "
            . "\n " . ($folder_and_mime_statement ? ($folder_and_mime_statement . " AND ") : "")
            . "\n f.{$this->dpfi}user_id = " . $user->userid
            . "\n LIMIT 1";

        $pfetch = $db->query($sql);

        $prepended = !empty($pfetch) ? $pfetch : false;

        if (!empty($pfetch)) {

            $_SESSION['prepended_file'] = $pfetch;
        }

        $sql = "SELECT "
            . "\n f.*,"
            . "\n o.*,"
            . "\n IF(o.{$this->dpfo}id < 6, '" . $user->user_dir . "', o.{$this->dpfo}hash) as folder_hash,"
            . "\n CONCAT(f.{$this->dpfi}name, '.', f.{$this->dpfi}extension) as full_name"
            . "\n FROM " . $core->fTable . " f"
            . "\n LEFT JOIN " . $core->dTable . " as o ON o.{$this->dpfo}id = f.file_folder"
            . "\n WHERE "
            . ((isset($_SESSION['prepended_file']) && !empty($_SESSION['prepended_file'])) ? ("\n f.{$this->dpfi}id != " . $_SESSION['prepended_file'][0][$this->dpfi . "id"] . " AND ") : "")
            . "\n " . ($folder_and_mime_statement ? ($folder_and_mime_statement . " AND ") : "")
            . "\n f.{$this->dpfi}user_id = " . $user->userid
            . $searchQuery
            . "\n ORDER BY " . (($orderby) ? $sqlOrder : "f.{$this->dpfi}date")
            . ($page ? $pager->limit : "");


        //        var_dump($sql);
        //        die();

        if ($search) {
            $db->bindMore($searchBind);
        }

        if ($filter && $deep && $current_folder != 1) {
            $ffiles = $files = $db->query($sql);

            $subdirFiles = $this->fetchFilesDeeply($folders, $current_folder, $page, $pager, $ipp, $filter, $orderby, $sqlOrder, false);

            if (!empty($ffiles) && !empty($subdirFiles)) {
                $files = array_merge($ffiles, $subdirFiles);
            } else {
                $files = !empty($ffiles) ? $ffiles : (!empty($subdirFiles) ? $subdirFiles : false);
            }
        } else {
            $files = false;
        }

        if ($files) {
            $fetchedFiles = $files;
        } else {
            if ($prepended) {
                setcookie("CLO_HG", "f_" . $_SESSION['prepended_file'][0][$this->dpfi . "id"], time() + 60);
                $fetchedFiles = array_merge($prepended, $db->query($sql));
            } else {
                $fetchedFiles = $db->query($sql);
            }
        }

        //        var_dump($files);

        if (($page - 1 != $pager->num_pages && $counter >= $ipp) || $counter < $ipp) {
            $fdata['files'] = $fetchedFiles; //($prepended) ? (array_merge($prepended, $db->query($sql))) : $db->query($sql);
            $fdata['fetch'] = true;
            $fdata['count'] = $counter;
            $fdata['curitem'] = ($page * $ipp);
        }
        if ($page >= $pager->num_pages) {
            $fdata['fetch'] = false;
            $fdata['count'] = $counter;
        }

        //remove prepend from file if needed
        if ($counter > 0) {
            $this->unprependFile($prepended[0]);
        }

        return (!empty($fdata)) ? $fdata : 0;
    }

    /**
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $folders
     * @param type $current_folder
     * @param type $page
     * @param \Nedo\Paginate $pager
     * @param type $ipp
     * @param type $filter
     * @param type $orderby
     * @param type $sqlOrder
     * @param type $count
     * @return type
     */

    function fetchFilesDeeply($folders, $current_folder, $page, $pager, $ipp, $filter, $orderby, $sqlOrder, $count = false)
    {
        global $db, $core, $user;

        $subdirs = $this->getSubFoldersOfFolder($folders, $current_folder, false);

        $result = array();

        if ($subdirs && !empty($subdirs))
            foreach ($subdirs as $key => $subdir) {


                $folder_id = $subdir["folder_id"];

                if ($folder_id == $current_folder)
                    continue;

                $mimeSwitch = ($filter && $filter > 1) ? $filter : $folder_id;

                $folder_and_mime_statement =
                    //($filter && $deep) ? ("\n (f.{$this->dpfi}mime_folder = " . $mimeSwitch . ")") : 
                    ("\n (f.{$this->dpfi}folder = " . $folder_id
                        . "\n AND f.{$this->dpfi}mime_folder = " . $mimeSwitch . ")");

                $sql = "SELECT "
                    . "\n f.*,"
                    . "\n o.*,"
                    . "\n IF(o.{$this->dpfo}id < 6, '" . $user->user_dir . "', o.{$this->dpfo}hash) as folder_hash,"
                    . "\n CONCAT(f.{$this->dpfi}name, '.', f.{$this->dpfi}extension) as full_name"
                    . "\n FROM " . $core->fTable . " f"
                    . "\n LEFT JOIN " . $core->dTable . " as o ON o.{$this->dpfo}id = f.file_folder"
                    . "\n WHERE "
                    . ((isset($_SESSION['prepended_file']) && !empty($_SESSION['prepended_file'])) ? ("\n f.{$this->dpfi}id != " . $_SESSION['prepended_file'][0][$this->dpfi . "id"] . " AND ") : "")
                    . "\n " . ($filter ? ($folder_and_mime_statement . " AND ") : "")
                    . "\n f.{$this->dpfi}user_id = " . $user->userid
                    //. $searchQuery
                    . "\n ORDER BY " . (($orderby) ? $sqlOrder : "f.{$this->dpfi}date")
                    . ($page ? $pager->limit : "");

                $query = $db->query($sql);

                if (!empty($query))
                    $result[] = $query[0];
            }

        return $result;
    }

    /**
     * Get files of given folder.
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $dir
     * @return type
     */
    function getFolderFiles($dir, $user_id = false)
    {
        global $db, $core, $user;

        $sql = "SELECT * FROM " . $core->fTable
            . "\n WHERE "
            . "\n {$this->dpfi}folder = :dir"
            . "\n AND {$this->dpfi}user_id = :user_id"
            . "\n ORDER BY {$this->dpfi}id DESC";

        $row = $db->query($sql, array(
            "dir" => $dir,
            "user_id" => ($user_id ? $user_id : $user->userid)
        ));

        return ($row) ? $row : 0;
    }

    /**
     * Merge static and user folders and return as an array.
     * 
     * @param type $staticFolders
     * @param type $userFolders
     * @return type
     */
    function getAllFolders($staticFolders, $userFolders, $onlyRoot = false)
    {
        if ($userFolders != null) {
            if ($onlyRoot) {
                $staticFolders = array($staticFolders[1]);
            }

            foreach ($userFolders as $key => $val) {
                $staticFolders[$userFolders[$key]['folder_id']] = $val;
            }
        }

        return $staticFolders;
    }

    /**
     * Search for a folder recursively.
     * 
     * @param type $needle
     * @param type $haystack
     * @return boolean
     */
    function recurFolderSearch($needle, $haystack)
    {
        foreach ($haystack as $key => $value) {
            $current_key = $key;
            if (strpos($value['folder_name'], $needle) !== false || strpos($value['folder_description'], $needle) !== false) {
                $this->searched_folders[] = $haystack[$current_key];
            }
        }
        if (!empty($this->searched_folders)) {
            return $this->searched_folders;
        }
        return false;
    }

    /**
     * Get user folders with an hierarchy.
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $folder_id
     * @return type
     */
    function getUserFolders($folder_id = false, $user_id = false, $searchQuery = false)
    {
        global $db, $core, $user;

        $userid = ($user_id ? $user_id : $user->userid);

        $sql = "SELECT "
            . "d.*"
            //                . ","
            //                . "p.{$this->dpfo}hash as dirhash"
            //. "\n (SELECT {$this->dpfo}hash, {$this->dpfo}id FROM {$core->dTable} p WHERE p.{$this->dpfo}id = d.folder_parent_id) as dirhash "
            . "\n FROM " . $core->dTable . " d"
            //. "\n JOIN {$core->dTable} as p ON p.{$this->dpfo}user_id = $userid AND d.{$this->dpfo}parent_id = p.{$this->dpfo}id"

            //                . "\n JOIN (SELECT {$this->dpfo}id, {$this->dpfo}user_id, {$this->dpfo}hash FROM {$core->dTable} p WHERE {$this->dpfo}user_id = $userid GROUP BY {$this->dpfo}id) p ON p.{$this->dpfo}id = d.folder_parent_id"

            . "\n WHERE d.{$this->dpfo}user_id = :user_id"
            . (($searchQuery) ? ("\n AND (( d.{$this->dpfo}name LIKE :squery0"
                . "\n OR d.{$this->dpfo}description LIKE :squery1 ) OR d.{$this->dpfo}id = :folder_id )") : "")
            . "\n ORDER BY d.{$this->dpfo}parent_id ASC, d.{$this->dpfo}id DESC";

        //bind param if $searchQuery exists
        if ($searchQuery)
            $db->bindMore(array(
                "squery0" => "%" .  ($searchQuery) . "%",
                "squery1" => "%" . ($searchQuery) . "%",
                "folder_id" => $folder_id,
                "user_id" => $userid
            ));
        else
            $db->bindMore(array(
                "user_id" => $userid
            ));

        $query = $db->query($sql);

        $this->countUserFoldersNum = count($query);

        $children = array();

        //        while ($result = $db->fetch($query)) {

        foreach ($query as $key => $result) {

            $children[$result['folder_id']] = $result; //$this->getParentFolderHash();

            $children[$result['folder_id']]["dirhash"] = $this->getParentFolderHash($query, $result['folder_parent_id'], $userid);
        }
        //        }


        return ($children) ? ($folder_id ? $children : $this->folderHierarchy($children)) : null;
    }

    /**
     * 
     * @global type $core
     * @param type $data
     * @return type
     */
    function folderHierarchy($data)
    {
        global $core;
        $folders = $data;
        foreach ($data as $key => $row) {

            if (isset($folders[$row['folder_parent_id']])) {

                $folders = $core->push_after($row['folder_parent_id'], $folders, $key, $row);
            }
            unset($key);
        }
        return $folders;
    }

    /**
     * 
     * @global type $db
     * @global type $core
     * @return type
     */
    public function getStaticFolders()
    {
        global $db, $core, $user;

        $result = array();

        $db->bind("static", "1");
        $rows = $db->query("SELECT * FROM $core->dTable WHERE {$this->dpfo}static = :static");


        foreach ($rows as $key => $row) {

            $result[$row['folder_id']] = $row;

            //set user-dir to the document root hash
            if ($row['folder_id'] == 1) {
                $result[$row['folder_id']]['folder_hash'] = $user->user_dir;
            }
        }

        //sort by key
        ksort($result);

        return !empty($result) ? $result : null;
    }

    /**
     * 
     * @param type $data
     * @param type $folder_id
     * @param type $append_parent
     * @return type
     */
    function getSubFoldersOfFolder($data, $folder_id, $append_parent = false, $numerickey = false, $fresh = false)
    {
        global $core;

        if ($fresh) {
            $this->subdirs = array();
        }
        $folder_id = $core->getNumbersOnly($folder_id, false);
        if ($data)
            foreach ($data as $key => $row) {

                if ($append_parent && !isset($this->subdirs[($numerickey ? $numerickey : "current")])) {
                    $this->subdirs[($numerickey ? $numerickey : "current")] = $data[$folder_id];
                }

                if ($row['folder_parent_id'] == $folder_id) {
                    $this->subdirs[$key] = $row;
                    $this->getSubFoldersOfFolder($data, $row['folder_id']);
                }
                unset($row);
            }


        return is_array($this->subdirs) ? $this->subdirs : false;
    }

    function countSubFoldersOfFolder($allfolders, $folder_id)
    {

        return count($this->getSubFoldersOfFolder($allfolders, $folder_id, false, false, true));
    }

    /**
     * 
     * @global \Nedo\type $core
     * @param type $allfolders
     * @param type $folder_id
     * @return type
     */
    function nameSubFoldersOfFolder($allfolders, $folder_id)
    {
        global $core;

        $subdirs = $this->getSubFoldersOfFolder($allfolders, $folder_id, false, false, true);
        $arr = array();
        if ($subdirs)
            foreach ($subdirs as $key => $sub) {
                $arr[] = $sub['folder_name'];
            }
        return $arr;
    }

    /**
     * 
     * @param type $data
     * @param type $id
     * @param type $user_id
     * @return type
     */
    function getParentFolderHash($data, $id, $user_id = false)
    {
        global $user;

        foreach ($data as $key => $row) {

            if ($row['folder_id'] == $id) {
                return $row['folder_hash'];
                break;
            }
        }
        return $user->user_dir;
    }

    /**
     * 
     * @param type $data
     * @param type $folder_id
     * @return type
     */
    function getParentFoldersOfFolder($data, $parent_id)
    {

        foreach ($data as $key => $row) {

            if ($row['folder_id'] == $parent_id) {
                $this->parents[$parent_id] = $row;
                $this->getParentFoldersOfFolder($data, $row['folder_parent_id']);
            }
        }
        unset($row);

        return is_array($this->parents) ? array_reverse($this->parents) : false;
    }

    /**
     * 
     * @global type $user
     * @param type $bytes
     * @param type $precision
     * @param type $unit
     * @return string|int
     */
    function formatBytes($bytes, $precision = 2, $unit = false)
    {
        global $user;

        if (!$bytes)
            return "N/A";

        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow); //or
        //$bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . '' . ($unit ? $units[$pow] : "");
    }

    /**
     * Return bytes from string (formatted sizes)
     * 
     * @global \Nedo\type $core
     * @param type $sizeString
     * @return type
     */

    function formatToBytes($sizeString)
    {
        global $core;
        $size = $core->getNumbersOnly($sizeString);

        $unit = str_replace($size, "", $sizeString);

        switch (strtoupper($unit)) {
            case "GB":
                $multiplier = 1073741824;
                break;
            case "TB":
                $multiplier = 1099511627776;
                break;
            case "KB":
                $multiplier = 1024;
                break;
            case "B":
                $multiplier = 1;
                break;
            case "MB":
                $multiplier = 1048576;
                break;
            default: //GB
                $multiplier = 1073741824;
                break;
        }
        return ($size * $multiplier);
    }

    /**
     * Get unit from size string (2GB -> GB)
     * 
     * @param type $bytes
     * @return type
     */

    function getUnitFromBytes($bytes)
    {
        $i = 0;
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        if ($bytes > 1024) {

            $i = floor(log($bytes, 1024));
        }

        return sanitise($units[$i]);
    }

    /**
     * Test for a valid size unit and return if it was defined else return the default "GB" unit
     * 
     * @param type $string
     * @return string
     */
    function getUnitFromString($string)
    {
        global $core;
        $string = strtoupper(sanitise($string));

        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        $size = $core->getNumbersOnly($string);
        $unit = str_replace($size, "", $string);

        if (in_array($unit, $units)) {
            return $unit;
        }
        //return as default GB
        return "GB";
    }

    /**
     * Returns the free disk space of system
     * 
     * @return boolean
     */

    function getSystemDiskSize()
    {

        if (function_exists("disk_free_space") && !@ini_get("open_basedir")) {
            if (disk_free_space("/")) {
                return disk_free_space("/");
            } else {
                return false;
            }
        }
    }

    /**
     * Calculate total disk space of a user or give bytes and calculate the total disk size
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $user_id
     * @param type $format
     * @return type
     */
    function userTotalSpace($user_id = false, $format = true, $ubytes = false)
    {
        global $db, $core, $user;
        //requested from other user
        if ($user_id) {

            $row = $db->row("SELECT "
                . "\n user_limit as bytes"
                . "\n FROM $core->fTable"
                . "\n WHERE {$this->dpfi}user_id = :user_id", array("user_id" => ($user_id ? $user_id : $user->userid)));

            $bytes = $row['bytes'];
        } else {
            if ($ubytes == 0 && $user->isAdmin()) {
                $bytes = $this->getSystemDiskSize();
                if (!$bytes) $bytes = 0;
            } else {
                $bytes = $ubytes ? $ubytes : $user->disk_limit;
            }
        }
        return sanitise(!$format ? $bytes : $this->formatBytes($bytes, 2, true));
    }

    /**
     * Calculates how much space in use for a user. Can be calculated on DB or realpath
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $user_id
     * @param type $format
     * @return type
     */
    function userSpaceInUse($user_id = false, $format = true, $disk = false)
    {
        global $db, $core, $user;
        $sum = 0;

        $userid = ($user_id) ? $user_id : $user->userid;
        if ($disk) {
            $bytes = $this->totalSize(UPLOAD_PATH . return6charsha1($userid, 6), $this->exclude_files);

            return sanitise(!$format ? $bytes : $this->formatBytes($bytes, 2, true));
        } else {

            $row = $db->row(
                "SELECT "
                    . "\n COALESCE(SUM(file_size),0) as bytes"
                    . "\n FROM $core->fTable"
                    . "\n WHERE {$this->dpfi}user_id = :user_id",
                array(
                    "user_id" => ($user_id ? $user_id : $user->userid)
                )
            );


            $bytes = $row['bytes'];
            return sanitise(!$format ? $bytes : $this->formatBytes($bytes, 2, true));
        }
    }

    /**
     * Returns user usage percentage
     * 
     * @param type $user_id
     * @param type $total
     * @param type $precalculated
     * @return int
     */
    function calcUserUsagePercentage($user_id, $total, $precalculated = false)
    {

        if ($total == "N/A" || $total == 0) {
            $total = $this->userTotalSpace(false, false, $total);
        }
        if (!$precalculated) {
            $usage = $this->userSpaceInUse($user_id, false, true);
        } else {
            $usage = $precalculated;
        }

        $calc = $total ? (float)(number_format((float)(($usage / $total) * 100), 1, '.', '')) : 0;
        return $calc;
    }

    /**
     * Returns how many user folders depending given pre-fetched folder array or fetches from the first
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @return type
     */
    function countUserFolders($data = false, $folder_id = false, $userid = false, $returnData = false)
    {
        global $db, $core, $user;
        if ($data) {

            //special data...
        } else {

            $user_id = (($userid) ? $userid : $user->userid);

            if ($folder_id) {
                $db->bind("parent_id", $folder_id);
                $db->bind("user_id", $user_id);
            } else {
                $db->bind("user_id", $user_id);
            }

            $rows = $db->query("SELECT "
                . (($returnData) ? ("\n * ") : ("\n {$this->dpfo}id"))
                . " FROM $core->dTable "
                . "WHERE {$this->dpfo}user_id = :user_id"
                . (($folder_id) ? ("\n AND {$this->dpfo}parent_id = :parent_id") : ''));

            $result = ($returnData ? $rows : count($rows));
        }

        return $result ? $result : 0;
    }

    /**
     * Return total user files by mime_type(2:image,3:video,4:sound,5:document,6:other) or in given folder_id. $value must be an int
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $value
     * @return type
     */
    function countOrGetAllUserFiles($value = false, $returnData = false, $on_mime = false, $userid = false)
    {

        global $db, $core, $user;

        $user_id = (($userid) ? $userid : $user->userid);
        $all = false;
        $result = '';

        if ($on_mime) {

            $db->bind("mime_folder", "$value");
            $sql = $returnData
                ? "SELECT * FROM $core->fTable WHERE {$this->dpfi}user_id = :user_id AND {$this->dpfi}mime_folder = :mime_folder"
                : "SELECT COUNT({$this->dpfi}id) as count FROM $core->fTable WHERE {$this->dpfi}user_id = :user_id AND {$this->dpfi}mime_folder = :mime_folder";
        } else {
            if ($value) {

                $db->bind("folderId", "$value");
                $sql = $returnData
                    ? "SELECT * FROM $core->fTable WHERE {$this->dpfi}user_id = :user_id AND {$this->dpfi}folder = :folderId"
                    : "SELECT COUNT({$this->dpfi}id) as count FROM $core->fTable WHERE {$this->dpfi}user_id = :user_id AND {$this->dpfi}folder = :folderId";
            } else {
                $all = true;
                $sql = $returnData
                    ? "SELECT * FROM $core->fTable WHERE {$this->dpfi}user_id = :user_id"
                    : "SELECT COUNT({$this->dpfi}id) as count FROM $core->fTable WHERE {$this->dpfi}user_id = :user_id";
            }
        }

        $db->bind("user_id", $user_id);

        $tempdata = false;

        if ($returnData) {
            //prevent all time to fetch data from DB this is a kind of cache system for all files of a user

            $files = $db->query($sql);

            $size = 0;

            foreach ($files as $key => $file) {
                $size += $file['file_size'];
            }

            //            print_r($value);
            //            echo ":\n-------------------\n";
            //            print_r($db);
            //            echo ":\n-------------------\n";
            //            print_r($files);
            //            echo "\n-------------------\n";

            $result = array(
                "count" => (int)count($files),
                "size" => $size,
                "data" => $files
            );

            $this->userFiles = $files;
        } else {
            $result = $db->row($sql)["count"];
        }


        return $result ? $result : 0;
    }

    /**
     * Returns the image files count from the given(fetched) files array
     * 
     * @param type $files
     * @return int
     */

    function countImageFiles($files)
    {

        $i = 0;
        foreach ($files as $key => $file) {

            if ((int) $file['file_mime_folder'] == 2) {
                $i++;
            }
        }

        $this->countImageFiles = $i;

        return $i;
    }

    /**
     * Returns the video files count from the given(fetched) files array
     * 
     * @param type $files
     * @return int
     */

    function countVideoFiles($files)
    {

        $i = 0;
        foreach ($files as $key => $file) {

            if ((int) $file['file_mime_folder'] == 3) {
                $i++;
            }
        }

        $this->countVideoFiles = $i;

        return $i;
    }

    /**
     * Returns the audio files count from the given(fetched) files array
     * 
     * @param type $files
     * @return int
     */

    function countAudioFiles($files)
    {

        $i = 0;
        foreach ($files as $key => $file) {

            if ((int) $file['file_mime_folder'] == 4) {
                $i++;
            }
        }

        $this->countAudioFiles = $i;

        return $i;
    }

    /**
     * Returns the document files count from the given(fetched) files array
     * 
     * @param type $files
     * @return int
     */

    function countDocumentFiles($files)
    {

        $i = 0;
        foreach ($files as $key => $file) {

            if ((int) $file['file_mime_folder'] == 5) {
                $i++;
            }
        }

        $this->countDocumentFiles = $i;

        return $i;
    }

    /**
     * Returns user item statistics(in development)
     * 
     * @param type $files
     * @return int
     */

    public function userAnalytics($user_id = false)
    {
        global $core, $user;


        $userid = $user_id ? $user_id : $user->userid;

        $totalspace = $this->userTotalSpace(false, false, $user->user_limit);
        $spaceInUse = $this->userSpaceInUse($userid, false, true);

        $totalspaceFormatted = $this->formatBytes($totalspace, 2, true);
        $spaceInUseFormatted = $this->formatBytes($spaceInUse, 2, true);

        $spaceInUsePercent = $this->calcUserUsagePercentage(false, $totalspace, $spaceInUse);

        $spaceFree = ($totalspace > 0) ? ($totalspace - $spaceInUse) : 0;
        $spaceFreeFormatted = $this->formatBytes($spaceFree, 2, true);

        $spaceFreePercent = (100 - $spaceInUsePercent);

        $Allfiles = $this->countOrGetAllUserFiles(false, true);
        $folderscount = $this->countUserFolders() + 1; //+1 for root folder ;)

        $filescount = $Allfiles["count"];
        $sum = 0;

        $sum += $imageTypesCount = $this->countImageFiles($this->userFiles);
        $sum += $videoTypesCount = $this->countVideoFiles($this->userFiles);
        $sum += $audioTypesCount = $this->countAudioFiles($this->userFiles);
        $sum += $documentTypesCount = $this->countDocumentFiles($this->userFiles);
        $otherTypesCount = ($filescount - $sum);

        $totalFoldersAndFilesCount = ($filescount + $folderscount) ? ($filescount + $folderscount) : 1;


        $imageTypesPercent = number_format((($imageTypesCount / $totalFoldersAndFilesCount) * 100), 2);
        $videoTypesPercent = number_format((($videoTypesCount / $totalFoldersAndFilesCount) * 100), 2);
        $audioTypesPercent = number_format((($audioTypesCount / $totalFoldersAndFilesCount) * 100), 2);
        $documentTypesPercent = number_format((($documentTypesCount / $totalFoldersAndFilesCount) * 100), 2);
        $otherTypesPercent = number_format((($otherTypesCount / $totalFoldersAndFilesCount) * 100), 2);
        $foldersPercent = number_format((($folderscount / $totalFoldersAndFilesCount) * 100), 2);

        $core->jsonE = array(
            "space_total" => $totalspace,
            "space_total_formatted" => $totalspaceFormatted,
            "space_used" => $spaceInUse,
            "space_used_formatted" => $spaceInUseFormatted,
            "space_used_percentage" => $spaceInUsePercent,
            "space_free" => $spaceFree,
            "space_free_formatted" => $spaceFreeFormatted,
            "space_free_percentage" => $spaceFreePercent,
            "count_files" => $filescount,
            "count_dirs" => $folderscount,
            "count_all" => ((int) $filescount + (int) $folderscount),
            "count_image_types" => $imageTypesCount,
            "count_video_types" => $videoTypesCount,
            "count_audio_types" => $audioTypesCount,
            "count_document_types" => $documentTypesCount,
            "count_other_types" => $otherTypesCount,
            "percent_types" => array(
                "Images" => $imageTypesPercent,
                "Videos" => $videoTypesPercent,
                "Audios" => $audioTypesPercent,
                "Documents" => $documentTypesPercent,
                "Other Types" => $otherTypesPercent,
                "Folders" => $foldersPercent,
            )
        );

        if ($spaceFree == 0 && $filescount > 0) {
            $core->jsonE['error'] = array(
                "title" => 'Error!',
                "content" => ($user->isAdmin() ? clear('An error occured while getting disk information. Please check PHP <b class="ul">open_basedir</b> setting.') : clear('A technical error occured.'))
            );
        }

        return $core->jsonE;
    }

    /**
     * Quick search tool
     * 
     * @global \Nedo\type $core
     * @param type $query
     * @return int
     */

    function search($query = false)
    {
        global $core;

        //get all folders & subfolders of current folder if needed
        $folders = $this->getUserFolders(false);

        $dir = sanitise(get("dir"));
        $searcIn = sanitise(get("in"));

        $starred = ($searcIn == "starred" ? true : false);

        $core->jsonE = array();

        $files = ($searcIn == "file" || $searcIn == "all" || $searcIn == "starred") ? $this->searchFiles($folders, $query, $dir, $starred) : false;
        $folders = ($searcIn == "folder" || $searcIn == "all" || $searcIn == "starred") ? $this->searchFolders($folders, $query, $dir, $starred) : false;

        if (is_array($files) && is_array($folders))
            $result = array_merge($files, $folders);
        elseif (is_array($files) && !is_array($folders))
            $result = $files;
        elseif (is_array($folders) && !is_array($files))
            $result = $folders;
        else
            $result = 0;


        return $result;
    }

    /**
     * File array orginizing for quick search
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $query
     * @return type
     */
    function searchFiles($folders, $query = false, $dir = false, $starred = false)
    {
        global $db, $core, $user;

        $subdirs = $this->getSubFoldersOfFolder($folders, $dir, false);

        //fetch files of current folder
        $this->searchFilesQuery($query, $dir, $starred);

        if (is_array($subdirs) && !empty($subdirs)) {
            foreach ($subdirs as $key => $val) {

                //fetch files of sub-folder
                $this->searchFilesQuery($query, $val['folder_id'], $starred);
            }
        }

        return !empty($core->jsonE) ? $core->jsonE : 0;
    }

    /**
     * File Query for quick search
     * 
     * @param type $query
     * @param type $cdir
     * @return type
     */
    function searchFilesQuery($query = false, $cdir = false, $starred = false)
    {
        global $db, $core, $user;

        $dir = sanitise($cdir ? $cdir : get("dir"));

        $sql = "SELECT "
            . "\n f.*,"
            . "\n d.{$this->dpfo}hash as folder_hash,"
            . "\n CONCAT_WS('.', {$this->dpfi}name, {$this->dpfi}extension) as full_name"
            . "\n FROM " . $core->fTable . " f"
            . "\n LEFT JOIN " . $core->dTable . " as d ON d.{$this->dpfo}id = f.{$this->dpfi}folder"
            . "\n WHERE "
            . "\n f.{$this->dpfi}user_id = :user_id"
            . (($dir && $dir > 1) ? ("\n AND f.{$this->dpfi}folder = :dir0") : "")
            . (($starred) ? ("\n AND f.{$this->dpfi}starred = :starred") : "")
            . "\n AND ( LOWER(CONCAT_WS('.', {$this->dpfi}name, {$this->dpfi}extension)) LIKE LOWER(:query0)"
            . "\n OR LOWER(f.{$this->dpfi}description) LIKE LOWER(:query1) )"
            . "\n ORDER BY f.{$this->dpfi}date DESC LIMIT 5";
        $bind = array(
            "query0" => "%" . urldecode($query) . "%", //name
            "query1" => "%" . urldecode($query) . "%", //description
            "user_id" => $user->userid
        );

        if ($dir > 1) {
            $bind["dir0"] = $dir;
        }

        /* @var $starred type */
        if ($starred) {
            $bind["starred"] = 7;
        }

        $rows = $db->query($sql, $bind);

        foreach ($rows as $key => $row) {

            $core->jsonE["f_" . $row["file_id"]] = $this->fileObject($row);
        }
    }

    /**
     * Folder query and array orginizing for quick search
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $query
     * @return type
     */

    function searchFolders($folders, $query = false, $dir = false, $starred = false)
    {
        global $db, $core, $user;

        $sql = "SELECT "
            . "\n d.*"
            . "\n FROM " . $core->dTable . " d"
            . "\n WHERE "
            . "\n ( d.{$this->dpfo}user_id = :user_id"
            . "\n AND d.{$this->dpfo}static != 1 )"
            . (($dir && $dir > 1) ? ("\n AND d.{$this->dpfo}parent_id = :dir0") : "")
            . (($starred) ? ("\n AND d.{$this->dpfo}starred = :starred") : "")
            . "\n AND LOWER ( d.{$this->dpfo}name LIKE :query0"
            . "\n OR d.{$this->dpfo}description LIKE :query1 ) ORDER BY d.{$this->dpfo}created DESC LIMIT 3";

        $bind = array(
            "query0" => "%" . urldecode($query) . "%", //name
            "query1" => "%" . urldecode($query) . "%", //description
            "user_id" => $user->userid
        );

        if ($dir > 1) {
            $bind["dir0"] = $dir;
        }

        if ($starred) {
            $bind["starred"] = 7;
        }

        $rows = $db->query($sql, $bind);

        if (count($rows) > 0) {
            foreach ($rows as $key => $row) {

                $core->jsonE["d_" . $row["folder_id"]] = $this->dirObject($row, $rows);

                $subdirs = $this->getSubFoldersOfFolder($folders, $row["folder_id"], false);

                if (is_array($subdirs) && !empty($subdirs)) {
                    foreach ($subdirs as $k => $val) {

                        if (stripos($val["folder_name"], (string)$query) !== false && !array_key_exists("d_" . $val["folder_id"], $core->jsonE))
                            $core->jsonE["d_" . $val["folder_id"]] = $this->dirObject($val, $folders);
                    }
                }
            }
        }
        if ($dir > 1) {
            $subdirs = $this->getSubFoldersOfFolder($folders, $dir, false);

            if (is_array($subdirs) && !empty($subdirs)) {
                foreach ($subdirs as $k => $v) {

                    if (stripos($v["folder_name"], (string)$query) !== false && !array_key_exists("d_" . $v["folder_id"], $core->jsonE))
                        $core->jsonE["d_" . $v["folder_id"]] = $this->dirObject($v, $folders);
                }
            }
        }

        return !empty($core->jsonE) ? $core->jsonE : 0;
    }

    /**
     * Returns a pre-json object for a directory.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $dir
     * @param type $folders
     * @param type $shareURI
     * @param type $checkIfNeedsTobeUpdated
     * @return type
     */

    function dirObject($dir, $folders = false, $shareURI = false, $checkIfNeedsTobeUpdated = false)
    {
        global $core, $user;

        $folder_path = ($folders) ? ('/' . $this->getFolderPath($folders, $dir['folder_parent_id'], $dir['folder_vpath'], $dir['folder_level'])) : false;

        $subfoldercount = ($folders) ? $this->countSubFoldersOfFolder($folders, $dir['folder_id']) : 0;

        $dirsize = $this->formatBytes($dir['folder_size'], 2, true);

        $folder_st = ($folders) ? ($dir['folder_files'] . '-' . $subfoldercount . '-' . $dirsize) : NULL;

        $array = array(
            'path' => ($folder_path ? $folder_path : (($folders) ? $this->getFolderPath($folders, $dir['folder_parent_id'], $dir['folder_vpath'], $dir['folder_level']) : NULL)),
            'id' => $dir['folder_id'],
            'type' => 'folder',
            'filetype' => 'folder',
            'name' => $dir['folder_name'],
            'size' => $this->formatBytes($dir['folder_size'], 1, true),
            'bsize' => (int) $dir['folder_size'],
            'hash' => $dir['folder_hash'],
            'icon' => $dir['folder_icon'],
            'stamp' => strtotime($dir['folder_created']),
            'date' => $core->formatDate($dir['folder_created']),
            'modified' => $core->formatDate($dir['folder_modified']),
            'thumbs' => (($dir['folder_files'] > 0 && !$core->isShareUrI() && !$shareURI) ? $this->createFolderThumbs($folder_path, false, false, $dir['folder_id']) : ""),
            'password' => ($dir["folder_pass"] ? $dir["folder_pass"] : false),
            'fileCount' => (int) $dir['folder_files'],
            'description' => $dir['folder_description'],
            'needUpdate' => (!$core->isShareUrI() && !$shareURI) ? (($dir["folder_size"] == 0 && $this->totalSize($user->full_path . $folder_path) > 0) ? true : false) : false,
            'starred' => (int)$dir['folder_starred'],
            'data' => array(
                'type' => "d",
                'size' => $this->formatBytes($dir['folder_size'], 1, true),
                'ftype' => "folder",
                'typeIcon' => "folder.png",
                'id' => "d_" . $dir['folder_id'],
                'date' => strtotime($dir['folder_created']),
                'cdate' => $core->formatDate($dir['folder_created']),
                'mdate' => $core->formatDate($dir['folder_modified']),
                'dirhash' => isset($dir['dirhash']) ? $dir['dirhash'] : null,
                'ppath' => mb_str_replace($dir['folder_vpath'], "", ($folder_path ? $folder_path : (($folders) ? $this->getFolderPath($folders, $dir['folder_parent_id'], $dir['folder_vpath'], $dir['folder_level']) : NULL))),
                'path' => ($folder_path ? $folder_path : (($folders) ? $this->getFolderPath($folders, $dir['folder_parent_id'], $dir['folder_vpath'], $dir['folder_level']) : NULL)),
                'parent' => (int) $dir['folder_parent_id'],
                't' => $dir['folder_name'],
                's' => $folder_st,
                'icon' => $dir['folder_icon'] ? $dir['folder_icon'] : false,
                'p' => $dir['folder_pass'] ? true : false,
                'description' => $dir['folder_description'],
                'starred' => (int)$dir["folder_starred"],
                'totalFiles' => (int)$dir['folder_files'],
                'totalSubFolders' => (int)$subfoldercount
            )
        );

        if ($core->isShareUrI() || get("loadMoreShare")) {
            $array["userid"] = (int) $dir["folder_user_id"];
        }
        return $array;
    }

    /**
     * Returns a pre-json object for a file.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $content
     * @param type $file
     * @param type $suffix
     * @return type
     */
    function fileObject($file, $suffix = false, $viewing = false)
    {
        global $core, $user, $content, $audio;

        $file_path = $content->current_path ? $content->current_path : $file['file_path'];

        //        if($viewing || $core->isShareUrI())
        //            var_dump($viewing, $core->isShareUrI());

        $data =  array(
            'id' => $file['file_id'],
            'type' => 'file',
            'size' => $this->formatBytes($file['file_size'], 1, true),
            'bsize' => (int) $file['file_size'],
            'filetype' => $this->getTypeIcon($file, false),
            'date' => $core->formatDate($file['file_date']),
            'stamp' => strtotime($file['file_date']),
            'modified' => $file['file_modified'],
            'name' => $file['full_name'],
            'description' => $file['file_description'],
            'hash' => $file['file_key'],
            'parent' => $file['file_folder'],
            'viewable' => ($this->isViewable($file) ? $this->getTypeIcon($file, false) : false),
            'previewable' => (in_array($this->getTypeIcon($file, false), $this->previewable)),
            'starred' => (int) $file['file_starred'],
            //thumbnail for image files
            'preview' => $this->getThumbnail($file, $file_path, $suffix),
            //file source for viewing or downloading them
            'src' => $this->createViewUrI($file, $file_path, false, false, false, $file["file_user_id"]),
            'data' => array(
                'type' => "f",
                'ftype' => $this->getTypeIcon($file, false),
                //'mime' => ( !$core->isShareUrI() && !$viewing) ? $this->getMimeType( ($user->full_path.DS.trim($file_path, '/').DS.$file['full_name'] ), $file['file_extension']) : false,                
                'typeIcon' => $file['file_extension'] . ".png",
                'id' => "f_" . $file['file_id'],
                'size' => $this->formatBytes($file['file_size'], 1, true),
                'parent' => (int) $file['file_folder'],
                't' => $file['file_name'] . '.' . $file['file_extension'],
                'p' => $file['file_name'],
                'ext' => $this->fixtnExtensions($file['file_extension']),
                'realext' => $file['file_extension'],
                'date' => strtotime($file['file_date']),
                'udate' => $core->formatDate($file['file_date']),
                'cdate' => $core->formatDate($file['file_changed']),
                'mdate' => $core->formatDate($file['file_modified']),
                'dirhash' => $file['folder_hash'],
                'userdir' => $user->user_dir,
                'path' => '/' . trim($file_path, '/'),
                'ppath' => '/' . trim($file_path, '/'),
                'description' => $file['file_description'],
                'starred' => (int)$file["file_starred"],
                's' => null,
                'icon' => null,
                'viewable' => ($this->isViewable($file) ? $this->getTypeIcon($file, false) : false)
            )
        );

        /**
         * add extra data if the file is an image
         */
        if ($data["filetype"] == 'image' && $data["data"]["realext"] != "psd") {
            $data["attr"] = $data["data"]["attr"] = $this->getImageAtributes(UPLOAD_PATH . $data["src"]);

            if (isset($data["attr"]) && !empty($data["attr"]))
                foreach ($data["attr"] as $key => $val)
                    if ($key == "width" || $key == "height")
                        $data["data"]["attr"][$key] = $val;
        }

        /*/**
         * add extra data if the file is an audio
         */
        if ($viewing && $data["filetype"] == 'audio') {
            $audioPath = UPLOAD_PATH . return6charsha1($file["file_user_id"]) . rtrim($file['file_path'], "/") . "/" . $file['full_name'];

            if ($this->checkFile($audioPath))
                $data["data"]["attr"] = (array) $audio->loadFile($audioPath);
        }
        return $data;
    }


    /**
     * Return basic image information
     * 
     * @param type $imagePath
     * @return boolean
     */

    function getImageAtributes($imagePath)
    {

        if (is_file($imagePath) && filesize($imagePath) > 0) {

            $get = getimagesize($imagePath);

            return array(
                "width"  => $get[0],
                "height" => $get[1],
                "type"   => $get[2],
                "attr"   => $get[3],
                "bits"   => $get['bits'],
                "mime"   => $get['mime']
            );
        }

        return false;
    }

    /**
     * 
     * @param type $file
     * @param type $suffix
     * @return type
     */
    function getThumbnail($file, $file_path = false, $suffix = false)
    {
        global $core;
        $result = "canvas";

        if ($this->isImage($file)) {
            if ($suffix) {

                $result = array(
                    "t" => $this->createViewUrI($file, $file_path, true, false, $file['folder_hash'], $file["file_user_id"], $suffix),
                    "b" => $this->createViewUrI($file, $file_path, true, false, $file['folder_hash'], $file["file_user_id"], false)
                );
            } else {
                $result = $this->createViewUrI($file, $file_path, true, false, $file['folder_hash'], $file["file_user_id"]);
            }
        } else if ($this->isVideo($file)) {

            if ($core->exe()) {
            }
        }

        return $result;
    }

    /**
     * Returns the total size excluding index.php and .htaccess files /starts from given path(recursive)
     * 
     * @param type $path
     * @return size in B of the given path
     */
    function totalSize($path, $exclude = false)
    {
        $total = 0;
        if ($this->checkFile($path)) {
            if (is_dir($path)) {
                $handle = @opendir($path);
                while ($aux = @readdir($handle)) {
                    if ($aux != "." && $aux != ".." && $aux != 'index.php') {

                        if (is_array($exclude) && in_array($aux, $exclude))
                            continue;

                        $total += $this->totalSize($path . "/" . $aux);
                    }
                }
                @closedir($handle);
            } else {
                $fname = pathinfo($path, PATHINFO_FILENAME);
                if (is_array($exclude) && in_array($fname, $exclude)) {
                    $total = 0;
                } else {
                    $total = filesize($path);
                }
            }
        }
        return $total;
    }

    /**
     * Removes a physical file from the given path(full path)
     * 
     * @param type $file_path
     * @return boolean
     */
    function deletePhysicalFile($file_path)
    {
        if (@is_file($file_path)) {
            if (@file_exists($file_path)) {
                if (@unlink("$file_path")) {
                    $this->f_err = null;
                    return true;
                } else if (@exec("del $file_path")) {
                    $this->f_err = null;
                    return true;
                } else if (@system("del $file_path")) {
                    $this->f_err = null;
                    return true;
                } else {
                    $err = 'Cannot delete File: Permission denied.';
                    return false;
                }
            } else {
                $err = 'File does not exists.';
                return false;
            }
        } else {
            $err = 'File does not exists.';
            return false;
        }
    }

    /**
     * Removes a file from DB
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $file_id
     * @return boolean
     */
    public function deleteFileFromDB($file_id)
    {

        global $db, $core;

        $result = $db->query("DELETE FROM $core->fTable WHERE {$this->dpfi}id = :id", array("id" => $file_id));

        if ($result) {
            return true;
        }
        return false;
    }

    /**
     * Download requested file 
     * 
     * @global type $encryption
     * @global type $user
     * @param type $file
     * @param type $userid
     * @return boolean
     */
    function download($userid = false)
    {
        global $encryption, $mobile;

        if (!$userid) {
            global $user;
            $userid = get("uid") ? $encryption->decode(get("uid")) : $user->userid;
        }

        $path = $encryption->decode(get("store"));

        $server_file = UPLOAD_PATH . $path . get("file");

        $size = @filesize($server_file);
        if (is_file($server_file)) {
            if (@file_exists($server_file)) {
                if (ini_get('zlib.output_compression')) {
                    @ini_set('zlib.output_compression', 'On');
                }

                $file = get("file");

                $path_parts = pathinfo($server_file);
                $file_extension = $path_parts['extension'];

                $ctype = $this->getMimeType($server_file); //(isset($types[$file_extension]) ? $types[$file_extension] : 'application/octet-stream');

                @header("Pragma: public");
                @header("Expires: 0");
                @header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                @header("Cache-Control: private", false);
                @header("Content-Type: $ctype");
                @header("Content-Disposition: attachment; filename=\"" . get("file") . "\";");
                @header("Content-Length: $size");
                @header("Content-Transfer-Encoding: binary");
                //@header("X-Frame-Options: SAMEORIGIN GOFORIT");
                @header("Set-Cookie: CLO_OCT=true; path=/");

                set_time_limit(0);
                $file = @fopen($server_file, "rb");
                while (!feof($file)) {
                    print(@fread($file, 1024 * 8));
                    ob_flush();
                    flush();
                }

                @exit;
            } else {
                die("The resource you are looking for has been removed, had its name changed, or is temporarily/permanently unavailable."); // for after use...
                return false;
            }
        } else {
            die("The resource you are looking for has been removed, had its name changed, or is temporarily/permanently unavailable."); // for after use...
            return false;
        }
    }

    /**
     * Returns full folder informations by folder hash or folder id
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $folder_id
     * @param type $userid
     * @return type
     */
    function getFolderInfoDB($folder_id, $userid = false, $byhash = false)
    {
        global $db, $core, $user;

        $db->bind("userid", (($userid) ? $userid : $user->userid));

        if ($byhash)
            $db->bind("hash", $byhash);
        if ($folder_id)
            $db->bind("folder_id", $folder_id);

        $row = $db->row("SELECT * FROM $core->dTable"
            . " WHERE ("
            . (($byhash) ? (" {$this->dpfo}hash = :hash") : ("\n {$this->dpfo}id = :folder_id"))
            . "\n ) AND {$this->dpfo}user_id = :userid");

        return !empty($row) ? $row : false;
    }

    /**
     * Returns full file info from DB with file id
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $file_id
     * @param type $userid
     * @return type
     */
    function getFileInfoFromDB($file_id, $userid = false)
    {
        global $db, $core, $user;

        if (!is_numeric($file_id))
            return false;

        $user_id = (($userid) ? $userid : $user->userid);

        $sql = "SELECT f.*,"
            . "\n IF(d.{$this->dpfo}id < 6, :user_id0, d.{$this->dpfo}hash) as folder_hash,"
            . "\n CONCAT_WS('.', f.{$this->dpfi}name, f.{$this->dpfi}extension) as full_name,"
            . "\n DATE(file_date) as date"
            . "\n FROM $core->fTable f"
            . "\n LEFT JOIN $core->dTable as d ON d.{$this->dpfo}id = f.{$this->dpfi}folder "
            . "\n AND {$this->dpfo}user_id = :user_id1"
            . "\n WHERE f.{$this->dpfi}id = :file_id AND f.{$this->dpfi}user_id = :user_id2";


        $row = $db->row($sql, array(
            "user_id0" => $user_id,
            "user_id1" => $user_id,
            "user_id2" => $user_id,
            "file_id" => $file_id
        ));

        return !empty($row) ? $row : false;
    }

    /**
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $file_key
     * @param type $userid
     * @return type
     */
    function getFileInfoDBinFolder($folder_id, $filename, $userid = false)
    {
        global $db, $core, $user;

        $sql = "SELECT f.*,"
            . "\n IF(d.{$this->dpfo}id < 6, '" . $user->user_dir . "', d.{$this->dpfo}hash) as folder_hash,"
            . "\n CONCAT_WS('.', f.{$this->dpfi}name, f.{$this->dpfi}extension) as full_name,"
            . "\n DATE(file_date) as date"
            . "\n FROM " . $core->fTable . " f"
            . "\n LEFT JOIN " . $core->dTable . " as d ON d.{$this->dpfo}id = f.{$this->dpfi}folder "
            . "\n WHERE CONCAT_WS('.', f.{$this->dpfi}name, f.{$this->dpfi}extension) = :filename AND f.{$this->dpfi}folder = :folder_id AND f.{$this->dpfi}user_id = :user_id";



        $rows = $db->row($sql, array(
            "user_id" => (($userid) ? $userid : $user->userid),
            "filename" => $filename,
            "folder_id" => $folder_id
        ));

        return !empty($rows) ? $rows : 0;
    }

    /**
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $userid
     * @param type $file_key
     * @param type $folder_id
     * @return type
     */

    public function getFileInfoOnFly($userid, $file_key, $folder_id)
    {
        global $db, $core, $user;

        $user_id = (($userid) ? $userid : $user->userid);

        $sql = "SELECT f.*,"
            . "\n IF(d.{$this->dpfo}id < 6, '" . $user->user_dir . "', d.{$this->dpfo}hash) as folder_hash,"
            . "\n CONCAT(f.{$this->dpfi}name, '.', f.{$this->dpfi}extension) as full_name"
            . "\n FROM " . $core->fTable . " f"
            . "\n LEFT JOIN " . $core->dTable . " as d ON d.{$this->dpfo}id = f.{$this->dpfi}folder "
            . "\n AND {$this->dpfo}user_id = :user_id1"
            . "\n WHERE f.{$this->dpfi}key = :key "
            . (($folder_id) ? ("\n AND f.{$this->dpfi}folder = :folder_id") : "")
            . " AND f.{$this->dpfi}user_id = :user_id0";

        $db->bindMore(array(
            "key" => $file_key,
            "user_id0" => $user_id,
            "user_id1" => $user_id
        ));

        if ($folder_id) {
            $db->bind("folder_id", $folder_id);
        }

        $row = $db->row($sql);

        return !empty($row) ? $row : false;
    }

    /**
     * 
     * @global type $core
     * @global type $user
     * @param type $name
     * @return string
     */
    function createFileName($name)
    {
        global $core, $user;
        $partRand = $core->getUniqueCode(9);
        $key = $partRand . '_';

        if (isset($_SESSION[$name]) && $_SESSION['ups'] == $name) {
            $return = $_SESSION[$name];
        } else {

            if ($this->checkfilexistDB($key) == 0) {
                $return = $_SESSION[$name] = $key . makeSlug($name);
                $_SESSION['ups'] = $_SESSION['filetitle'] = $name;
            } else {
                $this->createFileName($name);
                $_SESSION['filetitle'] = $name;
            }
        }

        return $return;
    }

    /**
     * 
     * @global type $db
     * @global type $core
     * @param type $key
     * @return type
     */
    function checkfilexistDB($value, $folder_id = false, $byid = false, $userid = false)
    {
        global $db, $core;

        //        $user_id = $userid ? $userid : $user->userid;

        if ($byid)
            $sqlwh = "{$this->dpfi}id = :value";
        else
            $sqlwh = "{$this->dpfi}key = :value";

        if ($folder_id) {
            $sqlwh .= " AND {$this->dpfi}folder = :folder_id";
            $db->bind("folder_id", $folder_id);
        }

        if ($userid) {
            $sqlwh .= " AND {$this->dpfi}user_id = :user_id";
            $db->bind("user_id", $userid);
        }

        $db->bind("value", $value);

        $sql = "SELECT {$this->dpfi}id, {$this->dpfi}key FROM $core->fTable WHERE $sqlwh";

        $row = $db->row($sql);

        return ($row) ? $row : 0;
    }

    /**
     * Insert a file record to the DB
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $file
     * @param type $onfile
     * @return boolean
     */

    function insertFileToDB($file, $onfile = false)
    {
        global $db, $core, $user;

        $data = $onfile ? $file : array(
            $this->dpfi . 'user_id' => (int) $user->userid,
            $this->dpfi . 'access' => (int) $file->access,
            $this->dpfi . 'description' => "$file->description",
            $this->dpfi . 'name' => "$file->name",
            $this->dpfi . 'key' => "$file->key",
            $this->dpfi . 'extension' => "$file->extension",
            $this->dpfi . 'folder' => (int) $file->folder,
            $this->dpfi . 'mime_folder' => (int) $file->mime_id,
            $this->dpfi . 'path' => sanitise($file->path),
            $this->dpfi . 'size' => "$file->size",
            $this->dpfi . 'date' => $file->date ? $file->date : ":now()",
            $this->dpfi . 'changed' => $file->changed,
            $this->dpfi . 'modified' => $file->modified,
            $this->dpfi . 'prepend' => $file->prepend,
        );

        $result = $db->insert($core->fTable, $data);

        if ($result) {
            return $db->lastInsertId();
        }

        return false;
    }

    /**
     * 
     * @param type $name
     * @param type $key
     * @return type
     */
    function getFileKeyFromName($name, $key = 0)
    {
        $arr = explode("_", $name);
        return $arr[$key];
    }

    /**
     * 
     * @param type $file
     * @return type
     */
    function getFileName($file, $ext = true, $original = false)
    {

        if ($original) {
            return $file['file_name'] . (!$ext ? '' : ('.' . $file['file_extension']));
        } else {
            return urldecode($file['file_key'] . '_' . makeSlug($file['file_name']) . (!$ext ? '' : ('.' . $file['file_extension'])));
        }
    }

    /**
     * 
     * @global type $user
     * @param type $file
     * @param type $tn
     * @param type $user_dir
     * @return type
     */
    function createPureDirectFileUrl($file, $tn, $user_dir = false)
    {
        global $user;

        $filename = $this->getFileName($file);

        return CLO_URL . '/' . ($user_dir ? $user_dir : $user->user_dir) . '/' . ($tn ? ('thumbnail/') : '') . $filename;
    }

    /**
     * 
     * @param type $cacheURI
     * @param type $path
     * @param type $user_dir
     * @return type
     */
    function returnImagePath($cacheURI, $path, $user_dir)
    {

        return str_replace($path, $user_dir, $cacheURI);
    }

    /**
     * 
     * @global type $user
     * @param type $file
     * @return type
     */
    function createViewUrI($file, $path = false, $tn = false, $view = false, $folder_hash = false, $userid = false, $suffix = false)
    {
        global $user;

        $userdir = \return6charsha1($userid);

        if (in_array($file['file_extension'], $this->prohibitedTypesArr)) {
            return $this->createDownloadUrI($this->getFileName($file), false, $userdir);
        } else {

            $type = $this->getTypeIcon($file);

            if ($this->isImage($file['file_extension'])) {

                if ($tn) {
                    $extension = $this->fixtnExtensions($file['file_extension']);
                    return FILE_URL . '/' . ($userid ? $userdir : $user->user_dir) . '/' . ($folder_hash ? $folder_hash . '/' : '') . $type . '/' . $file['file_key'] . ($suffix ? $suffix : '') . '.' . $extension . '';
                } elseif ($view) {
                    $extension = $this->fixtnExtensions($file['file_extension']);
                    return '/' . ($userid ? $userdir : $user->user_dir) . '/view/' . $file['file_key'] . '.' . $extension;
                }
                return '/' . ($userid ? $userdir : $user->user_dir) . '/' . (($path == "/" || $path == "") ? "" : (trim($path, '/') . '/'))  . $file['file_name'] . '.' . $file['file_extension'];
            }
            return CLO_URL . '/' . ($userid ? $userdir : $user->user_dir) . '/' . (($path == "/" || $path == "") ? "" : (trim($path, '/') . '/'))  . $file['file_name'] . '.' . $file['file_extension'];
        }
    }

    /**
     * 
     * @global type $user
     * @param type $file_name
     * @param type $user_id
     * @return type
     */
    function createDownloadUrI($purefilename, $path = false, $userdir, $returnAsArray = false)
    {
        global $encryption;

        $file_base = rtrim($userdir, "/") . '/' . ltrim($path, "/");

        $firstpart = $purefilename;

        $secondpart =  $encryption->encode($file_base);

        $downloadLink = $returnAsArray ? array(
            "name" => $firstpart,
            "store" => $secondpart
        ) : (CLO_URL . '/?octet=download&file=' . $firstpart . '&store=' . $secondpart);

        return $downloadLink;
    }

    /**
     * creates folder hash (unique) - same as folder_id but less guesable ( used for url creations )
     * 
     * @global \Nedo\type $core
     * @return type
     * 
     */
    function generateFolderHash()
    {
        global $core;
        $hash = $core->getUniqueCode(5, true);

        //loop if the root of upload directory already contains this hash for a folder or there is a folder with this hash in DB
        if (countDataDB($core->dTable, $this->dpfo . 'hash', $hash) || (file_exists(UPLOAD_PATH . $hash) && is_dir(UPLOAD_PATH . $hash))) {
            return $this->generateFolderHash();
        }
        return 'C' . $hash;
    }

    /**
     * Returns jpg values for both bmp and jpeg
     * 
     * @param type $extension
     * @return string
     */
    function fixtnExtensions($extension)
    {

        switch (strtolower($extension)) {
            case "bmp":
            case "psd":
                return "jpg";
                break;

            case "jpg":
            case "jpeg":
                return "jpg";
                break;

            default:
                return $extension;
                break;
        }
    }

    /**
     * Fixes the no name files like .htaccess or with no extension files like "file"
     * 
     * @param type $filename
     * @param type $extension
     * @param type $name
     * @return boolean|string
     */
    public function fixNonameFile($filename, $extension, $name)
    {
        $arr = array();

        if ($filename == NULL || $filename == "") {

            if (strpos($name, ".") !== false) {
                $arr['filename'] = "";
                $arr['extension'] = $extension;
            } else {
                $arr['filename'] = $extension;
                $arr['extension'] = "";
            }

            return $arr;
        }

        return false;
    }


    /**
     * Add/Edit folder description (standalone action)
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $encryption
     */

    function editDescriptionFolder()
    {
        global $db, $core, $user, $encryption;

        $dir = $core->getNumbersOnly(post("pk"), false);

        $newfolderdescription = post("value");

        $err = 0;
        $data = array(
            $this->dpfo . 'description' => sanitise($newfolderdescription),
        );

        $update = $db->update($core->dTable, $data, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $dir, "user_id" => $user->userid));

        if (!$update) {
            $err = 2;
        } else {
            unset($data);
        }

        if ($err == 0) {


            //update modified time
            $data = array(
                $this->dpfo . 'modified' => ":now()"
            );

            $db->update($core->dTable, $data, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $dir, "user_id" => $user->userid));

            $core->jsonE["result"] = 1;
            $core->jsonE["message"]['title'] = 'Success!';
            $core->jsonE['message']['txt'] = 'Folder description edited successfully.';
            $core->jsonE['newValue'] = $newfolderdescription;
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = "Sorry! I couldn't find any changes to edit.";
        }
    }

    /**
     * Rename directory.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $encryption
     */
    function renameFolder()
    {
        global $db, $core, $user, $encryption;

        $dir = $core->getNumbersOnly(post("pk"), false);

        $newfoldername = $this->clearffNames(post("value"));

        $err = 0;

        $updated = false;

        if ($newfoldername == "") {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Error!</strong> Please enter a folder name.';
        }

        if ($newfoldername != post("oname") && ($row = $this->checkFolderExistDB($newfoldername, post("parent")))) {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Error!</strong> This directory already has a folder named <a href="#dir=' . $row['folder_hash'] . '"><i>' . $newfoldername . '</i></a>';
        }

        if (empty($core->jsonE["message"])) {

            $data = array(
                $this->dpfo . 'name' => sanitise($newfoldername),
                $this->dpfo . 'vpath' => cleaner($newfoldername)
            );

            //update physical folder
            if (post("oname") != $newfoldername) {
                $path = post("path");

                //to edit folder that is currently viewing
                if (ltrim($path, "/") == post("oname")) {

                    $path = mb_str_replace(post("oname"), "", $path);
                }

                $opath = $user->full_path . rtrim($path, "/") . '/' . cleaner(post("oname"));
                $npath = $user->full_path . rtrim($path, "/") . '/' . cleaner($newfoldername);

                //check physical dir
                if (is_dir($opath)) {
                    //rename it
                    if (!rename($opath, $npath)) {
                        $err = 1;
                    } else {
                        $this->recurse_mark_update(rtrim($path, "/") . '/' . cleaner($newfoldername), true);

                        $this->matchUserFilesAndFolders($dir, rtrim($path, "/") . '/' . cleaner($newfoldername), true);
                    }
                } else {
                    //print_r($opath);
                    $err = 1;
                }
            }

            if (!$err) {
                $updated = $db->update($core->dTable, $data, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $dir, "user_id" => $user->userid));

                if (!$updated) {
                    $err = 2;
                } else {
                    unset($data);
                    //update modified time
                    $data = array(
                        $this->dpfo . 'modified' => ":now()"
                    );
                    $db->update($core->dTable, $data, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $dir, "user_id" => $user->userid));
                }
            }


            if ($err == 0) {
                $core->jsonE["result"] = 1;
                $core->jsonE["message"]['title'] = 'Success!';
                $core->jsonE['message']['txt'] = 'Folder renamed.';
                $core->jsonE['newValue'] = $newfoldername;
            } elseif ($err == 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message'] = (($user->isAdmin()) ?
                    ('<b>Error!</b> Rename <b class="ul">' . post("oname") . "</b> was failed."
                        . "###Please check chmod settings."
                        . "###The folder you are trying to rename might be renamed or deleted in some way.") : ("<b>Renaming folder(s) was failed!</b>"
                        . "###Please process a folder update."
                        . "###The folder you are trying to rename might be already deleted or moved."
                    )
                );

                //will implemented to all functions
                $core->jsonE['item_names'][] = post("oname");
                $core->jsonE['message'] = $core->doErrList($core->jsonE['message'], false, false);
            } elseif ($err > 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message'] = "Sorry! I couldn't find any changes to edit.";
            }
        }
    }

    /**
     * Edit directory information.
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $newfoldername
     * @param type $newdescription
     * @param type $newicon
     * @param type $dir
     */
    function editFolder($newfoldername, $newdescription, $newicon, $dir)
    {
        global $db, $core, $user, $encryption;

        $newfoldername = $this->clearffNames($newfoldername);
        $err = 0;
        $updated = false;

        if ($newfoldername == "") {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Error!</strong> Please enter a folder name.';
        }

        if (post("fopass") == 1 && $_POST['fopass_val'] == "") {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = isset($core->jsonE["message"]) ? '' : '<strong>Error!</strong> Please enter a password.';
        }

        if ($newfoldername != post("oname") && ($row = $this->checkFolderExistBySlug(cleaner($newfoldername), post("parent")))) {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Error!</strong> This directory already has a folder named <a href="#dir=' . $row['folder_hash'] . '"><i>' . $newfoldername . '</i></a>';
        }

        if (empty($core->jsonE["message"])) {


            $newicon = (!post("icon")) ? "" : post("icon");

            $data = array(
                $this->dpfo . 'user_id' => $user->userid,
                $this->dpfo . 'vpath' => cleaner($newfoldername),
                $this->dpfo . 'name' => sanitise($newfoldername),
                $this->dpfo . 'description' => sanitise($newdescription),
                $this->dpfo . 'icon' => $newicon
            );

            /**
             * apply user permissions
             */
            if (!$user->checkUserPrivilege("rename")) {
                unset($data[$this->dpfo . 'name']);
            }
            if (!$user->checkUserPrivilege("describe")) {
                unset($data[$this->dpfo . 'description']);
            }

            if (post("fopass")) {
                //change password if it's not empty
                if ((post('fopass') == 2 && !empty($_POST['fopass'])) || (post('fopass') == 1 && !empty($_POST['fopass']))) {
                    $password = $encryption->encode($_POST['fopass_val']);
                } else {
                    $password = false;
                }
            } else {
                //no password
                $password = '';
            }

            if ($password == '' || $password !== false) {
                $data[$this->dpfo . 'pass'] = $password;
            }

            //update physical folder
            if (post("oname") != $newfoldername) {
                $path = post("path");


                //to edit current folder
                if (ltrim($path, "/") == post("oname") || post("ondir")) {
                    $path = mb_str_replace(post("oname"), "", $path);
                }

                $opath = $user->full_path . rtrim($path, "/") . '/' . cleaner(post("oname"));
                $npath = $user->full_path . rtrim($path, "/") . '/' . cleaner($newfoldername);

                //check physical dir
                if (is_dir($opath)) {
                    //$this->createPhysicalDir($opath, ($this->getFolderLevel($dir) + 1));

                    //rename it

                    if (!@rename($opath, $npath)) {
                        $err = 1;
                    } else {
                        $this->recurse_mark_update(rtrim($path, "/") . '/' . cleaner($newfoldername), true);
                    }
                } else {
                    $err = 1;
                }
            }

            if (!$err) {
                $updated = $db->update($core->dTable, $data, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $dir, "user_id" => $user->userid));

                if (!$updated) {
                    $err = 2;
                } else {
                    unset($data);
                    //update modified time
                    $data = array(
                        $this->dpfo . 'modified' => ":now()"
                    );
                    $db->update($core->dTable, $data, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $dir, "user_id" => $user->userid));
                }
            }


            if ($err == 0) {
                $core->jsonE["result"] = 1;
                $core->jsonE["message"] = '<strong>Folder properties changed successfully.</strong>';
            } elseif ($err == 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message'] = (($user->isAdmin()) ?
                    ("<b>Error! Editing " . post("oname") . " was failed.</b>"
                        . "###Please check chmod settings."
                        . "###Target directory path :<br>{$this->fixPath($opath)}" . '<b class="label label-warning">' . filePerm($opath, true) . '</b>'
                        . "###Be sure you have updated it's current directory."
                        . "###The folder(s) you are trying to edit might be renamed or deleted in some way.") : ("<b>Editing folder(s) was failed!</b>"
                        . "###Please process a folder update."
                        . "###The folder you are trying to edit might be already deleted or moved."
                    )
                );

                //will implemented to all functions
                $core->jsonE['item_names'][] = post("oname");
                $core->jsonE['message'] = $core->doErrList($core->jsonE['message'], false, false);
            } elseif ($err > 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message'] = "Sorry! I couldn't find any changes to edit.";
            }
        }
    }

    /**
     * Create a new directory.
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $foldername
     * @param type $description
     * @param type $icon
     * @param type $dir
     */
    function createFolder($foldername, $description, $icon, $dir, $path = false, $cdate = false, $modified = false)
    {
        global $db, $core, $user;

        $foldername = sanitise($this->clearffNames($foldername));

        if ($foldername == "") {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Error!</strong> Please enter a folder name.';
        }

        //prohibited folder names are required for thumbnails and view versions of images
        if (in_array($foldername, $this->prohibitedFolderNameArr)) {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Error!</strong> Please enter another folder name.';
        }

        if (empty($core->jsonE["message"]) || $path) :

            if ($row = $this->checkFolderExistBySlug(\cleaner($foldername), $dir)) {
                $core->jsonE["result"] = 0;
                $core->jsonE["message"] = '<strong>Error!</strong> This directory already has a folder named <a href="#dir=' . $row['folder_hash'] . '"><i>' . $foldername . '</i></a>';
                return false;
            } else {
                $v_path = cleaner($foldername);
                $r_path = $path ? $path : (post("path") == '/' ? '' : urldecode(post("path")));
                $p_path = $user->full_path . $r_path . '/';
                $r_path = $p_path . cleaner($foldername);

                $full_path = $user->full_path . $v_path;
                $level = ($this->getFolderLevel($dir) + 1);
                $hash = $this->generateFolderHash();

                $data = array(
                    $this->dpfo . 'user_id' => $user->userid,
                    $this->dpfo . 'vpath' => cleaner($v_path),
                    $this->dpfo . 'hash' => $hash,
                    $this->dpfo . 'name' => sanitise($foldername),
                    $this->dpfo . 'parent_id' => sanitise($dir),
                    $this->dpfo . 'level' => $level,
                    $this->dpfo . 'description' => sanitise($description),
                    $this->dpfo . 'icon' => ($icon ? $icon : NULL),
                    $this->dpfo . 'created' => ($cdate ? $cdate : ":now()"),
                    $this->dpfo . 'modified' => ($modified ? $modified : ":now()"),
                    $this->dpfo . 'static' => 0,
                );
                //if the path wasnt given try to recreate dir.
                $mkdir = $this->createPhysicalDir($r_path, $level);

                if ($mkdir) {
                    //insert folder data to DB
                    $result = $db->insert($core->dTable, $data);
                } else {
                    if ($user->isAdmin()) {
                        $core->jsonE["result"] = 0;
                        $core->jsonE["message"] = '<strong><i>' . $foldername . '</i> can not be created, please check chmod rights.</strong>';
                        $core->jsonE['message'] = (($user->isAdmin()) ?
                            ('<strong><i>' . $foldername . '</i> can not be created.</strong>'
                                . "###Please check chmod settings."
                                . "###Target directory path :<br>{$this->fixPath($p_path)}" . '<b class="label label-warning">' . filePerm($p_path, true) . '</b>'
                                . "###You might also take a look  at permissions.") : ("<b>Creating new folder was failed!</b>"
                                . "###Please process a folder update."
                                . '###If you will always get this message please <a href="javascript:;" data-remote="/?uiaction=contact" data-toggle="#uimodal">contact</a> to the administrator.>'
                            )
                        );

                        $core->jsonE['message'] = $core->doErrList($core->jsonE['message'], false, false);

                        return false;
                    }
                }

                if ($result) {
                    $core->jsonE["result"] = 1;
                    $core->jsonE["message"] = '<strong><i>' . $foldername . '</i> has been created successfully.</strong>';
                    return $db->lastInsertId();
                } else {
                    $core->jsonE["result"] = 0;
                    $core->jsonE['error_upload_db_insert'] = "Sorry! I encountered an error.<br>Error Code: " . mysql_errno($result);
                    return false;
                }
            }
        endif;
    }

    /**
     * Create directory physically.
     * 
     * @param type $path
     * @param type $level
     * @return boolean
     */
    function createPhysicalDir($path, $level = false)
    {

        if (!is_dir($path)) {
            if (@mkdir($path, 0777)) {
                if ($level) {
                    //create index.php for the given path
                    return createIndexFile($level + 2, $path);
                } else {
                    return true;
                }
            }
        } else {
            //or only try to create an index.php
            if (!file_exists($path . '/index.php')) {
                return createIndexFile($level + 2, $path);
            }

            return true;
        }
    }

    /**
     * copy whole physical directory to the given target(path)
     * @param type $path
     * @param type $target
     */
    private function recurse_copy($src, $dst)
    {

        if (is_dir($src)) {
            $dir = opendir($src);
            @mkdir($dst);
            while (false !== ($file = readdir($dir))) {
                if (($file != '.') && ($file != '..')) {
                    if (is_dir($src . '/' . $file)) {
                        $this->recurse_copy($src . '/' . $file, $dst . '/' . $file);
                    } else {
                        copy($src . '/' . $file, $dst . '/' . $file);
                    }
                }
            }
            closedir($dir);
            return true;
        } else {
            return false;
        }
    }

    /**
     * remove whole physical directory structure
     * @param type $dirname
     * @return boolean
     */
    public function removeDirectory($dirname)
    {
        $dir_handle = false;
        if (is_dir($dirname)) {
            $dir_handle = @opendir($dirname);
            if ($dir_handle) {
                while ($file = readdir($dir_handle)) {
                    if ($file != "." && $file != "..") {
                        if (!is_dir($dirname . "/" . $file))
                            unlink($dirname . "/" . $file);
                        else
                            $this->removeDirectory($dirname . '/' . $file);
                    }
                }
                closedir($dir_handle);
                rmdir($dirname);
            }
        }
        return true;
    }

    /**
     * Delete a folder from DB returns true if succeed  else false
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $id
     * @return boolean
     */
    function deleteFolderFromDB($id)
    {
        global $db, $core;

        if ($id < 7) return false;

        $delete = $db->delete($core->dTable, "{$this->dpfo}id = :id", array("id" => $id));

        if ($delete) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $files
     * @param type $dir
     * @return boolean
     */
    function deleteFolderFiles($files = false, $dir = false, $cdir = false)
    {
        global $db, $core, $user;

        if ($dir) {
            $cdir = $dir;

            $files_to_delete = $this->getFolderFiles($dir);

            if ($files_to_delete)
                foreach ($files_to_delete as $key => $file) {
                    $file_real_path = $this->getSingleFilePath($file, false);

                    $deleted = $db->delete($core->fTable, "{$this->dpfi}folder = :folder", array("folder" => $file['file_folder']));

                    //delete file physically.
                    if ($deleted) {
                        if (is_file($file_real_path))
                            $this->deletePhysicalFile($file_real_path);
                        if ($this->isImage($file)) {
                            //thumbnail
                            if (file_exists($this->getSingleFilePath($file, true))) {
                                if (!$this->checkfilexistDB($file['file_key'])) {
                                    $this->deletePhysicalFile($this->getSingleFilePath($file, true)); //thumbnail
                                }
                                //view version
                                if (file_exists($this->getSingleFilePath($file, 'view'))) {
                                    $this->deletePhysicalFile($this->getSingleFilePath($file, 'view')); //view version
                                }
                            }
                        }
                    } else
                        return false;
                }
        } else {
            $err = 0;
            //its an array of files.
            $files_to_delete = is_array($files) ? $files : $this->getRequestedFilesArr($files);

            if ($files_to_delete)
                foreach ($files_to_delete as $id) {

                    $file = $this->getFileInfoFromDB($id, false);

                    if (!$file) {
                        $err = 1;
                    }

                    $file_real_path = $this->getSingleFilePath($file);
                    //delete file from DB
                    $deleted = $db->delete($core->fTable, "{$this->dpfi}id = :id", array("id" => $id));

                    //delete single file physically.
                    if ($deleted) {
                        if (is_file($file_real_path))
                            $this->deletePhysicalFile($file_real_path);
                        else
                            $err = 0;

                        if ($this->isImage($file)) {
                            if (is_file($this->getSingleFilePath($file, "thumb"))) {

                                //dont delete thumbnail if another same image exists in another folder (depending md5_file())
                                if (!$this->checkfilexistDB($file['file_key'])) {
                                    if (file_exists($this->getSingleFilePath($file, 'thumb'))) {
                                        $this->deletePhysicalFile($this->getSingleFilePath($file, "thumb")); //thumbnail
                                    }
                                    //view version
                                    if (file_exists($this->getSingleFilePath($file, 'view'))) {
                                        $this->deletePhysicalFile($this->getSingleFilePath($file, 'view')); //view version
                                    }
                                }
                            } else
                                $err = 0;
                        }
                    } else {
                        $err = 1;
                    }
                }
            if ($err == 0) {
                //update folder item count
                $this->setUserFolderFiles($cdir, false);

                $core->jsonE["result"] = 1;
                $core->jsonE["message"] = '<strong>Selected file(s) deleted successfully.</strong>';
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE['message'] = "Sorry! I encountered an error. Please try again.";
            }
        }

        //return $deleted;
    }

    /**
     * Get one down level path from an item path
     * 
     * @param type $child_path
     * @param type $child_name
     * @return string
     */
    public function getParentPath($child_path, $child_name)
    {

        $parent_path = mb_str_replace($child_name, "", $child_path);

        $parent_path = rtrim($parent_path, "/");

        if ($parent_path == "") {
            return "/";
        }

        return $parent_path;
    }

    /**
     * Marks whole folder tree as to be updated
     * 
     * @global \Nedo\type $user
     * @param type $dir
     * @param type $cput
     * @param type $user_full_path
     * @param type $only_cput
     * @return type
     */
    function recurse_mark_update($dir, $cput = false, $user_full_path = false, $only_cput = false)
    {

        global $user;

        $uifullpath = ($user_full_path) ? $user_full_path : $user->full_path;

        $uidir = ($dir == "/") ? "/" : ("/" . $dir);

        $fobj = new \DirectoryIterator($uifullpath . $uidir);

        if ($cput) {
            @file_put_contents($uifullpath . $uidir . '/update.clo', "1");
        }
        if (!$only_cput)
            return $this->recurse_mark_update_proc($fobj);
    }

    /**
     * 
     * @global \Nedo\type $user
     * @param \DirectoryIterator $dir
     * @return boolean
     */
    function recurse_mark_update_proc(\DirectoryIterator $dir)
    {

        global $user;

        foreach ($dir as $node) {

            if ($node->isDir() && !$node->isDot()) {

                @file_put_contents($node->getPathname() . '/update.clo', "1");

                $this->recurse_mark_update_proc(new \DirectoryIterator($node->getPathname()));
            }
        }
        return true;
    }

    /********************************************************/
    /*                FOLDER ACTIONS                        */
    /********************************************************/

    /**
     * 
     * @global type $db
     * @global type $core
     * @param type $data
     * @param type $current_folder
     * @return int
     */
    function deleteFolderProc($data, $current_folder)
    {
        $result = 0;
        foreach ($data as $key => $row) {
            if (!$this->folder_name && $row['folder_id'] == $current_folder) {
                $this->folder_name = $row['folder_name'];
            }
            if ($row['folder_parent_id'] == $current_folder) {

                $this->deleteFolderFiles(false, $row['folder_id']);

                $result = $this->deleteFolderFromDB($row['folder_id']);

                $this->deleteFolderProc($data, $row['folder_id']);
            }
        }
        unset($row);
        return 1;
    }

    /**
     * Removes whole folder tree + all files & folders it contains
     * 
     * @global type $db
     * @global type $core
     * @param type $dir
     */
    function deleteFolder($dir)
    {
        global $db, $core, $user;
        $allfolders = $this->getUserFolders(false);
        $result = 0;

        if ($core->getNumbersOnly($dir) < 7) return false;

        //delete a folder completely (physical)
        if (isset($allfolders[$dir]['folder_name']))
            $this->removeDirectory($user->full_path . post("path") . '/' . $allfolders[$dir]['folder_vpath']);

        if ($this->deleteFolderProc($allfolders, $dir)) {
            //delete the files inside this $dir
            if ($this->countOrGetAllUserFiles($dir) > 0)
                $this->deleteFolderFiles(false, $dir);

            $this->setUserFolderFiles($dir, false);
            //finally delete this $dir
            $result = $db->delete($core->dTable, "{$this->dpfo}id = :id", array("id" => $dir));

            if ($result) {
                $core->jsonE["result"] = 1;
                $core->jsonE["message"] = '<strong><i>' . $this->folder_name . '</i> and all files and folders it contains deleted successfully.</strong>';
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE["message"] = '<strong>Sorry! I encountered an error.<br>This Error shows that I can not perform as i have to! You might want to contact to the <a href="mailto:' . $core->site_email . '">administrator</a>.</strong>';
            }
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Sorry! I encountered an error.<br>This Error shows that I can not perform as i have to! You might want to contact to the <a href="mailto:' . $core->site_email . '">administrator</a>.</strong>';
        }

        $core->jsonE['items'][] = $allfolders[$dir]['folder_name'];
        return true;
    }

    /**
     * Copy whole directory tree from source to target (creates duplicates for each files and folders)
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $dir_id
     * @return boolean
     */
    public function copyFolder($dir_id)
    {
        global $db, $core, $user;

        //        sleep(1);

        $dir_id = $core->getNumbersOnly($dir_id, false);

        $current_path = post("cpath");

        $current_dir_id = $core->getNumbersOnly(post("cdir"), false);

        $target_path = post("path");

        $target_dir_id = $core->getNumbersOnly(post("dir"), false);

        $err = false;

        //get folder current level from its path;
        $dirlevel = substr_count((rtrim($current_path, "/") . "/"), "/");

        $newDirlevel = substr_count((rtrim($target_path, "/") . "/"), "/");

        $levelChange = ($newDirlevel - $dirlevel);

        $dir = $this->getFolderInfoDB($dir_id, false, false); //everytime check for a folder on DB.

        if ($dir) {

            $dir_source_full_path = $user->full_path . rtrim($current_path, '/') . '/' . $dir['folder_name'];

            $dir_target_full_path = $user->full_path . rtrim($target_path, '/') . '/' . $dir['folder_name'];

            //move file from $olddir to $targetdir
            if ($this->recurse_copy($dir_source_full_path, $dir_target_full_path)) {

                //create a new folder in DB
                $new_dir_id = $this->createFolder($dir['folder_name'], $dir['folder_description'], $dir['folder_icon'], $target_dir_id, $target_path, $dir['folder_created'], false);

                //if new_dir_id === false / dir is already there! so dont bother to get informations using new id only get its id
                if ($new_dir_id === false) {
                    $tdirInf = $this->checkFolderExistDB($dir['folder_name'], $target_dir_id);

                    $new_dir_id = $tdirInf["folder_id"];
                }

                $new_dir = $this->getFolderInfoDB($new_dir_id, false, false);

                $this->matchUserFilesAndFolders($new_dir_id, $target_path . '/' . $dir['folder_name'], true);

                //make required changes for subdirs of it
                //there is no way to get informations whithout getting all folders for each one // working on it...
                //$folders = $this->getUserFolders(false);

                $create_update_file = $this->recurse_mark_update($target_path . '/' . $dir['folder_name']);

                if ($err) {
                    $core->jsonE["result"] = 0;
                    $core->jsonE['ppop']['items'][] = $new_dir['folder_id'];
                    $core->jsonE['ppop']['item_names'][] = $new_dir['folder_name'];

                    $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                        "<b>Copying folder(s) was failed!</b>"
                        . "###Please be sure that you have grant access to make changes on DB."
                        . "###You may need to update the directory that contains these folder(s)." :
                        '<b>Copying folder(s) was failed!</b><br>Please try again in a few seconds.')
                        . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                    $core->jsonE["copyError"] = $core->jsonE['ppop']['id'] = 133; //133 db error
                    return false;
                } else {

                    $this->setUserFolderFiles($target_dir_id, false);
                }
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE['ppop']['items'][] = $new_dir['folder_id'];
                $core->jsonE['ppop']['item_names'][] = $new_dir['folder_name'];

                $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                    "<b>Some of the following folder(s) could not be copied!</b>"
                    . "###Please check chmod settings."
                    . "###Be sure you have updated it's current directory."
                    . "###The folder(s) you are trying to copy might be renamed or deleted in some way." :
                    '<b>Copying folder(s) was failed!</b><br>There is no such folder(s) on the disk.')
                    . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                $core->jsonE['ppop']['action'] = array(
                    array('label' => 'Update current folder', 'className' => 'btn-primary btn-sm', 'callback' => 'qDirActions:updatedir', 'value' => implode(",", $core->jsonE['ppop']['items'])),
                    array('label' => 'Cancel', 'className' => 'btn-default btn-sm'),
                );

                $core->jsonE["copyError"] = $core->jsonE['ppop']['id'] = 134; //134 chmod error
                return false;
            }
            $core->jsonE["result"] = 1;
            $core->jsonE['items'][] = $new_dir['folder_name'];
            return true;
        }
    }

    /**
     * Move a folder from source path to target path completely. (recursively)
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $dir_id
     * @return boolean
     */
    public function moveFolder($dir_id)
    {
        global $db, $core, $user;

        //        sleep(1);
        $dir_id = $core->getNumbersOnly($dir_id, false);

        $current_path = post("cpath");
        $current_dir_id = $core->getNumbersOnly(post("cdir"), false);
        $target_path = post("path");
        $target_dir_id = $core->getNumbersOnly(post("dir"), false);
        $err = false;

        //get folder current level from its path;
        $dirlevel = substr_count((rtrim($current_path, "/") . "/"), "/");

        $newDirlevel = substr_count((rtrim($target_path, "/") . "/"), "/");

        $levelChange = ($newDirlevel - $dirlevel);

        $dir = $this->getFolderInfoDB($dir_id, false, false); //everytime check for a dir on DB.

        if ($dir) {

            $dir_source_full_path = mb_str_replace("/", DS, $user->full_path . rtrim($current_path, '/') . '/' . $dir['folder_vpath']);

            $dir_target_full_path = mb_str_replace("/", DS, $user->full_path . rtrim($target_path, '/') . '/' . $dir['folder_vpath']);

            //            if(is_dir($dir_source_full_path)){

            //move file from $olddir to $targetdir
            if ($this->recurse_copy($dir_source_full_path, $dir_target_full_path)) {

                //update folder info on DB 
                $data = array(
                    $this->dpfo . 'parent_id' => $target_dir_id,
                    $this->dpfo . 'level' => $newDirlevel
                );

                $err = !($db->update($core->dTable, $data, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $dir_id, "user_id" => $user->userid)));

                //create a new index.php in it
                createIndexFile($newDirlevel + 2, $dir_target_full_path);

                //make required changes for subdirs of it
                //there is no way to get informations whithout getting all folders for each one // working on it...
                $folders = $this->getUserFolders(false);

                $subdirs = $this->getSubFoldersOfFolder($folders, $dir_id, false);

                $this->folder_path = '';

                if (is_array($subdirs) && !empty($subdirs)) {
                    foreach ($subdirs as $key => $val) {

                        $subdirlevel = $val['folder_level'];

                        $newLevel = ($subdirlevel + $levelChange);
                        $sdata = array(
                            $this->dpfo . 'parent_id' => $val['folder_parent_id'],
                            $this->dpfo . 'level' => (int) $newLevel
                        );

                        $err = !($db->update($core->dTable, $sdata, "{$this->dpfo}id= :id AND {$this->dpfo}user_id = :user_id", array("id" => $val['folder_id'], "user_id" => $user->userid)));
                    }

                    unset($sdata);
                }

                if ($err) {
                    $core->jsonE["result"] = 0;
                    $core->jsonE['ppop']['items'][] = $dir['folder_id'];
                    $core->jsonE['ppop']['item_names'][] = $dir['folder_name'];

                    $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                        "<b>Moving folder(s) was failed!</b>"
                        . "###Please ensure that you have grant access to make changes on DB."
                        . "###You may need to update the directory that contains these folder(s)." :
                        '<b>Moving folder(s) was failed!</b><br>Please try again in a few seconds.')
                        . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                    $core->jsonE["moveError"] = $core->jsonE['ppop']['id'] = 131; //131 db error
                    return false;
                } else {
                    //finally remove & update file counts also mark as update
                    $this->removeDirectory($dir_source_full_path);

                    $this->setUserFolderFiles($target_dir_id, $current_dir_id);

                    $create_update_file = $this->recurse_mark_update(rtrim($target_path, '/') . '/' . $dir['folder_vpath'], true);

                    $this->matchUserFilesAndFolders($dir_id, rtrim($target_path, '/') . '/' . $dir['folder_vpath'], true);
                }
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE['ppop']['items'][] = $dir['folder_id'];
                $core->jsonE['ppop']['item_names'][] = $dir['folder_name'];

                $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                    "<b>Some of the following folder(s) could not be moved!</b>"
                    . "###Please check chmod settings."
                    . "###Be sure you have updated it's current directory."
                    . "###The folder(s) you are trying to move might be renamed or deleted in some way." :
                    '<b>Moving folder(s) was failed!</b><br>There is no such folder(s) on the disk.')
                    . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                $core->jsonE['ppop']['action'] = array(
                    array('label' => 'Update current folder', 'className' => 'btn-primary btn-sm', 'callback' => 'qDirActions:updatedir', 'value' => implode(",", $core->jsonE['ppop']['items'])),
                    array('label' => 'Cancel', 'className' => 'btn-default btn-sm'),
                );

                $core->jsonE["moveError"] = $core->jsonE['ppop']['id'] = 132; //132 chmod error
                return false;
            }
            $core->jsonE["result"] = 1;
            $core->jsonE['items'][] = $dir['folder_name'];
            return true;
        }
    }
    /********************************************************/
    /*                ACTIONS                          */
    /********************************************************/

    function addRemoveStar($idArr)
    {

        global $db, $core, $user, $encryption;

        $add = (post("add") == "true") ? 7 : 0;

        $itemIDs = filter_var_array($idArr);

        $err = 0;

        if (is_array($itemIDs) && !empty($itemIDs)) {

            foreach ($itemIDs as $key => $itemID) {

                $item = $this->itemTypeFromString($itemID);
                $ID = $item["id"];
                $type = $item["type"];

                $prefix = ($type == "dir") ? $this->dpfo : $this->dpfi;
                $table = ($type == "dir") ? $core->dTable : $core->fTable;

                $data = array(
                    $prefix . 'starred' => $add
                );

                $updated = $db->update($table, $data, "{$prefix}id= :id AND {$prefix}user_id = :user_id", array("id" => $ID, "user_id" => $user->userid));

                if (!$updated) {
                    $err = 1;
                }

                unset($data);
            }
        }
        if ($err == 0) {
            $core->jsonE["result"] = 1;
            $core->jsonE["message"]['title'] = 'Success!';
            $core->jsonE['message']['txt'] = $add ? 'Item(s) starred.' : 'Item(s) starred removed.';
            $core->jsonE['message']['icon'] = $add ? "star" : "star-o";
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = "Sorry! I encountered an error.";
        }
    }

    /********************************************************/
    /*                FILE ACTIONS                          */
    /********************************************************/

    /**
     * Add/Edit file description (standalone action)
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $encryption
     */

    function editDescriptionFile()
    {

        global $db, $core, $user, $encryption;

        $file = $core->getNumbersOnly(post("pk"), false);

        $newfiledescription = $this->clearffNames(post("value"));

        $err = 0;
        $updated = false;

        $path = post("path");

        $opath = $user->full_path . rtrim($path, "/") . '/' . post("oname");

        if ($this->checkfilexistDB($file, post("parent"), true)) {


            $data = array(
                $this->dpfi . 'description' => sanitise($newfiledescription),
            );

            $updated = $db->update($core->fTable, $data, "{$this->dpfi}id= :id AND {$this->dpfi}user_id = :user_id", array("id" => $file, "user_id" => $user->userid));

            if (!$updated) {
                $err = 2;
            }
        }
        unset($data);
        if ($err == 0) {
            //update modified time
            $data = array(
                $this->dpfi . 'modified' => ":now()"
            );

            $db->update($core->fTable, $data, "{$this->dpfi}id= :id AND {$this->dpfi}user_id = :user_id", array("id" => $file, "user_id" => $user->userid));

            $core->jsonE["result"] = 1;
            $core->jsonE["message"]['title'] = 'Success!';
            $core->jsonE['message']['txt'] = 'File description changed.';
            $core->jsonE['newValue'] = $newfiledescription;
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = "Sorry! I couldn't find any changes to edit.";
        }
    }

    /**
     * Renames given file (standalone action)
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $encryption
     */
    function renameFile()
    {
        global $db, $core, $user, $encryption;

        $file = $core->getNumbersOnly(post("pk"), false);

        $newfilename = $this->clearffNames(post("value"));

        $err = 0;

        if ($newfilename == "") {
            $core->jsonE["result"] = 0;
            $core->jsonE["message"] = '<strong>Error!</strong> Please enter a file name.';
        }

        if (empty($core->jsonE["message"])) {

            if (post("oname") != $newfilename) {
                $path = post("path");

                $opath = $user->full_path . rtrim($path, "/") . '/' . post("oname");

                @list($dirname, $basename, $extension, $filename) = array_values(pathinfo($opath));

                if (isset($extension) && $extension != "") {
                    $extlen = strlen($extension) + 1;

                    if (strpos($newfilename, $extension) !== false) {
                        $newfilename = mb_substr($newfilename, 0, ($extlen * -1), "UTF-8");
                    }
                }

                $pnewfilename = $newfilename;

                $npath = $user->full_path . rtrim($path, "/") . '/' . $newfilename . (isset($extension) ? ('.' . $extension) : '');

                if ($this->checkFile($npath) && !$this->files_identical($opath, $npath)) {

                    $newfilename = $core->upcount_name($newfilename); // if file exists append number to the old name
                }


                $npath = $user->full_path . rtrim($path, "/") . '/' . $newfilename . (isset($extension) ? ('.' . $extension) : '');

                //                var_dump($npath, $opath);

                if (is_file($opath) && !is_dir($opath)) {

                    //rename it
                    if (!@rename($opath, $npath)) {
                        $core->jsonE['item_names'][] = post("oname");
                        $err = 1;
                    } else {

                        @list($dirname, $basename, $extension, $filename) = array_values(pathinfo($npath));

                        $data = array(
                            $this->dpfi . 'name' => sanitise($filename),
                        );

                        $updated = $db->update($core->fTable, $data, "{$this->dpfi}id= :id AND {$this->dpfi}user_id = :user_id", array("id" => $file, "user_id" => $user->userid));

                        if (!$updated) {
                            $err = 2;
                        }
                    }
                }
            }
            unset($data);
            if ($err == 0) {
                //update modified time
                $data = array(
                    $this->dpfi . 'modified' => ":now()"
                );

                $db->update($core->fTable, $data, "{$this->dpfi}id= :id AND {$this->dpfi}user_id = :user_id", array("id" => $file, "user_id" => $user->userid));

                $core->jsonE["result"] = 1;
                $core->jsonE["message"]['title'] = 'Success!';
                $core->jsonE['message']['txt'] = 'File renamed';
                $core->jsonE['newValue'] = $newfilename . (isset($extension) ? ('.' . $extension) : '');
                $core->jsonE['newpValue'] = $pnewfilename;
            } elseif ($err == 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message'] = (($user->isAdmin()) ?
                    ('<b>Error!</b> Rename <b class="ul">' . post("oname") . "</b> was failed."
                        . "###Please check chmod settings."
                        . "###The file you are trying to rename might be renamed or deleted in some way.") : ("<b>Renaming file(s) was failed!</b>"
                        . "###Please process a folder update."
                        . "###The file you are trying to rename might be already deleted or moved."
                    )
                );

                $core->jsonE['message'] = $core->doErrList($core->jsonE['message'], false, false);
            } elseif ($err > 1) {
                $core->jsonE["result"] = 0;
                $core->jsonE['message'] = "Sorry! I couldn't find any changes to edit.";
            }
        }
    }

    /**
     * Removes thumbs or view versions of an deleted image
     * 
     * @param type $file
     */

    public function deleteImageFileE($file)
    {

        $err = 0;
        if ($this->isImage($file)) {

            $thumb_path = $this->getSingleFilePath($file, 'thumb');
            $view_path = $this->getSingleFilePath($file, 'view');

            if (file_exists($thumb_path)) {
                //don't delete thumbnail & view version if another same image exists in another folder (depending on md5_file())
                if (!$this->checkfilexistDB($file['file_key'])) {

                    if (file_exists($thumb_path)) {
                        $err = !$this->deletePhysicalFile($thumb_path); //thumbnail
                    }

                    if (file_exists($view_path)) {
                        if (file_exists($view_path)) {
                            $err = !$this->deletePhysicalFile($view_path); //view version
                        }
                    }
                }
            }
            return $err;
        }
    }

    /**
     * To delete single file by using it's ID. removes file from DB & from it's physical directory.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $id
     * @return boolean
     */
    public function deleteFile($file_id, $full_path = false)
    {
        global $db, $core, $user;

        $file = $this->getFileInfoFromDB($file_id, false);
        $path = post("path");
        $err = false;

        if ($file) {
            $file_real_path = $full_path ? $full_path : $this->getSingleFilePath($file, false, $path);

            //delete single file physically.
            if ($this->deletePhysicalFile($file_real_path)) {

                if (!$err) {
                    //delete file from DB
                    $err = !$this->deleteFileFromDB($file_id);

                    $err = $this->deleteImageFileE($file);

                    if ($err) {
                        $core->jsonE["result"] = 0;
                        $core->jsonE['ppop']['items'][] = $file['file_id'];
                        $core->jsonE['ppop']['item_names'][] = $file['full_name'];

                        $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                            "<b>Deletion file(s) was failed!</b>"
                            . "###Please be sure that you have grant access to delete rows on DB."
                            . "###You may need to update the directory that contains these files." :
                            '<b>Deletion file(s) was failed!</b><br>Please try again in a few seconds.')
                            . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                        $core->jsonE["deleteError"] = $core->jsonE['ppop']['id'] = 126; //126 db error
                        return false;
                    }
                }
            } else {

                $core->jsonE["result"] = 0;
                $core->jsonE['ppop']['items'][] = $file['file_id'];
                $core->jsonE['ppop']['item_names'][] = $file['full_name'];

                $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                    "<b>Some of the following file(s) could not be removed!</b>"
                    . "###Please Check your chmod settings."
                    . "###Be sure you have updated it's current directory."
                    . "###The file(s) you are trying to delete might be already deleted or renamed in some way." :
                    '<b>Deletion file(s) was failed!</b><br>There is no such file(s) on the disk.')
                    . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                $core->jsonE['ppop']['action'] = array(
                    array('label' => 'Remove completely', 'className' => 'btn-danger btn-sm', 'callback' => 'qDirActions:delmissingfile', 'value' => implode(",", $core->jsonE['ppop']['items'])),
                    array('label' => 'Ignore', 'className' => 'btn-default btn-sm'),
                );

                $core->jsonE["deleteError"] = $core->jsonE['ppop']['id'] = 127; //127 chmod error
                return false;
            }

            $core->jsonE["result"] = 1;
            $core->jsonE['items'][] = $file['full_name'];

            $this->filesChanged = true;

            return true;
        } else {

            $core->jsonE["result"] = 1;
            $core->jsonE['message']['txt'] = 'The file already has been removed.';
        }

        return false;
    }

    /**
     * Move single file from one directory to another one.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $file
     * @param type $target
     * @param type $olddir
     * @return boolean
     */
    public function moveFile($file_id)
    {
        global $db, $core, $user;

        $current_path = post("cpath");
        $current_dir_id = $core->getNumbersOnly(post("cdir"), false);
        $target_path = post("path");
        $target_dir_id = $core->getNumbersOnly(post("dir"), false);
        $err = false;

        $file = $this->getFileInfoFromDB($file_id, false); //everytime check for a file on DB.

        if ($file) {

            $file_source_full_path = $this->getSingleFilePath($file, false, $current_path);

            $file_target_full_path = $this->getSingleFilePath($file, false, $target_path);

            //move file from $olddir to $targetdir
            if (@rename($file_source_full_path, $file_target_full_path)) {


                $params = array(
                    "id" => $file_id,
                    "user_id" => $user->userid,
                    "target_dir_id" => $target_dir_id,
                    "target_path" => $target_path
                );

                $err = !$db->query(
                    "UPDATE $core->fTable "
                        . "SET {$this->dpfi}folder = :target_dir_id, {$this->dpfi}path = :target_path "
                        . "WHERE {$this->dpfi}id = :id AND {$this->dpfi}user_id = :user_id",
                    $params
                );

                if ($err) {
                    $core->jsonE["result"] = 0;
                    $core->jsonE['ppop']['items'][] = $file['file_id'];
                    $core->jsonE['ppop']['item_names'][] = $file['full_name'];

                    $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                        "<b>Moving file(s) was failed!</b>"
                        . "###Please be sure that you have grant access to make changes on DB."
                        . "###You may need to update the directory that contains these files." :
                        '<b>Moving file(s) was failed!</b><br>Please try again in a few seconds.')
                        . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                    $core->jsonE["moveError"] = $core->jsonE['ppop']['id'] = 128; //123 db error
                    return false;
                }
            } else {
                $core->jsonE["result"] = 0;
                $core->jsonE['ppop']['items'][] = $file['file_id'];
                $core->jsonE['ppop']['item_names'][] = $file['full_name'];

                $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                    "<b>Some of the following file(s) could not be moved!</b>"
                    . "###Please check chmod settings."
                    . "###Be sure you have updated it's current directory."
                    . "###The file(s) you are trying to move might be renamed or deleted in some way." :
                    '<b>Moving file(s) was failed!</b><br>There is no such file(s) on the disk.')
                    . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                $core->jsonE["moveError"] = $core->jsonE['ppop']['id'] = 129; //124 chmod error
                return false;
            }
            $core->jsonE["result"] = 1;
            $core->jsonE['items'][] = $file['full_name'];

            $this->filesChanged = true;

            return true;
        }
    }

    /**
     * Copies single file 
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $file_id
     * @return boolean
     */

    public function copyFile($file_id)
    {
        global $db, $core, $user;

        $current_path = post("cpath");
        $current_dir_id = $core->getNumbersOnly(post("cdir"), false);
        $target_path = post("path");
        $target_dir_id = $core->getNumbersOnly(post("dir"), false);
        $err = false;

        $file = $this->getFileInfoFromDB($core->getNumbersOnly($file_id, false), false); //everytime check for a file on DB.

        if ($file) {

            $file_source_full_path = $this->getSingleFilePath($file, false, $current_path);

            $file_target_full_path = $this->getSingleFilePath($file, false, $target_path);

            //move file from $olddir to $targetdir
            if (@copy($file_source_full_path, $file_target_full_path)) {

                $data = array(
                    "access" => $file['file_access'], //1: private, 2: public (for future versions of CLOSHARE)
                    "description" => $file['file_description'],
                    "name" => $file['file_name'], //remove extension from name
                    "key" => $file['file_key'],
                    "extension" => $file['file_extension'],
                    "folder" => $target_dir_id,
                    "mime_id" => $file['file_mime_folder'],
                    "path" => $target_path, //new file path
                    "size" => $file['file_size'],
                    "password" => $file['file_password'],
                    "date" => $file['file_date'],
                    "changed" => $file['file_changed'],
                    "modified" => $file['file_modified'],
                    "prepend" => 0
                );

                //insert it as a new to DB
                $dataObj = (object) $data;
                $err = !($this->insertFileToDB($dataObj, false));

                if ($err) {

                    $core->jsonE['ppop']['items'][] = $file['file_id'];
                    $core->jsonE['ppop']['item_names'][] = $file['full_name'];

                    $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                        "<b>Copying file(s) was failed!</b>"
                        . "###Please be sure that you have grant access to insert to DB."
                        . "###You may need to update the directory that contains these files." :
                        '<b>Copying file(s) was failed!</b><br>Please try again in a few seconds.')
                        . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                    $core->jsonE["copyError"] = $core->jsonE['ppop']['id'] = 130; //125 db insert error
                    return false;
                }
            } else {
                $core->jsonE['ppop']['items'][] = $file['file_id'];
                $core->jsonE['ppop']['item_names'][] = $file['full_name'];

                $core->jsonE['ppop']['message'] = (($user->isAdmin()) ?
                    "<b>Some of the following file(s) could not be copied!</b>"
                    . "###Please Check your chmod settings."
                    . "###Be sure you have updated it's current directory."
                    . "###The file(s) you are trying to copy might be renamed or deleted in some way." :
                    '<b>Copying file(s) was failed!</b><br>Source file(s) does not exist on the disk.')
                    . '<b class="uld db well well-small mtb5 p5"> %s </b>';

                $core->jsonE["copyError"] = $core->jsonE['ppop']['id'] = 131; //126 chmod copy error
                return false;
            }
            $core->jsonE["result"] = 1;
            $core->jsonE['items'][] = $file['full_name'];

            $this->filesChanged = true;

            return true;
        }
    }

    /**
     * 
     * @global type $db
     * @global type $core
     * @global type $user
     * @param type $dir
     * @param type $olddir
     * @return type
     */
    function updateUserFolderFileCount($dir, $allfolders)
    {
        global $db, $core, $user;

        $dirArr = array();

        $dirArr[] = $tardir = isset($allfolders[$dir]) ? $allfolders[$dir] : false;

        $parents = $tardir['folder_parent_id'] > 6 ? $this->getParentFoldersOfFolder($allfolders, $tardir['folder_parent_id']) : null;

        $dirs = $parents != null ? array_merge($parents, $dirArr) : $dirArr;

        $dirs = array_reverse($dirs);

        foreach ($dirs as $d => $line) {

            $sum = $this->countFolderFilesProc($line['folder_id'], $allfolders);

            $params = array(
                "idx" => $line['folder_id'],
                "user_id" => $user->userid,
                "count" => $sum['count'],
                "size" => $sum['size']
            );

            $update = $db->query("UPDATE $core->dTable SET {$this->dpfo}files = :count , {$this->dpfo}size = :size WHERE {$this->dpfo}id = :idx AND {$this->dpfo}user_id = :user_id", $params);


            $sum = 0;

            unset($line);
        }
    }

    /**
     * 
     * @param type $folders
     * @param type $current_folder_parent
     * @param type $current_folder_name
     * @param type $level
     * @return type
     */
    function getFolderPath($folders, $current_folder_parent, $current_folder_slug, $level)
    {

        $path = $this->folder_path = '';
        if ($current_folder_parent == (int) "-1") {
            return "/";
        }
        return $this->getFolderPathProc($folders, $current_folder_parent, $current_folder_slug, $level) . $current_folder_slug;
    }

    /**
     * 
     * @param type $folders
     * @param type $current_folder_parent
     * @param type $current_folder_name
     * @param type $level
     * @return type
     */
    function getFolderPathProc($folders, $current_folder_parent, $current_folder_slug, $level)
    {

        foreach ($folders as $key => $row) {

            //root folder name to "/"
            if ($row['folder_id'] == 1) {
                $spath = "";
            } else {
                $spath = $row['folder_vpath'];
            }

            if ($row['folder_id'] == $current_folder_parent && $row['folder_level'] < $level) {
                $this->folder_path = $this->getFolderPathProc($folders, $row['folder_parent_id'], $current_folder_slug, $row['folder_level']) . $spath . '/';
            }
        }
        unset($row);

        return $this->folder_path;
    }

    /**
     * 
     * @param type $folder_id
     * @param type $allfolders
     * @param type $cursum
     * @return type
     */
    function countFolderFilesProc($folder_id, $allfolders, $cursum = false)
    {

        $this->subdirs = array();
        $subdirs = $this->getSubFoldersOfFolder($allfolders, $folder_id, true, $folder_id);


        //count and sum child folders files of current folder
        $sum = 0;
        $size = 0;
        foreach ($subdirs as $key => $row) {

            $total = $this->countOrGetAllUserFiles($row['folder_id'], true);

            unset($total["data"]);

            $total["id"] = $row['folder_id'];

            $sum += $total['count'];
            $size += $total['size'];

            //            var_dump($sum, $total['count']);
            //            echo "-------------------\n";
        }

        return array("count" => $sum, "size" => $size);
    }

    /**
     * 
     * @param type $target
     * @param type $old
     */
    function setUserFolderFiles($target, $old, $folders = false)
    {

        $allfolders = ($folders && !empty($folders)) ? $folders : $this->getUserFolders(false);

        if ($target > 6)
            $this->updateUserFolderFileCount($allfolders[$target]['folder_id'], $allfolders);
        if ($old > 6)
            $this->updateUserFolderFileCount($allfolders[$old]['folder_id'], $allfolders);
    }

    /**
     * Removes all file entries on given user id from DB
     * 
     * @global type $db
     * @global type $core
     * @param type $userid
     * @return type
     */
    function deleteUserAllFilesDB($userid)
    {
        global $db, $core;

        return $db->delete($core->fTable, "{$this->dpfi}user_id = :user_id", array("user_id" => $userid));
    }

    /**
     * Removes all folder entries on given user id from DB
     * 
     * @global type $db
     * @global type $core
     * @param type $userid
     * @return type
     */
    function deleteUserAllFoldersDB($userid)
    {
        global $db, $core;

        return $db->delete($core->dTable, "{$this->dpfo}user_id = :user_id", array("user_id" => $userid));
    }

    public function fixPath($path)
    {

        $path = str_replace("\\", "/", $path);
        $path = preg_replace("/^(\.*\/+)+/", "", $path);
        $path = preg_replace("/\/+/", "/", $path);
        $path = preg_replace("/\/$/", "", $path);



        return $path . (is_dir($path) ? '/' : '');
    }

    /**
     * Prepare single file download link
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $value
     * @param type $path
     * @return type
     */

    public function prepareSingleFileDownload($value, $path)
    {
        global $core, $user, $encryption;

        //set ZIP Archive Session for after use
        $_SESSION["ZIP_ARCHIVE_ITEMS"] = array();

        $size = 0;

        $fileid = $value[0];
        $path = $path[0];

        if (!empty($fileid)) {
            //selected files&folders

            $fpath = $user->user_dir . '/' .  ltrim($path, "/");

            if ($this->checkFile($user->full_path . $path)) {

                $purefilename = post("name");

                $file_base = mb_str_replace($purefilename, "", $fpath);

                $downloadLink = CLO_URL . '/?octet=download&file=' . $purefilename . '&store=' . $encryption->encode($file_base);
            } else {

                $core->jsonE['ppop']['items'][] = $core->getNumbersOnly(sanitise($fileid), false);
                $core->jsonE['ppop']['item_names'][] = $path;
            }
        }
        if (empty($core->jsonE["ppop"]['items'])) {
            $core->jsonE['result'] = 1;
            $core->jsonE['message'] = 'Download will start automatically...If not please click <a href="' . $downloadLink . '">here</a> to retrieve file again.';
            $core->jsonE['koko'] = $file_base;
            $core->jsonE['octet'] = $downloadLink;
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = (($user->isAdmin()) ?
                "<b>Some of the following paths could not be counted!</b>"
                . "###The item(s) you are trying to download might be renamed or deleted in some way." :
                '<b>Fetching path information was failed!</b><br>There are missing item(s) on the disk.')
                . '<b class="uld db well well-small mtb5 p5"> %s </b>';

            $core->jsonE['ppop']['action'] = array(
                array('label' => 'Update current folder', 'className' => 'btn-primary btn-sm', 'callback' => 'qDirActions:updatedir', 'value' => implode(",", $core->jsonE['ppop']['items'])),
                array('label' => 'Cancel', 'className' => 'btn-default btn-sm'),
            );

            $core->jsonE['ppop']['message'] = $core->doErrList($core->jsonE['message'], false, false);
        }
    }

    /**
     * Calculate total size(in Bytes) of array of requested items
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $value
     * @param type $path
     * @return type
     */
    public function calculateApproximateSize($value, $path)
    {
        global $core, $user;

        //set ZIP Archive Session for after use
        $_SESSION["ZIP_ARCHIVE_ITEMS"] = array();

        $size = 0;

        $value = is_array($value) ? $value : array(sanitise($value));
        $path = is_array($path) ? $path : array($path);

        if (!empty($value)) {
            //selected files&folders
            foreach ($value as $key => $val) {

                $fpath = $user->full_path . $path[$key];

                if ($this->checkFile($fpath)) {

                    //set ZIP Archive Session for after use
                    $_SESSION["ZIP_ARCHIVE_ITEMS"][/* $core->getNumbersOnly(sanitise($val),false) */] = $fpath;

                    $size += $this->totalSize($fpath, $this->exclude_files);
                } else {

                    $core->jsonE['ppop']['items'][] = $core->getNumbersOnly(sanitise($val), false);
                    $core->jsonE['ppop']['item_names'][] = $path[$key];
                }
            }
        }
        if (empty($core->jsonE["ppop"]['items'])) {
            $core->jsonE["result"] = 1;
            $core->jsonE["size"] = $this->formatBytes($size, 2, true);
            return $core->jsonE;
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = (($user->isAdmin()) ?
                "<b>Some of the following paths could not be counted!</b>"
                . "###The item(s) you are trying to download might be renamed or deleted in some way." :
                '<b>Fetching path information was failed!</b><br>There are missing item(s) on the disk.')
                . '<b class="uld db well well-small mtb5 p5"> %s </b>';

            $core->jsonE['ppop']['action'] = array(
                array('label' => 'Update current folder', 'className' => 'btn-primary btn-sm', 'callback' => 'qDirActions:updatedir', 'value' => implode(",", $core->jsonE['ppop']['items'])),
                array('label' => 'Cancel', 'className' => 'btn-default btn-sm'),
            );

            $core->jsonE['ppop']['message'] = $core->doErrList($core->jsonE['message'], false, false);
        }
    }

    /**
     * Create a compressed .zip archive with the previously stored in session ($_SESSION["ZIP_ARCHIVE_ITEMS"]) paths are required.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     */
    public function createArchive($download = false)
    {
        global $core, $user, $encryption;

        require_once __DIR__ . DS . "class.archive.php";

        if (isset($_SESSION["ZIP_ARCHIVE_ITEMS"]) && !empty($_SESSION["ZIP_ARCHIVE_ITEMS"])) {

            //            $zip = new ZipArchive;
            //get the current directory path from first item in array    
            $fitem = $_SESSION["ZIP_ARCHIVE_ITEMS"][0];
            //create zip file in the parent folder
            $current_path = (dirname($fitem) . DS);

            //            var_dump($_SESSION["ZIP_ARCHIVE_ITEMS"], $current_path);

            $return = array();
            $saveArchive = ($download) ? post("saveArchive") : true;
            //random archive name
            $zipnamePure = 'snapshot-' . date("Ymdhsi") . rand(111, 999) . '.zip';
            $zipname = ($saveArchive ? $current_path : (UPLOAD_PATH . "tmp" . DS)) . $zipnamePure;

            $zipCurrentDirOnly = post("ondir") === true ? true : false;

            $zip = new zip;
            //set exclude some folder and files
            $zip->set_exclude($this->exclude_files);

            //$_SESSION["ZIP_ARCHIVE_ITEMS"] = mb_str_replace("/", DS, $_SESSION["ZIP_ARCHIVE_ITEMS"]);
            //            print_r($_SESSION["ZIP_ARCHIVE_ITEMS"]);
            //            die();
            $zip->makeZip($_SESSION["ZIP_ARCHIVE_ITEMS"], $zipname);


            //create more info about this pack
            $zippedFrom = array();
            foreach ($_SESSION["ZIP_ARCHIVE_ITEMS"] as $key => $value) {

                if (basename($value) == $user->user_dir) {
                    $zippedFrom = false;
                    break;
                }

                $zippedFrom[] = basename($value);
            }

            $zippedFrom = $zippedFrom ? ((string) implode(" | ", $zippedFrom)) : $zippedFrom;


            //if document root was compressed move it after process to the user root directory
            if ((post("dirname") == $user->user_dir)) {

                @rename(UPLOAD_PATH . $zipnamePure, $user->full_path . DS . $zipnamePure);
            }

            //update directory
            if ($saveArchive) {


                //                print "current_path : $current_path \n";

                //                print "UPLOAD_PATH :". UPLOAD_PATH ."\n";

                $uip = mb_str_replace(UPLOAD_PATH, "", $current_path);

                //                print "uip: $uip \n";

                //                print "\$user->user_dir : $user->user_dir \n";

                if ($uip == $user->user_dir . DS || ($uip == "" && $zipCurrentDirOnly)) {
                    $uip = "";
                    $infpath = $current_path . $user->user_dir . '/';
                } else {
                    $uip = mb_str_replace($user->user_dir . '/', "", $uip);
                    $infpath = $current_path;
                }

                if (!$zippedFrom) {
                    $descText = 'Created as a full archive(Backup).';
                } else {
                    $descText = "Archive created from " . ($zipCurrentDirOnly ? post("dirname") : $zippedFrom);
                }
                //create info file for this pack
                $this->createInfoFile(array(
                    'filename' => $zipnamePure,
                    'description' => $descText,
                    'path' => (post("dirname") == $user->user_dir ? $current_path . $user->user_dir . '/' : $current_path),
                    'prepend' => 1,
                ));

                $this->matchUserFilesAndFolders(post("dirid"), '/' . $uip, true);
            }

            $core->jsonE['result'] = 1;

            if ($download) {
                $helperUrl = ($saveArchive ? '/' . ($uip == "" ? ($user->user_dir . '/') : ($user->user_dir . '/' . $uip)) : "tmp/");

                $downloadLink = CLO_URL . '/?octet=download&file=' . $zipnamePure . '&store=' . $encryption->encode($helperUrl);

                $core->jsonE['message'] = 'Download will start automatically...If not please click <a href="' . $downloadLink . '">here</a> to retrieve file again.';
                $core->jsonE['octet'] = $downloadLink;
            } else {

                $core->jsonE['message'] = 'Selected Item(s) was compressed successfuly';
            }
        } else {

            die("at least one file path must be provided in session.");
        }
    }

    /**
     * Prepares requested items for extraction
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global type $content
     * @param type $relative
     * @param type $toSelect
     * @return type
     */

    public function prepare_extracti($relative = true, $toSelect = false)
    {
        global $core, $user, $content;

        require_once __DIR__ . DS . "class.archive.php";

        $size = 0;

        $value = post("value"); //id of an zip archive :: future thought
        $path = rtrim(post("path"), "/") . DS . post("name");
        $full_zip_path = $user->full_path . $path;

        if (file_exists($full_zip_path)) {

            $zip = new zip;

            $zipInfo = $zip->infosZip($full_zip_path);

            if ($zipInfo !== false) {

                $core->jsonE['zipInfo'] = "";
                $tempArr = array();
                $core->jsonE = $this->recursive_dirs($user->full_path, true, $toSelect);

                foreach ($zipInfo as $key => $value) {

                    $tempArr[] = array(
                        "name"  => $value["name"],
                        "path"  => 'Zip_Archive/' . $this->fixPath($key),
                        "size" => $value["UnCompSize"] . 'B',
                        "csize" => $value["Size"] . 'B',
                        "ratio" => $value["Ratio"],
                    );
                }
                $core->jsonE['zipInfo']['table'] = $content->createZipInfoTable($tempArr);
                $archive = new archive;

                $core->jsonE['zipInfo']['data'] = $archive->infos($full_zip_path, true);

                //set ZIP Archive Session for after use
                $_SESSION["EXTRACT_ZIP_ARCHIVE"] = $path;
            } else {
                $core->jsonE["ppop"]['items'][] = post("value");
                $core->jsonE["ppop"]['item_names'][] = $this->fixPath($path);
            }
        } else {
            unset($_SESSION["EXTRACT_ZIP_ARCHIVE"]);
            $core->jsonE["ppop"]['items'][] = post("value");
            $core->jsonE["ppop"]['item_names'][] = $this->fixPath($path);
        }

        if (!empty($core->jsonE["ppop"]['items'])) {

            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = (($user->isAdmin()) ?
                "<b>Error! This archive can't be extracted!</b>"
                . "###Please check chmod settings."
                . '<div class="mb10">**You don\'t have permission to execute the following file.</div><b class="label label-warning">chmod: ' . filePerm($full_zip_path, true) . '</b>' :
                '<b>Error! You don\'t have permission to extract the following file.</b>')
                . '<b class="uld db well well-small mtb5 p5"> %s </b>';

            $core->jsonE['ppop']['action'] = array(
                array('label' => 'Close', 'className' => 'btn-default btn-sm'),
            );

            $core->jsonE['ppop']['message'] = $core->doErrList($core->jsonE['message'], $core->jsonE["ppop"]['item_names'], false);
            $core->jsonE['ppop']['parsed'] = true;
            return $core->jsonE;
        }
    }

    /**
     * Extract a zip file to the given path (also can be used as a backup data...)
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $encryption
     */

    function extract_zip()
    {
        global $core, $user, $encryption;

        require_once __DIR__ . DS . "class.archive.php";

        $err = false;
        $extract = false;
        $extractTo_post = post("extract_to");

        if (post("extract_to") == "" || (is_array($extractTo_post) && empty($extractTo_post)))
            $err = "Error! Please specify a target folder.";

        if (is_array($extractTo_post)) {
            //            if($extractTo_post[1])
            $extractTo = rtrim((empty($extractTo_post[1]) ? $extractTo_post[0] : $extractTo_post[1]), "/");
        } else {
            $extractTo = rtrim($extractTo_post, "/");
        }

        if (!$err) {
            $value = post("value"); //id of an zip archive :: future thought
            $opath = rtrim(post("path"), "/");
            $path = $opath . DS . post("name");
            $full_zip_path = $user->full_path . $path;

            $extractTo_path = $extractTo;
            $extractTo = $user->full_path . DS . $extractTo_path;

            if (file_exists($full_zip_path)) {

                $zip = new zip;

                if (!is_dir($extractTo)) {
                    //target dir is missing create it first
                    @mkdir($extractTo, 0777);
                }

                $extract = $zip->extractZip($full_zip_path, $extractTo);
            }
        }
        if ($extract && !$err) {

            $core->jsonE["result"] = 1;

            if (!empty($extractTo_post[1])) {
                //create target folder inside current folder
                $id = $this->createFolder(ltrim($extractTo_path, "/"), "", "", post("parentid"), $opath);

                $dir = $this->getFolderInfoDB($id);

                $core->jsonE["message"] = 'Extracted successfuly. Go to folder <a href="#dir=' . $dir['folder_hash'] . '"><i>' . ltrim($extractTo_path, "/") . '</i></a>';
            } else {
                $core->jsonE["message"] = 'Extracted to <i>' . ltrim($extractTo_path, "/") . '</i> successfuly.</a>';
            }
            //mark target folder as tobe updated

            $this->recurse_mark_update($extractTo_path, true);
        } elseif ($err) {
            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = $err;
        } else {
            $core->jsonE["result"] = 0;
            $core->jsonE['message'] = (($user->isAdmin()) ?
                ("<b>Error! Extracting " . post("name") . " was failed.</b>"
                    . "###Please check chmod settings."
                    . "###Chmod of archive :<br>{$this->fixPath($opath)}" . '<b class="label label-warning">' . filePerm($full_zip_path, true) . '</b>'
                    . "###Target directory path :<br>{$this->fixPath($opath)}" . '<b class="label label-warning">' . filePerm($extractTo, true) . '</b>'
                    . "###Please check file permissions.") : ("<b>Extracting failed!</b>"
                    . "###Please process a folder update and try again."
                )
            );
        }
    }

    /**
     * Prepare items data to send email
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     */

    public function sendViaEmail($userid = false)
    {
        global $db, $core, $user, $share, $encryption;

        $err = false;
        $to = post("recipient");
        $sender = (post("sender") != "") ? post("sender") : false;

        $user_id = $userid ? $userid : $user->userid;

        if (!$to)
            $err = "Error! Please enter at least one recipient email address.";

        if (!$err) {

            $recipients = (strpos($to, ",") !== false) ? array_map('trim', explode(",", sanitise($to))) : array($to);

            $items = $this->createArrFromStringEachItemType(post("value"));

            //            var_dump($recipients);
            //            
            //            die();

            $countFiles = 0;
            $countFolders = 0;

            $filename = '';

            $totalSended = 0;

            $eitems = array();

            $tempArray = array();

            //fetch all user folders if emailed pack contains any folder
            if (isset($items["dir"]) && !empty($items["dir"]))
                $userfolders = $this->getUserFolders(false, $user_id);

            $viewData = $share->getShareElementParams(post("value"), false, $encryption->encode($user_id), false);

            foreach ($items as $key => $item) {
                //file array
                if ($key == 'file') {
                    //loop for each file id in the array
                    foreach ($item as $key => $id) {

                        if ($countFiles <= 2) {
                            $eitems[] = (object) $this->fileObject($this->getFileInfoFromDB($id, $user_id), "_m");
                            $countFiles++;
                        }

                        $tempArray[] = "f_" . $id;

                        //                      if($countFiles == 2) break;
                    }
                } else {
                    //its a directory
                    foreach ($item as $key => $id) {

                        if ($countFiles <= 2) {
                            $finfo = $this->getFolderInfoDB($id, $user_id, false);

                            $eitems[] = (object) $this->dirObject($finfo, $userfolders, true);

                            $countFiles++;
                        } else {

                            $finfo = $this->getFolderInfoDB($id, $user_id, false);

                            $lastfile = key($eitems);

                            $eitems[$lastfile] = (object) $this->dirObject($finfo, $userfolders, true);

                            $countFiles++;
                        }

                        $tempArray[] = "d_" . $id;

                        //                        if($countFiles == 3) break;
                    }
                }
            }

            //            var_dump(implode(",", $tempArray));
            ////            
            //            die();

            $viewUrl = $viewData["url"];

            $countFile = isset($items["file"]) ? count($items["file"]) : 0;
            $countFolder = isset($items["dir"]) ? count($items["dir"]) : 0;

            $totalSended = $countFile + $countFolder;

            $message = post("message");

            ob_start();

            include VIEW_PATH . 'email' . DS . 'email-item-content.php';
            $emailOut = ob_get_contents();
            ob_end_clean();

            //            print $emailOut;

            $tempRes = array();
            $total = count($recipients);
            $x = 0;

            //            foreach($recipients as $recipient){

            $result = $core->sendSingleMail(
                array(
                    "body" => $emailOut,
                    "subject" => ($user->logged_in ? ($user->user_name . " sent you some file(s)") : ('a file was sent you on ' . CLO_SITE_NAME)),
                ),

                $recipients,
                ($user->logged_in ? $user->user_name : $sender),
                null,
                null,
                sanitise($sender)
            );

            //                if(!$result){
            //                    $tempRes[] = $recipient;
            //                }else{
            //                    $x++;
            //                }
            //            }
            foreach ($recipients as $recipient) :
                //add email to userdata if not exists & the user is logged_in to their account
                if ($user->logged_in && $user->userid == $user_id) {
                    if ($user->getuserData($recipient, 'email') === false) {
                        $data = array(
                            "user_id" => $user_id,
                            "type" => "email",
                            "value" => $recipient
                        );

                        $db->insert($core->vTable, $data);
                    }
                }
            endforeach;

            if (!$result) {
                $core->jsonE["result"] = 0;
                $core->jsonE["message"]['title'] = 'Error!';
                $core->jsonE['message']['txt'] = 'While sending to the following emails<br>' .  implode("<br>", $tempRes);
            } else {
                $core->jsonE["result"] = 1;
                $core->jsonE["message"] = '<i class="icon icon-check"></i> Email was sent successfuly.';
            }
        }
    }

    /**
     * Remove prepend option from a file on DB (after creation of a zip file it must be listed as a prepended but after first show let it to be where it must be)
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $file
     * @return boolean
     */

    function unprependFile($file)
    {
        global $db, $core, $user;

        $run = true;

        if (is_array($file)) {
            $fileid = $file['file_id'];
            $run = ($file['file_prepend'] == 1) ? true : false;
        } else {
            $fileid = $file;
        }

        if (!$run) return true;

        $data = array(
            "file_prepend" => 0
        );

        unset($_SESSION['prepended_file']);

        $data = array(
            "file_prepend" => 0,
            "id" => sanitise($fileid),
            "user_id" => $user->userid
        );

        $update = $db->query("UPDATE $core->fTable SET file_prepend = :file_prepend WHERE {$this->dpfi}id = :id AND {$this->dpfi}user_id = :user_id", $data);


        return $update ? true : false;
    }

    /**
     * Creates a inf file of a file
     * 
     * @param type $data
     * @return boolean
     */
    function createInfoFile($data)
    {
        $inf = <<<EOF
filename#:::#{$data['filename']}
description#:::#{$data['description']}
prepend#:::#{$data['prepend']}
EOF;
        if (file_put_contents($data['path'] . $data['filename'] . '-inf.inf', $inf)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Parses the inf file of a file or a folder which is created automatically or created outside of system... (future imrovements will be more useful)
     * 
     * @param type $filename
     * @return type
     */
    function parseInfoFile($filename)
    {

        $txt_file = file_get_contents($filename);
        $rows = explode("\n", $txt_file);
        $info = array();
        array_shift($rows);

        foreach ($rows as $row => $data) {
            //get row data
            $row_data = explode('#:::#', $data);

            $info[$row_data[0]] = sanitise($row_data[1]);
        }

        if ($txt_file)
            unlink($filename);

        return $info;
    }

    /**
     * Returns file path
     * 
     * @global \Nedo\type $user
     * @param type $file
     * @param type $version
     * @param type $directory_path
     * @return type
     */
    function getSingleFilePath($file, $version = false, $directory_path = null)
    {
        global $user;

        if ($version) {
            switch ($version) {
                case "view":
                    return $user->full_path . DS . 'view' . DS . $file['file_key'] . '.' . $this->fixtnExtensions($file['file_extension']);
                    break;

                default:
                    return $user->full_path . DS . 'thumbnail' . DS . $file['file_key'] . '.' . $this->fixtnExtensions($file['file_extension']);
                    break;
            }
        }

        return $user->full_path . DS . $directory_path . DS . $file['file_name'] . '.' . $file['file_extension'];
    }

    /**
     * 
     * @param type $files
     * @return boolean
     */
    function getRequestedFilesArr($files, $itemOnArr = false)
    {
        global $core;

        if (!$files)
            return false;

        if (!$itemOnArr) {
            $files = str_replace("f_", "", $files);
            $files = str_replace("d_", "", $files);
        }

        if (strpos($files, ",") !== false) { //comma is here so multiple files was requested explode it to create an array;
            $arr = explode(",", $files);
        } else { //its a single file so retur single item array;
            $arr = array($files);
        }

        if ($itemOnArr) {
            $temp = array();
            foreach ($arr as $key => $ob) {
                $temp = array(
                    "id" => $core->getNumbersOnly($ob, false),
                    "type" => $this->fileOrFolder($ob)
                );

                $arr[$key] = $temp;
            }
        }

        return $arr;
    }

    /**
     * 
     * @global \Nedo\type $user
     * @param type $fpath
     * @return type
     */
    public function createFolderThumbs($fpath, $user_full_path = false, $onSession = false, $dirInfo = false, $suffix = false)
    {

        global $core, $user;

        $path = (($user_full_path) ? $user_full_path : $user->full_path) . $fpath . '/';

        if (!is_dir($path))
            return false;

        $iterator = new \GlobIterator("$path*", \FilesystemIterator::KEY_AS_FILENAME);

        $temp = array();
        $images = array();
        $dir = false;

        $folder_id = is_object($dirInfo) ? $dirInfo->id : $dirInfo;

        $shareDim = $core->isShareUrI() ? "544x435" : "";

        foreach ($iterator as $name => $item) {

            if ($item->isFile()) {

                if ($name == "index.php" || $name == "update.clo" || strpos($name, "-inf.inf") !== false)
                    continue;

                @list($dirname, $basename, $extension, $filename) = array_values(pathinfo($item->getPath() . "/" . $name));

                $user_id = ((is_object($dirInfo) ? $dirInfo->userid : ($user->logged_in ? $user->userid : false)));

                if ($this->isImage($extension)) {

                    //prevent more query
                    if (count($images) >= 3) {
                        continue;
                    }

                    $file = array(
                        'file_name' => $name,
                        'file_key' => md5_file($item->getPath() . "/" . $name, false),
                        'file_extension' => $extension
                    );

                    $folder_hash = (($onSession) ? $_SESSION["sfi"][$onSession]->hash : false);

                    $temp["images"][] = $images[] = array(
                        "src" => $this->createViewUrI($file, '/' . $dirname, true, false, $folder_hash, $user_id, $suffix),
                        "name" => $name,
                        "ftype" => "image"
                    );
                } else if ($this->isVideo($extension)) {

                    $temp['video'] = array(
                        "src" => THEME_URL . 'images/video' . $shareDim . '.gif',
                        "name" => $name,
                        "ftype" => "video",
                        "viewable" => true,
                    );
                } else if ($this->isAudio($extension)) {

                    $temp['audio'] = array(
                        "src" => THEME_URL . 'images/audio' . $shareDim . '.gif',
                        "name" => $name,
                        "ftype" => "audio",
                        "viewable" => true,
                    );
                } else if ($this->isDocument($extension)) {

                    $temp['document'] = array(
                        "src" => THEME_URL . 'images/document' . $shareDim . '.gif',
                        "name" => $name,
                        "ftype" => "document",
                        "viewable" => false,
                    );
                } else {
                    $temp['other'] = array(
                        "src" => THEME_URL . 'images/other' . $shareDim . '.gif',
                        "name" => $name,
                        "ftype" => "other",
                        "viewable" => false,
                    );
                }
            }

            if ($item->isDir()) {
                $temp["dir"] = $dir = array(
                    "src" => THEME_URL . 'images/folder' . $shareDim . '.gif',
                    "name" => $name,
                    "type" => "folder",
                    "ftype" => "folder",
                    "viewable" => false,
                );

                continue;
            }

            if ((count($images) + count($temp) + count($dir)) <= 4) {
                continue;
            }
        }


        $tempOftemp = array();
        //fetch file infos seperetly
        foreach ($temp as $key => $item) {

            //fetch db info and push except images and directory
            if ($key != "images" && $key != "dir") {

                $fileDBInfo = $this->getFileInfoDBinFolder($folder_id, $item["name"], $user_id);
                $fileInfo = $this->fileObject($fileDBInfo);
                $tempOftemp[$key] = array(
                    "src" => $item["src"],
                    "name" => $item["name"],
                    "type" => "file",
                    "ftype" => $item["ftype"],
                    "viewable" => $item["viewable"],
                    "inf" => $fileInfo
                );
            }
            //           No need so far...
            //             else if ($key == "dir") {
            //                $folderDBInfo = $this->getFolderInfoDB($folder_id, $user_id);
            //                $folderInfo = $this->dirObject($folderDBInfo);
            //                $tempOftemp[$key] = array(
            //                    "src" => $item["src"],
            //                    "inf" => $folderInfo
            //                );
            //            } 
            else if ($key != "dir" && $key == "images") {
                //images only
                foreach ($temp['images'] as $k => $im) {
                    $fileDBInfo = $this->getFileInfoDBinFolder($folder_id, $im["name"], $user_id);
                    $fileInfo = $this->fileObject($fileDBInfo);
                    $images[$k] = array(
                        "src" => $im["src"],
                        "name" => $im["name"],
                        "type" => "file",
                        "ftype" => $im["ftype"],
                        "viewable" => true,
                        "inf" => $fileInfo
                    );
                }
            }
        }

        unset($temp);
        $temp = $tempOftemp;

        $ctm = count($temp);
        $cim = count($images);

        if ($ctm >= 3) {
            $temp = array_slice($temp, 0, 2);

            if ($cim)
                $temp[2] = $images[0];
        } else if ($ctm == 1) {

            if ($cim > 0)
                $temp[1] = $images[0];
            if ($cim > 1)
                $temp[2] = $images[1];
        } else if ($ctm == 2) {

            if ($cim > 0)
                $temp[1] = $images[0];
        } else {
            $temp = array_slice($images, 0, 3);
            $temp = $temp;
        }

        if (count($temp) <= 3 && $dir) {
            $temp[2] = $dir;
            unset($temp[2]);
            $temp['folder'] = $dir;
        }

        return $temp;
    }

    /**
     * 
     * @param type $val
     * @return string - file or folder from string
     */
    function fileOrFolder($val)
    {
        if (strpos($val, "f") !== false) {
            return 'file';
        }
        return 'folder';
    }

    function createArrFromStringEachItemType($string, $callback = null)
    {

        $fileArr = array();
        $dirArr = array();
        $return = array();
        //check requested is single or not
        if (strpos($string, ",") !== false) {

            $itemArr = explode(",", $string);

            foreach ($itemArr as $item) {

                $parts = $this->itemTypeFromString($item);

                $type = $parts['type'];

                switch ($type) {
                    case "dir":
                        $dirArr[] = $parts['id'] > 6 ? $parts['id'] : null;
                        break;
                        //file
                    default:
                        $fileArr[] = $parts['id'];
                        break;
                }
            }


            $type = $this->itemTypeFromString($string);
        } else {
            //single element

            $parts = $this->itemTypeFromString($string);

            ${"{$parts['type']}Arr"}[] = $parts['id'];
        }

        if (!empty($fileArr)) {
            $return['file'] = $fileArr;
        }

        if (!empty($dirArr)) {
            $return['dir'] = $dirArr;
        }

        return $return;
    }

    /**
     * Returns item type and id in an array with the following keys "type" & "id"
     * 
     * @param type $string
     * @return type
     */
    function itemTypeFromString($string)
    {

        $str = (is_numeric($string) ? ("d_" . $string) : $string); //test if it' s only number so its a directory. folder tree uses only numbers

        $parts = explode("_", $str);

        if (strpos($str, "f_") !== false) {
            return array(
                "type" => "file",
                "id" => $parts[1]
            );
        }
        return array(
            "type" => "dir",
            "id" => $parts[1]
        );
    }

    /**
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $folder_name
     * @param type $parent_id
     * @param type $userid
     * @return type
     */
    function checkFolderExistBySlug($folder_slug, $parent_id, $userid = false)
    {
        global $db, $core, $user;

        $user_id = ($userid ? $userid : $user->userid);



        $sql = "SELECT "
            . "\n {$this->dpfo}id,"
            . "\n {$this->dpfo}name,"
            . "\n {$this->dpfo}vpath"
            . "\n {$this->dpfo}hash"
            . "\n FROM $core->dTable"
            . "\n WHERE {$this->dpfo}vpath = :folder_vpath AND {$this->dpfo}parent_id = :parent_id AND {$this->dpfo}user_id = :user_id";

        $row = $db->row($sql, array(
            "user_id" => $user_id,
            "folder_vpath" => $folder_slug,
            "parent_id" => $parent_id
        ));

        return !empty($row) ? $row : 0;
    }
    /**
     * Checks that given folder name is exists on DB or not
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $folder_name
     * @param type $parent_id
     * @param type $userid
     * @return type
     */
    function checkFolderExistDB($folder_name, $parent_id, $userid = false)
    {
        global $db, $core, $user;

        $user_id = ($userid ? $userid : $user->userid);



        $sql = "SELECT "
            . "\n {$this->dpfo}id,"
            . "\n {$this->dpfo}name,"
            . "\n {$this->dpfo}hash"
            . "\n FROM $core->dTable"
            . "\n WHERE {$this->dpfo}name = :folder_name AND {$this->dpfo}parent_id = :parent_id AND {$this->dpfo}user_id = :user_id";

        $row = $db->row($sql, array(
            "user_id" => $user_id,
            "folder_name" => $folder_name,
            "parent_id" => $parent_id
        ));

        return !empty($row) ? $row : 0;
    }

    /**
     * Return folder level
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @param type $parent_id
     * @return type
     */
    function getFolderLevel($parent_id)
    {
        global $db, $core, $user;
        $sql = "SELECT {$this->dpfo}level FROM $core->dTable "
            . "\n WHERE {$this->dpfo}user_id = :user_id AND {$this->dpfo}id = :parent_id";


        $row = $db->row($sql, array("user_id" => $user->userid, "parent_id" => $parent_id));

        return $row[$this->dpfo . 'level'];
    }

    /**
     * 
     * @param type $mime
     * @return string
     */
    function getFileTypeFromMimeType($mime)
    {
        if ($mime && strpos($mime, "/") !== false) {
            $temp = explode("/", $mime);
            return rtrim($temp[0], " "); //ie image/jpeg -> returns image or jpeg.
        } else
            return '';
    }

    /**
     * 
     * @global type $db
     * @global type $core
     * @param type $flip
     * @return type
     */
    function arrangeIdStaticFoldersType($flip = false)
    {
        global $db, $core;


        $rows = $db->query(
            "SELECT {$this->dpfo}id, {$this->dpfo}mime FROM $core->dTable "
                . "WHERE {$this->dpfo}static = :static AND {$this->dpfo}id != :id", //exclude root folder
            array(
                "static" => 1,
                "id" => 1
            )
        );

        foreach ($rows as $key => $row) {
            $this->static_folder_mime_Arr[$row['folder_mime']] = $row['folder_id'];
        }
        if ($flip)
            array_flip($this->static_folder_mime_Arr);

        return $this->static_folder_mime_Arr;
    }

    function setfilemimeFolderId($mime, $ext)
    {

        //return $this->static_folder_mime_Arr[$this->getDocOrApp($ext)];
        $document = $this->isDocument($ext);
        if (!$document && $mime) {

            $type = $this->getFileTypeFromMimeType($mime, false);

            $return = (isset($this->static_folder_mime_Arr[$type]) ? $this->static_folder_mime_Arr[$type] : $this->static_folder_mime_Arr['other']);
        } elseif (!$document && !$mime) {
            $return = $this->getMimeFromExtension($ext);
        }

        if ($document) {
            $return = $this->static_folder_mime_Arr[$document];
        }
        return $return;
    }

    function getMimeFromExtension($ext)
    {
        $types = $this->allFileTypes();

        $extension = strtolower($ext);

        return (isset($types[$extension]) ? $types[$extension] : 'unknown/file');
    }

    function isDocument($ext)
    {
        $isDocument = in_array($ext, $this->documentTypes);
        return $isDocument ? 'document' : 0;
    }

    function isImage($ext)
    {
        //inline image files.
        if (is_array($ext)) {
            $ext = $ext['file_extension'];
        }
        $isImage = in_array(strtolower($ext), $this->imageTypes);
        return $isImage ? 'image' : false;
    }

    function isAudio($ext)
    {
        //sound files (.aif etc...)
        if (is_array($ext)) {
            $ext = $ext['file_extension'];
        }
        $alltypes = $this->allFileTypes();

        $audioArr = array();

        foreach ($alltypes as $key => $mime) {
            if (!is_array($mime) && (strpos($mime, "audio") !== false)) {
                $audioArr[] = $key;
            }
        }

        $isSound = in_array(strtolower($ext), $audioArr);
        return $isSound ? 'audio' : false;
    }

    function isVideo($ext)
    {
        //video files (.m4p etc...)
        if (is_array($ext)) {
            $ext = $ext['file_extension'];
        }
        $alltypes = $this->allFileTypes();

        $videoArr = array();

        foreach ($alltypes as $key => $mime) {

            if (!is_array($mime) && (strpos($mime, "video") !== false)) {
                $videoArr[$key] = $key;
            }
        }

        $isVideo = isset($videoArr[strtolower($ext)]); //array_key_exists(strtolower($ext), $videoArr);
        return $isVideo ? 'video' : false;
    }

    /**
     * Closhare based file type groups.
     * @example ::getTypeIcon($fileObject, false) or ::getTypeIcon(false, "jpg")
     * @param type $file
     * @param type $byext
     * @return string
     */
    function getTypeIcon($file, $byext = false)
    {
        $ext = ($byext ? $byext : $file['file_extension']);

        if ((!$file && !$byext) || $ext == "") {
            return 'other';
        }

        return $this->isImage($ext) ? $this->isImage($ext) : ($this->isDocument($ext) ? $this->isDocument($ext) : ($this->isAudio($ext) ? $this->isAudio($ext) : ($this->isVideo($ext) ? $this->isVideo($ext) : 'other'
        )
        )
        );
    }

    /**
     * Returns json formatted types array for all known file extensions
     * 
     * @param type $json
     * @return type
     */

    function createTypesArrays($json = true)
    {
        $types = $this->allFileTypes();
        $typesArray = array();

        foreach ($types as $key => $val) {
            if ($this->isImage($key)) {

                $tkey = $json ? 'image-Types' : 'image';
            } else if ($this->isVideo($key)) {

                $tkey = $json ? 'video-Types' : 'video';
            } else if ($this->isAudio($key)) {

                $tkey = $json ? 'audio-Types' : 'audio';
            } else if ($this->isDocument($key)) {

                $tkey = $json ? 'document-Types' : 'document';
            } else {
                $tkey = $json ? 'other-Types' : 'other';
            }

            $typesArray[$tkey][] = $key;
        }

        return $json ? json_encode($typesArray) : $typesArray;
    }

    /**
     * Finds specific type by extension or its mime for all known file extensions
     * 
     * @param type $typesArr
     * @param type $key
     * @return type
     */

    function findType($typesArr, $key)
    {

        if (in_array($key, $typesArr)) {

            return $typesArr[$key];
        }

        if (array_key_exists($key, $typesArr)) return $typesArr[$key];
    }

    /**
     * Returns all known file types by mime or extension(Future improvments will be made. "check psd extension for more information")
     * @return type
     */
    function allFileTypes()
    {
        return array(
            null => "unknown",
            "323" => "text/h323",
            "7z" => "application/x-7z-compressed",
            "aac" => "audio/x-aac",
            "acx" => "application/internet-property-stream",
            "ai" => "application/postscript",
            "aif" => "audio/x-aiff",
            "aifc" => "audio/x-aiff",
            "aiff" => "audio/x-aiff",
            "asf" => "video/x-ms-asf",
            "asr" => "video/x-ms-asf",
            "asx" => "video/x-ms-asf",
            "au" => "audio/basic",
            "avi" => "video/x-msvideo",
            "axs" => "application/olescript",
            "bcpio" => "application/x-bcpio",
            "bin" => "application/octet-stream",
            "bmp" => "image/bmp",
            "cat" => "application/vnd.ms-pkiseccat",
            "cdf" => "application/x-cdf",
            "cer" => "application/x-x509-ca-cert",
            "class" => "application/octet-stream",
            "clp" => "application/x-msclip",
            "cmx" => "image/x-cmx",
            "cod" => "image/cis-cod",
            "cpio" => "application/x-cpio",
            "crd" => "application/x-mscardfile",
            "crl" => "application/pkix-crl",
            "crt" => "application/x-x509-ca-cert",
            "csh" => "application/x-csh",
            "css" => "text/css",
            "dcr" => "application/x-director",
            "der" => "application/x-x509-ca-cert",
            "dir" => "application/x-director",
            "dll" => "application/x-msdownload",
            "dms" => "application/octet-stream",
            "doc" => "application/msword",
            "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "dotm" => "application/vnd.ms-word.template.macroEnabled.12",
            "dotx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
            "dvi" => "application/x-dvi",
            "dxr" => "application/x-director",
            "eot" => "application/vnd.ms-fontobject",
            "eps" => "application/postscript",
            "etx" => "text/x-setext",
            "evy" => "application/envoy",
            "exe" => "application/octet-stream",
            "fif" => "application/fractals",
            "flr" => "x-world/x-vrml",
            "gif" => "image/gif",
            "gtar" => "application/x-gtar",
            "gz" => "application/x-gzip",
            "hdf" => "application/x-hdf",
            "hlp" => "application/winhlp",
            "hqx" => "application/mac-binhex40",
            "hta" => "application/hta",
            "htc" => "text/x-component",
            "htm" => "text/html",
            "html" => "text/html",
            "htt" => "text/webviewhtml",
            "ico" => "image/x-icon",
            "ief" => "image/ief",
            "iii" => "application/x-iphone",
            "ini" => "text/plain",
            "ins" => "application/x-internet-signup",
            "isp" => "application/x-internet-signup",
            "jfif" => "image/pipeg",
            "jpe" => "image/jpeg",
            "jpeg" => "image/jpeg",
            "jpg" => "image/jpeg",
            "js" => "application/x-javascript",
            "latex" => "application/x-latex",
            "lha" => "application/octet-stream",
            "log" => "text/plain",
            "lsf" => "video/x-la-asf",
            "lsx" => "video/x-la-asf",
            "lzh" => "application/octet-stream",
            "m13" => "application/x-msmediaview",
            "m14" => "application/x-msmediaview",
            "m2v" => "video/mpeg",
            "m3u" => "audio/x-mpegurl",
            "man" => "application/x-troff-man",
            "mdb" => "application/x-msaccess",
            "me" => "application/x-troff-me",
            "mht" => "message/rfc822",
            "mhtml" => "message/rfc822",
            "mid" => "audio/mid",
            "mkv" => "video/x-matroska",
            "mny" => "application/x-msmoney",
            "mov" => "video/quicktime",
            "movie" => "video/x-sgi-movie",
            "mp2" => "video/mpeg",
            "mp3" => "audio/mpeg",
            "mp4" => "video/mp4",
            "mpa" => "video/mpeg",
            "mpe" => "video/mpeg",
            "mpeg" => "video/mpeg",
            "mpg" => "video/mpeg",
            "mpp" => "application/vnd.ms-project",
            "mpv2" => "video/mpeg",
            "ms" => "application/x-troff-ms",
            "mvb" => "application/x-msmediaview",
            "nws" => "message/rfc822",
            "oda" => "application/oda",
            "oga" => "audio/ogg",
            "ogg" => "audio/ogg",
            "ogv" => "video/ogg",
            "p10" => "application/pkcs10",
            "p12" => "application/x-pkcs12",
            "p7b" => "application/x-pkcs7-certificates",
            "p7c" => "application/x-pkcs7-mime",
            "p7m" => "application/x-pkcs7-mime",
            "p7r" => "application/x-pkcs7-certreqresp",
            "p7s" => "application/x-pkcs7-signature",
            "pbm" => "image/x-portable-bitmap",
            "php" => "application/php",
            "pdf" => "application/pdf",
            "pfx" => "application/x-pkcs12",
            "pgm" => "image/x-portable-graymap",
            "pko" => "application/ynd.ms-pkipko",
            "pma" => "application/x-perfmon",
            "pmc" => "application/x-perfmon",
            "pml" => "application/x-perfmon",
            "pmr" => "application/x-perfmon",
            "pmw" => "application/x-perfmon",
            "png" => "image/png",
            "pnm" => "image/x-portable-anymap",
            "pot" => "application/vnd.ms-powerpoint",
            "potm" => "application/vnd.ms-powerpoint.template.macroEnabled.12",
            "potx" => "application/vnd.openxmlformats-officedocument.presentationml.template",
            "ppam" => "application/vnd.ms-powerpoint.addin.macroEnabled.12",
            "ppm" => "image/x-portable-pixmap",
            "pps" => "application/vnd.ms-powerpoint",
            "ppsx" => "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
            "ppt" => "application/vnd.ms-powerpoint",
            "ppsx" => "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
            "pptm" => "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
            "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "prf" => "application/pics-rules",
            "ps" => "application/postscript",
            "psd" => "image/vnd.adobe.photoshop", //array("image/vnd.adobe.photoshop","image/photoshop", "image/x-photoshop", "image/psd", "application/photoshop", "application/psd", "zz-application/zz-winassoc-psd") there are several mime types for "psd" files to make closhare be aware of these mime types must return an array for multiple mime types(sometimes for multiple extensions).
            "pub" => "application/x-mspublisher",
            "qt" => "video/quicktime",
            "ra" => "audio/x-pn-realaudio",
            "ram" => "audio/x-pn-realaudio",
            "ras" => "image/x-cmu-raster",
            "rar" => "application/x-rar-compressed",
            "rgb" => "image/x-rgb",
            "rmi" => "audio/mid",
            "roff" => "application/x-troff",
            "rtf" => "application/rtf",
            "rtx" => "text/richtext",
            "scd" => "application/x-msschedule",
            "sct" => "text/scriptlet",
            "setpay" => "application/set-payment-initiation",
            "setreg" => "application/set-registration-initiation",
            "sh" => "application/x-sh",
            "shar" => "application/x-shar",
            "sit" => "application/x-stuffit",
            "sldm" => "application/vnd.ms-powerpoint.slide.macroEnabled.12",
            "sldx" => "application/vnd.openxmlformats-officedocument.presentationml.slide",
            "snd" => "audio/basic",
            "spc" => "application/x-pkcs7-certificates",
            "spl" => "application/futuresplash",
            "sql" => "text/plain",
            "src" => "application/x-wais-source",
            "srt" => "text/plain",
            "sst" => "application/vnd.ms-pkicertstore",
            "stl" => "application/vnd.ms-pkistl",
            "stm" => "text/html",
            "svg" => "image/svg+xml",
            "sv4cpio" => "application/x-sv4cpio",
            "sv4crc" => "application/x-sv4crc",
            "swf" => "application/x-shockwave-flash",
            "t" => "application/x-troff",
            "tar" => "application/x-tar",
            "tcl" => "application/x-tcl",
            "tex" => "application/x-tex",
            "texi" => "application/x-texinfo",
            "texinfo" => "application/x-texinfo",
            "tgz" => "application/x-compressed",
            "tif" => "image/tiff",
            "tiff" => "image/tiff",
            "tr" => "application/x-troff",
            "torrent" => "application/x-bittorrent",
            "trm" => "application/x-msterminal",
            "tsv" => "text/tab-separated-values",
            "ttf" => "application/x-font-ttf",
            "txt" => "text/plain",
            "uls" => "text/iuls",
            "ustar" => "application/x-ustar",
            "vcf" => "text/x-vcard",
            "vrml" => "x-world/x-vrml",
            "wav" => "audio/x-wav",
            "wcm" => "application/vnd.ms-works",
            "wdb" => "application/vnd.ms-works",
            "wks" => "application/vnd.ms-works",
            "wma" => "audio/x-ms-wma",
            "wmf" => "application/x-msmetafile",
            "wmv" => "video/x-ms-wmv",
            "woff" => "application/x-font-woff",
            "wps" => "application/vnd.ms-works",
            "wri" => "application/x-mswrite",
            "wrl" => "x-world/x-vrml",
            "wrz" => "x-world/x-vrml",
            "xaf" => "x-world/x-vrml",
            "xbm" => "image/x-xbitmap",
            "xml" => 'application/xml',
            "xla" => "application/vnd.ms-excel",
            "xlam" => "application/vnd.ms-excel.addin.macroEnabled.12",
            "xlc" => "application/vnd.ms-excel",
            "xlm" => "application/vnd.ms-excel",
            "xls" => "application/vnd.ms-excel",
            "xlsb" => "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
            "xlsm" => "application/vnd.ms-excel.sheet.macroEnabled.12",
            "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "xlt" => "application/vnd.ms-excel",
            "xltx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
            "xlw" => "application/vnd.ms-excel",
            "xof" => "x-world/x-vrml",
            "xpm" => "image/x-xpixmap",
            "xwd" => "image/x-xwindowdump",
            "webm" => "video/webm",
            "z" => "application/x-compress",
            "zip" => "application/zip",
            "file" => "unknown/File",
        );
    }

    /**
     * Checks file or folder existance
     * 
     * @param type $file_path
     * @return boolean
     * 
     */

    function checkFile($file_path)
    {

        if (@file_exists($file_path)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks file is viewable or not on closhare
     * 
     * @param type $file
     * @param type $ext
     * @return type
     */

    function isViewable($file, $ext = false)
    {

        return in_array(strtolower(($ext) ? $ext : $file['file_extension']), $this->viewableTypesArr);
    }

    /**
     * 
     * @param type $exts
     * @param type $mode
     * @return type
     */
    public function getAllowedTypesRegex($exts, $mode)
    {

        $exts = preg_replace("/\s/", "", $exts);

        if ($mode && ($mode == 'js' || $mode == 'php')) {
            $result = str_replace(",", "|", $exts);
        } else if (!$mode) {
            $result = str_replace("|", ",", $exts);
        } else {
            $result = str_replace(",", ", ", $exts);
        }
        return $result;
    }

    /**
     * Creates user sample data on registration.
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $user_id
     */
    public function createSampleData($user_id)
    {
        global $db, $core;

        $userdir = return6charsha1($user_id);

        //create sample folder physically
        @mkdir(UPLOAD_PATH . $userdir . DS . "sample", 0777, false);
        createIndexFile(3, UPLOAD_PATH . $userdir . DS . "sample" . DS);
        //create info file for the sample folder
        $this->createInfoFile(array(
            'filename' => 'sample',
            'description' => 'This is your first folder.',
            'path' => UPLOAD_PATH . $userdir . '/',
            'prepend' => 0
        ));

        //copy sample images
        if ($this->sample_data_copy(ASS_PATH . 'img' . DS . 'sample' . DS, UPLOAD_PATH . $userdir, $user_id)) {
            //mark as tobe updated
            $this->recurse_mark_update("/", true, UPLOAD_PATH . $userdir);
        }
    }

    /**
     * Copies "asssets/img/sample" to the new user directory
     * 
     * @global \Nedo\type $db
     * @global \Nedo\type $core
     * @param type $source
     * @param type $target
     * @param type $user_id
     */
    private function sample_data_copy($source, $target, $user_id)
    {
        global $db, $core;
        if ((!isset($_SESSION['fnames']))) {
            $_SESSION['fnames'] = array();
        }
        if (is_dir($source)) {
            $d = dir($source);
            while (FALSE !== ($entry = $d->read())) {
                if ($entry == '.' || $entry == '..') {
                    continue;
                }
                $Entry = $source . '/' . $entry;

                if (strpos($entry, ".php") !== false || $entry[0] == '_') {
                    continue;
                }

                if (is_dir($Entry)) {
                    //@mkdir($Entry, 777, true);
                    //recursive action
                    $this->sample_data_copy($Entry, $target . '/' . $entry, $user_id);
                    continue;
                }

                copy($Entry, $target . '/' . $entry);
            }

            $d->close();
        } else {
            copy($source, $target);
        }

        return true;
    }

    function rmfolderR($path)
    {
        $path = rtrim($path, '/') . '/';
        $handle = opendir($path);
        while (false !== ($file = readdir($handle))) {
            if ($file != '.' and $file != '..') {
                $fullpath = $path . $file;
                if (is_dir($fullpath))
                    $this->rmfolderR($fullpath);
                else {
                    if ($file != 'index.php')
                        unlink($fullpath);
                }
            }
        }
        closedir($handle);
        rmdir($path);
    }

    /**
     * 
     * @param type $filename
     * @return boolean
     */
    function getMimeType($filename, $extension = false)
    {
        if ($filename) {
            $realpath = realpath($filename);
            if ($realpath && function_exists('finfo_file') && function_exists('finfo_open') && defined('FILEINFO_MIME_TYPE')) {
                // Use the Fileinfo PECL extension (PHP 5.3+)
                return finfo_file(finfo_open(FILEINFO_MIME_TYPE), $realpath);
            }
            if (function_exists('mime_content_type')) {
                // Deprecated in PHP 5.3
                return mime_content_type($realpath);
            }
        }
        if ($extension)
            return $this->getMimeFromExtension($extension);

        return false;
    }

    function clearffNames($string)
    {
        $string = preg_replace('~[\\\\/:*?"<>|]~', '', $string);
        return $string;
    }
}
