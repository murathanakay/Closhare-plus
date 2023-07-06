<?php

/**
 * This file is a ajax controller file. All ajax requests will be passed to this file.
 * 
 * controller
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: controller.php UTF-8 , 21-Jun-2013 | 23:02:02 nwdo ε
 */
if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

if ((!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')) {

    if (isset($_POST["cli_resolution"])) :
        $_SESSION['CLO_RES'] = $_POST['cli_resolution'];

        $res = explode("x", $_POST['cli_resolution']);
        $_SESSION['CLO_RES'] = $clientResolution = array(
            "width" => $res[0],
            "height" => $res[1]
        );
    endif;
    if (isset($_POST["colwidth"])) :
        $_SESSION['colwidth'] = $_POST['colwidth'];

    endif;


    if (get("content")) {
        switch (get("content")) {

            case 'terms-of-use':
                $core->jsonE['html'] = htmlspecialchars_decode($core->register_terms_template);
                break;
        }

        echo $core->returnJson();
    }

    /**
     * @return page actions
     */
    if (post("page")) {

        checkauth();

        switch (post("page")) {
            case "list":
                $spf = explode(',', post("p"));
                $current_folder = isset($spf[0]) ? $spf[0] : 1;
                $parent_id = isset($spf[1]) ? $spf[1] : 1;

                if (post("updatedir")) {
                    $core->jsonE = array();
                    $fhand->matchUserFilesAndFolders($current_folder, false);
                }

                $core->jsonE = $content->ListScreenHTML($parent_id, $current_folder);
                break;

                //update profile
            case "profile":
                $core->jsonE = $user->updateProfile();
                break;

                //update user //requires admin authorization
            case "users":
                checkauth(true);

                $userid = post("value");
                //switch action
                switch (post("uiaction")) {

                    case "status":
                        $user->toggleStatus($userid, post("status"));
                        break;

                    case "remove":
                        $user->deleteUser($userid);
                        break;

                    case "sizelimit":
                        //change userid to pk
                        $userid = post("pk");
                        $user->disklimitUser($userid, post("value"));
                        break;

                    case "privileges":
                        //change userid to pk
                        $userid = post("pk");
                        $user->setUserPrivileges($userid);
                        break;
                    default:

                        break;
                }

                break;

            case 'settings':
                checkauth(true);
                $core->setSettings();
                break;

            case 'mail':
                switch (post("uiaction")) {
                    case "recovery":
                        $core->defaultRecoverMailTemplate();
                        break;
                    case "recovery_res":
                        $core->defaultRecoverResMailTemplate();
                        break;
                    case "welcome":
                        $core->defaulWelcometMailTemplate();
                        break;
                }

                break;
            default:

                break;
        }

        echo $core->returnJson();
    }

    ###########PURGE###########################################################################################

    if (get("purge")) {
        switch (get("purge")) {
            case 'download':
                include_once LIB_PATH . 'crontab' . DS . 'purgeDownloadTmp.php';
                break;
        }
    }

    ###########SEARCH###########################################################################################

    if (isset($_GET["search"])) :
        checkauth();
        $type = $_GET["search"];
        switch ($type) {
            case 'key':
                $core->jsonE = $fhand->search($_GET['q']);
                break;
        }
        echo $core->returnJson();
    endif;

    ###########SEARCH###########################################################################################

    if (isset($_GET["userdata"])) :
        checkauth();
        $type = $_GET["userdata"];
        switch ($type) {
            case 'email':
                $core->jsonE = $user->getuserData($_GET['q'], 'email');
                break;
        }
        echo $core->returnJson();
    endif;

    ###########ACTIONS###########################################################################################

    function itemActions()
    {
        global $core, $user, $fhand, $content, $share;

        if (post("action") == "tpage") {
            return;
        }

        $action = post("action");
        $values = post("value"); //id of item(s)

        $no_sortArr = array(
            "pull_icons",
            "user_stat",
            "calculate_size",
            "compress",
            "addremovestar",
            "download",
            "extract_directories",
            "prepare_share"
        );


        switch ($action) {

            case 'calculate_size': //calculate total size of files that wanted to be downloaded.
                $size = $fhand->calculateApproximateSize($values, post("path"));
                //                $core->jsonE = $fhand->formatBytes($size, 2, true);
                break;

            case 'prepare_download': //prepare single file to download
                $size = $fhand->prepareSingleFileDownload($values, post("path"));
                break;

            case 'compress':
                $fhand->createArchive($values, post("path"));
                break;

            case 'addremovestar':
                $fhand->addRemoveStar($values);
                break;

            case 'download':
                $fhand->createArchive(true);
                break;

            case 'email':
                $fhand->sendViaEmail();
                break;

            case 'prepare_share':
                $core->jsonE = $share->getShareElementParams($values, false, post('uihash'));
                break;

            case 'user_stat': //statistics
                $current_icon = post('current_icon');
                $fhand->userAnalytics($user->userid);
                break;

            case 'pull_icons': //icon list
                $current_icon = post('current_icon');
                $core->jsonE = $content->getIconsSet($current_icon, false);
                break;

            case 'extract_directories': //icon list
                $toSelect = post("toSelect");
                $fhand->prepare_extracti(true, $toSelect);
                break;

            case 'extractItem':
                $fhand->extract_zip();
                break;

                //create new directory
            case 'create':
                $foldername = (post('name'));
                $description = (post('desc'));
                $icon = (post('icon'));
                $fhand->createFolder($foldername, $description, $icon, $core->getNumbersOnly($values, false));
                break;

                //edit directory
            case 'edit':
                $newfoldername = (post('name'));
                $newdescription = (post('desc'));
                $fhand->editFolder($newfoldername, $newdescription, false, $core->getNumbersOnly($values, false));
                break;

            case 'rename': //change file or folder name
                //rename folder
                if (post("type") == "d") {
                    $fhand->renameFolder();
                } else {
                    $fhand->renameFile();
                }
                //$fhand->editFolder($newfoldername, $newdescription, false, $core->getNumbersOnly($values, false));
                break;

            case 'description': //add/edit item description
                if (post("type") == "d") {
                    $fhand->editDescriptionFolder();
                } else {
                    //print_r($_POST);
                    $fhand->editDescriptionFile();
                }
                break;
            case 'move': //move file or folder
                //get items by type 
                $items = $fhand->createArrFromStringEachItemType($values);

                foreach ($items as $key => $item) {
                    //file array
                    if ($key == 'file') {
                        //loop for each file id in the array
                        foreach ($item as $key => $id) {
                            $fhand->moveFile($id);
                        }
                        $text = 'File ';
                    } else {
                        //its a directory move whole directory to the given new path
                        //loop for each folder id in the array
                        foreach ($item as $key => $id) {
                            $fhand->moveFolder($id);
                        }
                        $text = 'Folder ';
                    }
                }

                if (isset($core->jsonE['items'])) {
                    $count = count($core->jsonE['items']) - 1;
                    $firstItemName = $core->jsonE['items'][0];
                    $text = $text . $firstItemName . (($count != 0) ? (' and ' . $count . ' item(s) ') : '') . ' moved.';
                }

                $fhand->setUserFolderFiles($core->getNumbersOnly(post("dir"), false), $core->getNumbersOnly(post("cdir"), false));
                break;

            case 'copy': //copy file or folder
                //get items by type 
                $items = $fhand->createArrFromStringEachItemType($values);
                foreach ($items as $key => $item) {
                    //file array
                    if ($key == 'file') {
                        //loop for each file id in the array
                        foreach ($item as $key => $id) {
                            $fhand->copyFile($id);
                        }
                        $text = 'File ';
                    } else {
                        //its a directory copy whole directory to the given new path
                        //loop for each folder id in the array
                        foreach ($item as $key => $id) {
                            $fhand->copyFolder($id);
                        }
                        $text = 'Folder ';
                    }
                }

                if (isset($core->jsonE['items'])) {
                    $count = count($core->jsonE['items']) - 1;
                    $firstItemName = $core->jsonE['items'][0];
                    $text = $text . $firstItemName . (($count != 0) ? (' and ' . $count . ' item(s) ') : '') . ' copied.';
                }

                $fhand->setUserFolderFiles($core->getNumbersOnly(post("dir"), false), $core->getNumbersOnly(post("cdir"), false));
                break;

            case 'delete': // delete file or folder
                //get items by type 
                $items = $fhand->createArrFromStringEachItemType($values);
                foreach ($items as $key => $item) {
                    //file array
                    if ($key == 'file') {
                        //loop for each file id in the array
                        foreach ($item as $key => $id) {
                            if ($id === null)
                                return;
                            $fhand->deleteFile($id);
                        }
                        $text = 'File ';
                    } else {
                        //its a directory delete whole directory
                        //loop for each folder id in the array
                        foreach ($item as $key => $id) {
                            if ($id === null)
                                return;
                            $fhand->deleteFolder($id);
                        }
                        $text = 'Folder ';
                    }
                }

                if (isset($core->jsonE['items'])) {
                    $count = count($core->jsonE['items']) - 1;
                    $firstItemName = $core->jsonE['items'][0];
                    $text = $text . $firstItemName . (($count != 0) ? (' and ' . $count . ' item(s) ') : '') . ' deleted.';
                }

                $fhand->setUserFolderFiles($core->getNumbersOnly(post("dir"), false), $core->getNumbersOnly(post("cdir"), false));
                break;
                //additional quick actions
            case 'deldir':
                $dirIds = @explode(",", post("value"));
                foreach ($dirIds as $id) {

                    $fhand->deleteFolder($id);

                    $response = $core->jsonE["message"];
                    $core->jsonE["message"] = array();

                    if ($core->jsonE["result"]) {
                        $core->jsonE["result"] = 1;
                        $core->jsonE["callback"] = 'reloadPage(1, false, 400)';
                        $core->jsonE["message"]['title'] = 'Success!';
                        $core->jsonE["message"]['txt'] = 'Missing folder(s) completely removed!';
                        $core->jsonE["message"]['icon'] = 'check';
                    } else {
                        $core->jsonE["result"] = 0;
                        $core->jsonE["message"]['title'] = 'Error!';
                        $core->jsonE["message"]['txt'] = ($user->isAdmin()) ?
                            'Deletion folder(s) was failed! Please be sure that you have the right chmod settings.' :
                            'Deletion folder(s) was failed!';
                        $core->jsonE["message"]['icon'] = 'exclamation-triangle';
                    }
                }
                break;

            case 'recreatedir':
                $dirIds = @explode(",", post("value"));
                foreach ($dirIds as $id) {

                    $row = $fhand->getFolderInfoDB($id, false, false);
                    $dirname = $row['folder_name'];
                    $level = $row['folder_level'];

                    if ($fhand->createPhysicalDir($user->full_path . '/' . post("path") . '/' . $dirname, $level)) {

                        $core->jsonE["result"] = 1;
                        $core->jsonE["message"]['title'] = 'Success!';
                        $core->jsonE["message"]['txt'] = 'Folder re-creation completed!';
                        $core->jsonE["message"]['icon'] = 'check';
                    } else {
                        $core->jsonE["result"] = 0;
                        $core->jsonE["message"]['title'] = 'Error!';
                        $core->jsonE["message"]['txt'] = ($user->isAdmin()) ?
                            'Re-creation of folder was failed! Please be sure that you have the right chmod settings.' :
                            'Re-creation of folder was failed!';
                        $core->jsonE["message"]['icon'] = 'exclamation-triangle';
                    }
                }
                break;

            case 'delmissingfile':
                $Ids = @explode(",", post("value"));
                foreach ($Ids as $id) {
                    $del = 0;
                    $file = $fhand->getFileInfoFromDB($id, false);
                    $file_path = $fhand->fixPath($user->full_path . $user->full_path . rtrim($file["file_path"], "/") . $file['full_name']);

                    if (!file_exists($file_path)) {
                        $del = $fhand->deleteFileFromDB($core->getNumbersOnly($id, false));
                    } else {
                        $del = $fhand->deleteFileFromDB($core->getNumbersOnly($id, false));
                        $del = $fhand->deletePhysicalFile($file_path);
                        //if image remove versions
                        $fhand->deleteImageFileE($file);
                    }
                    if ($del) {
                        $core->jsonE["result"] = 1;
                        $core->jsonE["message"]['title'] = 'Success!';
                        $core->jsonE["message"]['txt'] = 'Missing file(s) completely removed!';
                        $core->jsonE["callback"] = 'reloadPage(1, false, 400);';
                        $core->jsonE["message"]['icon'] = 'check';
                    } else {
                        $core->jsonE["result"] = 0;
                        $core->jsonE["message"]['title'] = 'Error!';
                        $core->jsonE["message"]['txt'] = ($user->isAdmin()) ?
                            'Error while trying to remove file(s)!<br>*Please check your DB connection.<br> *Check chmod settings of this file.' :
                            'Removing file was failed! Please try again later.';
                        $core->jsonE["message"]['icon'] = 'exclamation-triangle';
                    }
                }

                break;
        }


        if (!in_array($action, $no_sortArr) && empty($core->jsonE[$action . 'Error']) && (isset($core->jsonE["result"]) && !empty($core->jsonE["result"]))) {
            //update target folder if necessary   
            //$core->jsonE["result"] = 1;
            if (empty($core->jsonE["message"])) {

                $core->jsonE["message"]['title'] = 'Success!';
                $core->jsonE["message"]['txt'] = $text;
                $core->jsonE["message"]['icon'] = 'check';
            }
        } else {

            //show error
            if (!empty($core->jsonE['ppop'])) {
                $core->jsonE['ppop']['title'] = 'You need to pay attention!';
                if (!isset($core->jsonE['ppop']['action'])) {
                    $core->jsonE['ppop']['action'] = array(
                        array('label' => 'Try to delete', 'className' => 'btn-danger btn-sm', 'callback' => 'qDirActions:delmissingfile', 'value' => implode(",", $core->jsonE['ppop']['items'])),
                        array('label' => 'Ignore', 'className' => 'btn-default btn-sm'),
                    );
                }

                if (!isset($core->jsonE['ppop']['parsed']))
                    $core->jsonE['ppop']['message'] = addLiItems(
                        sprintf($core->jsonE['ppop']['message'], implode(",", $core->jsonE['ppop']['item_names']))
                    ) . 'What do you want me to do?';
                else
                    unset($core->jsonE['ppop']['parsed']);
            }
            //clear
            if (isset($core->jsonE[$action . 'Error']))
                unset($core->jsonE[$action . 'Error']);
        }

        //fix missing result icons
        if ((isset($core->jsonE["message"]) && is_array($core->jsonE["message"])) && !isset($core->jsonE["message"]['icon'])) {
            if ($core->jsonE["result"]) {
                $core->jsonE["message"]['icon'] = 'check';
            } else {
                $core->jsonE["message"]['icon'] = 'exclamation-triangle';
            }
        }

        echo $core->returnJson();
    }

    if (post("action")) {
        checkauth();
        itemActions();
    }

    if (get("action")) {
        switch (get("action")) {
            case "encr":
                $str = get("str");

                $core->jsonE['hash'] = $encryption->encode($str);
                break;

            case "decr":
                $str = get("str");

                $core->jsonE['hash'] = $encryption->decode($str);
                break;

            default:
                break;
        }

        echo $core->returnJson();
    }
    //load pages (profile, users, settings etc...)
    if (get("page")) {
        checkauth();

        if (file_exists(THEME_PATH . get("page") . '.php')) {
            //include it
            include_once THEME_PATH . get("page") . '.php';
        } elseif (get("page") == "updateCheck") {

            $html = '<iframe id="updateCheck_iframe" src="" style="width:100%; height: 300px; border: 1px solid #cccccc; border-radius: 4px;" scrolling="yes"></iframe>';
            echo 'If there is an update after you click<br>'
                . '<button type="button" onclick="javascript: document.getElementById(\'updateCheck_iframe\').src = \'' . CLO_URL . '/application/lib/updater/index.php\'; ">Check for update</button><br>'
                . 'update process will start automatically.<br>'
                . '<br>' . $html
                . '<div class="mb10 mt10 db text-danger"><i class="icon icon-exclamation-triangle icon-3x"></i> ATTENTION!</div><b class="dark-gray">Please make a complete database & file-system( application ) backup before continue.</b>';
        } else {
            die("Sorry! I got lost");
        }
    }

    //share page
    if (get("loadfolderItems")) {

        $share->loadfolderItems();

        echo $core->returnJson();
    }

    if (post("unlock_folder")) {

        $share->unlockFolder();

        echo $core->returnJson();
    }

    if (get("update_upload_settings")) {

        $core->jsonE = $core->getUploadOptions();

        echo $core->returnJson();
    }

    if (isset($_GET["meter"])) :
        checkauth();
        $core->jsonE = $content->getUserLimitBR();
        echo $core->returnJson();
    endif;

    //check fb user existance
    if (post("checkfbuser")) {

        $fbuser = $user->getUserFBInfo(post("checkfbuser"));
        $core->jsonE = "";
        if (!$fbuser) {
            $core->jsonE = array(
                "result" => 0
            );
        } else {
            $core->jsonE = array(
                "result" => 1
            );
        }

        echo $core->returnJson();
    }

    if (get("askforemail")) {
        checkauth();

        $core->jsonE = $content->createEmailAskForm();

        echo $core->returnJson();
    }

    if (post("updateemail")) {
        checkauth();

        $user->updateUserEmail(post("updateemail"));

        echo $core->returnJson();
    }

    if (get("checkforemail")) {

        $email = get("email");

        $exist = $user->emailExists($email);

        $res = !empty($exist) ? false : true;

        if (get("reverse")) {
            $res = !$res;
        }

        if ($email == $core->site_email) {
            $res = false;
        }

        $core->jsonE = array(
            "valid" => $res,
            "field" => "email",
            "loginURI" => CLO_URL . "/?logout=true"
        );

        echo $core->returnJson();
    }

    if (post("shareViaEmail")) {

        $fhand->sendViaEmail($encryption->decode(post("uid")));

        echo $core->returnJson();
    }

    if (post("shareViaShare")) {

        $core->jsonE = $share->getShareElementParams(post("value"), false, post('uid'));

        echo $core->returnJson();
    }

    if (get("loadMoreShare")) {

        $core->jsonE = $share->createSharePageItems();

        echo $core->returnJson();
    }
    /**
     * recieve only ajax requests.
     */
}
