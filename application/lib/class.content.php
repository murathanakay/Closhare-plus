<?php

/**
 * content
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com 
 * @version $Id: class.content.php UTF-8 , 22-Jun-2014 | 23:48:02 nwdo ε
 */

namespace Nedo;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');
/**
 * Generates html outputs.
 */
class Content
{

    private $foldersView, $filesView, $currentFolderName, $currentFolderDesc, $files, $scrPage = null;
    private $listItems = array();
    private $forceItems = false;
    private $userfoldersCount = 0;
    private $folderfiles = 0;
    private $filesCount = 0;
    public $current_path = '';
    private $current_fo_static_id = 0;
    private $current_fo_files = 0;
    private $current_fo_fetched_files = 0;
    private $current_fo_fetch_more_files = false;
    private $current_fo_hash = '';
    private $current_fo_parent_id = 0;
    private $current_fo_dirs_count_sum = 0;
    private $current_fo_dirs_count_total = 0;
    private $current_fo_dir_names = "";
    private $current_fo_size = 0;
    private $current_fo_size_total = 0;
    private $current_fo_icon = '';
    private $breadcrumbArr, $foldersDropdown = array();
    private $folderTreeArr = array();
    private $dropdownhyrcy, $userdropdownfoldersHtml, $current_fo_v_path, $current_fo_parent_name, $current_fo_mime = '', $current_fo_created, $current_fo_modified;
    private $current_fo_static = false;
    private $userdropdownfoldersArray = array(
        'container' => ''
    );
    public $inlineASS = array();
    public $iconpath = null;
    /**
     * 
     * @global type $db
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $mobile
     * @return type
     */
    function getTopNav()
    {
        global $db, $core, $user, $mobile;
        $return = '';
        return clear($return, false);
    }

    function createEmailAskForm()
    {
        global $user;
        $html = '<form action="/" method="POST" role="form" class="twlog-email-ask">';

        $html .= '<div class="form-group">'
            . '<h5 class="mt0"><i class="icon icon-question-circle icon-3x gray"></i> We need your email address to continue.</h5>'
            . '</div>';

        $html .= '<div class="form-group" id="req-tw-email">
            <input type="email" class="form-control" id="req-tw-email-t" data-container="#req-tw-email" data-bv-notempty="true" name="email" type="email" class="form-control" placeholder="Please provide a valid email address" autocomplete="off">
            <input type="hidden" value="' . $user->userid . '" name="updateemail">
            </div>'
            . '<div class="divider"></div>'
            . '<b class="uld">Note</b><small> that you have registered for </small><b class="uld light-blue">' . CLO_SITE_NAME . '</b><small> using your twitter <i class="icon icon-twitter"></i> account. Since twitter doesn\'t supply. We need your email address.</small>';
        $html .= '</form>';

        return array(
            "result" => 1,
            "title" => '<i class="icon icon-envelope"></i> Email Required',
            "html" => clear($html)
        );
    }

    /**
     * 
     * @global \Nedo\type $core
     * @return type
     */
    function getTermsOfUSE()
    {
        global $core;
        $return = '
                <div class="modal-header">
                <a class="close" data-dismiss="modal">×</a>
                <h3>Terms of Service for ' . $core->site_name . '</h3>
                </div>
                <div class="modal-body">' . htmlspecialchars_decode($core->register_terms_template) . '</div>
                <div class="modal-footer">
                <a href="#" class="btn" data-dismiss="modal">Close</a>
                </div>';

        $core->jsonE["result"] = 1;
        $core->jsonE["html"] = $return;

        return $core->jsonE;
    }

    /**
     * 
     * @global \Nedo\type $core
     * @param type $type
     * @param type $fade
     * @param type $closebtn
     * @param type $strong
     * @param type $position
     * @param type $title
     * @return string
     */
    static function notifyMessage($type = "error", $fade = true, $closebtn = true, $strong = true, $position = 'bottom-left', $title = 'Error!')
    {

        global $core;

        $return = '<div class="notifications callout callout-' . $type . ' ' . $position . '">';
        $return .= (($closebtn) ? '<a class="close" data-dismiss="callout">×</a>' : '');
        $return .= (($strong) ? '<strong>' . (isset($core->msgs['title']) ? $core->msgs['title'] : '') . '</strong>' : '');
        $return .= addLiItems($core->msgs['message']);
        $return .= '</div>';

        return $return;
    }

    /**
     * 
     * @global \Nedo\type $core
     * @param type $type
     * @param type $fade
     * @param type $closebtn
     * @param type $strong
     * @param type $title
     * @return string
     */
    static function alertMessage($type = "error", $fade = true, $closebtn = true, $strong = true, $title = "Error!")
    {

        global $core;
        $len = count($core->msgs);
        $msg = '';
        foreach ($core->msgs as $key => $val) {
            if ((strpos($val, "###") !== false) && $key != 'title')
                $msg .= $val;
            else {
                if ($key != 'title')
                    $msg .= '###' . $val;
            }
        }
        $core->msgs = array();

        $etype = $type;

        $etype = "danger";
        $title = \Nedo\Lang::get("Error");

        if (isset($core->jsonE["result"]))
            switch ($core->jsonE["result"]) {
                case 1:
                    $etype = "success";
                    $title = \Nedo\Lang::get("Success");
                    break;
                case 2:
                    $etype = "warning";
                    $title = \Nedo\Lang::get("Warning");
                    break;
            }

        $core->msgs['title'] = $title;
        $core->msgs['message'] = $msg;

        $return = '<div class="callout callout-' . $etype . '">';
        $return .= (($closebtn) ? '<a class="close" data-dismiss="alert">×</a>' : '');
        $return .= (($strong) ? '<strong>' . (isset($core->msgs['title']) ? $core->msgs['title'] : '') . '</strong>' : '');
        $return .= addLiItems($core->msgs['message']);
        $return .= '</div>';

        return $return;
    }

    /**
     * 
     * @global \Nedo\type $core
     * @return type
     */
    static function implodeMessages()
    {
        global $core;

        $message = '';

        foreach ($core->msgs as $key => $val) {
            if ((strpos($val, "###") !== false) && $key != 'title')
                $message .= $val;
            else {
                if ($key != 'title')
                    $message .= '###' . $val;
            }
        }

        $core->msgs = array();

        return addLiItems($message);
    }

    /**
     * 
     * @global \Nedo\type $core
     * @return type
     */
    static function returnMessage()
    {

        global $core;

        return $core->msgs['message'];
    }

    /**
     * Creates list files and folders HTML output.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global type $encryption
     * @global \Nedo\type $fhand
     * @global \Nedo\type $mobile
     * @param type $parent_id
     * @param type $current_folder
     * @return type
     */
    function ListScreenHTML($parent_id = 1, $current_folder)
    {

        global $core, $user, $encryption, $fhand, $mobile;

        //if(!$current_folder){
        $filter = (post("filter")) ? true : false;

        $search = sanitise(urldecode(post("search")));

        $page = post("p");

        $page_number = post("pg") ? post("pg") : 1;

        $dir = (post("dir") && post("dir") != $user->user_dir) ? post("dir") : 1;

        $qdir = ($dir == 1) ? array('folder_id' => 1, 'folder_parent_id' => 1) : $fhand->getFolderInfoDB(false, false, $dir);

        if (!$qdir) {
            //wrong hash submitted redirect user.
            $core->jsonE["result"] = 0;
            $core->jsonE["run"] = 'loadPage({dir: "' . $user->user_dir . '"}, true)';
            return $core->jsonE;
        }

        if (post("filter")) {
            //type filter
            switch (post("filter")) {
                case "folder":
                    $filter = 1;
                    break;
                case "image":
                    $filter = 2;
                    break;
                case "video":
                    $filter = 3;
                    break;
                case "audio":
                    $filter = 4;
                    break;
                case "document":
                    $filter = 5;
                    break;
                case "other":
                    $filter = 6;
                    break;
                case "starred":
                    $filter = 7;
                    break;
                    //files only
                default:
                    $filter = -2;
                    break;
            }
        }


        $current_folder = $qdir['folder_id'];
        $parent_id = $qdir['folder_parent_id'];

        //get static folders
        $staticFolders = $fhand->getStaticFolders();
        //get personal folders
        $userFolders = $fhand->getUserFolders($current_folder, false);

        //print nl2br(print_r($staticFolders,true));

        $countStaticFolders = count($staticFolders); //countByKeyVal($folders, 'folder_static', 1);

        $countUserFolders = count($userFolders); //($totalcount-$countStaticfolders);
        //check for update action of requested dir before list it;
        $folder_path = ($dir == 1) ? "/" : ($fhand->getFolderPath($userFolders, $parent_id, $qdir['folder_vpath'], $qdir['folder_level']));

        if (file_exists($user->full_path . '/' . $folder_path . '/update.clo')) {

            $fhand->matchUserFilesAndFolders($current_folder, '/' . $folder_path, true);
            //totalSize

            $userFolders = $fhand->getUserFolders($current_folder, false, false);

            $this->forceItems = true;
        }

        $x = 0;

        //prepare static folder dropdown
        foreach ($staticFolders as $key => $value) {
            $x++;
            if ($value['folder_id'] == $current_folder) {
                $this->currentFolderName = $value['folder_name'];
                $this->currentFolderDesc = $value['folder_description'];
                $this->current_fo_static = $value['folder_static'];
                $this->current_fo_static_id = $value['folder_id'];
                $this->current_fo_mime = $value['folder_mime'];
                $this->folderfiles = ($value['folder_id'] > 1) ? $fhand->countOrGetAllUserFiles($value['folder_id'], false, true) : $fhand->countOrGetAllUserFiles(1);
                $this->current_fo_dirs_count_sum = $fhand->countSubFoldersOfFolder($userFolders, $value['folder_id']);
                //$this->current_fo_dir_names = $fhand->nameSubFoldersOfFolder($userFolders, $value['folder_id']);
                $this->current_fo_created = $this->current_fo_modified = $core->formatDate($user->user_created, true);
                $this->current_path = '';
                $this->current_fo_hash = $value['folder_hash'];

                //static folder total size
                if ($value['folder_id'] == 1) {
                    $this->current_fo_size_total = $fhand->userSpaceInUse(false, false);
                } else {
                    $fosize = $fhand->countOrGetAllUserFiles($value['folder_id'], true, true);
                    $this->current_fo_size_total = $fosize['size'];
                }
            }
        }

        $allFolders = $fhand->getAllFolders($staticFolders, $userFolders, 1);

        if ($search) {

            $this->current_path = "";
        }

        $this->folderTreeArr = $this->getSidebarFolderTree($allFolders, $current_folder);

        $subdirs = $fhand->getSubFoldersOfFolder($userFolders, $current_folder, false);

        $searchDirs =  $fhand->getUserFolders($current_folder, false, $search);

        $searched_folders = array();

        if ($search && !empty($searchDirs) && !empty($subdirs)) {
            foreach ($searchDirs as $key => $value) {
                if (array_key_exists($value["folder_id"], $subdirs))
                    $searched_folders[$value["folder_id"]] = $value;
            }
        }

        $merged_userFolders = $search ?
            ($searched_folders)
            : $userFolders;


        /**
         * Pre-define folder info
         */
        if ($qdir["folder_id"] > 6 && $search) {
            $this->currentFolderName = $qdir['folder_name'];
            $this->currentFolderDesc = $qdir['folder_description'];
            $this->current_fo_hash = $qdir['folder_hash'];
            $this->current_fo_icon = $qdir['folder_icon'];
            $this->current_fo_parent_name = ($qdir["folder_id"] < 7 || $qdir['folder_parent_id'] < 7) ? "Document Root" : $userFolders[$qdir['folder_parent_id']]['folder_name'];
            $this->current_fo_created = $core->formatDate($qdir['folder_created'], true);
            $this->current_fo_modified = $core->formatDate($qdir['folder_modified'], true);
            $this->current_path = $fhand->getFolderPath($userFolders, $qdir['folder_parent_id'], $qdir['folder_vpath'], $qdir['folder_level']);
        }

        return $this->prepareFileAndFolderHierarchy($merged_userFolders, $parent_id, $current_folder, $countUserFolders, $parent_id, $filter, $search);
    }

    /**
     * 
     * @global type $core
     * @global type $user
     * @global type $fhand
     * @global \Nedo\type $mobile
     * @param type $folders
     * @param type $parent_id
     * @param type $current_folder
     * @param type $countUserFolders
     * @param type $currentFolderparent_id
     * @param type $filter
     * @param type $search
     * @return type
     */
    function prepareFileAndFolderHierarchy($folders, $parent_id, $current_folder, $countUserFolders, $currentFolderparent_id, $filter = false, $search = false)
    {
        global $core, $user, $fhand, $mobile;

        $page = post("pg") ? post("pg") : 1;

        $searchFilter = (isset($_COOKIE["CLO_SF"]) ? $_COOKIE["CLO_SF"] : "all");

        $isSearchFilterForDirs = $search ? ($searchFilter != "file") : true;

        $isSearchFilterForFiles = $search ? ($searchFilter != "folder") : true;

        $this->current_fo_dirs_count_total = 0;
        $tempfoldercount = 0;

        if (is_array($folders) && !empty($folders)) {

            foreach ($folders as $key => $row) {

                $static = $row['folder_static'];
                $subtext = ($static ? ' data-subtext="' . $row['folder_description'] . '"' : '');


                if ($row['folder_id'] == $current_folder) {

                    $this->currentFolderName = $row['folder_name'];
                    $this->currentFolderDesc = $row['folder_description'];
                    $this->folderfiles = (int) $row['folder_files'];
                    $this->current_fo_created = $core->formatDate($row['folder_created'], true);
                    $this->current_fo_modified = $core->formatDate($row['folder_modified'], true);
                    $this->current_fo_size_total = $this->current_fo_static ? $this->current_fo_size_total : $row['folder_size'];
                    $this->current_fo_parent_id = $this->current_fo_static ? 0 : $row['folder_parent_id'];
                    $this->current_fo_parent_name = ($this->current_fo_parent_id < 7) ? "Document Root" : $folders[$row['folder_parent_id']]['folder_name'];

                    if (!$filter || ($filter && $filter == 1)) {
                        $this->current_fo_dirs_count_sum = $fhand->countSubFoldersOfFolder($folders, $row['folder_id']);
                        $this->current_fo_dir_names = $fhand->nameSubFoldersOfFolder($folders, $row['folder_id']);
                    }

                    $this->current_path = $fhand->getFolderPath($folders, $row['folder_parent_id'], $row['folder_vpath'], $row['folder_level']);

                    $this->current_fo_hash = $row['folder_hash'];

                    $this->current_fo_icon = $this->current_fo_static ? $user->user_dir : $row['folder_icon'];
                }

                if ((($row['folder_parent_id'] == $current_folder) && $filter !== -2) || $search || ($filter == 7 && $row["folder_starred"] != 7)) {

                    if ($page != 1 && !post("until"))
                        break;

                    if ($filter == 7 && $row["folder_starred"] != 7)
                        continue;

                    if (!$filter || ($filter && ($filter == 1 && $filter !== -2))) {
                        $this->current_fo_dirs_count_total++;
                    }
                    $ID = $row['folder_id'];
                    $userfolder = $row['folder_user_id'];
                    $name = $row['folder_name'];
                    $parentID = $row['folder_parent_id'];

                    $tempfoldercount++;

                    $fhand->setUserFolderFiles($ID, false, $folders);


                    if (((!$filter) || ($filter && $filter == 1) || ($filter && $filter == 7)) && $isSearchFilterForDirs) {
                        if (($search && $row['folder_id'] != $current_folder) || !$search) {

                            $checkIfNeedsTobeUpdated = $this->forceItems ? true : false;

                            $this->listItems[] = $fhand->dirObject($row, $folders, false, $checkIfNeedsTobeUpdated);
                        }
                    }
                }

                unset($row);
            }
        }

        //if order and sort type exists move folders at the end of
        if (post("order") == "type" && post("sort") == "asc") {
            $tempItems = $this->listItems;
            unset($this->listItems);
            $this->listItems = array();
        }


        //Files of current folder.
        if ($isSearchFilterForFiles && ($this->files == null && !$filter) || ($filter && abs($filter) > 1)) {

            $filesData = $fhand->getUserFiles($current_folder, $filter, post("order"), post("sort"), $folders);

            if (!empty($filesData)) {

                $this->files = $filesData['files'];
                $this->current_fo_files = $filesData['count'];
                $this->current_fo_fetched_files = $filesData['curitem'];
                $this->current_fo_fetch_more_files = $filesData['fetch'];

                $this->filesCount = $count = count($this->files);

                $mimeOrStarred = $filter > 6 ? 'file_starred' : 'file_mime_folder';

                $i = 0;

                if ($this->files) {
                    foreach ($this->files as $key => $file) {

                        if ($filter && $filter != -2 && $file[$mimeOrStarred] != $filter) {
                            $this->filesCount--;
                            continue;
                        }
                        //file size total only current folder
                        $this->current_fo_size += $file['file_size'];

                        $i++;
                        $filename = $file['file_name'] . '.' . $file['file_extension'];

                        //file items array();
                        $tempFile = $fhand->fileObject($file, false, true);

                        $this->listItems[] = $tempFile;
                    }

                    //if order and sort type exists move folders at the end of
                    if (post("order") == "type" && post("sort") == "asc") {
                        if ($count >= $core->items_per_page - $tempfoldercount) {
                            $this->listItems = array_merge($this->listItems, $tempItems);
                        }
                    }
                } else {
                    if (empty($this->listItems) && post("order") == "type" && post("sort") == "desc") {
                        if (!empty($tempItems))
                            $this->listItems = $tempItems;
                    }
                }
            }
        }

        //sort by date,size if exists
        if (post("order") == "date" || post("order") == "size") {

            $orderby = post("order") == "date" ? "stamp" : "bsize";

            usort($this->listItems, array(new cmp($orderby, post("sort")), "cmp__"));
        } else if (post("order") == "name") {

            usort($this->listItems, array(new cmp("name", post("sort"), true), "cmp__"));
        }

        $core->jsonE["result"] = 1;

        $core->jsonE['items'] = $this->listItems;

        $core->jsonE["dir"] = array(
            "id" => (int) $current_folder,
            "name" => $this->currentFolderName,
            "description" => $this->currentFolderDesc,
            "size" => array("current" => $fhand->formatBytes($this->current_fo_size, 2, true), "total" => $fhand->formatBytes($this->current_fo_size_total, 2, true)),
            "path" => ("/" . $this->current_path),
            "pageTitle" => mb_str_replace("/", " » ", rtrim(("/Document Root/" . ($this->current_path)), "/")),
            "hash" => $this->current_fo_hash,
            "icon" => $this->current_fo_icon,
            "page" => $page,
            "parentid" => (int) ($this->current_fo_parent_id ? $this->current_fo_parent_id : $parent_id),
            "parentname" => $this->current_fo_parent_name,
            "files" => (int) $this->filesCount, //$filter ? (int) $this->filesCount : (int) $this->folderfiles,
            "subdirs" => array("count_sum" => (int) $this->current_fo_dirs_count_sum, "count_total" => (int) $this->current_fo_dirs_count_total, "names" => $this->current_fo_dir_names),
            "page" => (int) $page,
            "created" => $this->current_fo_created,
            "modified" => $this->current_fo_modified,
            "scrollMore" => ($this->current_fo_fetch_more_files) ? ($this->current_fo_fetched_files . '/' . $this->current_fo_files + $this->current_fo_dirs_count_total) : false
        );

        if ($page == 1) {
            $core->jsonE["dir"]["totalitems"] = ($this->current_fo_files + $this->current_fo_dirs_count_total);
        }
        $core->jsonE["pg"] = $page;

        //send only if forceUpdate
        if ((post("force") && post("force") == true) || $this->forceItems)
            $core->jsonE["folderTree"] = $this->folderTreeArr;
        return $core->jsonE;
    }

    /**
     * 
     * @param type $folders
     * @param type $folder_id
     * @return type
     */
    function getSidebarFolderTree($data, $folder_id)
    {
        global $core, $user, $fhand, $buildtree;

        $temp = $tree = array();

        if (is_array($data) && !empty($data)) {

            foreach ($data as $key => $row) {

                if ($row['folder_static'] && $row['folder_id'] > 1)
                    continue;

                $temp[$row['folder_id']] = array(
                    "key" => (int) $row['folder_id'],
                    "parent" => (int) $row['folder_parent_id'],
                    "title" => (($row['folder_id'] == 1) ? 'Home' : $row['folder_name']),
                    "hash" => $row['folder_hash'],
                    "folder" => true,
                    "path" => $fhand->getFolderPath($data, $row['folder_parent_id'], ($row['folder_vpath']), $row['folder_level'])
                );


                if ($row['folder_icon'] != "") {
                    $temp[$row['folder_id']]['icon'] = substr(CLO_DEF_ASS_URI, 5) . 'img/icons/' . $row['folder_icon'];
                }

                if ($row['folder_id'] == 1) {
                    $temp[1]['acti'] = ($folder_id == 1 ? (int) "1" : (int) $folder_id);
                    $temp[1]['extraClasses'] = 'root';
                } else {
                    $temp[$row['folder_id']]['phash'] = $data[($row['folder_parent_id'] == 1 ? 0 : $row['folder_parent_id'])]['folder_hash'];
                }

                $temp[$row['folder_id']]['parent_path'] = $fhand->getParentPath($temp[$row['folder_id']]['path'], $row['folder_vpath']);
            }

            $tree = $buildtree->create($temp)->render();
            $tree[0]['expanded'] = true;

            //print_r($tree);
            return $tree;
        } else {
            return null;
        }
    }

    //view shared items
    function createSharedPage($ItemsHash)
    {
        global $core, $user, $fhand, $share, $encryption;

        $parts = $share->comboutSharedItems($ItemsHash);


        var_dump($parts);

        $userInfo = $user->getUserInfo($parts['uid']);

        $username = $userInfo['user_name'];

        $meta = array();

        $itemObj = null;
        //unset
        unset($userInfo);

        $return = $metaDesc = '';

        $uihash = $encryption->encode($parts['uid']);

        $x = 0;

        $return = '<div class="row-fluid" id="share" data-hash="' . $uihash . '">';

        foreach ($parts['items'] as $key => $item) {
            $count = count($parts['items']);

            //if item is file
            if ($parts['type'] === 'file') {
                $x++;
                if ($x == 1)
                    $return .= '<ul class="share" style="position: relative" data-pack="' . $encryption->encode(return6charsha1($parts['uid'])) . '">';
                $itemObj = $this->createSharePageItems($item, $parts, $x, $count, $username, false);

                $return .= $itemObj['content'];

                $meta[] = $itemObj['meta'];
                $metaDesc .= ($x == 1 ? ' &hArr; ' : ' ') . $itemObj['meta']['description'];
            } else {
                //its a folder
                //get All Folders of user
                $allfolders = $fhand->getUserFolders(false, $parts['uid']);

                //get All Bounded Folders
                $folders = $fhand->getSubFoldersOfFolder($allfolders, $item, true, true, true);

                $metaImgArr = array();

                $a = 0;
                $folder_name = '';
                foreach ($folders as $f => $folder) {
                    $x = 0;
                    $folder_name .= $folder['folder_name'] . ' - ';
                    //get files of folder if it has
                    if ($folder['folder_files'] > 0) {

                        //create single folder share buttons;
                        $SinglefolderShare = $share->getShareElementParams($folder['folder_id'], false, $uihash, $folder['folder_name']);

                        $a++;
                        if ($a >= 1) {
                            $return .= '</ul>
                     <div class="dir_ex" data-share-url="' . $SinglefolderShare['link'] . '" data-share-title="' . $SinglefolderShare['title'] . '" data-share-description="' . $SinglefolderShare['description'] . '" data-share-cls="none"><i class="icon-folder-open fo"></i>' . $folder['folder_name'] . ' - ' . $folder['folder_description'] . '<div class="fltrt"><div class="sfo btn-group"></div></div></div>
                     <ul id="share_' . $a . '" class="share" style="position: relative" data-pack="' . $encryption->encode(return6charsha1($parts['uid'])) . '">';
                        }
                        $files = $fhand->getFolderFiles($folder['folder_id'], $parts['uid']);

                        $count = count($files);

                        $count = ($count <= 1 ? ($count + 1) : (($count > 4) ? ($count - 2) : $count));

                        $b = 0;
                        if (is_array($files))
                            foreach ($files as $k => $item) {
                                $b++;
                                $itemObj = $this->createSharePageItems($item['file_id'], $parts, $x, $count, $username, $folder['folder_name']);

                                $return .= $itemObj['content'];

                                $meta[] = $itemObj['meta'];

                                $metaDesc .= ($b == 1 ? ' &hArr; ' : ' ') . $itemObj['meta']['description'];

                                //start og:meta images for folders/subfolders
                                if ($fhand->isImage($item['file_extension'])) {
                                    if (count($metaImgArr) <= 3)
                                        $metaImgArr[] = array(
                                            "name" => $fhand->getFileName($item, false),
                                            "user_dir" => return6charsha1($parts['uid']),
                                            "resolution" => "320x320"
                                        );
                                }
                            }
                    }
                }

                //be sure the 320x320 version of images created/cached
                if (isset($metaImgArr) && !empty($metaImgArr))
                    $fhand->createMultipleImageViewUrl($metaImgArr);
            }
        }

        $return .= '</ul></div>';

        $meta = $share->createSocialMeta($meta);

        return array(
            "meta" => array(
                "title" => $username . ' shared goods on ' . CLO_SITE_NAME . trunc($metaDesc, 72),
                "description" => (isset($folder_name) ? rtrim($folder_name, " - ") : '') . $metaDesc,
                "extra" => $meta
            ),
            "content" => $return
        );
    }
    /**
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @global type $share
     * @global \Nedo\type $encryption
     * @param type $item
     * @param type $parts
     * @param type $x
     * @param type $count
     * @param type $username
     * @param type $folder_name
     * @return string
     */
    function createSharePageItems($item, $parts, $x, $count, $username = false, $folder_name = false)
    {
        global $core, $fhand, $share, $encryption;

        $meta = array();

        $fileID = $core->getNumbersOnly($item);

        $file = $fhand->getFileInfoFromDB($item, $parts['uid']);

        if ($file) {

            $mime = $fhand->getMimeFromExtension($file['file_extension']);

            $type = $fhand->getFileTypeFromMimeType($mime);

            $user_dir = return6charsha1($parts['uid']);

            $src = $fhand->createPureDirectFileUrl($file, false, $user_dir);

            $image = $fhand->isImage($file['file_extension']) ? true : false;

            $viewable = $fhand->isViewable($file);
        }

        $span = (($count <= 4 && $viewable) ? ceil(12 / $count) : 3);


        $return = '<li data-id="f' . ($file ? $file['file_id'] : ('_deleted_' . $x)) . '" class="item span' . $span . ' ' . ($fhand->getTypeIcon($file, false)) . '" data-back="span' . $span . '">';

        $return .= '<div class="thumbnail" style="position: relative;">';

        $return .= '<div class="shareit btn-group"> </div>';

        if ($file && $viewable) {
            if ($image) {
                $return .= '<a class="vibtn" href="#">';
                $return .= '<img src="' . $fhand->createImageRequestUrl($file, $user_dir, $parts['uid'], false) . '" />';
                $return .= '</a>';
                $return .= '<a href="#" class="fullscreen icon-fullscreen" style=" font-size: 20px; display:block; z-index:10; position: absolute; right: 10px; top: 5px;" data-target="f' . $file['file_id'] . '"></a>';
            } else {
                //other viewable file types
                if ($type == 'audio' || $type == 'video') {

                    $return .= '<' . $type . ' width="272" height="252" preload="false" src="' . $src . '" controls="controls" preload="false">
                  
                  <object width="272" height="100%" type="application/x-shockwave-flash" data="' . CLO_DEF_ASS_URI . 'player/player.swf">
                  <param name="movie" value="' . CLO_DEF_ASS_URI . 'player/player.swf" />
                  <param name="flashvars" value="controls=true&file=' . $src . '" />
                  </object>
                  </' . $type . '>';
                }
            }
        } else {
            //downloadable files
            if ($file) {
                $return .= '<div class="download" style="min-height: 113px;"><a href="' . $fhand->createPureDirectFileUrl($file, false) . '"><span>Download File</span></a></div>';
            }
        }

        //generate social meta information of this file
        if ($file) {
            $meta = array(
                "card" => "gallery",
                //"title" => $username . ' shared goods on ' . CLO_SITE_NAME,
                "site_name" => CLO_SITE_NAME,
                "type" => $type,
                "url" => $core->current_page_url(),
                "description" => $file['file_description'],
                "folder" => $folder_name,
                "source" => ($image ? $fhand->createImageRequestUrl($file, $user_dir, $parts['uid'], false) : CLO_DEF_ASS_URI . 'img/social-types/' . $fhand->getTypeIcon($file, false) . '.png')
            );
        }

        if (!$file) {

            $file = array(
                "file_title" => "File has been deleted!"
            );
            $return .= '<div style="min-height: 113px;"></div>';
            $meta = null;
        }

        $return .= '<div class="caption">';
        $return .= '<h5>' . $file['file_name'] . $file['file_extension'] . '</h5>';
        $return .= '<p>';
        $return .= '<b>Type: </b>' . $fhand->getTypeIcon($file, false) . ', ';
        $return .= '<b>Size: </b>' . $fhand->formatBytes($file['file_size'], 1, true) . '<br>';
        $return .= '<b>Date: </b>' . $core->formatDate($file['file_date']);
        $return .= '</p>';
        $return .= '</div>';
        $return .= '</div>';
        $return .= '</li>';

        $result = array(
            "meta" => $meta,
            "content" => $return
        );


        return $result;
    }
    /**
     * 
     * @global \Nedo\type $user
     * @global \Nedo\type $fhand
     * @param type $plain
     * @return type
     */
    function getUserLimitBR($plain = false)
    {
        global $user, $fhand;

        $totalspace = $fhand->userTotalSpace(false, false, $user->user_limit);
        $totalSpaceF = $fhand->userTotalSpace(false, true, $user->user_limit);

        $spaceInUse = $fhand->userSpaceInUse($user->userid, false);
        $spaceInUsePercent = $fhand->calcUserUsagePercentage(false, $totalspace, $spaceInUse);
        $filescount = $fhand->countOrGetAllUserFiles(false);
        $folderscount = $fhand->countUserFolders();

        return array(
            'percent' => $this->createProgressBarHTML($spaceInUsePercent, false, "usage no-round", "margin: 0"),
            'total' => $totalSpaceF,
            'free' => $fhand->formatBytes(($totalspace - $spaceInUse), 2, true),
            'used' => $plain ? $fhand->formatBytes($spaceInUse, 2, true) : '<i class="icon-hdd"></i> ' . $fhand->formatBytes($spaceInUse, 2, true) . ' / ',
            'nfolders' => ($folderscount > 0 ? $folderscount : 'no') . ($plain ? '' : ' x <i class="icon-folder-close-alt"></i>'),
            'nfiles' => ($filescount > 0 ? $filescount : '0') . ($plain ? '' : ' x <i class="icon-file-alt"></i>')
        );
    }
    /**
     * 
     * @return string
     */
    function getUserLimitHTML()
    {

        return '<div class="size-container">
               <div id="meters" class="dnone">
                  <div class="pull-left nums">
                     <div class="used"></div>
                     <div class="total"></div>
                     <div class="clearfix"></div>
                     <div class="nfiles well well-small dnone"></div>
                     <div class="nfolders well well-small last dnone"></div>
                  </div>
                  <div class="pull-left divider-vertical"></div>
                  <div class="percent">
                  </div>
               </div>
            </div>
            <div class="pull-right proc-container">
               <div id="mprogress" class="pull-left bottom">
                  <strong class="fltlft"></strong>
                  <div class="fltrt">
                     <div class="progress progress-info progress-striped active">
                        <div class="bar" style="width: 0%;"></div>
                        <span></span>
                     </div>
                  </div>
               </div>
               <div class="pull-left divider-vertical visible-desktop" style="margin-right: 4px"></div> 
            </div>';
    }
    /**
     * 
     * @param type $current
     * @param type $id
     * @param type $class
     * @param type $style
     * @return type
     */
    function createProgressBarHTML($current, $id = false, $class = false, $style = false)
    {
        $return = '<div'
            . ($id ? 'id="' . $id . '"' : '')
            . ' class="progress' . ($class ? ' ' . $class : '')
            . ($current > 49 ? ($current > 79 ? ' progress-danger' : ' progress-warning') : '') . '"'
            . ($style ? ' style="' . $style . '"' : '')
            . '>';
        $return .= '<div role="progressbar" class="progress-bar" style="width: ' . $current . '%;"  aria-valuenow="' . $current . '" aria-valuemin="0" aria-valuemax="100">';
        $return .= '<span' . ($current < 55 ? ' class="dark-gray"' : '') . '>' . $current . '%</span>';
        $return .= '</div></div>';
        return \clear($return);
    }
    /**
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @param type $data
     * @param type $selected
     * @param type $name
     * @param type $multiple
     * @param type $icon
     * @return type
     */
    function createDropdownMenu($data, $selected, $name, $multiple, $icon)
    {
        global $core, $fhand;
        $return = '<select id="' . $name . '" name="' . $name . '" class="form-control" data-size="5" ' . ($multiple ? 'multiple' : '') . '>';
        if (is_array($data)) {
            $x = 0;
            $js = false;
            foreach ($data as $key => $value) {

                $row = !is_numeric($key) ? $key : $value;

                $return .= '<option ' . ($icon ? 'data-icon="icon-' . $icon[$x] . '"' : '') . (is_array($selected) ? in_array($row, $selected) : ($row == $selected) ? 'selected="selected"' : '') . ' value="' . $row . '">' . $row . '</option>';
                $x++;


                //get javascript for this option
                if (!is_numeric($key)) {
                    $js = $value;
                }
            }
        }
        $return .= '</select>';

        if ($js) {
            $return .= $this->$js();
        }
        return $return;
    }
    /**
     * 
     * @param type $unitTarget
     * @param type $selected
     * @return string
     */
    function createUnitSelectionRadio($unitTarget, $selected)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        $return = '<select class="btn btn-default" id="' . $unitTarget . '" name="' . $unitTarget . '[]" value="' . $selected . '">';

        foreach ($units as $value) {

            $return .= '<option value="' . $value . '" ' . ($value == $selected ? ' selected="selected"' : '') . '>' . $value . '</option>';

            //$return.='<button type="button" data-value="' . $value . '" class="btn btn-mini' . ($value == $selected ? ' active' : '') . '">' . $value . '</button>';
        }

        $return .= '</select>';
        //$return.='<input type="hidden" id="' . $unitTarget . '" name="' . $unitTarget . '[]" value="' . $selected . '" />';

        return $return;
    }
    /**
     * 
     * @param type $selected
     * @param type $target
     * @return string
     */
    function createYesNoRadio($selected, $target)
    {
        $return = '
            <div data-toggle="buttons-radio" class="btn-group prp" data-target="' . $target . '">
                <button type="button" data-value="1" class="btn' . ($selected == 1 ? ' active' : '') . '">Yes</button>
                <button type="button" data-value="0" class="btn' . ($selected == 0 ? ' active' : '') . '">No</button>';
        $return .= '</div>';
        $return .= '<input type="hidden" id="' . $target . '" name="' . $target . '[]" value="' . $selected . '" />';

        return $return;
    }
    /**
     * 
     * @return string
     */
    private function showHideSMTPoptions()
    {

        $return = '<script>
          jQuery(document).ready(function() {';
        $return .= '$("select[name=\'mailer_method\']").on("change", function(){
          var val = $(this).find(":selected").val();
          if(val == "SMTP"){
             $(".smtpoptions").show();
             var y = $(".smtpoptions").prop("scrollHeight");
             $("#page_settings").find(".tab-content").slimScroll({scrollTo : y+"px"});
             }else{
             $(".smtpoptions").hide();
             }
          }).trigger("change");
          });
          </script>';

        return $return;
    }

    /**
     * 
     * @global \Nedo\type $core
     */
    public function printThemeCssFiles()
    {
        global $core, $user;

        $csses = array();

        $log = $user->logged_in ? true : false;
        $share = $core->isShareUrI() ? true : false;

        if (!$log && !$share) {

            $csses = array(
                "style",
                "welcome",
                "wcustom",
            );
        } elseif ($log && !$share) {
            $csses = array(
                "style",
                "app",
                "custom"
            );
        }


        $return = "";
        foreach ($csses as $key => $css) {
            $return .= '<link rel="stylesheet" href="' . CSS_URL . $css . '.css">' . "\n";
        }

        return $return;
    }
    /**
     * 
     * @global \Nedo\type $core
     */
    public function printThemeJsFiles()
    {
        global $core, $user, $mobile;

        $jses = array();

        $log = $user->logged_in ? true : false;
        $share = $core->isShareUrI() ? true : false;

        if (!$log && !$share) {

            $jses = array(
                "welcome",
            );
        } elseif ($log && !$share) {
            $jses = array(
                "app",
            );
        }

        if ($mobile->isMobile()) {
            array_push($jses, "mobile");
        }

        $return = "";
        if (!empty($jses))
            foreach ($jses as $key => $js) {
                $return .= '<script src="' . \JS_URL . $js . '.js' . '"></script>' . "\n";
            }

        return $return;
    }

    /**
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @return string
     */
    public function printCssFiles($nested = false)
    {
        global $core, $user;

        ## possibilities
        #
        #1 user not logged in and viewing login screen
        #2 user not logged in and viewing shared items screen
        #3 user logged in and viewing members area
        #4 user logged in and viewing shared items screen
        #

        $log = $user->logged_in ? true : false;

        $path = CLO_DEF_JS_URI;

        $share = $core->isShareUrI() ? true : false;

        $return = '';

        $base = array(
            "base" => "",
            "font-awesome" => "",
            "default" => "",
        );

        if ($user->isAdmin()) {
            $base["admin"] = "";
        }

        if ($log && !$share) {
            //application page
            $temp = array(
                //                "jqueryui.min" => "ui",
                "media" => "player",
                "animate" => array("", "animate"),
                "style" => "editor",
                "viewer" => "",
                "edit" => "",
                "share" => "",
                "select" => "",
                "responsive" => "",
            );

            $css = array_merge($base, $temp);

            //            if($core->site_list_view){                
            //                $css = $core->push_after("app", $css, "list", array( "", "list_view" ) );
            //            }

        } else if (($share && !$log) || ($share && $log)) {
            //shared items page
            $css = array_merge($base, array(
                "media" => "player",
                "animate" => array("", "animate"),
                "viewer" => "",
                "view" => "",
                "share" => "",
            ));
        } else {
            //user login-register page
            $css = array_merge($base, array(
                "animate" => array("", "animate")
            ));
        }

        //load only nested css files

        if (is_array($nested) && !empty($nested)) {


            foreach ($css as $key => $val) {
                if (!array_key_exists($key, $nested))
                    unset($css[$key]);
            }
            //add css item which has not already included
            foreach ($nested as $k => $v) {
                if (!array_key_exists($k, $css)) {
                    $css[$k] = $v;
                }
            }
        }


        foreach ($css as $key => $value) {
            $id = false;
            if (is_array($value)) {
                $id = $value[1];
                $value = $value[0];
            }
            $href = ($value == "" ? "css/" : ($value == "build" ? "build/" : ("css/" . $value . "/")));
            $return .= '<link' . ($id ? ' id="' . $id . '"' : '') . ' rel="stylesheet" href="' . CLO_DEF_ASS_URI . $href . $key . '.css' . /* debugASS() . */ '">' . "\n";
        }
        return $return;
    }
    /**
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $mobile
     * @param type $header
     * @return string
     */
    public function printJsFiles($header = false, $nested = false)
    {
        global $core, $user, $mobile;

        ##4 possibilities here
        #
        #1 user not logged in and viewing login screen
        #2 user not logged in and viewing shared items screen
        #3 user logged in and viewing members area
        #4 user logged in and viewing shared items screen
        #

        $log = $user->logged_in ? true : false;

        $path = CLO_DEF_JS_URI;

        $share = $core->isShareUrI() ? true : false;

        $return = '';

        //scripts name => folder
        //global / request every page load
        $scripts = $header ? array(
            //"modernizr" => "rotors",
            "jquery" => "jquery"
        ) : null;


        $script2 = array(
            "jquery.ui" => "jquery",
            "bootstrap" => "bootstrap",
        );

        if ($log && !$share) {

            $js = array(
                "lib" => "",
                "viewer" => "rotors",
                "context" => "rotors",
                "edit" => "rotors",
                "share" => "rotors",
                "validator" => "rotors",
                "select" => "rotors",
                "main" => "",
                "library" => "upload",
                "upload" => "upload",
                "media" => "player",
            );

            if ($user->isAdmin()) {
                $js["admin"] = "";
            }
        } else if (($share && !$log) || ($share && $log)) {

            $js = array(
                "gallery" => "rotors",
                "share" => "rotors",
                "media" => "player",
                "lib" => "",
                "validator" => "rotors",
                "viewer" => "rotors",
                //                "ZeroClipboard" => "rotors/zero",
                "view" => "",

            );
        } else {
            //user login-register screen
            $js = array(
                "lib" => "",
                "validator" => "rotors",
            );
        }

        $script2 = array_merge($script2, $js);

        //load only nested js files

        if (is_array($nested) && !empty($nested)) {


            foreach ($script2 as $key => $val) {
                if (!array_key_exists($key, $nested))
                    unset($script2[$key]);
            }
            //add css item which has not already included
            foreach ($nested as $k => $v) {
                if (!array_key_exists($k, $script2)) {
                    $script2[$k] = $v;
                }
            }
        }


        if (!CLO_DEBUG) {
            $temp = array();
            foreach ($js as $key => $value) {

                $temp[$key . '.min'] = $value;
            }
            $js = $temp;
        }

        $scripts = !$nested ? ($header ? $scripts : $script2) : $script2;

        foreach ($scripts as $key => $value) {

            $return .= '<script src="' . CLO_DEF_JS_URI . (($value) ? ($value . "/") : $value) . $key . '.js' . /* debugASS() . */ '"></script>' . "\n";
        }
        return $return;
    }
    /**
     * Print extra inline javascript code
     */
    public function printExtraJS()
    {

        $inline = $this->inlineASS;

        if (!empty($inline)) {
            foreach ($inline as $key => $value) {
                foreach ($value as $k => $ass) {
                    print "\n<script>\n" . $ass . "\n</script>\n";
                }
            }
        }
    }
    /**
     * 
     */
    public function typeArrayToHtml($array, $all = false)
    {
        $x = 0;
        $html = '';
        foreach ($array as $key => $value) {
            $x++;

            $html .= ',' . $value;
            if ($x == 5 && !$all) {
                $html .= ' ie...';
                break;
            }
        }

        return htmlspecialchars(ltrim($html, ","));
    }
    /**
     * 
     * @global type $ajaxed
     * @param type $selected
     * @param type $html
     * @param type $showRadio
     * @return boolean
     */
    function getIconsSet($selected = false, $html = true, $showRadio = true)
    {
        global $ajaxed;

        $path = ASS_PATH . 'img/icons/';
        checkDir($path);
        $res = $html ? '' : array();
        $handle = opendir($path);
        $class = 'odd';
        $x = 0;
        while (false !== ($file = readdir($handle))) {

            $class = ($class == 'even' ? 'odd' : 'even');

            if ($file != "." && $file != ".." && $file != "index.php" && $file != "blank.png") {
                $sel = ($selected == $file) ? ' sel' : false;

                $flabel = makeSlug($file);

                $class = rtrim($file, ".png") . " ";

                if ($html) {
                    $res .= '<div class="iconselect ' . $class . $sel . '">';
                    if ($selected == $file) {
                        $res .= '<input id="' . $flabel . '" type="radio" name="icon" value="' . $file . '" checked="checked" ' . ($showRadio ? '' : ' class="dnone"') . '>'
                            . '<label for="' . $flabel . '" class="label bgnone"><img src=""' . CLO_DEF_ASS_URI . "img/icons/" . $file . '" alt="" /></label>';
                    } else {
                        $res .= '<input id="' . $flabel . '" type="radio" name="icon" value="' . $file . '" ' . ($showRadio ? '' : ' class="dnone"') . '>'
                            . ' <label for="' . $flabel . '" class="label bgnone"><img src="' . CLO_DEF_ASS_URI . "img/icons/" . $file . '" alt="" /></label>';
                    }
                    $res .= "</div>\n";
                } else {
                    //return as an object for inline editing;
                    $res[$x] = array(
                        'value' => $file
                    );
                    if ($sel) {
                        $res[$x]['selected'] = true;
                    }
                    $x++;
                }
            }
        }
        closedir($handle);
        return $res;
    }

    /**
     * fetches directory icons and output radio html to select them
     * 
     * @global \Nedo\type $core
     * @param type $selected
     * @return string
     */
    function getDirIcons($selected = false)
    {
        global $core;

        $path = ASS_PATH . 'img/diricons/default/';
        checkDir($path);
        $html = '';
        $handle = opendir($path);
        $class = 'odd';
        $x = 0;

        while (false !== ($file = readdir($handle))) {

            $class = ($class == 'even' ? 'odd' : 'even');

            if (!is_dir("$path$file")) {

                if ($file != "." && $file != ".." && $file != "index.php") {
                    $sel = ($selected == $file) ? ' sel' : false;
                    $x++;

                    //@list( $dirname, $basename, $extension, $filename ) = array_values(pathinfo("$path$file"));

                    $value = substr($file, 0, -4); //rtrim($file, ".png");

                    $html .= '<div class="mr10" style="float: left; display: block; height:64px"><label>';

                    $html .= '<input type="radio" name="site_dir_icon" class="i" value="' . $value . '" id="site_dir_icon_' . $x . '" ' . (($value == $core->site_dir_icon) ? ' checked' : '') . '>';
                    $html .= '<img class="ml5" src="' . CLO_DEF_ASS_URI . "img/diricons/small/" . $file . '">';

                    $html .= '</label></div>';
                }
            }
        }
        closedir($handle);
        return $html;
    }
    /**
     * Create zip content and informations data HTML TABLE output
     * @param type $arr
     * @return type
     */
    public function createZipInfoTable($arr)
    {
        $start = '<table class="table table-bordered" data-limit-navigation="5" data-page-size="5">';
        $html = '<thead>
                    <tr>
                    <th>#</th>
                    <th data-toggle="true">File Name</th>
                    <th data-hide="all">Path</th>
                    <th data-hide="all">Size</th>
                    <th data-hide="all">Compressed Size</th>
                    <th data-hide="all">Ratio (%)</th>
                    </tr>
                    </thead>    
                    <tbody id="tbcont">';
        $x = 0;
        //$html = "";

        foreach ($arr as $key => $val) {
            $html .= '<tr>';
            $x++;
            $html .= '<td>' . $x . '</td>';

            foreach ($val as $k => $v) {
                $html .= '<td>' . $v . '</td>';
            }

            $html .= '</tr>';
        }

        $start .= $html;

        $html = $start . '</tbody><tfoot><tr><td colspan="5">
            <ul class="pagination pagination-sm pagination-centered hide-if-no-paging"></ul>
            </td></tr></tfoot>'
            . '</table>';

        return array(
            "pages" => ceil($x / 10),
            "html" => \clear($html),
        );
    }

    /**
     * Checkes SideBar Cookie
     * @return boolean
     */
    public function checkSideBarStatus()
    {
        global $user;
        if (!$user->logged_in) return false;

        if (isset($_COOKIE['CLO_SBAR'])) {
            if ($_COOKIE['CLO_SBAR'] == "off") {
                return false;
            } else {
                return true;
            }
        } else {
            setcookie("CLO_SBAR", "on");
            return true;
        }
    }
    /**
     * Create 404 error page html output.
     * 
     * @global \Nedo\type $core
     * @param type $type
     */
    public function errorPages($type = false)
    {
        global $core;
        $etype = ($type ? $type : get("errorPage"));
        switch ($etype) {
            case 404:
                header("HTTP/1.0 404 Not Found");
                echo "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">
                    <html><head>
                    <title>404 Not Found</title>
                    </head><body style='background: #E9EAED'>
                    <div style=\"text-align: center; width: 60%; margin: 30px auto; background: #fff; border: 1px solid #CCCCCC; border-radius: 10px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1) inset, 0 0 0 1px rgba(0, 0, 0, 0.03) inset; padding: 50px 30px; color: #666; font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; 
   font-weight: 300; font-size: 0.9em; \">
                    <img src='" . CLO_DEF_ASS_URI . "/img/uploads/" . $core->site_logo . "'>
                    <h1>404 Not Found</h1>
                    <p>The resource you are looking for has been removed, had its name changed, or is temporarily/permanently unavailable.</p>
                     <hr>
                         <br>
                     You can return the <strong>Home</strong> by clicking <a href='/'> here</a>.
                     </div>
                    </body></html>";
                exit();
                break;

            default:
                break;
        }
    }
}
