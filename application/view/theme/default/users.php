<?php

/**
 * users
 * @package      Closhare +plus
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: users.php UTF-8 , 17-May-2014 | 01:30:41 nwdo ε
 * 
 * This file cannot be called itself must only be included by some other.
 * Requires Admin Level
 * 
 */
if (!defined("_SECURE_PHP")) {
    die('Direct access to this location is not allowed.');
}
?>
<!--begin user list HTML BLOCK-->
<?php
$page = get("pg") ? get("pg") : 1;
$ipp = $core->items_per_page;
$searchMode = get("uisearch") ? get("uisearch") : false;

$users = $user->getUsers(false, $page, $ipp, 'users', $searchMode);

if ($users) {
    $pdata = $user->arrangeUserTableData($users);
    $i = 0;
    $thead = $pdata['th'];
    $tbody = $pdata['body'];
}

$return = '<div id="uinotify"></div>';
$return .= '<div class="table-responsive">
            <table id="user-list-tbl" class="table table-striped" data-pg=' . $page . ' data-ipp=' . $ipp . '>
            <thead>
            <tr>';
if ($users) {
    foreach ($thead as $key) {
        if ($key == 'token')
            continue;
        $return .= '
            <th>' . constant($key) . (defined($key . '_title') ? helpIcon(constant($key . '_title'), false, 'top') : '') . '</th>';
    }
    $return .= '
          </tr>
        </thead>
        <tbody>';
    //print_r($tbody);
    foreach ($tbody as $keys => $val) {

        $return .= '<tr data-id="' . $tbody[$keys]['id'] . '">';
        $i++;
        $userid = $tbody[$keys]['id'];
        $tbody[$keys]['id'] = (($page - 1) * $ipp) + $i;

        foreach ($tbody[$keys] as $key => $value) {

            $tdClass = null;

            if ($key == 'disklimit') {
                if ($userid == 1) {
                    $value = '<span class="curdef" rel="tip" title="This is the total free disk space of your server" data-container="item">' . $fhand->userTotalSpace(false, true, $value) . ' <i class="icon icon-info-circle"></i></span>';
                } else {
                    $value = '<a href="#" id="uisp_' . $userid . '" data-name="' . $userid . '" data-type="text" data-pk="' . $userid . '" data-url="/" class="uispace editable-click" data-title=\'<b>Set User Disk Quota</b> <span class="small">add <b rel="tip" data-container="#page_users" title="Kilo Byte: KB<br>Mega Byte: MB<br>Giga Byte: GB<br>Tera Byte: TB">unit</b>, use .(dot) for float numbers. ie: 2.3GB</span>\'>'
                        . $fhand->userTotalSpace(false, true, $value)
                        . '</a>';
                }
            }

            if ($key == 'permissions') {

                if ($tbody[$keys]['role'] != "admin") {

                    $arrayPermissions = array();
                    $valuePermissions = array();

                    $permissions = $user->getUserPrivileges($value, $tbody[$keys]['role']);

                    $value = '<small id="ui' . $userid . '_perm_result" class="mid-gray well well-sm mtb5 p3 animated">';
                    $x = 0;


                    foreach ($permissions as $kp => $permission) {
                        $x++;
                        $enable = false;
                        if ($permission == 1) {
                            $valuePermissions[] = $kp;
                            $enable = $kp;
                        }

                        $class = $kp;

                        $text = mb_convert_case($kp, MB_CASE_TITLE, "UTF-8");

                        if ($kp == 'rename') $class = 'pencil';
                        if ($kp == 'move') $class = 'cut';
                        if ($kp == 'describe') $class = 'pencil-square-o';
                        if ($kp == 'sync') $class = 'recycle';
                        if ($kp == 'share') $class = 'share-square';
                        if ($kp == 'delete') $class = 'trash';
                        if ($kp == 'email') $class = 'envelope';
                        if ($kp == 'compress') $class = 'file-zip-o';
                        if ($kp == 'create') $class = 'plus-square';

                        if ($enable)
                            $value .= ' <i class="icon icon-' . $class . ' curdef" rel="tip" data-placement="top" data-container="item" title="' . $text . '"></i>';

                        $arrayPermissions[] = array("value" => $kp, "text" => $text, "class" => $class);


                        unset($kp);
                        unset($permission);
                    }


                    $value .= '</small>';

                    if (count($valuePermissions) == 0) {
                        $value = '<small id="ui' . $userid . '_perm_result" class="mid-gray well well-sm mtb5 p3 animated"></small>';
                    }

                    $value .= '<a href="#" id="ui' . $userid . '_perm" class="uipermissions db" data-target="ui' . $userid . '_perm_result" data-type="checklist" data-pk="' . $userid . '" data-url="/" data-value=\'' . json_encode($valuePermissions) . '\'>Edit</a>';

                    $value .= '<script>'
                        . 'ui' . $userid . '_perm_source = ' . json_encode($arrayPermissions) . ';'
                        . 'ui' . $userid . '_perm_value = ' . json_encode($valuePermissions)
                        . '</script>';
                } else {
                    $value = "All";
                }
            }

            if ($key == 'lastlogin')
                $value = '<span class="date">' . $core->formatDate($value, true, false) . '</span>';

            if ($key == 'created')
                $value = '<span class="date">' . $core->formatDate($value, false) . '</span>';

            if ($key == 'status')
                $value = $user->userStatusSignBtn($val['id'] == 1 ? "admin" : $value);

            if ($key == 'disk_usage') {
                $value = $content->createProgressBarHTML($value, false, "usage no-round", "margin: 0");
                $tdClass = 'class="user_usage_percentage_' . $userid . '"';
            }

            $return .= "<td $tdClass>" . $value . '</td>';
        }

        $return .= '</tr>';
    }
} else {
    //no match
    $return .= '<div class="callout callout-warning"><h4>Warning!</h4>There is no such a user to show depends on your criteria</div>';
}
$return .= '
        </tbody>
        </table>
        </div>';



echo $return;
?>

<script>
    (function() {
        var $headControl = $("#headcontrol");
        <?php if ($pager->display_pages(true) != "") { ?>
            $headControl.find(".uitoolbar").htmlA($('<?php echo clear($pager->display_pages(true)); ?>'), 300);
        <?php } else { ?>
            $headControl.find(".uitoolbar li").addClass("disabled");
        <?php } ?>



        //addSearchField 
        var $searchContainer = $headControl.find(".uisearcher");

        if ($searchContainer.length === 0) {
            var html = '<div class="uisearcher">\n\
                        <form class="form-inline" role="form">\n\
                        <div class="form-group">\n\
                        <input type="text" id="uisearchuser" class="form-control input-sm" placeholder="Search for users...">\n\
                        </div>\n\
                        <button type="submit" id="uisearchuserbtn" class="btn btn-default-alt btn-xs mt5">\n\
                        <i class="icon icon-search"></i>\n\
                        </button>\n\
                        <span id="uisearchreset" class="clearinput"></span>\n\
                        </form>\n\
                        </div>';
            $headControl.append(html);
        }

        $searchContainer.find("input").focus();

    })(jQuery);
</script>

<!--end of user list HTML BLOCK-->