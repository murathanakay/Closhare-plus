<?php

/**
 * The welcome page which contains login/register&reset forms
 * 
 * login
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: login.php UTF-8 , 22-Jun-2013 | 14:10:36 nwdo ε
 */
if (!defined("_SECURE_PHP")) {
    die('Direct access to this location is not allowed.');
}


//echo $encryption->encode('demo123');
?>

<div class="row">
    <div id="welcome-logo" class="col-xs-12 col-md-6 col-lg-6" style="text-align: center; margin: 20px auto; float: none;">

        <img src="<?php echo CLO_DEF_ASS_URI; ?>/img/uploads/<?php echo $core->site_logo; ?>" style="vertical-align: middle">

    </div>
</div>
<div class="row">

    <div id="form-login" class="col-xs-12 col-md-5 col-lg-5">
        <div class="tabs-top tabbable" id="page">
            <ul class="nav nav-pills tabnav mb10" id="user-post-box-lrr">
                <?php if (isset($_GET['reset'])) : ?>
                    <li class="active"><a href="#reset" data-toggle="tab" data-social="false" class="pg bold">Password Reset</a></li>
                <?php else : ?>
                    <li class="active"><a href="#login" data-toggle="tab" data-callback="" data-social="true" class="pg bold">Login</a></li>
                    <?php if ($core->register_allowed && ($core->register_user_limit == 0 || $core->register_user_limit > countDataDB($core->uTable))) : ?><li><a href="#register" data-toggle="tab" data-callback="" data-social="false" class="pg bold">Register</a></li><?php endif; ?>
                    <li class="pull-right"><a href="#recover" data-toggle="tab" data-callback="" data-social="false" class="pg bold">Forgot Password?</a></li>
                <?php endif; ?>
            </ul>
            <div class="tab-content">
                <?php if (isset($_GET['reset'])) : ?>
                    <div class="tab-pane active" id="reset"><?php include_once THEME_PATH . 'reset.php'; ?></div>
                <?php else : ?>
                    <div class="tab-pane active<?php if ($core->enable_facebook || $core->enable_twitter) : ?> mt-40<?php endif; ?>" id="login"><?php include_once THEME_PATH . 'login.php'; ?></div>
                    <?php if ($core->register_allowed && ($core->register_user_limit == 0 || $core->register_user_limit > countDataDB($core->uTable))) : ?><div class="tab-pane" id="register"><?php include_once THEME_PATH . 'register.php'; ?></div><?php endif; ?>
                    <div class="tab-pane" id="recover"><?php include_once THEME_PATH . 'reset.php'; ?></div>
                <?php endif; ?>


            </div>
        </div>
    </div>
</div>