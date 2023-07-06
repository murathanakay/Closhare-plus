<?php

/**
 * register
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: register.php UTF-8 , 23-Jun-2013 | 22:56:44 nwdo ε
 */
if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');
?>
<form id="register_form" action="<?php echo getUrlDirectoryRoot() ?>#page=register" method="POST" class="col-xs-12 col-md-10 col-lg-10" novalidate>

    <div class="form-group mb0">
        <h5 class="col-xs-12 mb10 mt0 p5 thin-large"><?php echo \Nedo\Lang::get("Sign up for", '<u>' . CLO_SITE_NAME . '</u>'); ?></u></h5>
    </div>
    <?php if (post("registerme")) : ?>
        <div class="form-group" style="margin: 0">
            <?php echo $user->uiregister; ?>
        </div>
    <?php endif; ?>
    <div class="form-group">
        <input name="register-email" id="register-email" type="email" class="form-control" data-bv-notempty="true" data-bv-notempty-message="<?php echo \Nedo\Lang::get("Please enter your email address"); ?>" data-bv-emailaddress="true" data-bv-emailaddress-message="<?php echo \Nedo\Lang::get("Please enter valid email address"); ?>" value="<?php echo isset($_POST['register-email']) ? $_POST['register-email'] : ''; ?>" placeholder="<?php echo \Nedo\Lang::get("email"); ?>" />

    </div>
    <div class="form-group">
        <input name="register-fname" id="register-fname" minlength="3" type="text" class="form-control" data-bv-regexp="true" data-bv-regexp-regexp="<?php echo \Nedo\Lang::get("NameRegex"); ?>" data-bv-regexp-message="<?php echo \Nedo\Lang::get("A name can only consist of alphabetical"); ?>" data-bv-stringlength="true" data-bv-stringlength-min="3" data-bv-stringlength-message="<?php echo \Nedo\Lang::get("Please enter your name min 3 character"); ?>" value="<?php echo isset($_POST['register-fname']) ? $_POST['register-fname'] : ''; ?>" placeholder="<?php echo \Nedo\Lang::get("Your Name"); ?>" />
    </div>
    <div class="form-group">
        <input name="register-passw" id="register-passw" minlength="<?php echo $core->register_password_min_length ?>" type="password" class="form-control" data-bv-stringlength="true" data-bv-stringlength-min="<?php echo $core->register_password_min_length ?>" data-bv-stringlength-message="<?php echo \Nedo\Lang::get("Please choose a password at least characters", $core->register_password_min_length); ?>" placeholder="<?php echo \Nedo\Lang::get("Choose a password"); ?>" autocomplete="off" />
    </div>
    <div class="form-group">
        <input name="register-passws" id="register-passws" type="password" class="form-control" data-bv-identical="true" data-bv-identical-field="register-passw" data-bv-identical-message="<?php echo \Nedo\Lang::get("Passwords are not the same"); ?>" placeholder="<?php echo \Nedo\Lang::get("Confirm password"); ?>" autocomplete="off" />
    </div>
    <div class="form-group" style="margin-bottom: 10px">
        <strong><?php echo \Nedo\Lang::get("You are not a robot Prove"); ?></strong>
        <a href="javascript:;" onclick="$('.captcha_img').attr('src', '<?php echo CLO_URL; ?>/captcha.png?' + Math.random());
                return false" id="change-image-register" class="captcha" tabindex="500">
            <img src="<?php echo CLO_URL; ?>/captcha.png" class="captcha_img" tabindex="500">
            <i class="icon icon-refresh"></i>
        </a>
    </div>
    <div class="form-group">
        <input type="text" name="captcha" id="captcha_input_register" class="form-control" minlength="4" data-bv-stringlength="true" data-bv-stringlength-min="4" data-bv-stringlength-message="<?php echo \Nedo\Lang::get("Please enter what you see above"); ?>" placeholder="<?php echo \Nedo\Lang::get("Enter what you see above"); ?>" autocomplete="off" />
    </div>

    <div class="form-group pull-left" style="padding-right: 30px">
        <?php if ($core->register_use_terms) : ?>
            <label class="<?php if (!$mobile->isMobile() && !$mobile->isTablet()) : ?>checkbox ';<?php endif; ?>pull-left">
                <input type="checkbox" value="1" id="register-terms" name="register-terms" />
                <?php echo \Nedo\Lang::get("AgreeTermsofUse", array('<a class="btn btn-default btn-xs" data-loading-text="Loading" href="javascript:;" data-action="terms-of-use" data-toggle="modal">Terms</a>')); ?>
            </label>
        <?php endif; ?>
    </div>
    <div class="form-group pull-right">
        <button data-loading-text="<?php echo \Nedo\Lang::get("Procesing"); ?>" class="btn btn-default button-loading pull-right" disabled="disabled" id="register-submit" type="submit"><?php echo \Nedo\Lang::get("Sign up"); ?></button>
    </div>

    <input type="hidden" name="registerme" value="<?php echo $encryption->encode(date("Ymd")); ?>">
</form>