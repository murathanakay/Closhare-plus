<?php

/**
 * default
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: default.php UTF-8 , 22-Jun-2013 | 15:25:03 nwdo ε
 */
if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');
?>
<div id="dropzone">
    <span>Drop it!</span>
</div>
<div class="mask"></div>

<!--<a href="javascript:;" onclick="window.open('/?auth=google', 'google', 'toolbar=0,resizable=1,status=0,width=640,height=528');">Open Google</a>-->
<div id="notify_block"></div>

<div id="topActionButtons" class="navbar fileupload-buttonbar" role="navigation">

    <div id="page" class="actions dropdown p0">

        <div style="width: 250px;" class="hidden-xs pull-left">
            <a href="javascript:;" class="logo"></a>
        </div>


        <button id="phoneActDr" data-toggle="dropdown" class="navbar-toggle dropdown-toggle collapsed hidden-lg" type="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon icon-bars"></span>
            <span class="icon icon-caret-down"></span>
        </button>

        <div class="upsection noisselected pull-left">

            <form id="fileupload" action="/" method="POST" enctype="multipart/form-data" class="mb0 fltlft">
                <input type="file" name="files[]" multiple directory webkitdirectory>
                <input type="hidden" name="uploadme" value="1">
            </form>

        </div>

        <ul class="navbar-collapse collapse fr pull-left" role="menu">

            <?php if ($user->checkUserPrivilege("download")) : ?>
                <li class="noisselected edis">
                    <a href="javascript:;" class="act btn" data-action="downloadFolder" rel="tip" data-title="Download current folder">
                        <i class="icon icon-cloud-download"></i> <span class="hidden-xs">Download</span>
                    </a>
                </li>


                <li class="isselected">
                    <a href="javascript:;" class="act btn" data-action="downloadItem" rel="tip" data-title="Download selected items">
                        <i class="icon icon-cloud-download"></i> <span class="hidden-xs">Download</span>
                    </a>
                </li>
            <?php endif; ?>

            <?php if ($user->checkUserPrivilege("move")) : ?>
                <li class="isselected">
                    <a href="javascript:;" data-action="cutItem" class="act btn round cut"><i class="icon icon-cut"></i> <span class="hidden-xs">Cut</span></a>
                </li>
            <?php endif; ?>
            <?php if ($user->checkUserPrivilege("copy")) : ?>
                <li class="isselected">
                    <a href="javascript:;" data-action="copyItem" class="act btn round copy"><i class="icon icon-copy"></i> <span class="hidden-xs">Copy</span></a>
                </li>
            <?php endif; ?>

            <?php if ($user->checkUserPrivilege("copy") || $user->checkUserPrivilege("move")) : ?>
                <li id="itemPaste" class="btn-group dropdown mb0 dn">

                    <button data-action="pasteItem" class="act btn btn-primary round pr0 fltn disabled" disabled="disabled" rel="tip" data-title="Paste Items here" data-placement="bottom">
                        <i class="icon icon-paste"></i> <span class="hidden-xs">Paste</span>

                    </button>

                    <button class="btn btn-primary fltn dropdown-toggle" data-hover="dropdown" data-toggle="dropdown" id="cutcopyItemsDbtn">
                        <span class="icon icon-chevron-down"></span>
                        <span class="badge"></span>
                    </button>

                    <div class="dropdown-menu cutcopyList" role="menu" aria-labelledby="cutcopyItemsDbtn">
                        <form>
                            <div role="presentation" class="top dropdown-header bgnone">Items on Clipboard
                                <div class="ccinfo orange small"></div>
                            </div>
                            <ul class="scr"></ul>

                            <div role="presentation" class="bottom">
                                <a role="menuitem" tabindex="-1" href="javascript:;" class="clearcutocopyItem btn btn-maroon btn-xs">
                                    Clear All
                                </a>
                            </div>
                        </form>
                    </div>
                </li>
            <?php endif; ?>
            <?php if ($user->checkUserPrivilege("delete")) : ?>
                <li class="isselected">
                    <a href="javascript:;" data-action="deleteItem" class="act btn">
                        <i class="icon icon-trash-o"></i> <span class="hidden-xs">Delete</span>
                    </a>
                </li>
            <?php endif; ?>
            <?php if ($user->checkUserPrivilege("create")) : ?>
                <li class="noisselected">
                    <a href="javascript:;" data-action="createdir" rel="tip" data-title="Create a new folder" class="act btn round newfolder">
                        <i class="icon icon-folder dir"><i class="icon icon-plus plus"></i></i> <span class="hidden-xs">New Folder</span>
                    </a>
                </li>
            <?php endif; ?>
            <?php if ($user->checkUserPrivilege("share")) : ?>
                <li class="isselected">
                    <a href="javascript:;" data-action="shareItem" class="act btn" rel="tip" data-title="Email & Share selected items">
                        <i class="icon icon-share-alt dir">
                        </i> <span class="hidden-xs">Share</span>
                    </a>
                </li>
            <?php endif; ?>
            <?php if ($user->checkUserPrivilege("sync")) : ?>
                <li class="noisselected">
                    <a href="javascript:;" data-action="updatedir" class="act btn pr0" rel="tip" data-title="Sync current folder & database">
                        <i class="icon icon-recycle"></i> <span class="hidden-xs">Sync Folder</span>
                    </a>
                    <span class="hidden-xs">
                        <?php echo infoIcon('This operation maybe take several minutes.', 12, false, false, "white"); ?>
                    </span>
                </li>
            <?php endif; ?>

        </ul>

        <?php if ($user->isAdmin()) { ?>

            <div class="dropdown pull-right m0 mr1 lld" id="configAction">
                <button class="act btn btn-lightblue dropdown-toggle" data-hover="dropdown" data-toggle="dropdown" id="userUi">
                    <i class="icon icon-users dir">
                        <i class="icon icon-cog dark-purple cog"></i>
                    </i>
                </button>
                <ul id="uiactControl" class="dropdown-menu fdropdownActions uiaction right" role="menu" aria-labelledby="userUi">
                    <li>
                        <a role="menuitem" tabindex="-1" href="javascript:;" class="uiact" data-action="profile" data-title="My Profile" data-icon="user-md" data-width="500px">
                            <i class="icon icon-user-md"></i> My Profile
                        </a>
                    </li>
                    <li>
                        <a role="menuitem" tabindex="-1" href="javascript:;" class="uiact" data-action="users" data-title="Users" data-icon="users" data-width="90%" data-nobtn="true" data-scroll="true">
                            <i class="icon icon-users"></i> Users
                        </a>
                    </li>
                    <li>
                        <a role="menuitem" tabindex="-1" href="javascript:;" class="uiact" data-action="settings" data-title="Settings" data-icon="cogs" data-width="54%" data-scroll="true">
                            <i class="icon icon-cogs"></i> Settings
                        </a>
                    </li>
                    <li>
                        <a role="menuitem" tabindex="-1" href="javascript:;" class="uiact" data-action="updateCheck" data-title="Check for updates" data-icon="refresh" data-width="30%" data-height="300px" data-nobtn="true" data-scroll="true">
                            <i class="icon icon-refresh"></i> Check for updates
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a role="menuitem" tabindex="-1" href="<?php echo CLO_URL; ?>/?logout=true" data-action="signout" class="logout btn p5">
                            Sign out <i class="icon icon-sign-out maroon"></i>
                        </a>
                    </li>
                </ul>

            </div>

        <?php } else { ?>

            <div class="dropdown pull-right m0 mr1 lld" id="userProfile">
                <button class="act btn btn-lightblue dropdown-toggle" data-hover="dropdown" data-toggle="dropdown" id="userUi">
                    <i class="icon icon-users dir">
                        <i class="icon icon-cog light-blue cog"></i>
                    </i>
                </button>

                <ul id="uiactControl" class="dropdown-menu fdropdownActions uiaction right" role="menu" aria-labelledby="userUi">
                    <li>
                        <a role="menuitem" tabindex="-1" href="javascript:;" class="uiact" data-action="profile" data-title="My Profile" data-icon="user-md">
                            <i class="icon icon-user-md"></i> My Profile
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="<?php echo CLO_URL; ?>/?logout=true" class="logout btn p5">
                            Sign out <i class="icon icon-sign-out"></i>
                        </a>
                    </li>
                </ul>

            </div>

        <?php } ?>


        <?php if ($core->site_list_view) : ?>
            <div class="btn-group pull-right edis" data-toggle="buttons" id="switchListType">

                <label class="act btn btn-xs" data-action="switchListType" data-type="list">
                    <input type="radio" name="listType" id="optionls"> <i class="icon icon-list" rel="tip" title="List"></i>
                </label>

                <label class="act btn btn-xs<?php if ((isset($_COOKIE['CLO_VT']) && $_COOKIE['CLO_VT'] != 'list') || !isset($_COOKIE['CLO_VT'])) : ?> active<?php endif; ?>" data-action="switchListType" data-type="thumb">
                    <input type="radio" name="listType" id="optiontn"> <i class="icon icon-th" rel="tip" title="Thumb"></i>
                </label>

            </div>
        <?php endif; ?>
        <div class="pull-right mr10" id="totalItemsNumber">

            <span class="details">
                <span class="inner">

                    <span class="typeContainer" style="display: none">
                        <i class="icon icon-folder-open"></i>
                        <span class="dirs"></span>
                        Folder(s)
                    </span>

                    <span class="typeContainer" style="display: none">
                        <i class="icon icon-file-text"></i>
                        <span class="files"></span>
                        File(s)
                    </span>

                </span>
            </span>

            <span class="loaded">0</span>
            <b> / </b>
            <span class="total">0</span>
            Items
        </div>

        <div id="mainIndicator" class="indicator pull-right" style="visibility: hidden;">
            <span></span>
            <span></span>
            <span></span>
        </div>

    </div>


    <ul class="filesHeading">

        <li id="filecheck" class="edis">
            <label for="checkFiles">
                <input type="checkbox" id="checkFiles">
            </label>
        </li>

        <li id="dirNav" class="fheading">
            <a href="javascript:;" class="parentN" data-area="hidden" title="Go to upper level">
                <i class="icon icon-arrow-left hidden-xs"></i>
                <span></span>
            </a>
            <a href="javascript:;" class="currentN hidden-xs" data-aria="hidden">
                <span></span><i class="fltr"></i>
            </a>
        </li>

        <li class="sortmain wide hidden-xs">
            <ul>
                <li class="fheading filenames edis" data-order="name">
                    <span class="link ml10">Name</span>
                </li>

                <li class="searchbtnli fltrt" data-order="none">
                    <div id="searcher" class="">
                        <form autocomplete="off">
                            <div id="search_filter_container">
                                <select id="search_filter" class="selectpicker show-tick" data-width="110px" name="search_filter">
                                    <option data-hidden="true"></option>
                                    <option value="all" data-icon="icon icon-files-o" selected>Mixed</option>
                                    <option value="file" data-icon="icon icon-file-text-o">Files</option>
                                    <option value="folder" data-icon="icon icon-folder-open-o">Folders</option>
                                    <option value="starred" data-icon="icon icon-star">Starred</option>
                                </select>
                            </div>
                            <input id="search" name="search" type="text" placeholder="Search items by name,description,extension..." autocomplete="off">
                            <span id="search_clear" class="clearinput"></span>
                            <input id="search_submit" value="" type="button" rel="tip" data-title="Search">
                        </form>
                    </div>
                </li>

                <li class="fheading filetypes fltrt up edis" data-order="type">
                    <span class="link ml10 active">Type</span>
                </li>

                <li class="fheading filedates fltrt edis" data-order="date">
                    <span class="link ml10">Date</span>
                </li>

                <li class="fheading filesizes fltrt edis" data-order="size">
                    <span class="link ml10">Size</span>
                </li>

            </ul>
        </li>

        <li class="phone pull-right visible-xs">

            <div class="dropdown mb0 mt0 edis">
                <button class="btn btn-xs btn-primary dropdown-toggle" type="button" id="dropdown1" data-toggle="dropdown">
                    Sort by
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdown1">
                    <li class="fheading filenames" data-order="name">
                        <a href="javascript:;" class="link">Name</a>
                    </li>
                    <li class="fheading filetypes up" data-order="type">
                        <a href="javascript:;" class="link active">Type</a>
                    </li>

                    <li class="fheading filedates" data-order="date">
                        <a href="javascript:;" class="link">Date</a>
                    </li>

                    <li class="fheading filesizes" data-order="size">
                        <a href="javascript:;" class="link">Size</a>
                    </li>
                </ul>
            </div>
        </li>


    </ul>
</div>

<section id="sidebar" class="panel panel-default<?php if (!$content->checkSideBarStatus()) : ?> dn<?php endif; ?>">

    <div class="panel-body p0">

        <ul id="sidebarTabContainer" class="nav">
            <li class="pull-left">
                <a href="#sideBarTree" data-toggle="tab" class="btn">My Folders</a>
            </li>
            <li class="pull-left">
                <a href="#sideBarStaticTree" data-toggle="tab" class="btn">
                    <i class="icon icon-circle"></i> Item Filter
                </a>
            </li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane" id="sideBarTree">
                <div class="treeFilterContainer">
                    <input type="search" placeholder="Start type to filter..." name="search" id="dirTreeFilter" class="form-control input-sm">
                    <span id="dirTreeCtr"><span id="dirTreematches"></span><i class="clearinput"></i></span>
                </div>
                <div id="dirTree" class="tree"></div>
            </div>

            <div class="tab-pane" id="sideBarStaticTree">

                <div>
                    <div class="resetFilter_cont">
                        <button class="btn btn-lg btn-block disabled resetFilter" type="button">Reset item filter <i class="icon icon-times-circle"></i></button>
                    </div>
                    <label class="filter_cdir_container badge db">Deep Filtering is <input id="filter_current_dir" type="checkbox" class="xswi" data-xswitch="true" <?php if ((isset($_COOKIE['CLO_DP']) && $_COOKIE['CLO_DP'])) : ?> checked<?php endif; ?>></label>
                </div>
                <div class="clearfix mt0 mb0"></div>

                <div class="scr">
                    <div class="list-group">

                        <div class="list-group-item btn-group btn-group-justified" data-toggle="buttons">

                            <div class="btn-group">
                                <button rel="#file" class="btn btn-default ftypes filter" data-color="white">Files Only</button>
                            </div>
                            <div class="btn-group">
                                <button rel="#folder" class="btn btn-default ftypes filter" data-color="dark-gray">Folders Only</button>
                            </div>

                        </div>

                        <a href="javascript:;" rel="#image" class="list-group-item filter" data-color="violet"><span class="bg-violet" data-placement="right" rel="tip" title="<?php echo $content->typeArrayToHtml($fhand->imageTypes); ?>"><i class="icon icon-picture-o"></i></span>Images</a>
                        <a href="javascript:;" rel="#video" class="list-group-item filter" data-color="orange"><span class="bg-orange" data-placement="right" rel="tip" title="wmv,ogg,mov,mp4 ie..."><i class="icon icon-youtube-play"></i></span>Video Files</a>
                        <a href="javascript:;" rel="#audio" class="list-group-item filter" data-color="blue"><span class="bg-blue" data-placement="right" rel="tip" title="mp3,wav,acc,wma ie..."><i class="icon icon-music"></i></span>Audio Files</a>
                        <a href="javascript:;" rel="#document" class="list-group-item filter" data-color="green"><span class="bg-green" data-placement="right" rel="tip" title="<?php echo $content->typeArrayToHtml($fhand->documentTypes); ?>"><i class="icon icon-file-text"></i></span>Documents</a>
                        <a href="javascript:;" rel="#other" class="list-group-item filter" data-color="light-orange"><span class="bg-light-orange" data-placement="right" rel="tip" title="zip,rar,iso,php ie..."><i class="icon icon-suitcase"></i></span>Other File Types</a>
                        <div class="clearfix divider"></div>
                        <a href="javascript:;" rel="#starred" class="list-group-item filter mtb5 taleft starred">
                            <span><i class="icon icon-star"></i></span> Starred</a>
                    </div>

                </div>
            </div>

        </div>

        <div id="usageStatistics" class="hidden-xs linear">

            <div class="col-md-6 col-sm-6 col-xs-6 p0 chartContainer" data-width="500" data-target=".uts">
                <b>Disk Usage</b>
                <div class="col-md-12 p0" id="diskSpaceUseDonut"></div>
            </div>

            <div class="col-md-6 col-sm-6 col-xs-6 p0 chartContainer" data-width="500" data-target=".uts">
                <b>File Types</b>
                <div class="col-md-12 p0" id="typesCountDonut"></div>
            </div>

            <div class="statPull" rel="tip" data-placement="top" data-title="Toggle Statistics"><i class="icon icon-angle-double-down"></i></div>

        </div>


    </div>

    <div class="resizeable" id="sidebarDivider" rel="tip" data-title="Click to hide sidebar" data-placement="right"></div>


    <div class="copyright">
        <?php if (isset($core->copyright_text) && !empty($core->copyright_text)) : ?>
            <?php echo $core->copyright_text; ?>
        <?php else : ?>
            &copy; <?php
                    if (!$mobile->isMobile()) {
                        echo date("Y");
                    }
                    ?> <?php echo $core->site_name ?><?php echo ' v' . $core->clo_version; ?>
        <?php endif; ?>
    </div>

</section>

<div id="sidebarOpener" class="<?php if ($content->checkSideBarStatus()) : ?>off<?php else : ?>on<?php endif; ?>">
    <div class="tongue" rel="tip" data-placement="right" data-title="Show Sidebar">
        <i class="icon icon icon-angle-double-right"></i>
    </div>
</div>

<div id="wrap">

    <section class="main col-xs-12 col-md-12 p0">

        <div id="viewport" class="view_port view_port_fixed">
            <div class="notify_area alert alert-info" style="position: absolute; height: 10px; padding: 20px; left: 0; right: 0; display: none; z-index: 1"> Showing "folder" filtered results.</div>
            <div class="viewbox linksc" id="list">


                <ul class="directoryList thumb <?php echo $core->site_dir_icon; ?>"></ul>


                <div id="moreItemLoader">
                    <div class="loader">
                        <span class="db">Loading Items...</span>
                    </div>
                    <div class="loaderbtn">
                        <button class="btn btn-block btn-primary">Load More</button>
                    </div>
                </div>

            </div>

            <div id="pageNumber">
                <div class="helper scrolldown top touch hidden-xs" rel="tip" data-title="Scroll down to load more items." data-placement="left"></div>
                <div class="badge">Page 1</div>
            </div>

        </div>

    </section>

</div>
<!--</div>-->