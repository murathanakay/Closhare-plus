<?php

/**
 * settings
 * @package      Closhare+plus
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: settings.php UTF-8 , 17-May-2014 | 01:01:41 nwdo ε
 * 
 * This file cannot be called itself must only be included by some other.
 * Requires Admin Level
 * 
 */
if (!defined("_SECURE_PHP")) {
    die('Direct access to this location is not allowed.');
}
$phpini = $core->getServerInfo();
?>
<!--begin settings HTML BLOCK-->
<div id="uinotify"></div>
<div class="tabbable tabs-left">

    <ul class="nav nav-tabs" id="settingsTab">
        <li><a href="#system" data-toggle="tab" data-heading="System Settings" data-icon="setting"><i class="icon icon-cog"></i> System</a></li>
        <li><a href="#upload" data-toggle="tab" data-heading="Upload Settings"><i class="icon icon-upload"></i> Upload</a></li>

        <li class="dropdown">
            <a href="#user" class="dropdown-toggle" data-toggle="dropdown" data-heading="User Settings"><i class="icon icon-users"></i> User
                <span class="caret"></span>
            </a>
            <ul class="dropdown-menu small" role="menu">
                <li><a href="#privileges" data-toggle="tab" data-heading="Privileges"><i class="icon icon-bicycle"></i> Privileges</a></li>
                <li><a href="#registrationsettings" data-toggle="tab" data-heading="Register & Login"><i class="icon icon-user-plus"></i> Register & Login</a></li>
                <li><a href="#templatesel" data-toggle="tab" data-heading="Mail&Terms Templates"><i class="icon icon-envelope-square"></i> Mail&Terms Templates</a></li>
            </ul>
        </li>
        <li><a href="#share" data-toggle="tab" data-heading="Sharing Settings"><i class="icon icon-share-alt"></i> Share</a></li>
        <li>

            <?php if (!$core->checkplatformSettings(true)) : ?>
                <a href="#apiset" data-toggle="tab" class="dark-yellow" title="<b class='db'>ATTENTION!</b>You need to provide API keys." rel="tip" data-container="item"><i class="icon icon-warning"></i> Platform APIs</a>
            <?php else : ?>
                <a href="#apiset" data-toggle="tab">Platform APIs</a>
            <?php endif; ?>
        </li>
    </ul>
    <div class="tab-heading"></div>
    <!-- Tab panes -->
    <div class="tab-content">
        <!-- begin system settings -->
        <div class="tab-pane" id="system">

            <div class="form-group">
                <label for="clo_hash" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-key pull-left"></span>
                    Product Key
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="clo_hash" name="clo_hash" class="form-control" value="" placeholder="<?php echo $core->clo_hash; ?>">
                </div>
            </div>

            <div class="form-group">
                <div class="callout callout-gray">
                    <span>If you did not purchase Closhare+plus from offical site of Closhare, you need to get a product key to get updates.</span>
                    <span class="maroon help-block"><a href="javascript:;" onclick="javascript: window.open('http://closhare.xneda.com/plugins/makeform/form.php?id=2', 't', 'toolbar=0,resizable=1,status=0,width=640,height=800');">Where to find the Product Key?</a></span>
                </div>
            </div>

            <div class="form-group">
                <label for="site_name" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-asterisk pull-left"></span>
                    Site Name
                    <span class="help-inline"><?php echo helpIcon("Your site name"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="site_name" name="site_name" class="form-control" value="<?php echo $core->site_name; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="site_slogan" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-keyboard-o pull-left"></span>
                    Site Description
                    <span class="help-inline"><?php echo helpIcon("Your site slogan (description) (used in page title)"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="site_slogan" name="site_slogan" class="form-control" value="<?php echo $core->site_slogan; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="meta_description" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-tags pull-left"></span>
                    Meta Description
                    <span class="help-inline"><?php echo helpIcon("Your site description for search engines (used in page meta tag)"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="meta_description" name="meta_description" class="form-control" value="<?php echo $core->meta_description; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="site_url" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-home pull-left"></span>
                    Site URL
                    <span class="help-inline"><?php echo helpIcon("Your site domain or IP without trailing slash / and must begin with http or https protocol. (http://www.example.com)"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="site_url" name="site_url" class="form-control" value="<?php echo $core->site_url; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="site_logo" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-picture-o pull-left"></span>
                    Site Logo
                    <span class="help-inline"><?php echo helpIcon("Your Site Logo. Max 205x55"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <?php if ($core->site_logo != "") { ?>
                        <div class="thumbnail bg-gray"><img src="<?php echo CLO_DEF_ASS_URI . 'img/uploads/' . $core->site_logo; ?>"></div>
                    <?php } ?>
                    <input type="file" id="site_logo" name="site_logo" class="filestyle" data-buttonText="Choose" data-buttonBefore="true">
                </div>
            </div>


            <div class="form-group">
                <label for="site_email" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-envelope-o pull-left"></span>
                    Site Email
                    <span class="help-inline"><?php echo helpIcon("Enter your site e-mail that emails sent from.(email@example.com)"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="site_email" name="site_email" class="form-control" value="<?php echo $core->site_email; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="mailer_method" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-external-link-square pull-left"></span>
                    Mailer Method
                    <span class="help-inline"><?php echo helpIcon("How does system send an e-mail?"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <?php echo $content->createDropdownMenu(
                        array("PHP", "SMTP" => "showHideSMTPoptions"),
                        $core->mailer_method,
                        "mailer_method",
                        false,
                        false
                    ); ?>
                </div>

            </div>


            <div class="form-group smtpoptions dn">
                <label for="mailer_smtp_host" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-ellipsis-h pull-left"></span>
                    Smtp Server/Port
                    <span class="help-inline"><?php echo helpIcon("Server Url/IP and port number ie: smtp.gmail.com:587"); ?></span>
                </label>

                <div class="well col-xs-8">
                    <div class="col-xs-7 pr0 pl0">
                        <input type="text" id="mailer_smtp_host" name="mailer_smtp_host" class="form-control" value="<?php echo $core->mailer_smtp_host; ?>">
                    </div>
                    <div class="w15 pull-left pr0 pl0 tacent" style="line-height: 35px">:</div>
                    <div class="col-xs-4 pl0">
                        <input type="number" id="mailer_smtp_port" name="mailer_smtp_port" class="form-control" value="<?php echo $core->mailer_smtp_port; ?>">
                    </div>
                </div>
                <div class="mt10 db col-xs-12"></div>
                <label for="mailer_smtp_user" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Smtp Username
                </label>
                <div class="well col-xs-8 pull-right">
                    <input type="text" id="mailer_smtp_user" name="mailer_smtp_user" class="form-control" value="<?php echo $core->mailer_smtp_user; ?>" placeholder="Username">
                </div>

                <div class="mt10 db col-xs-12"></div>

                <label for="mailer_smtp_pass" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Smtp Password
                </label>
                <div class="well col-xs-8 pull-right">
                    <input type="text" id="mailer_smtp_pass" name="mailer_smtp_pass" class="form-control" value="<?php echo $core->mailer_smtp_pass; ?>" placeholder="Password">
                </div>

                <div class="mt10 db col-xs-12"></div>

                <label for="mailer_connection_type" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Connection Type
                    <span class="help-inline"><?php echo helpIcon("Provide an working SMTP Protocol"); ?></span>
                </label>
                <div class="well col-xs-8 pull-right">
                    <?php echo $content->createDropdownMenu(array("None", "SSL", "TLS"), $core->mailer_connection_type, "mailer_connection_type", false, false); ?>
                </div>

            </div>

            <div class="form-group">
                <label for="site_list_view" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-list pull-left"></span>
                    List View(Alpha)
                    <span class="help-inline"><?php echo helpIcon("Do you want to enable list view for items?"); ?></span>
                </label>

                <div class="col-xs-8 well">

                    <input id="site_list_view" data-target-value="site_list_view" type="checkbox" value="1" <?php echo (($core->site_list_view) ? 'checked' : '') ?>>
                    <input type="hidden" id="site_list_view_v" name="site_list_view" value="<?php echo $core->site_list_view; ?>">

                </div>

            </div>

            <div class="form-group">
                <label for="site_dir_icon" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-folder-open-o pull-left"></span>
                    Directory icon
                    <span class="help-inline"><?php echo helpIcon("Select directory icon style"); ?></span>
                </label>

                <div class="col-xs-8 well" id="site_dir_icon" style="max-height: 200px; overflow: hidden; overflow-y: auto">
                    <?php echo $content->getDirIcons(); ?>
                </div>
            </div>

            <div class="form-group">
                <label for="page_welcome_bg" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-picture-o pull-left"></span>
                    Welcome screen Bg
                    <span class="help-inline"><?php echo helpIcon("Minimum Dimensions: 1920x1080px"); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <?php if ($core->page_welcome_bg != "") { ?>
                        <div class="thumbnail">
                            <span class="icon icon-times-circle curdef white removeBgBtn" title="Remove background image completely"></span>
                            <img src="<?php echo CLO_DEF_ASS_URI . 'img/uploads/' . $core->page_welcome_bg; ?>">
                        </div>
                    <?php } ?>
                    <input type="file" id="page_welcome_bg" name="page_welcome_bg" class="filestyle" data-buttonText="Choose" data-buttonBefore="true">

                    <input type="hidden" id="page_welcome_bg_0" name="page_welcome_bg_0" value="0">

                </div>
            </div>

            <div class="form-group">
                <label for="page_welcome_bg_animate" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    <span class="crt help-inline hidden-xs icon icon-spinner pull-left"></span>
                    Welcome screen bg animation
                    <span class="help-inline"><?php echo helpIcon("Set this on to make welcome screen animated on mouse hover."); ?></span>
                </label>

                <div class="col-xs-8 well">
                    <input id="page_welcome_bg_animate" data-target-value="page_welcome_bg_animate" type="checkbox" value="1" <?php echo (($core->page_welcome_bg_animate) ? 'checked' : '') ?>>
                    <input type="hidden" id="page_welcome_bg_animate_v" name="page_welcome_bg_animate" value="<?php echo $core->page_welcome_bg_animate; ?>">

                </div>
            </div>

            <div class="form-group">
                <div class="col-xs-12 well">
                    <button id="purgeDownloadTmpBtn" type="button" class="btn btn-warning">Purge Download Temporary Directory</button>
                    <span class="help-inline"><?php echo helpIcon("This is the temporary folder for downloaded archives without saving. (/files/tmp)"); ?></span>
                    <span class="help-block">You can also set crontab job for this action. To set a crontab you can take a look to quick reference on <a href="http://www.adminschoice.com/crontab-quick-reference/" target="_blank">here</a><br><i>Note: You should run the .php script which is located at</i><br><b class="ul">your_closhare_root/application/lib/crontab/purgeDownloadTmp.php</b></span>
                </div>

            </div>

        </div>
        <!-- end system settings -->

        <!-- begin upload settings -->
        <div class="tab-pane" id="upload">

            <div class="form-group">
                <label for="default_disk_limit" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-hdd-o pull-left"></span>
                    Default user disk quota
                    <span class="help-inline"><?php echo helpIcon("This option sets the default maximum disk space for each users. Note: You can also set disk limit for each user individually on 'Users' Tab."); ?></span>
                </label>

                <div class="col-xs-7 input-group well">
                    <input type="text" id="default_disk_limit" name="upload_user_default_disk_limit[]" class="form-control" value="<?php echo $fhand->formatBytes($core->upload_user_default_disk_limit, 2, false); ?>">
                    <div class="input-group-btn">
                        <?php echo $content->createUnitSelectionRadio("upload_user_default_disk_limit", $fhand->getUnitFromBytes($core->upload_user_default_disk_limit)); ?>
                    </div>
                </div>

            </div>

            <div class="form-group">
                <label for="file_size_limit" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-cube pull-left"></span>
                    Default Max File Size Limit
                    <span class="help-inline"><?php echo helpIcon("The file size limit of one file. Note that you must make the right changes on php.ini file. ie: post_max_size = 128MB"); ?></span>
                </label>

                <div class="col-xs-7 input-group well">
                    <input type="text" id="file_size_limit" name="upload_max_file_size_limit[]" class="form-control" value="<?php echo $fhand->formatBytes($core->upload_max_file_size_limit, 2, false); ?>">
                    <div class="input-group-btn">
                        <?php echo $content->createUnitSelectionRadio("upload_max_file_size_limit", $fhand->getUnitFromBytes($core->upload_max_file_size_limit)); ?>
                    </div>
                </div>
            </div>

            <div class="form-group<?php if ($phpini["upload_max_filesize"]["current"] < $core->upload_max_chunk_size_limit) : ?> has-error<?php endif; ?>">
                <label for="chunk_size_limit" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-cubes pull-left"></span>
                    Max chunk size limit
                    <span class="help-inline"><?php echo helpIcon("Sets the data size sent to the server while uploading a file per request. Must not be greater than Max file size limit to take effect. Default 5MB"); ?></span>
                </label>

                <div class="col-xs-7 input-group well">
                    <input type="text" id="chunk_size_limit" name="upload_max_chunk_size_limit[]" class="form-control" value="<?php echo $fhand->formatBytes($core->upload_max_chunk_size_limit, 2, false); ?>">
                    <div class="input-group-btn">
                        <?php echo $content->createUnitSelectionRadio("upload_max_chunk_size_limit", $fhand->getUnitFromBytes($core->upload_max_chunk_size_limit)); ?>
                    </div>
                </div>

            </div>

            <div class="form-group">
                <label for="up_items" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-circle-o-notch pull-left"></span>
                    Max items per upload
                    <span class="help-inline"><?php echo helpIcon("Maximum file items to upload in one go. Set 0 for unlimited. Please note that it's better to set different than zero to prevent slower client experiences."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input type="text" id="up_items" name="upload_user_default_up_items" class="form-control" value="<?php echo $core->upload_user_default_up_items; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="allowed_file_types" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-minus-circle pull-left"></span>
                    Allowed File Types
                    <span class="help-inline"><?php echo helpIcon('Specify which file types can be uploaded. Enter extensions comma(,) seperated. ie: "<i class="small">gif, jpe?g, png</i>" for image files only. Set it "all" to allow any file types.'); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input type="text" id="allowed_file_types" name="upload_allowed_file_types" class="form-control" value="<?php echo (!$user->getUserAllowedFileTypes("html") ? 'All' : $user->getUserAllowedFileTypes("html")); ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="allowed_hdim" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-arrows-alt pull-left"></span>
                    Max image preview dimensions
                    <span class="help-inline"><?php echo helpIcon("Set Maximum dimensions to force browser create preview thumbnails before upload. Note: Any image that has dimensions bigger than these values preview will be ignored."); ?></span>
                </label>

                <div class="well col-xs-7">
                    <div class="col-xs-5 pr0 pl0">
                        <input type="text" id="allowed_hdim" name="upload_preview_allowed_hdim" class="form-control" value="<?php echo $core->upload_preview_allowed_hdim; ?>">
                    </div>
                    <div class="col-xs-1 pr0 pl0 tacent" style="line-height: 35px">x</div>
                    <div class="col-xs-6 pl0">
                        <input type="text" id="allowed_vdim" name="upload_preview_allowed_vdim" class="form-control" value="<?php echo $core->upload_preview_allowed_vdim; ?>">
                    </div>
                </div>

            </div>

            <div class="form-group">
                <label for="preview_file_size_limit" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-cube pull-left"></span>
                    Max image size to create preview
                    <span class="help-inline"><?php echo helpIcon("Set Maximum size to force browser to create preview thumbnails before upload. Note: Any image that is bigger than this value will be ignored."); ?></span>
                </label>

                <div class="col-xs-7 input-group well">
                    <input type="text" id="preview_file_size_limit" name="upload_preview_max_file_size_limit[]" class="form-control" value="<?php echo $fhand->formatBytes($core->upload_preview_max_file_size_limit, 2, false); ?>">
                    <div class="input-group-btn">
                        <?php echo $content->createUnitSelectionRadio("upload_preview_max_file_size_limit", $fhand->getUnitFromBytes($core->upload_preview_max_file_size_limit)); ?>
                    </div>
                </div>

            </div>

            <div class="form-group">
                <label for="upload_thumb_crop" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-crop pull-left"></span>
                    Crop Images
                    <span class="help-inline"><?php echo helpIcon("Crop images while creating preview, thumbnail and view versions."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="upload_thumb_crop" data-target-value="upload_thumb_crop" type="checkbox" value="1" <?php echo (($core->upload_thumb_crop) ? 'checked' : '') ?>>
                    <input type="hidden" id="upload_thumb_crop_v" name="upload_thumb_crop" value="<?php echo $core->upload_thumb_crop; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="upload_psd_preview" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-file-image-o pull-left"></span>
                    Psd Preview
                    <span class="help-inline"><?php echo helpIcon("Create jpg thumbnails from psd files."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="upload_psd_preview" data-target-value="upload_psd_preview" type="checkbox" value="1" <?php echo (($core->upload_psd_preview) ? 'checked' : '') ?>>
                    <input type="hidden" id="upload_psd_preview_v" name="upload_psd_preview" value="<?php echo $core->upload_psd_preview; ?>">

                    <span class="help-block"><b class="maroon">Note:</b>Creating jpeg from a psd file is processed pixel by pixel, so it may consume a lot of memory on large files and take some times depending on your server speed.</span>
                </div>

            </div>

        </div>
        <!-- end upload settings -->

        <!-- start user settings -->
        <div class="tab-pane" id="privileges">

            <div class="form-group">
                <label for="item_create" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-folder pull-left"></span>
                    Allow Folder Create
                    <span class="help-inline"><?php echo helpIcon("Can users create new Folder?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_create" data-target-value="item_create" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_create) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_create_v" name="item_create" value="<?php echo $core->item_create; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_download" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-download pull-left"></span>
                    Allow Download
                    <span class="help-inline"><?php echo helpIcon("Can users download Items?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_download" data-target-value="item_download" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_download) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_download_v" name="item_download" value="<?php echo $core->item_download; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_archive" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-compress pull-left"></span>
                    Allow File Compression
                    <span class="help-inline"><?php echo helpIcon("Can users compress files?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_archive" data-target-value="item_archive" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_compress) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_archive_v" name="item_archive" value="<?php echo $core->item_compress; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_share" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-share-alt pull-left"></span>
                    Allow Item Sharing
                    <span class="help-inline"><?php echo helpIcon("Can users share Items?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_share" data-target-value="item_share" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_share) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_share_v" name="item_share" value="<?php echo $core->item_share; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_rename" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-pencil-square pull-left"></span>
                    Allow Item Renaming
                    <span class="help-inline"><?php echo helpIcon("Can users rename Items?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_rename" data-target-value="item_rename" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_rename) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_rename_v" name="item_rename" value="<?php echo $core->item_rename; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_describe" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-pencil-square-o pull-left"></span>
                    Allow Description Editing
                    <span class="help-inline"><?php echo helpIcon("Can users edit description of Items?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_describe" data-target-value="item_describe" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_describe) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_describe_v" name="item_describe" value="<?php echo $core->item_describe; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_copy" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-copy pull-left"></span>
                    Allow Item Copying
                    <span class="help-inline"><?php echo helpIcon("Can users copy Items?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_copy" data-target-value="item_copy" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_copy) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_copy_v" name="item_copy" value="<?php echo $core->item_copy; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_move" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-cut pull-left"></span>
                    Allow Item Moving
                    <span class="help-inline"><?php echo helpIcon("Can users move Items?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_move" data-target-value="item_move" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_move) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_move_v" name="item_move" value="<?php echo $core->item_move; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="item_sync" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-recycle pull-left"></span>
                    Allow Item Sync
                    <span class="help-inline"><?php echo helpIcon("Can users sync Database&Filesystem?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="item_sync" data-target-value="item_sync" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->item_sync) ? 'checked' : '') ?>>
                    <input type="hidden" id="item_sync_v" name="item_sync" value="<?php echo $core->item_sync; ?>">
                    <span class="help-block">File&Database sync is useful when you changed/add/edit files outside of System(ie: as a FTP client). If you want to allow users to take this actions you need to enable it from here or on users tab individually.</span>
                </div>

            </div>

            <div class="form-group">
                <label for="items_readonly" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-minus-circle pull-left"></span>
                    Readonly all Items
                    <span class="help-inline"><?php echo helpIcon("Only allow read of files & folders."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="items_readonly" data-target-value="items_readonly" type="checkbox" value="1" data-on-label="Yes" data-off-label="No" <?php echo (($core->items_readonly) ? 'checked' : '') ?>>
                    <input type="hidden" id="items_readonly_v" name="items_readonly" value="<?php echo $core->items_readonly; ?>">
                    <span class="help-block">If this option is set to "Yes" all of the permissions above will be ignored and all Items will be marked as readonly.<b>Note that all clients will be affected from this.</b></span>
                </div>

            </div>


        </div>

        <div class="tab-pane" id="registrationsettings">

            <div class="form-group">
                <label for="register_allowed" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-child pull-left"></span>
                    Allow Registrations
                    <span class="help-inline"><?php echo helpIcon("Users may sign up your site?"); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="register_allowed" data-target-value="register_allowed" type="checkbox" value="1" <?php echo (($core->register_allowed) ? 'checked' : '') ?>>
                    <input type="hidden" id="register_allowed_v" name="register_allowed" value="<?php echo $core->register_allowed; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="register_user_limit" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-users pull-left"></span>
                    Register user limit
                    <span class="help-inline"><?php echo helpIcon("How many users can sign up your site. Set 0 for unlimited."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input type="text" id="register_user_limit" name="register_user_limit" class="form-control" value="<?php echo $core->register_user_limit; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="register_password_min_length" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-ellipsis-h pull-left"></span>
                    Min Password length
                    <span class="help-inline"><?php echo helpIcon("The required password length(characters) on user registration."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input type="text" id="register_password_min_length" name="register_password_min_length" class="form-control" value="<?php echo $core->register_password_min_length; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="register_send_welcome_mail" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-envelope-square pull-left"></span>
                    Send Welcome Mail
                    <span class="help-inline"><?php echo helpIcon("Set this \'yes\' to send a welcome e-mail to new registered user."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="register_send_welcome_mail" data-target-value="register_send_welcome_mail" type="checkbox" value="1" <?php echo (($core->register_send_welcome_mail) ? 'checked' : '') ?>>
                    <input type="hidden" id="register_send_welcome_mail_v" name="register_send_welcome_mail" value="<?php echo $core->register_send_welcome_mail; ?>">
                </div>

            </div>

            <div class="form-group">
                <label for="enable_facebook" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-facebook pull-left"></span>
                    Facebook Login&Register
                    <span class="help-inline"><?php echo helpIcon("Set this on to let users login/register with their facebook account. Note: If you enable this option you have to provide Faceboook APP ID&SCREET."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="enable_facebook" name="enable_facebook" data-target-value="enable_facebook" type="checkbox" value="1" <?php echo (($core->enable_facebook) ? 'checked' : '') ?>>
                    <input type="hidden" id="enable_facebook_v" name="enable_facebook" value="<?php echo $core->enable_facebook; ?>">
                </div>
                <span class="maroon">You need to edit <a href="javascript:;" class="programaticLink" data-target="#apiset">Facebook API</a> informations.</span>
            </div>

            <div class="form-group">
                <label for="enable_twitter" class="col-xs-5 control-label">
                    <span class="crt help-inline hidden-xs icon icon-twitter pull-left"></span>
                    Twitter Login&Register
                    <span class="help-inline"><?php echo helpIcon("Set this on to let users login/register with their twitter account. Note: If you enable this option you have to provide Twitter APP KEY&SCREET."); ?></span>
                </label>

                <div class="col-xs-7 well">
                    <input id="enable_twitter" data-target-value="enable_twitter" type="checkbox" value="1" <?php echo (($core->enable_twitter) ? 'checked' : '') ?>>
                    <input type="hidden" id="enable_twitter_v" name="enable_twitter" value="<?php echo $core->enable_twitter; ?>">
                </div>
                <span class="maroon">You need to edit <a href="javascript:;" class="programaticLink" data-target="#apiset">Twitter API</a> informations.</span>
            </div>

        </div>

        <div class="tab-pane" id="templatesel">

            <button type="button" class="btn btn-block mb10" data-toggle="collapse" data-parent="#templatesel" data-target="#registerwelcomeEmailTemplate">
                Welcome mail template
            </button>

            <div id="registerwelcomeEmailTemplate" class="panel-collapse collapse">
                <div class="panel-body pl0 pr0">
                    <a href="javascript:;" class="load_default db taright" data-uiaction="welcome" data-container="#registerwelcomeEmailTemplate" data-content="Do you really want to return the default template?">Load Default</a>
                    <textarea class="editor" name="register_welcome_mail_template" id="register_welcome_mail_template" cols="80" rows="5"><?php echo htmlspecialchars_decode($core->register_welcome_mail_template); ?></textarea>
                    <span class="help-block">This template will be used for sending welcome e-mails to the new registered users. Note: Do not remove tags between {...}</span>
                </div>
            </div>


            <button type="button" class="btn btn-block mb10" data-toggle="collapse" data-parent="#templatesel" data-target="#recoveryEmailTemplate">
                Recovery mail template
            </button>
            <div id="recoveryEmailTemplate" class="panel-collapse collapse">
                <div class="panel-body pl0 pr0">
                    <a href="javascript:;" class="load_default db taright" data-uiaction="recovery" data-container="#recoveryEmailTemplate" data-content="Do you really want to return the default template?">Load Default</a>
                    <textarea class="editor" name="recover_mail_template" id="recover_mail_template"><?php echo htmlspecialchars_decode($core->recover_mail_template); ?></textarea>
                    <span class="help-block">This template will be used for sending password recovery e-mail to users. Note: Do not remove tags between {...}</span>
                </div>
            </div>

            <button type="button" class="btn btn-block mb10" data-toggle="collapse" data-parent="#templatesel" data-target="#recoveryResultEmailTemplate">
                Recovery result mail template
            </button>

            <div id="recoveryResultEmailTemplate" class="panel-collapse collapse">
                <div class="panel-body pl0 pr0">
                    <a href="javascript:;" class="load_default db taright" data-uiaction="recovery_res" data-container="#recoveryResultEmailTemplate" data-content="Do you really want to return the default template?">Load Default</a>
                    <textarea class="editor" name="recover_mail_template_res" id="recover_mail_template_res" cols="80" rows="5"><?php echo htmlspecialchars_decode($core->recover_mail_template_res); ?></textarea>
                    <span class="help-block">This template will be used for sending password recovery result (selected password) e-mail to users. Note: Do not remove tags between {...}</span>
                </div>
            </div>

            <button type="button" class="btn btn-block" data-toggle="collapse" data-parent="#templatesel" data-target="#termsofservice">
                Terms of service
            </button>

            <div id="termsofservice" class="panel-collapse collapse">
                <div class="panel-body pl0 pr0">

                    <div class="form-group">
                        <label for="register_use_terms" class="col-xs-5 control-label">
                            <span class="crt help-inline hidden-xs icon icon-file-text-o pull-left"></span>
                            Use Terms of Service?
                            <span class="help-inline"><?php echo helpIcon("Do you want to users agree your terms of service or not?"); ?></span>
                        </label>

                        <div class="col-xs-7 well">
                            <input id="register_use_terms" name="register_use_terms" type="checkbox" value="1" <?php echo (($core->register_use_terms) ? 'checked' : '') ?>>
                        </div>

                    </div>

                    <textarea class="editor" name="register_terms_template" id="register_terms_template" cols="80" rows="5"><?php echo htmlspecialchars_decode($core->register_terms_template); ?></textarea>
                    <span class="help-block">Terms of service for your site.</span>
                </div>
            </div>


        </div>
        <div class="tab-pane" id="share">

            <div class="form-group">
                <label for="sharing_platforms" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Sharing Platforms
                </label>

                <div class="col-xs-8 well" id="sharing_platforms">

                    <?php
                    $Currentshare_options = @explode(",", $core->share_options);

                    $x = -1;
                    foreach ($share->share_opts as $key => $value) {
                        $x++;
                    ?>
                        <label>
                            <input class="i" type="checkbox" name="share_options[]" value="<?php echo $value; ?>" <?php if (in_array($value, $Currentshare_options)) {
                                                                                                                        echo " checked";
                                                                                                                    } ?>>
                            <?php
                            echo ucwords((string) $value);
                            ?>
                        </label>
                    <?php } ?>
                    <span class="help-block">Select sharing platforms to let users share files and folders.</span></span>
                </div>

            </div>
        </div>

        <div class="tab-pane" id="apiset">

            <div class="form-group">
                <h4><img src="<?php echo CLO_DEF_ASS_URI . '/img/vendor/facebook_logo.png'; ?>" width="48"> Facebook Connect Settings</h4>
                <hr>
            </div>

            <div class="form-group">
                <label for="facebook_id" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Facebook App ID
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="facebook_id" name="facebook_id" class="form-control" value="<?php echo $core->facebook_id; ?>">
                    <span class="help-block">You should create a Facebook App. <a href="https://developers.facebook.com/apps" target="_blank"> Start Here </a></span>
                </div>

            </div>

            <div class="form-group">
                <label for="facebook_secret" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Facebook App Secret
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="facebook_secret" name="facebook_secret" class="form-control" value="<?php echo $core->facebook_secret; ?>">
                    <span class="help-block">You should create a Facebook App. <a href="https://developers.facebook.com/apps" target="_blank"> Start Here </a></span>
                </div>

            </div>

            <div class="form-group">
                <h4><img src="<?php echo CLO_DEF_ASS_URI . '/img/vendor/twitter_logo.png'; ?>" width="48"> Twitter Connect Settings</h4>
                <hr>
            </div>

            <div class="form-group">
                <label for="twitter_key" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Twitter App KEY
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="twitter_key" name="twitter_key" class="form-control" value="<?php echo $core->twitter_key; ?>">
                    <span class="help-block">You should create a Twitter App. <a href="https://dev.twitter.com/apps" target="_blank"> Start Here </a></span>
                </div>

            </div>

            <div class="form-group">
                <label for="twitter_secret" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Twitter App Secret
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="twitter_secret" name="twitter_secret" class="form-control" value="<?php echo $core->twitter_secret; ?>">
                    <span class="help-block">You should create a Twitter App. <a href="https://dev.twitter.com/apps" target="_blank"> Start Here </a></span>
                </div>

            </div>

            <div class="form-group">
                <h4><img src="<?php echo CLO_DEF_ASS_URI . '/img/vendor/google.png'; ?>" width="48"> Google Settings</h4>
                <hr>
            </div>

            <div class="form-group">
                <div class="callout callout-info mb10">The system will handle the shortening process of shared links with or without it but An API key is highly recommended.</div>

                <label for="google_api_key" class="col-xs-12 col-md-4 col-lg-4 control-label">
                    Google URL Shortener API Key
                </label>

                <div class="col-xs-8 well">
                    <input type="text" id="google_api_key" name="google_api_key" class="form-control" value="<?php echo $core->google_api_key; ?>" autocomplete="off">

                    <span class="help-block">Provide an Google API KEY. To retrieve your personal API key you have to log in to the <a target="_blank" href="https://code.google.com/apis/console/">API console</a> and activate URL Shortener API. After that you can find your API key when clicking on the API access. To get it works please check your KEY twice or leave it empty. (Optional)</span></span>
                </div>

            </div>


        </div>
    </div>

</div>
<script type="text/javascript">
    $(function() {

        $("#settingsTab a:first").tab("show");

        $("#page_settings").find('input[type=checkbox]:not(.i)').xswitch().on("change", function() {
            var $this = $(this);

            if ($this.data("target")) {
                $target = $("#page_settings").find('#' + $(this).data("target"));
                if ($this.prop("checked")) {
                    $target.show().removeClass("dn");
                    var y = $target.prop("scrollHeight");
                    $("#page_settings").find(".tab-content").slimScroll({
                        scrollTo: y + "px"
                    });
                } else {
                    $target.hide().addClass("dn");
                }
            }
            //set value
            if ($this.data("target-value")) {
                $input = $("#page_settings").find('#' + $(this).data("target-value") + '_v');
                $input.val(($this.prop("checked") ? 1 : 0));
            }
            return false;
        });
        $("#page_settings").find(".tab-content").slimScroll({
            height: parseInt($(window).height() - 300),
            size: '6px',
            railVisible: true,
            railBorderRadius: '0',
            alwaysVisible: true,
            alwaysVisible: true
        });

        var editorCont = $("#page_settings").find(".editor");

        editorCont.each(function() {
            var $this = $(this);

            makeSmallEditor($this, $this.parent(), $this.val());
        });



        $("#page_settings").find(":file").filestyle({
            input: true,
            classButton: 'btn btn-default',
            classIcon: 'icon-folder-open'
        })

        $("#page_settings").find("#purgeDownloadTmpBtn").on("click", function() {

            $.getJSON('/', {
                "purge": "download"
            }, function(response) {
                //$("#page_settings").find("#uinotify").jGrowl("shutdown");
                $("#page_settings").find("#uinotify").jGrowl(response.message.txt, {
                    header: response.message.title,
                    life: 5000,
                    closeDuration: 0
                });
            });

            return false;
        });

        $(".modal-footer").find(".go").addClass("noDisable");

        $('input.i').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue',
        });

        $(".programaticLink").on("click", function() {
            var $this = $(this);
            $("#settingsTab").find('[href="' + $this.data("target") + '"]').tab('show');
        });

        $("#page_settings").find(".removeBgBtn").on("click", function() {
            $(this).closest("div.thumbnail").find("img").attr("src", ASSURI + "/" + "img/img-placeholder.jpg");
            $(this).next("#page_welcome_bg").val("");
            $("#page_welcome_bg_0").val("remove");
        });

        $("#settingsTab").outerHeight($("#page_settings").outerHeight() - 10)
    });

    function page_settings_callback() {

        //update upload settings
        $.getJSON("/?update_upload_settings=true", function(resOpt) {
            jQuery.each(resOpt, function(k, o) {
                uOptions[k] = o;
            });
        });

    }
</script>
<!--end of settings HTML BLOCK-->