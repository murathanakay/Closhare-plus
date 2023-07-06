<?php

/**
 * footer
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: footer.php UTF-8 , 22-Jun-2013 | 04:21:33 nwdo ε
 */
if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');
?>
<!--</div>-->
<?php if ($core->isShareUrI()) { ?>
<?php } ?>

<!--start main upload progress-->
<div class="col-xs-12 col-lg-12 col-md-12 fileupload-progress fade in" style="display: none">

    <div class="col-xs-2"></div>

    <div class="col-xs-10">

        <div class="upload-heading">
            <h4 class="mtb5 pl0"></h4>
        </div>
        <div class="col-xs-12 progress-container upload-body">

            <div class="current">

            </div>

            <div class="upload-part">

                <div class="progress">
                    <span class="percent"><b>0</b>%</span>
                    <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
                </div>

                <div class="progress-extended">
                    <span class="loadedPerTotal mb0 p3 pull-left"><i class="icon icon-check-circle"></i> <b>loadedPerTotal</b></span>
                    <div class="pull-right">
                        <span class="bitrate mb0 hidden-xs p3" title="Bitrate"><i class="icon icon-line-chart"></i> <b>bitrate</b></span>
                        <span class="remaining mb0 p3" title="Remaining time"><i class="icon icon-clock-o"></i> <b>remaining</b></span>
                        <span class="totalPercentage mb0 p3" title="Percentage"><i class="icon icon-pie-chart"></i> <b>totalPercentage</b></span>
                    </div>
                </div>

            </div>
        </div>

    </div>

    <a id="cancelAllUploads" class="btn btn-default disabled cancel" type="reset"><i class="icon icon-times-circle"></i> Cancel Upload</a>
</div>

<!--end main upload progress-->

</div>

<?php if ($user->logged_in && !$core->isShareUrI()) { ?>

    <div class="hide" id="actionbox">
        <div class="modal animatedout animated zoomInDown fast" tabindex="-1" data-width="420" data-height="100%" data-backdrop="static">
            <div class="modal-content">
                <div class="modal-header">
                    <button aria-hidden="true" data-dismiss="modal" class="dismisbox" type="button">
                        <span>&times;</span>
                    </button>
                    <h5 class="box_title"></h5>
                </div>

                <div class="modal-body">
                    <form class="actform" data-async data-target="" action="" method="POST" role="form">

                    </form>
                </div>

                <div class="modal-footer">
                    <span class="countdow"><i class="icon icon-clock-o"></i> <span></span></span>
                    <a href="#" class="btn btn-default btn-sm dismisbox" data-dismiss="modal">Cancel</a>
                    <span class="moveHandler"></span>
                </div>
            </div>
        </div>
    </div>
<?php } ?>
<input id="device" type="hidden" class="dnone" value="<?php echo (($mobile->isMobile() && !$mobile->isTablet()) ? 'mobile' : ($mobile->isTablet() ? 'tablet' : 'nor')); ?>" />
<div id="fb-root"></div>
<div id="tw-id"></div>
<script>
    var fileTypesAwsIcons = <?php echo json_encode($fhand->typesAvesomeIcons); ?>
</script>
<?php if ($core->isShareUrI()) : ?>
    <?php print $content->printJsFiles(true); ?>
<?php endif; ?>
<?php if ($user->logged_in) { ?>
    <script id="item-tpl" type="text/x-tmpl">
        {% for (var i=0, file; file=o.files[i]; i++) { %}
        <li class="preview {% if (file.hash) { %}{%=file.type%}{% } %}{% if (!file.hash){ %}file{% } %}<?php if ($mobile->isMobile()) {
                                                                                                            echo ' col-xs-10 mlrauto';
                                                                                                        } ?>{% if (file.password){ %} locked{% } %}{% if (file.data.id == $.cookie('CLO_HG') ){ %} highlight{% } %}"{% if (file.uniqueId){ %} data-uniqueid="{%=file.uniqueId%}"{% } %}>
        <div class="innerc lt">
        <div class="tnFileHeading">
        <?php if ($user->countPermissions()) : ?>
        <input type="checkbox" class="fltlft"{% if (file.noaction) { %} disabled{% } %}>
        <?php endif; ?>
        <div class="tnFilename fltlft">
        {%#truncToTip($('<span class="vn" data-type="text" data-emptytext="" data-title="Edit Name" />'), file.name, ( ($list.hasClass("list") || isMob()) ? 100 : 17), true, file.data.ftype)%}
        <?php if ($user->checkUserPrivilege("rename")) : ?>
        <span class="editName icon icon-pencil" rel="tip" title="Rename"></span>
        <?php endif; ?>
        </div>
        <div class="tnFileTopButtons fltlft btn-group animated bounceIn">
        <button class="btn fileInfoButton unfocusablebtn animated bounceIn"><i class="icon icon-info-circle"></i></button>
        <button class="btn fb fileMoreButton animated bounceIn"><i class="icon icon-caret-down"></i></button>
        </div>
        </div>
        <div 
        {% if (file.hash){ %}data-hash="{%=file.hash%}"
        {% } %} class="item {% if (file.type == 'folder'){ %}rpsve{% } else { %}{% if (file.viewable){ %}vpsve{% } else { %} octet{% } %}{% } %}">

        <div class="tnpreviewImageContainer">
        {% if (!touchable && file.type != 'folder' && !file.viewable){ %}
        <div class="dwnTip hvr-bounce-to-bottom"><b class="hvr-push"><i class="icon icon-download "></i><span>Download</span></b></div>
        {% } %}
        <div class="tnpreviewImage{%=((file.type != 'folder' && file.filetype) ? (' '+file.filetype.replace(/\W/g, '-')) : '')%}"
        {% if (file.preview && file.preview != 'canvas') { %}
        style="background-image:url({%=file.preview%})"
        {% } %}
        >
        {% if (file.noaction) { %}
        <span class="shortcut icon icon-share-square-o"></span>
        {% } %}  

        {% if (file.password){ %}<i class="protected icon icon-lock" rel="tip" title="Password protected folder"></i>{% } %}  
        </div>

        </div> 
        {% if (file.starred){ %}
        <span class="starred icon icon-star" rel="tip" title="Starred"></span>
        {% } %}
        </div>

        <div class="tnpreviewBottomBar">

        {% if (file.data.description){ %}
        <div class="tnpreviewDesc">
        {%#truncToTip($('<span class="dv" data-type="textarea" data-rows="2" data-title="Edit Description" data-emptytext="No Description"/>'), file.data.description, 30, true)%}
        {% } else { %}
        <div class="tnpreviewDesc empty">
        <span class="dv" data-type="textarea" data-rows="2" data-title="Edit Description" data-emptytext="Add description"></span>
        {% } %}
        <?php if ($user->checkUserPrivilege("describe")) : ?>
        <span class="edititemDesc" title="Edit description" rel="tip"><i class="icon icon-pencil"></i></span>
        <?php endif; ?>
        </div>

        <div class="brow">
        <div class="bleft">
        {% if (file.viewable && ( file.filetype == "video" || file.filetype == "audio" ) ){ %}
        <span class="qplayMedia" title="Quick play" rel="tip"></span>
        {% } %}    

        {% if (file.type == 'folder' && file.icon) { %}
        <img class="tnpreviewIcon" src="<?php echo CLO_DEF_ASS_URI . 'img/icons/' ?>{%=file.icon%}">
        {% } %}

        <span class="tnfileSize"{% if (file.icon && $wrap.hasClass("small")) { %} style="margin-left: -8px"{% } %}>
        {% if (file.type == 'folder' && file.needUpdate) { %}
        <i class="icon icon-database animatedicon_swing" rel="tip" title="Needs to be updated" data-placement="right"></i>
        {% } else { %}
        {% if (o.formatFileSize) { %}{%=o.formatFileSize(file.size)%}{% } %}
        {% if (!o.formatFileSize) { %}{%=file.size%}{% } %}
        {% } %}
        </span>
        </div>

        <div class="bright"></div>

        </div>
        </div>

        </div>
        </li>
        {% } %}
    </script>
    <script id="query-suggestions" type="text/x-tmpl">
        <p>
        <span class="suggestion-name">
        <i class="icon icon-circle {%=filterTypes[o.filetype]%}" rel="tip" title="{%=o.filetype%}" data-placement="top"></i> 
        {%=o.value%}
        </span>
        <span class="suggestion-actions">
        {% if (o.viewable){ %}
        <span class="suggestion-action viewItem" data-action="viewItem" data-type="{%=o.type%}" data-id="{%=o.id%}" data-hash="{%=o.hash%}" data-dirhash="{%=o.dirhash%}" rel="tip" title="View" data-placement="top">
        <i class="icon icon-external-link-square"></i>
        </span>   
        {% } %}
        {% if (o.type == 'folder'){ %}
        <span class="suggestion-action" data-action="openupfolder" data-type="{%=o.type%}" data-id="{%=o.id%}" rel="tip" title="Open" data-placement="top">
        <i class="icon icon-arrow-circle-o-right"></i>
        </span>       
        <span class="suggestion-action" data-action="downloadfolder" data-type="{%=o.type%}" data-id="{%=o.id%}" rel="tip" title="Download" data-placement="top">
        <i class="icon icon-download"></i>
        </span>
        {% } else { %}
        <span class="suggestion-action" data-action="downloaditem" data-type="{%=o.type%}" data-id="{%=o.id%}" rel="tip" title="Download" data-placement="top">
        <i class="icon icon-download"></i>
        </span>   
        {% } %}
        </span>
        </p>
    </script>
    <script id="itemInfo" type="text/x-tmpl">
        <div>
        <table class="table table-striped table-condensed table-responsive itemInfo">
        <tbody>
        <tr>
        <th scope="row">Name:</th>
        <td>{% if (o.type != 'd') { %}{%=o.p%}{% } else { %}{%=o.t%}{% } %}</td>
        </tr>  
        <tr>
        <th scope="row">File Type:</th>
        <td>
        <img src="<?php echo CLO_DEF_ASS_URI . 'img/filetypes/?get=' ?>{%=o.typeIcon%}" style="height: 28px; opacity: 0.4;">
        {% if (o.type != 'd') { %}{%=o.realext.toUpperCase()%} {% if (o.ftype == 'other') { %}file {% } else { %}{%=o.ftype%}{% } %} {% } else { %}{%=o.ftype%}{% } %}
        </td>
        </tr>
        {% if (o.ftype == 'image' && o.attr) { %}
        <tr>
        <th scope="row">Dimensions:</th>
        <td>{%=o.attr.width%}x{%=o.attr.height%} (pixels)</td>
        </tr>      
        {% } %}

        {% if (o.ftype == 'audio' && o.attr) { %}               
        <tr>
        <th scope="row">Lenght:</th>
        <td>
        {% if (o.attr.audio_duration) { %}
        {%=o.attr.audio_duration_formatted%}   
        {% } %}
        </td>
        </tr>      
        <tr>
        <th scope="row">Bit rate:</th>
        <td>
        {% if (o.attr.audio_byterate) { %}
        {%=o.attr.audio_byterate%}
        {% } %}
        </td>
        </tr>
        {% if (o.attr.id3) { %} 

        <tr>
        <td colspan="2">
        <table class="table table-bordered table-condensed fooit">

        {% for (index in o.attr.id3) { %}
        {% if (o.attr.id3[index] != "") { %} 
        <tr>
        <th>{%=index%}</th>
        <td>{%=o.attr.id3[index]%}</td>
        </tr>
        {% } %}
        {% } %}
        </table>
        </td>
        </tr>  

        {% } %}

        {% } %}
        {% if (o.type == 'd') { %}
        <tr>
        <th scope="row">Protected:</th>
        <td>{% if (o.p) { %}Yes{% } else { %}No{% } %}</td>
        </tr>
        {% if (o.totalFiles && o.totalSubFolders) { %}
        <tr>
        <th scope="row">Contains:</th>
        <td>{%=o.totalFiles%} x <i class="icon icon-files-o curdef" title="File"></i> {%=o.totalSubFolders%} x <i class="icon icon-folder-o curdef" title="Folder"></i>
        <div class="divider mt0 mb0"></div>
        <div class="vhidden">
        {% for (index in o.thumbs) { %}
        <div class="infoThumbs">
         <img src="{%=o.thumbs[index].src%}" title="{%=o.thumbs[index].name%}" rel="tip" data-container="item" data-placement="top">
        </div>    
        {% } %}
        <span>...</span>
        </div>

        </td>
        </tr>
        {% } %}
        <tr>
        {% } %}
        <th scope="row">Size:</th>
        <td>{%=o.size%}</td>
        </tr>
        {% if (o.type != 'd') { %}          
        <tr>
        <th scope="row">Uploaded:</th>
        <td>{%=o.udate%}</td>
        </tr>
        {% } %}
        <tr>
        <th scope="row">Created:</th>
        <td>{%=o.cdate%}</td>
        </tr>
        <tr>
        <th scope="row">Modified:</th>
        <td>{%=o.mdate%}</td>
        </tr>
        </tbody> 
        </table>
        </div>
    </script>
    <script>
        ui = {
            name: '<?php echo $user->user_name; ?>',
            mail: '<?php echo $user->user_email; ?>',
            perms: <?php echo json_encode($user->jsperms); ?>,
            totalPerm: <?php echo $user->countPermissions() ?>
        };
        var totalitems = <?php echo ($fhand->countUserFolders() + $fhand->countOrGetAllUserFiles(false, false)); ?>;
        var typesObj = <?php echo $fhand->createTypesArrays(); ?>;
        var shareOpts = <?php echo json_encode(explode(",", $core->share_options)); ?>;
        <?php if (!$core->isShareUrI()) : ?>
            <?php if ($user->logged_in) : ?>
                var uOptions = {
                        dataType: "json",
                        noind: true,
                        maxFileSize: <?php echo $user->getUserFileUploadSizeLimit(true); ?>,
                        loadImageMaxFileSize: <?php echo sanitise($core->upload_preview_max_file_size_limit); ?>,
                        maxNumberOfFiles: <?php echo ($user->getUserFileUploadItems() == 'N/A' ? 'undefined' : $user->getUserFileUploadItems()); ?>,
                        maxChunkSize: <?php echo $core->upload_max_chunk_size_limit; ?>,
                        forceIframeTransport: <?php echo ($mobile->isAndroidOS()) ? 1 : 0; ?>,
                        allowedTypes: <?php echo (!$user->getUserAllowedFileTypes("js") ? 0 : "'" . $user->getUserAllowedFileTypes("js") . "'"); ?>,
                        imageMaxWidth: <?php echo sanitise((int) $core->upload_preview_allowed_hdim); ?>,
                        imageMaxHeight: <?php echo sanitise((int) $core->upload_preview_allowed_vdim); ?>,
                        previewCrop: true
                    },
                    isIOS = <?php echo ($mobile->isiOS()) ? 1 : 0; ?>,
                    isAndroid = <?php echo ($mobile->isAndroidOS()) ? 1 : 0; ?>,
                    UIDIR = '<?php echo return6charsha1($user->userid) ?>',
                    freepArr = new Array("list", "upload", "profile"
                        <?php if ($user->isAdmin()) : ?>, "users", "settings"
                        <?php endif; ?>),
                    currPage = '';
            <?php endif; ?>
        <?php endif; ?>
    </script>
<?php } else { ?>
    <script>
        welcomePage = {
            animateBG: <?php echo (($core->page_welcome_bg_animate) ? 1 : 0); ?>
        }
    </script>
<?php } ?>
<script>
    var SITENAME = '<?php echo CLO_SITE_NAME ?>',
        AJAX_PATH = '<?php echo getUrlDirectoryRoot(); ?>',
        CLO_URL = '<?php echo CLO_URL ?>',
        ASSURI = '<?php echo CLO_DEF_ASS_URI ?>',
        THEMEURL = '<?php echo THEME_URL ?>',
        DevWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width),
        DevHeight = ((window.innerHeight > 0) ? window.innerHeight : screen.height);
</script>
<?php //load required social libraries  
?>
<script>
    //    window.twttr = (function (d,s,id) {
    //
    //      var t, js, fjs = d.getElementsByTagName(s)[0];
    //
    //      if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
    //
    //      js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
    //
    //      return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
    //
    //    }(document, "script", "twitter-wjs"));
</script>
<?php if ($core->enable_facebook && (isset($core->facebook_id) != "")) { ?>
    <script type="text/javascript">
        // <![CDATA[
        window.fbAsyncInit = function() {
            FB.init({
                appId: '<?php echo (isset($core->facebook_id) != "") ? $core->facebook_id : $facebook->getAppId(); ?>',
                session: <?php echo isset($fbsession) ? json_encode($fbsession) : 'undefined'; ?>,
                status: true,
                cookie: true,
                oauth: true,
                xfbml: true
            });
            FB.Event.subscribe('auth.statusChange', function(response) {
                getfbstatus(response);
            });

        };
        (function() {
            var e = document.createElement('script');
            e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
            e.async = true;
            document.getElementById('fb-root').appendChild(e);
        }());
        // ]]>
    </script>
<?php } ?>
<?php print $content->printJsFiles(false); ?>
<?php print $content->printThemeJsFiles(); ?>
<?php if ($core->enable_facebook) { ?>
    <script type="text/javascript">
        // <![CDATA[
        (function($) {
            if ($.cookie("CLO_FBASK") != 0)
                $.cookie("CLO_FBASK", 1);

        })(jQuery);

        function fblogin() {
            FB.login(function(response) {
                console.log(response);
            }, {
                scope: 'email'
            });
        }

        function fblogout() {
            FB.logout();
            FB.logout(function(response) {
                setTimeout(function() {
                    window.location.href = '<?php echo CLO_URL . '/logout.php' ?>';
                }, 400);
            });
        }

        function getfbstatus(response) {
            FB.getLoginStatus(function(response) {

                if (response.status === 'connected') {
                    <?php if (!$user->logged_in) { ?>

                        var uid = response.authResponse.userID;
                        var accessToken = response.authResponse.accessToken;

                        console.log(response);
                        if ($.cookie("CLO_FBASK") == 1) {
                            $.post('/', {
                                'checkfbuser': uid,
                                token: accessToken
                            }, function(res) {

                                if (res.result == 0) {
                                    ppop.confirm({
                                        title: '<i class="icon icon-chain-broken"></i> Login Authorization',
                                        message: '<b class="large">Hi, I see that you had connected to <span class="blue"><?php echo CLO_SITE_NAME; ?></span> before using your facebook account.</b><br><small class="mt10">Would you like me to register&log you in?</small>',
                                        buttons: {
                                            cancel: {
                                                label: "Cancel",
                                                className: "btn-default btn-sm"
                                            },
                                            confirm: {
                                                label: "Okay",
                                                className: "btn-success btn-sm"
                                            }
                                        },
                                        callback: function(result) {

                                            if (result) {
                                                createConnectFBBox();
                                                window.location.href = '<?php echo $core->current_page_url() ?>';
                                            } else {
                                                $.cookie("CLO_FBASK", 0);
                                                return false;
                                            }
                                        }
                                    }).on("hidden.bs.modal", function() {
                                        $.cookie("CLO_FBASK", 0);
                                    })
                                } else {
                                    createConnectFBBox();
                                    window.location.href = '<?php echo $core->current_page_url() ?>';
                                }
                            });
                        } else {
                            createConnectFBBox();
                            window.location.href = '<?php echo $core->current_page_url() ?>';
                        }

                    <?php } ?>

                } else if (response.status === 'not_authorized') {

                    <?php if (!$user->logged_in) { ?>
                        if ($.cookie("CLO_FBASK") == 1) {
                            ppop.confirm({
                                title: '<i class="icon icon-facebook-square"></i> Permission Required',
                                message: '<h4 style="margin-top: 0; padding-top: 0">Hello,</h4><b class="large">You have already connected to Facebook.<br><div class="divider"></div>If you want, I can connect you automatically on <a href="<?php echo CLO_URL; ?>" class="blue"><?php echo CLO_SITE_NAME; ?></a>.',
                                buttons: {
                                    cancel: {
                                        label: "Cancel",
                                        className: "btn-default btn-sm"
                                    },
                                    confirm: {
                                        label: "Yes, Sign in",
                                        className: "btn-success btn-sm"
                                    }
                                },
                                callback: function(result) {

                                    if (result) {
                                        createConnectFBBox();
                                        window.location.href = '<?php echo (isset($_SESSION['fb_login_url']) ? $_SESSION['fb_login_url'] : CLO_URL); ?>';
                                    } else {
                                        $.cookie("CLO_FBASK", 0);
                                        return false;
                                    }
                                }
                            }).on("hidden.bs.modal", function() {
                                $.cookie("CLO_FBASK", 0);
                            });
                        }
                    <?php } ?>
                } else {
                    // the user isn't logged in to Facebook.
                }
            });

        }
        jQuery(function() {
            $(".logout").on("click", function() {
                FB.getLoginStatus(function(response) {
                    console.log(response);
                    return false;
                    if (response.status == 'connected' || response.status === 'connected') {
                        fblogout();
                        return
                    } else {
                        window.location.href = '<?php echo CLO_URL . '/logout.php' ?>';
                    }
                });

            });
            <?php if (!$user->logged_in) { ?>
                $("#form-login .btn-facebook").on("click", fblogin);
            <?php } else { ?>
            <?php } ?>
        });
        // ]]>
    </script>
<?php } else { ?>
    <script>
        // <![CDATA[
        $(function() {
            $(".logout").on("click", function() {
                window.location.href = '<?php echo CLO_URL . '/logout.php' ?>';
            });

        });

        // ]]>    
    </script>
<?php } ?>
<?php if ($core->enable_twitter) { ?>
    <script>
        // <![CDATA[
        <?php if (!$user->logged_in) { ?>

            function twlogin() {
                window.open('/?auth=twitter', 'twitter', 'toolbar=0,resizable=1,status=0,width=640,height=528');
                return false;
            }
            $(function() {
                $("#form-login .btn-twitter").on("click", twlogin);
            });
            <?php
        } else {
            if ($user->user_email == "") {
            ?>
                //js
                if ($.cookie("CLO_TWMA") == 1) {

                    $.ajaxQueue({
                        url: '/',
                        type: 'GET',
                        data: {
                            "askforemail": <?php echo $user->userid; ?>
                        },
                        cache: true,
                        dataType: 'json',
                        success: function(response) {
                            var pp = ppop.dialog({
                                message: response.html,
                                title: response.title,
                                buttons: {
                                    cancel: {
                                        label: "Save",
                                        className: "btn-default btn-sm disabled hidden"
                                    },
                                    confirm: {
                                        label: "Save",
                                        className: "btn-success btn-sm disabled",
                                        callback: function(result) {
                                            if (result) {
                                                handleboxForms($(this), pp.find("form"), pp);
                                            }
                                            return false;
                                        }
                                    }
                                }
                            }).on("shownpp", function() {
                                var $pop = $(this);
                                $pop.find("input").focus();
                                $pop.find(".ppop-close-button").remove();
                                //validate email field
                                $pop.find('form').bootstrapValidator({
                                        fields: {
                                            "email": {
                                                container: "#req-tw-email",
                                                validators: {
                                                    remote: {
                                                        type: 'GET',
                                                        data: {
                                                            checkforemail: true
                                                        },
                                                        url: '/',
                                                        delay: 1000,
                                                        message: 'This email address is already exist. <a href="' + CLO_URL + '/?logout=true"> Login with this email?</a>'
                                                    }
                                                }
                                            }
                                        }
                                    }).on('error.validator.bv', function(e, data) {
                                        if (data.field === 'email' && data.validator === 'remote') {
                                            pp.find("button").disabletoggle(true);
                                        }
                                    })
                                    .on('success.validator.bv', function(e, data) {
                                        if (data.field === 'email' && data.validator === 'remote') {
                                            pp.find("button").disabletoggle(false);
                                        }
                                    });
                            });
                        }
                    });

                }
        <?php }
        } ?>
        // ]]> 
    </script>
<?php } ?>
</body>

</html>