<?php

/**
 * class.share
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: class.share.php UTF-8 , 29-Jul-2013 | 10:53:08 nwdo ε
 */

namespace Nedo;

use stdClass;
use Nedo\Image\Image;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

class Share
{

    //var $dpfs = 'shared_'; //prefix for columns of "_shared"
    var $tipIcons = '<span class="openActshowup"><span class="db"> & </span> <i class="icon icon-download"></i> <i class="icon icon-envelope"></i> <i class="icon icon-share-alt"></i></span>';
    private $shortUrlArr;
    public $share_opts = array("facebook", "twitter", "linkedin", "tumblr", "pinterest", "googleplus", "email");

    /**
     * 
     * @global type $core
     * @global type $user
     * @return type
     */
    function createShareUrl()
    {

        global $core, $user;

        return $core->generateRandID();
    }

    /**
     * 
     * @global type $core
     * @global type $fhand
     * @global type $encryption
     * @param type $ItemsHash
     * @return type
     */
    function comboutSharedItems($ItemsHash)
    {
        global $core, $fhand, $encryption;

        $elements = array();

        $decodedElements = $encryption->decode($ItemsHash);

        if (strpos($decodedElements, "%%") !== false) {


            $parts = explode("%%", $decodedElements);
            if (!isset($parts[0]) || !isset($parts[1]) || (isset($parts[0]) && empty($parts[0])) || (isset($parts[1]) && empty($parts[1])))
                return false;

            $elements['uid'] = $parts[1];
            $comboutedItems = $parts[0];

            $elements['dir'] = ((strpos($comboutedItems, "d_") !== false) ? true : false);

            $elements['items'] = $fhand->getRequestedFilesArr($comboutedItems, true);

            return $elements;
        } else {
            return false;
        }
    }

    public function createShareButtons($values, $uid)
    {
        global $core;

        $platformLinks = array(
            "facebook" => array("url" => 'http://www.facebook.com/share.php?u=|l|'),
            "twitter" => array("url" => 'https://twitter.com/share?url=|l|&text=|140|'),
            "linkedin" => array("url" => 'http://www.linkedin.com/shareArticle?mini=true&url=|l|&title=|t|&summary=|d|&source=in1.com'),
            "in1" => array("url" => 'http://www.in1.com/cast?u=|l|', "w" => '490', "h" => '529'),
            "tumblr" => array("url" => 'http://www.tumblr.com/share?v=3&u=|l|'),
            "digg" => array("url" => 'http://digg.com/submit?url=|l|&title=|t|'),
            "googleplus" => array("url" => 'https://plusone.google.com/_/+1/confirm?hl=en&url=|l|'),
            "reddit" => array("url" => 'http://reddit.com/submit?url=|l|'),
            "pinterest" => array("url" => 'http://pinterest.com/pin/create/button/?url=|l|&media=|media|&description=|d|'),
            "posterous" => array("url" => 'http://posterous.com/share?linkto=|l|&title=|t|'),
            "stumbleupon" => array("url" => 'http://www.stumbleupon.com/submit?url=|l|&title=|t|'),
            "email" => array("url" => 'mailto:?subject=|t|')
        );

        $res = $this->getShareElementParams($values, false, $uid, false);

        $platforms = explode(",", $core->share_options);

        $html = '';

        foreach ($platforms as $key => $platform) {

            $icon = ($platform == 'googleplus' ? 'google-plus' : $platform);

            $link = str_replace(
                array(
                    "|l|",
                    "|t|",
                    "|140|",
                    "|d|",
                    "|media|"
                ),
                array(
                    $res["url"],
                    $res["title"],
                    substr($res["title"], 0, 130),
                    $res["description"],
                    $res["media"]
                ),
                $platformLinks[$platform]["url"]
            );

            $html .= '<a href="' . $link . '" class="poper" style="margin-left: 10px;">';

            $html .= '<i class="icon icon-' . $icon . ' icon-2x"></i>';

            $html .= '</a>';
        }

        return $html;
    }

    /**
     * 
     * @global \Nedo\type $encryption
     * @param type $elements
     * @param type $userid
     * @return type
     */
    public function getShareUrl($elements, $userid)
    {

        global $encryption;

        $obj = $this->getShareElementParams($elements, false, $encryption->encode($userid), false);

        return $obj["url"];
    }

    /**
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $user
     * @global \Nedo\type $fhand
     * @global \Nedo\type $encryption
     * @param type $elements
     * @param type $type
     * @param type $uihash
     * @param type $googl
     * @return type
     */
    public function getShareElementParams($elements, $type = false, $uihash = false, $googl = true)
    {
        global $core, $user, $fhand, $encryption;

        if ($googl) {
            require_once(LIB_PATH . "/vendor/Google/GoogleUrlShortener.php");
            $goo = new GoogleURIShortener();
        }

        $userid = ($uihash ? $encryption->decode($uihash) : $user->userid);
        $info = array(
            'name' => null,
            'description' => null
        );

        if (strpos($elements, "d_") !== false) {
            $userfolders = $fhand->getUserFolders(false, $userid);
        }

        $items = @explode(",", $elements);

        $tempElements = array();
        $exclude = array();

        $folderCount = 0;
        $filecount = 0;
        $title = "";
        $x = 0;

        foreach ($items as $key => $item) {

            $itemType = $fhand->fileOrFolder($item);

            $id = $core->getNumbersOnly($item, false);

            $userFullPath = UPLOAD_PATH . return6charsha1($userid);

            //its a folder
            if ($itemType == 'folder') {
                //get folder info from db
                $data = $fhand->getFolderInfoDB($id, $userid);

                $item = $data ? (object) $fhand->dirObject($data, $userfolders, true) : false;

                if (!$item || !$fhand->checkfile($userFullPath . $item->path . "/")) {
                    array_push($exclude, "d_" . $id);
                    continue;
                }

                $info[$id]['name'] = $item->name;
                $info[$id]['description'] = $item->description;
                $info[$id]['fileCount'] = $item->fileCount;
                $info[$id]['type'] = "folder";

                $media = CLO_DEF_ASS_URI . 'img/folder544x435.gif';

                array_push($tempElements, "d_" . $id);

                $folderCount++;

                if ($x < 3) {
                    $title .= $data['folder_name'] . ', ';
                }
            } else {
                //try to execute requested file(s) information
                $data = $fhand->getFileInfoFromDB($id, $userid);
                $info[$id]['name'] = $data['file_name'];
                $info[$id]['type'] = "file";

                $itemArr = $fhand->getFileInfoFromDB($id, $userid);

                $item = (object) $fhand->fileObject($itemArr, "_n", $userid);

                if (empty($item) || !$fhand->checkfile($userFullPath . $item->data["path"] . DS . $item->name)) {
                    array_push($exclude, "f_" . $id);
                    continue;
                }

                $media = CLO_DEF_ASS_URI . 'img/' . $item->data['ftype'] . '544x435.gif';

                $media = (isset($item->preview["t"]) && !empty($item->preview["t"]) && $item->preview["t"] != "canvas") ? $item->preview["t"] : $media;

                array_push($tempElements, "f_" . $id);

                $filecount++;

                if ($x < 3)
                    $title .= $data['file_name'] . ', ';
            }

            $x++;
        }


        $title = rtrim($title, ", ");

        if (count($items) > 3) {
            $title = $title . " and other " . count($items) . " file(s)";
        }

        $title = ($title . " on " . CLO_SITE_NAME);

        $info['title'] = $folderCount;

        $shareObj = implode(",", $tempElements) . '%%' . $userid;

        $shareHash = $encryption->encode($shareObj);

        $shareUrl = CLO_URL . '/share/' . $shareHash;

        $shortenURI = ($googl) ? $goo->shorten($shareUrl) : null;

        $shareOpts = @explode(",", $core->share_options);

        if (post("excpt")) {

            $tempShareOptFlip = array_flip($shareOpts);

            $excpts = is_array(post("excpt")) ? pos("excpt") : (array) post("excpt");

            foreach ($excpts as $excpt) {

                unset($tempShareOptFlip[$excpt]);
            }

            $shareOpts = array_flip($tempShareOptFlip);
        }

        $return = clear('
            <div href="javascript:;" class="shareme"></div>');

        $result = array(
            'result' => 1,
            'html' => $return,
            'url' => $shareUrl,
            'link' => $shortenURI,
            'title' => $title,
            'shareOpts' => $shareOpts,
            'description' => $info['description'] ? $info['description'] : $title,
            "media" => isset($media) ? $media : null,
            "exclude" => $exclude
        );

        //      if($otype == false){
        //         unset($result['html']);
        //      }
        //        if (isset($metaImgArr) && !empty($metaImgArr))
        //            $fhand->createMultipleImageViewUrl($metaImgArr);

        return $result;
    }

    /**
     * Create share page with items.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @global \Nedo\type $user
     * @global type $content
     * @global \Nedo\type $encryption
     * @return type
     */
    public function createSharePageItems()
    {
        global $core, $fhand, $user, $content, $encryption;

        $folderPush = array();

        $Items = (substr(get("item"), -1) == "/") ? rtrim(get("item"), "/") : get("item");

        $shared = $this->comboutSharedItems($Items);

        if (!$shared) {
            echo $content->errorPages(404);
        }

        $nodes = $shared["items"];

        $count = count($nodes);

        $userInfo = $user->getUserInfo($shared['uid']);

        $html = "";
        $loadMoreMax = 0;

        $metaItems = array();

        $x = 0;
        $fileCount = 0;
        $folderCount = 0;
        $itemName = '';
        $protected = '';

        $pp = 5;
        $p = get("p");
        $lastPoint = $pp * $p;

        $totalNodes = count($nodes);

        $loadMore = false;

        if ($count > $pp * $p) {

            $tempNodes = array_chunk($nodes, 5);

            $currentNodes = $tempNodes[$p];

            $x = $p * $pp + 1;

            $loadMoreMax = count($tempNodes);

            $loadMore = (int) ($p + 1);

            if (count($tempNodes) - 1 == $p) {
                $loadMore = false;
            }
        } else {
            $currentNodes = $nodes;
        }

        //if shared elements contains any folder fetch all folders of user for after use
        if ($shared["dir"]) {
            $userfolders = $fhand->getUserFolders(false, $userInfo['id']);
        }


        foreach ($currentNodes as $key => $node) {

            $x++;

            $previewHTML = "";

            $previewCount = 0;

            if ($node['type'] == 'file') {

                $fileCount++;

                $itemArr = $fhand->getFileInfoFromDB($node["id"], $userInfo['id']);

                $item = (object) $fhand->fileObject($itemArr, "_z", $userInfo['id']);

                $itemID = $core->getNumbersOnly($item->id);
                $allfileTypes = $fhand->allFileTypes();

                $item->mime = $allfileTypes[$item->data["ext"]];

                $data = array(
                    "type" => "file",
                    "icon" => ($fhand->getTypeIcon(false, $item->data["ext"])),
                    "size" => $item->size,
                    "created" => $item->date,
                    "modified" => $core->formatDate($item->modified),
                    "description" => $item->description,
                );

                //add image preview for all types
                $previewHTML = '<img class="item" src="' . THEME_URL . 'images/' . $item->data['ftype'] . '544x435.gif">';

                $octetdata = $fhand->createDownloadUrI($item->name, $item->data["path"] . "/", $userInfo["dir"], true);

                $shareUrl = $this->getShareUrl("f_" . $item->id, $userInfo["id"]);

                if (in_array($item->viewable, $fhand->previewable)) {

                    if ($item->viewable == "image") {

                        $previewHTML = '<div class="gallery">';

                        $previewHTML .= '<a href="' . $item->preview["b"] . ':large" class="link singleImage" data-type="image" data-t="' . $item->data["t"] . '" data-description="' . $item->description . '" data-ftype="image" data-store="' . $octetdata["store"] . '" data-id="' . $item->data["id"] . '" rel="image">'
                            . '<img' . ($item->description ? ' alt="' . $item->description . '"' : '') . ' class="item" src="' . $item->preview["t"] . '" data-src="' . $item->preview["t"] . '">'
                            . '</a>';
                        $previewHTML .= '</div>';

                        $data["mime"] = "image";
                    } else {
                        //audio or video file
                        $previewHTML = clear(
                            '<' . $item->data['ftype'] . ' width="100%" height="100%" src="' . $item->src . '" controls="controls" preload="false">'
                                .
                                (($item->data['ftype'] == 'video') ?
                                    ('<object type="application/x-shockwave-flash" data="' . CLO_DEF_ASS_URI . 'player/player.swf">'
                                        . '<param name="movie" value="' . CLO_DEF_ASS_URI . 'player/player.swf" />') : '')
                                . '<param name="flashvars" value="controls=true&file=' . $item->src . '" />
                                    </object>
                                    </' . $item->data['ftype'] . '>'
                        );

                        $data["mime"] = $item->data['ftype'];
                    }
                } else {

                    $tpreviewHTML = $previewHTML;


                    $downloadLink = $fhand->createDownloadUrI($item->name, $item->data["path"] . "/", $userInfo["dir"]);

                    $previewHTML = '<div class="gallery njf">';

                    $previewHTML .= '<a href="' . $downloadLink . '" target="_blank">'
                        . '<div class="dwnTip hvr-bounce-to-bottom"><b class="tipcont"><i class="icon icon-download"></i><span>Download</span></b></div>';

                    $previewHTML .= $tpreviewHTML
                        . '</a>';

                    $previewHTML .= '</div>';
                }
            } elseif ($node['type'] == 'folder') {

                //                continue;

                $folderCount++;

                $userFullPath = UPLOAD_PATH . $userInfo['dir'];

                $finfo = $fhand->getFolderInfoDB($node["id"], $userInfo['id'], false);

                $item = $finfo ? (object) $fhand->dirObject($finfo, $userfolders, true) : false;

                $shareUrl = $this->getShareUrl("d_" . $item->id, $userInfo["id"]);

                //                print nl2br(print_r($item,true));

                $folderPush[$item->id] = $item;

                $protected = ($item->password != "") ? " locked" : null;

                //total files on this folder (second arg specifies return data(when its true) or only an array that contains count+total_size of items)
                $totalFiles = $fhand->countOrGetAllUserFiles($item->id, false, false, $userInfo['id']);
                //total folders on this folder //also contains fetched folder data
                $totalFolders = $fhand->countUserFolders(false, $item->id, $userInfo['id']);
                //$totalFolders = count($containedFolders);

                $totalItems = $totalFiles + $totalFolders;

                if ($fhand->checkfile($userFullPath . $item->path . "/")) {

                    if ($protected) {

                        $attempts = $core->checkAttempts("folder_id", $item->id, false);

                        $previewHTML = '<div class="protected col-lg-7 col-xs-11 mlrauto mt5 mb10 tacent" data-preventAttemptsIntv="' . ($attempts ? $attempts : 0) . '"' . ($attempts ? ' data-preventAttempts="so many wrong tries! please wait"' : '') . '>'
                            . '<div class="pres">'
                            . '<i class="icon icon-lock"></i>'
                            . '<div class="res"> </div>'
                            . '</div>'
                            . '<h4 class="mt0">Protected Folder</h4>'
                            . '<form class="" role="form">'
                            . '<div class="form-group">'
                            . '<div class="input-group">'
                            . '<input type="password" class="form-control" name="value" placeholder="Enter folder password" data-placeholder="Enter folder password">'
                            . '<span class="input-group-btn">'
                            . '<button class="btn btn-default" type="submit">unlock!</button>'
                            . '</span>'
                            . '</div><!-- /input-group -->'
                            . '</div><!-- /form-group -->'
                            . '</form>'
                            . '</div>';
                    } else {

                        $item->userid = $userInfo['id'];

                        $items = $fhand->createFolderThumbs($item->path, $userFullPath, false, $item, "_m");

                        $previewHTML = '<div class="gallery">';

                        $countItems = count($items);

                        if (($countItems < 4 && $totalItems < 4) && $countItems < $totalItems) {

                            $previewHTML .= $this->loadfolderItems($encryption->encode($item->id), $encryption->encode($userInfo["id"]));

                            $countItems = 2;
                        } else {

                            $ax = 0;
                            foreach ($items as $k => $thumb) {

                                //                        print nl2br(print_r($thumb,true));

                                $ax++;
                                //                    print nl2br(print_r($thumb,true));
                                $name = (isset($thumb["inf"]) ? $thumb["inf"]["name"] : $thumb["name"]);

                                $text = '<p class="diritemname" title="' . $name . '"><i class="icon icon-circle ' . $fhand->typesColors[isset($thumb["inf"]) ? $thumb["inf"]['filetype'] : 'folder'] . '"></i> '
                                    . trunc($name, 15, false)
                                    . '</p>';

                                $firstItem = ($countItems > 1 && $ax == 1);
                                $largeMode = ($firstItem && is_numeric($k)) || (is_numeric($k) && $countItems == 1);
                                $width = false; //( isset($thumb["inf"]["attr"])  && $thumb["inf"]["attr"]["width"] > $_SESSION["colwidth"]);

                                if ($thumb["type"] == "file") {

                                    $typeprefix = 'f_';
                                    $tid = $thumb["inf"]["id"];

                                    $tipIcon = 'download';
                                    $tipText = 'Download';

                                    if ($thumb["ftype"] == 'image') {
                                        $link = ($thumb["inf"]["preview"] . ':large');
                                        $tipIcon = 'file-image-o';
                                        $tipText = 'View' . $this->tipIcons;
                                    } elseif ($thumb["ftype"] == "video" || $thumb["ftype"] == "audio") {
                                        $link = $thumb["inf"]["src"];
                                        $tipText = 'Play' . $this->tipIcons;
                                        $tipIcon = 'play';
                                    } else {
                                        $link = $fhand->createDownloadUrI($thumb["name"], $thumb["inf"]["data"]["path"] . "/", $userInfo["dir"]);
                                    }

                                    $octetdata = $fhand->createDownloadUrI($thumb["name"], $thumb["inf"]["data"]["path"] . "/", $userInfo["dir"], true);
                                } else {
                                    //its a folder so open up
                                    $typeprefix = 'd_';
                                    $folderInf = $fhand->checkFolderExistDB($thumb["name"], $item->id, $userInfo["id"]);

                                    if ($folderInf) {
                                        $tid = $folderInf["folder_id"];
                                        $shareObj = $this->getShareElementParams($typeprefix . $tid, false, $encryption->encode($userInfo["id"]), false);
                                        $link = $shareObj["url"];
                                        $currentFolderFileCount = $fhand->countOrGetAllUserFiles($tid, false, false, $userInfo['id']);
                                        $currentFolderSubCount = $fhand->countUserFolders(false, $tid, $userInfo['id']);

                                        if ($currentFolderFileCount + $currentFolderSubCount > 0) {
                                            $tipIcon = 'list';
                                            $tipText = 'Go to folder <i class="name">' . $folderInf["folder_name"] . '</i>';
                                        } else {
                                            $tipIcon = 'folder-o';
                                            $tipText = 'Empty Folder';
                                        }
                                    } else {
                                        $link = 'javascript:;';
                                        $tid = time();
                                    }
                                }

                                $alt = $description = isset($thumb["inf"]) ? $thumb["inf"]["description"] : '';

                                $src = $thumb["src"];

                                $previewHTML .=
                                    '<a href="' . $link . '" target="_blank" rel="' . $item->type . $item->id . '"  class="link' . ($thumb["viewable"] ? ' viewable' : '') . '" data-t="' . $thumb["name"] . '" data-ftype="' . $thumb["ftype"] . '" ' . (($thumb["type"] == "file") ? ' data-store="' . $octetdata["store"] . '"' : '') . ' data-id="' . $typeprefix . $tid . '" data-description="' . $description . '">';

                                $previewHTML .= '<div class="dwnTip hvr-bounce-to-bottom"' . (mb_strlen($name) > 15 ? ' title="' . $name . '" rel="tip" data-placement="top"' : '') . '><b class="tipcont"><i class="icon icon-' . $tipIcon . '"></i><span>' . $tipText . '</span></b></div>';

                                $previewHTML .= $text;

                                //if($thumb["type"] == "file" && !$thumb["viewable"]){
                                //}                    

                                $previewHTML .= '<img' . ($alt ? ' alt="' . $alt . '"' : '') . ' src="' . $src . '" data-src="' . $src . '">'
                                    . '</a>';
                            }
                        }

                        $previewHTML .= '</div>';
                    }

                    $data = array(
                        "type" => "folder",
                        "icon" => "folder",
                        "size" => $item->size,
                        "created" => $item->date,
                        "modified" => $core->formatDate($item->modified),
                        "description" => ($item->description) ? $item->description : "",
                        "password" => $item->data["p"]
                    );
                } else {
                    $content->errorPages(404);
                }
            } else {
                //$content->errorPages(404);
            }

            //add items to meta data            
            array_push($metaItems, $item);

            $span = 12;
            //                    $count < 2 ? 12 : (
            //                    ( ( $item->filetype == 'video' || $item->filetype == 'audio') ? 6 :
            //                    (( 
            //                    ( $item->filetype != 'image' && isset($countItems) && $countItems <= 1 ) || ($item->filetype != 'image' && $item->filetype != 'folder') ) ? 3
            //                    : 6)
            //                    ));

            $titleLength = ceil($span / 5 * 30);

            $topActShowAllDisabled = ((isset($protected) || $totalItems <= 3) ? true : false);

            $shareUrlInput = '<div style="position: relative" class="input-group sharing">
                    <span class="input-group-btn">
                    <button data-placement="top" data-container="item" rel="tip" title="Copy link to clipboard" data-clipboard-target="shareurl-' . $item->data['ftype'] . $item->id . '" class="btn btn-default clipboardBtn borrn brln" type="button">Copy <i class="icon icon-clipboard"></i>
                    </button>
                    </span>
                    <input type="text" readonly="" placeholder="Short link" id="shareurl-' . $item->data['ftype'] . $item->id . '" class="form-control unselectable" name="share_short_url" value="' . $shareUrl . '">
                    <span class="input-group-btn">
                    <a data-placement="top" data-container="item" rel="tip" class="btn btn-default borrn brrn" target="_blank" href="' . $shareUrl . '" data-original-title="Open link in a new tab"><i class="icon icon-external-link"></i></a>
                    </span>
                    </div>';

            $topActGroupOpen = '<div class="btn-group topactcont">';

            $topActShareBtn = '<a href="#collapse_' . $item->data["id"] . '" class="btn btn-link itemShare" data-toggle="collapse" data-parent="#cp_' . $item->data["id"] . '" aria-expanded="false">'
                . '<i class="icon icon-share-alt"></i> Share'
                . '</a>';
            $topActShowAllBtn = '<button class="btn btn-link showAll' . ((isset($protected) || $totalItems <= 3) ? ' hidden' : '') . '" autocomplete="off"><i class="icon icon-caret-down"></i> Show all</button>';

            $topActShareBp = '<div id="collapse_' . $item->data["id"] . '" class="collapse qsharebox">'
                . $this->createShareButtons($item->data["id"], $encryption->encode($userInfo['id']))
                . $shareUrlInput
                . '</div>';

            $topActGroupClose = '</div>';


            //add data-id as encrypted
            $html .= '<li class="item-thumb col-lg-' . $span . ' col-md-' . $span . ' col-xs-12 ' . $item->type . ($item->type == 'folder' ? $protected : '') . ($item->type != 'folder' ? (' ' . $item->filetype) : '') . ((isset($totalItems) && $totalItems == 0) ? ' empty' : '') . '" data-id="' . $encryption->encode($item->data["id"]) . '" data-type="' . $item->type . '" data-p="' . $encryption->encode(isset($item->path) ? $item->path : "") . '" data-t="' . $item->data["t"] . '">';

            $html .= '<div class="thumbnail" style="position: relative;" id="cp_' . $item->data["id"] . '">';

            $html .= '<div class="share-header"><h5 class="title col-xs-6"><span class="icon icon-2x ' . $fhand->typesAvesomeIcons[$item->data['ftype']] . ' ' . $fhand->typesColors[(($item->type == "file") ? $item->data['ftype'] : $item->type)] . '"></span> <span class="name" title="' . $item->name . '">' . trunc($item->name, $titleLength, false) . '</span></h5>';


            if ($item->type == 'folder' && isset($totalItems)) {

                $html .= $topActGroupOpen . $topActShareBtn . $topActShowAllBtn . $topActGroupClose;

                $html .= '<div class="dirlistexp col-xs-12' . ($protected ? ' hidden' : '') . '">'
                    . '<span class="first3' . ($totalItems > 3 && !$protected ? ' visible' : ' hidden') . '">Showing first 3 items</span>'
                    . '<span class="all' . ($totalItems <= 3 && $totalItems != 0 && !$protected ? ' visible' : ' hidden') . '">Contains following item(s)</span>';

                $html .= '</div>';
            } else if ($item->type != 'folder') {

                $html .= $topActGroupOpen . $topActShareBtn . $topActGroupClose;
            }

            if ($item->type == 'folder' && isset($totalItems)) {

                if ($totalItems == 0) {
                    $html .= '<h3 class="tacent"><i class="icon icon-hand-o-right"></i> Empty folder</h3>';
                }
            }


            $html .= $topActShareBp;

            $html .= '</div><div class="clearfix"></div>';

            $html .= clear($previewHTML ? $previewHTML : "");

            $html .= '<div class="caption">';

            $html .= '<ul class="properties collapse" id="collapse_' . $item->data['ftype'] . $item->id . '" aria-labelledby="headingOne">';

            $html .= '<li><b>Type: </b>' . $data["icon"] . '</li>';
            $html .= '<li><b>Size: </b>' . $item->size . '</li>';
            $html .= '<li><b class=""><i class="icon icon-calendar"></i> </b><span class="date">' . $data["created"] . '</span></li>';
            $html .= '<li><b class=""><i class="icon icon-clock-o"></i> </b><span class="date">' . $data["modified"] . '</span></li>';

            $html .= '</ul>';

            $html .= '<a href="#collapse_' . $item->data['ftype'] . $item->id . '" class="btn btn-darkgray-alt p0 pt5 dropdetails" data-toggle="collapse" data-parent=".caption" aria-expanded="false" rel="tip" data-title="Toggle Details"><i class="icon icon-bars"></i></a>';

            $html .= '</div>';
            $html .= '</div>';

            $html .= '</li>';

            //print nl2br(print_r($item,true));
        }

        $marginAuto = $count == 1 ? "margin: 0 auto" : "";

        $Cspan = 6; //$count < 2 ? 6 : false;

        $fileFolderCount = ($fileCount + $folderCount);


        //create title
        $title = "";
        $itill = (count($metaItems) >= 3) ? 3 : count($metaItems);

        for ($i = 0; $i < $itill; $i++) {

            $title .= $metaItems[$i]->name . ', ';
        }

        $title = rtrim($title, ", ");

        if (count($metaItems) > 3) {
            $title = $title . " and other " . ($count - 3) . " file(s)";
        }

        //Create page-meta
        $meta = array(
            "url" => CLO_URL . '/share/' . $Items,
            "title" => /* ($userInfo["user_name"]. " shared ") . */ ($title) . (" on " . CLO_SITE_NAME),
            "description" => $userInfo["name"] . " shared " . $fileCount . " file(s)" . (($fileCount > 0 && $folderCount > 0) ? " &" : "") . ($folderCount ? (" " . $folderCount . " folder(s)") : "")
        );

        $_SESSION["sfi"] = $folderPush;

        if ($p == 0)
            $return = '<ul class="share' . ($Cspan ? (' col-lg-' . $Cspan) : '') . ' col-xs-12 col" data-uid="' . $encryption->encode($userInfo['id']) . '" data-loadmore="' . $loadMore . '">';

        $return = (isset($return) ? $return : '') . $html . (('<a class="nextpage" href="/?loadMoreShare=true&item=' . $Items . '&p=' . ($p == 0 ? 1 : $p + 1) . '"></a>'));

        if ($p == 0) {
            $return .= '</ul>';
            $return .= '<input id="pagepid" type="hidden" value="' . ($p ? $p : 0) . '">'
                . '<input id="itempid" type="hidden" value="' . $Items . '">';
        }
        return array(
            "meta" => array(
                "title" => $meta["title"],
                "canonical" => $meta["url"],
                "description" => $meta["description"],
                "extra" => $this->generateOgMeta($metaItems, $meta),
            ),
            "content" => $return,
            "loadMore" => $loadMore
        );
    }

    /**
     * Unlock a folder that protected with a password and show all contents of it.
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @global \Nedo\type $encryption
     * @return boolean
     */
    public function unlockFolder()
    {

        global $core, $fhand, $encryption;

        var_dump("Hottori");
        $elid = $encryption->decode(post("pd"));
        $dirid = $core->getNumbersOnly($elid, false);

        $attempts = $core->checkAttempts("folder_id", $dirid);

        if (!$attempts) {

            $pasword = sanitise(post("value"));
            $userid = $encryption->decode(post("uid"));
            $dirpath = $encryption->decode(post("path"));

            $type = $fhand->fileOrFolder($elid);

            $dir = $fhand->getFolderInfoDB($dirid, $userid, false);

            $previewHTML = '';
            //dir exists
            if ($dir) {
                //check password
                if ($encryption->encode((string) $pasword) != $dir["folder_pass"]) {
                    $core->jsonE["result"] = 0;
                    $core->jsonE["message"] = "Wrong password!";

                    $core->addAttempt("folder_id", $dirid);
                    return false;
                } else {
                    //its correct password continue to create data

                    $core->jsonE["result"] = 1;
                    $core->jsonE["html"] = clear('<div class="gallery">' . $this->loadfolderItems(post("pd"), post("uid")) . '</div>');
                }
            }
        } else {
            //tried so many password block it for a while:
            $core->jsonE["result"] = 0;
            $core->jsonE["intv"] = $attempts;
            $core->jsonE["blocked"] = "so many wrong attempts! please wait";
        }
        return $core->jsonE;
    }

    /**
     * Loads all items inside a folder
     * 
     * @global \Nedo\type $core
     * @global \Nedo\type $fhand
     * @global \Nedo\type $encryption
     * @return string
     */
    public function loadfolderItems($id = false, $uid = false)
    {

        global $core, $user, $fhand, $encryption;

        $eid = $encryption->decode($id ? $id : get("id"));
        $id = $core->getNumbersOnly($eid, false);
        $user_id = $encryption->decode($uid ? $uid : get("uid"));

        //get folder files
        $files = $fhand->getFolderFiles($id, $user_id);
        //getsubfolders of folder //normaly this function using for counting subfolders , here: the last arg true forces to return Data of subfolders
        $folders = $fhand->countUserFolders(false, $id, $user_id, true);

        //get all folders of the user. this is required for detailed folder data(parent informations etc...this will be improved in the near future)
        if ($folders)
            $userfolders = $fhand->getUserFolders(false, $user_id);

        //        print nl2br(print_r($folders,true));
        if ($files && $folders) {
            $items = array_merge($files, $folders);
        } elseif ($files && !$folders) {
            $items = $files;
        } else {
            $items = $folders;
        }

        $previewHTML = '';

        $totalFiles = count($files);

        foreach ($items as $k => $item) {

            $isFile = isset($item["file_id"]) ? true : false;

            if ($isFile) {
                $id = $item["file_id"];
                $typeprefix = 'f_';

                $thumb = (object) $fhand->fileObject($fhand->getFileInfoFromDB($id, $user_id), "_m", true);

                $tid = $thumb->id;

                if ($fhand->isImage($thumb->data["realext"])) {

                    $tipText = 'View' . $this->tipIcons;
                    $tipIcon = 'file-image-o';

                    $link = ($thumb->filetype == "image" ? $thumb->preview["b"] . ':large' : ($thumb->src));
                } elseif ($fhand->isVideo($thumb->data["realext"]) || $fhand->isAudio($thumb->data["realext"])) {

                    $tipText = 'Play' . $this->tipIcons;
                    $tipIcon = 'play';

                    $link = $thumb->src;
                } else {

                    $link = $fhand->createDownloadUrI($thumb->name, $thumb->data["path"] . "/", return6charsha1($user_id));

                    $tipIcon = 'download';
                    $tipText = 'Download' . $this->tipIcons;
                }

                $octetdata = $fhand->createDownloadUrI($thumb->name, $thumb->data["path"] . "/", return6charsha1($user_id), true);
            } else {
                $id = $item["folder_id"];
                $typeprefix = 'd_';

                $finfo = $fhand->getFolderInfoDB($id, $user_id, false);

                $thumb = $finfo ? (object) $fhand->dirObject($finfo, $userfolders, true) : false;

                $typeprefix = 'd_';

                $tid = $item["folder_id"];

                //get folder share url
                $shareObj = $this->getShareElementParams($typeprefix . $tid, false, $encryption->encode($user_id), false);
                $link = $shareObj["url"];

                //                            if($thumb-> > 0){
                //                                $link = $shareObj["url"];
                //                                $tipIcon = 'list';
                //                                $tipText = 'Open folder <i class="name">'.$thumb->name.'</i>';
                //                            }else{
                //                                $tipIcon = 'folder-o';
                //                                $tipText = 'Empty Folder';
                //                                $link = 'javascript:;';
                //                                $tid = time();                                
                //                            }

                $tipText = 'Go to folder <i class="name">' . $thumb->name . '</i>';
                $tipIcon = 'list';
            }

            //            print nl2br(print_r($thumb,true));

            $nonImgPreview = CLO_DEF_ASS_URI . 'img/' . $thumb->filetype . '.gif';

            $nonImageLink = '';


            //if only a file!! This is only for preview version of a folder the main view contains both file and folde description,size etc...
            $alt = $thumb->description || '';

            $src = ($thumb->filetype == "image" ? $thumb->preview["t"] : $nonImgPreview);

            $text = '<p class="diritemname">'
                . trunc($thumb->name, 15)
                . '</p>';

            $alt = $description = $thumb->data["description"];

            $previewHTML .= '<a href="' . $link . '" target="_blank" rel="' . $eid . '"  class="link' . (($thumb->filetype != "folder" && $thumb->previewable) ? ' viewable' : '') . '" data-t="' . $thumb->name . '"  data-ftype="' . $thumb->filetype . '"' . (($isFile) ? ' data-store="' . $octetdata["store"] . '"' : '') . ' data-id="' . $typeprefix . $tid . '" data-description="' . $description . '">';

            //                    if($thumb->type == 'file' && !$thumb->viewable){
            $previewHTML .= '<div class="dwnTip hvr-bounce-to-bottom"' . (mb_strlen($thumb->name) > 15 ? ' title="' . $thumb->name . '" rel="tip" data-placement="top"' : '') . '><b class="tipcont"><i class="icon icon-' . $tipIcon . '"></i><span>' . $tipText . '</span></b></div>';
            //                        }

            $previewHTML .= $text
                . '<img ' . ($alt ? 'alt="' . $alt . '"' : '') . ' src="' . $src . '" data-src="' . $src . '">';

            $previewHTML .= '</a>';
        }
        $previewHTML .= '';

        $core->jsonE["html"] = clear($previewHTML);

        return $previewHTML;
    }

    public function loadfolderItems2()
    {

        global $core, $fhand, $encryption;

        $eid = $encryption->decode(post("id"));
        $id = $core->getNumbersOnly($eid, false);

        $session = $_SESSION["sfi"];



        //        @session_unset("sfi");

        if (is_array($session) && !empty($session)) {
            //            print_r($session);

            $dir = $session[$id];

            $userFullPath = UPLOAD_PATH . return6charsha1($dir->userid);

            $items = $fhand->createFolderThumbs($dir->path, $userFullPath, $id, $id);

            $previewHTML = "";

            foreach ($items as $k => $thumb) {


                $previewHTML .= ''
                    . '<div class="tile">'
                    . '<a class="tile-inner" href="photos/1.jpg">'
                    . '<img class="item masonry-folder-img" src="' . $thumb["src"] . (is_numeric($k) ? ":large" : "") . '">'
                    . '<div class="itemCaption">
                            </div>'
                    . '</a>'
                    . '</div>';
            }
            unset($items);
        }

        return array(
            "html" => clear($previewHTML)
        );
    }

    private function generateOgMeta($items, $meta)
    {
        global $encryption;

        $imgArray = '';
        $vidArray = '';
        $auArray = '';
        $dirArray = '';
        $ogMeta = '';
        $x = 0;

        $itemCount = count($items);

        if ($itemCount < 2) {
        }
        //        print nl2br(print_r($items,true));

        $ogMeta .= '<meta property="og:url" content="' . $meta["url"] . '">' . "\n";
        $ogMeta .= '<meta property="og:type" content="website">' . "\n";
        $ogMeta .= '<meta property="og:title" content="' . $meta["title"] . '">' . "\n";
        $ogMeta .= '<meta property="og:description" content="' . $meta["description"] . '">' . "\n";

        foreach ($items as $key => $item) {
            $type = $item->filetype;
            $x++;

            switch ($type) {
                case "image":
                    $imgArray .= '<meta property="og:' . $type . '" content="' . $item->preview["t"] . '">' . "\n";

                    $imgArray .= '<meta property="og:' . $type . ':width" content="240">' . "\n";
                    $imgArray .= '<meta property="og:' . $type . ':height" content="240">' . "\n";
                    break;
                case "video":
                    $vidArray .= '<meta property="og:' . $type . ':type" content="' . $item->mime . '">' . "\n";
                    $vidArray .= '<meta property="og:' . $type . '" content="' . $item->preview . '" />' . "\n";
                    $vidArray .= '<meta property="og:' . $type . ':width" content="400">' . "\n";
                    $vidArray .= '<meta property="og:' . $type . ':width" content="300">' . "\n";
                    break;
                    //use images for preview
                case "audio":
                    $url = Image::open(APP_PATH . "assets" . DS . "img" . DS . "audio.gif")
                        ->setActualCacheDir(UPLOAD_PATH . "tmp")
                        ->setCacheDir("tmp")
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', '"' . $item->name . '"', 126, 160, 16, 0, 'white', 'center')
                        //total files
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', $item->size, 126, 180, 11, 0, 'white', 'center')
                        ->guess(100);

                    $imgArray .= '<meta property="og:image" content="' . CLO_URL . '/' . $url . '" />' . "\n";
                    $imgArray .= '<meta property="og:image:width" content="252">' . "\n";
                    $imgArray .= '<meta property="og:image:height" content="202">' . "\n";
                    break;
                    //use images for preview
                case "document":
                    $url = Image::open(APP_PATH . "assets" . DS . "img" . DS . "document.gif")
                        ->setActualCacheDir(UPLOAD_PATH . "tmp")
                        ->setCacheDir("tmp")
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', '"' . $item->name . '"', 126, 160, 16, 0, 'white', 'center')
                        //total files
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', $item->size, 126, 180, 11, 0, 'white', 'center')
                        ->guess(100);

                    $imgArray .= '<meta property="og:image" content="' . CLO_URL . '/' . $url . '">' . "\n";
                    $imgArray .= '<meta property="og:image:width" content="252">' . "\n";
                    $imgArray .= '<meta property="og:image:height" content="202">' . "\n";
                    break;

                    //use images for preview
                case "other":
                    $url = Image::open(APP_PATH . "assets" . DS . "img" . DS . "other.gif")
                        ->setActualCacheDir(UPLOAD_PATH . "tmp")
                        ->setCacheDir("tmp")
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', '"' . $item->name . '"', 126, 160, 16, 0, 'gray', 'center')
                        //total files
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', $item->size, 126, 180, 11, 0, 'gray', 'center')
                        ->guess(100);

                    $imgArray .= '<meta property="og:image" content="' . CLO_URL . '/' . $url . '">' . "\n";
                    $imgArray .= '<meta property="og:image:width" content="252">' . "\n";
                    $imgArray .= '<meta property="og:image:height" content="202">' . "\n";
                    break;

                    //use images for preview
                case "folder":
                    $url = Image::open(APP_PATH . "assets" . DS . "img" . DS . "folder.gif")
                        ->setActualCacheDir(UPLOAD_PATH . "tmp")
                        ->setCacheDir("tmp")
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', '"' . $item->name . '"', 126, 160, 16, 0, 'white', 'center')
                        //total files
                        ->write(LIB_PATH . 'captcha/fonts/VeraSansBold.ttf', $item->fileCount . " file(s)", 126, 180, 11, 0, 'white', 'center')
                        ->guess(100);

                    $imgArray .= '<meta property="og:image" content="' . CLO_URL . '/' . $url . '">' . "\n";
                    $imgArray .= '<meta property="og:image:width" content="252">' . "\n";
                    $imgArray .= '<meta property="og:image:height" content="202">' . "\n";
                    break;
                default:
                    break;
            }
        }

        $ogMeta .= $imgArray . $vidArray . $auArray . $dirArray;

        return $ogMeta;
    }

    public function createMetaData($metas)
    {
        global $core, $user;

        $metaArr = array();

        //print nl2br(print_r($metas,true));echo"<br>";
        $metaProp = '';
        $x = 0;
        foreach ($metas as $key => $meta) {
            $x++;
            if (!$meta)
                continue;
            foreach ($meta as $k => $val) {
                if (is_numeric($k)) {
                    $metaProp .= '<meta property="' . $val['property'] . '" content="' . $val['content'] . '">' . "\n";
                    //if(!array_search($val['content'], $metas))
                    //$metaArr[($k == 'kind' ? $val : '')] = '<meta property="'.$val['property'].'" content="'.$val['content'].'">'."\n";
                }
            }
            if ($x == 5) {
                break;
            }
            //         unset($key);
            //         unset($value);
        }

        //      foreach ($metaArr as $key => $value) {
        //         $metaProp.= $value;
        //      }
        return $metaProp;
    }

    public function createSocialMeta($metaArr)
    {

        $metaArrOut = $type = array();
        $metaProp = $ontype = '';
        $metaArrOut["type"] = "website";

        if (is_array($metaArr) && !empty($metaArr)) {
            $x = 0;
            foreach ($metaArr as $key => $value) {
                $x++;

                $description = isset($metaArrOut["description"]) ? $metaArrOut["description"] . ', ' : ($value['folder'] . ' &hArr; ');

                //object card
                $metaArrOut["card"] = $value['card'];

                //object title
                $metaArrOut["title"] = (isset($value['title']) ? $value['title'] : "");

                //object type
                if (!in_array($value["type"], $type)) {

                    $mtype = $value["type"];

                    $type[$value["type"]] = $ontype = ($mtype == "audio" ? "music.song" : ($mtype == "video" ? "video.other" : ($mtype == "image" ? "article" : $metaArrOut["type"])));

                    $metaArrOut["type"] = $type[$value["type"]];
                }

                //object url
                $metaArrOut["url"] = $value['url'];

                //object description
                $metaArrOut["description"] = $description . $value['description'];

                //object site_name

                $metaArrOut["site_name"] = $value['site_name'];

                //specific infos for description

                if (!isset($metaArrOut["image"]))
                    $metaArrOut["image"] = array();

                if ($x > 4)
                    continue;

                if (!in_array($value['source'], $metaArrOut["image"]))
                    $metaArrOut["image"][] = $value['source'];
            }
            if (count($type) == 1) {
                $metaArrOut["type"] = $ontype;
            } else {
                $metaArrOut["type"] = "website";
            }
            unset($key);
            unset($value);

            /*             * sc => Schema.org markup for Google+
             * og => Open Graph
             * tw => Twitter Card data
             */
            $tags = array(
                "sc" => array("tag" => "itemprop", "prefix" => ""),
                "og" => array("tag" => "property", "prefix" => "og:"),
                "tw" => array("tag" => "name", "prefix" => "twitter:")
            );

            // create HTML form from Array
            foreach ($tags as $key => $value) {
                foreach ($metaArrOut as $k => $val) {
                    if (!is_array($val)) {
                        if ($this->onlyOgschema($k, $key)) {
                            $metaProp .= "\n" . '<meta ' . $tags[$key]["tag"] . '="' . $tags[$key]["prefix"] . ($key == 'sc' && $k == 'title' ? 'name' : $k) . '" content="' . $val . '">';
                        }
                    } else {
                        //its a preview image
                        $t = 0;
                        foreach ($val as $ikey => $image) {

                            $metaProp .= "\n" . '<meta ' . $tags[$key]["tag"] . '="' . $tags[$key]["prefix"] . $k . ($key == 'tw' && $k == 'image' ? ($t . ':src') : '') . '" content="' . $image . ($key == 'tw' && $k == 'image' ? '/' : '') . '">';

                            if ($key == 'tw' && $k == "image") {
                                $t++;
                            }
                        }
                    }
                }
            }
        }
        //var_dump($metaArrOut);
        //var_dump($type);
        return $metaProp . "\n";
    }

    /**
     * Old function
     * 
     * @param type $k
     * @param type $key
     * @return type
     */
    private function onlyOgschema($k, $key)
    {

        $oA = array("type", "url", "site_name");

        $oT = ($k == "card") ? true : false;

        $newk = ($key == "og") ? true : false;

        $newt = ($key == "tw") ? true : false;

        return ((in_array($k, $oA) && $newk && !$oT) || (!in_array($k, $oA) && !$newk && !$oT) || (!in_array($k, $oA) && $newk && !$oT) || ($newt && $key != "sc" && !in_array($k, $oA)));
    }
}
