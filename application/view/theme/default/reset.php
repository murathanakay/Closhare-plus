<?php

/**
 * reset
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: reset.php UTF-8 , 27-Jun-2013 | 00:27:41 nwdo ε
 */
if (!defined("_SECURE_PHP"))
   die('Direct access to this location is not allowed.');
$noCapt = false;
?>
<form id="reset_form" action="<?php echo (isset($_GET['reset']) && $user->checkUserToken($_GET['reset'])) ? (getUrlDirectoryRoot() . '?reset=' . $_GET['reset']) : getUrlDirectoryRoot() . '#page=recover'; ?>" method="POST" class="col-xs-12 col-md-10 col-lg-10" novalidate>
   <div class="form-group mb0">
      <h5 class="col-xs-12 mb10 mt0 p5 thin-large">Recover login details</h5>
   </div>
   <?php if (post("resetme")) : ?>
      <div class="form-group">
         <?php echo $user->uireset; ?>
      </div>
   <?php endif; ?>
   <?php if (isset($_GET['reset'])) { ?>
      <?php if (!empty($_GET['reset']) && $user->checkUserToken(get('reset'))) { ?>
         <div class="form-group">
            <input name="reset-passw" id="reset-passw" minlength="<?php echo $core->register_password_min_length ?>" type="password" class="form-control" data-validation-required-message="" placeholder="<?php echo \Nedo\Lang::get("Enter your new password"); ?>" data-bv-stringlength="true" data-bv-stringlength-min="<?php echo $core->register_password_min_length ?>" data-bv-stringlength-message="<?php echo \Nedo\Lang::get("Please choose a password at least characters", $core->register_password_min_length); ?>" autocomplete="off" />
         </div>
         <div class="form-group">
            <input name="reset-passws" id="reset-passws" type="password" class="form-control" data-bv-identical="true" data-bv-identical-field="reset-passw" data-bv-identical-message="<?php echo \Nedo\Lang::get("Passwords are not the same"); ?>" placeholder="<?php echo \Nedo\Lang::get("Confirm password"); ?>" autocomplete="off" />
         </div>
         <input type="hidden" value="<?php echo $_GET['reset']; ?>" name="reset" />
      <?php
      } else {
         //the requested reset hash is broken/unvalid
         $core->msgs = array("title" => \Nedo\Lang::get("Problem with request"), "message" => \Nedo\Lang::get("BrokenRecoveryKeyMessage", array($core->site_url, "here")));
         print $content->alertMessage("error", false, false, true);
         $noCapt = true;
      }
      ?>
   <?php } else { ?>

      <div class="form-group">
         <input data-validation-ajax-ajax="" name="reset-email" id="reset-email" type="email" class="form-control" data-bv-notempty="true" data-bv-notempty-message="<?php echo \Nedo\Lang::get("Please enter your email address"); ?>" data-bv-emailaddress="true" data-bv-emailaddress-message="<?php echo \Nedo\Lang::get("Please enter valid email address"); ?>" data-bv-remote="true" data-bv-remote-message="<?php echo \Nedo\Lang::get("There is no such an account associated with this email address"); ?>" value="<?php echo isset($_POST['reset-email']) ? $_POST['reset-email'] : ''; ?>" placeholder="Email" />
         <div id="resetNotify" class="popover bottom animated posre">
            <div class="arrow"></div>
            <h3 class="popover-title"><?php echo \Nedo\Lang::get("Note"); ?></h3>
            <div class="popover-content">
               <p><?php echo \Nedo\Lang::get("EmailRecoveryKeyMessage"); ?></p>
            </div>
         </div>
      </div>
   <?php } ?>
   <?php if (!$noCapt) { ?>
      <div class="form-group" style="margin-bottom: 10px">
         <strong><?php echo \Nedo\Lang::get("You are not a robot Prove"); ?></strong>
         <a href="javascript:;" onclick="$('.captcha_img').attr('src', '<?php echo CLO_URL; ?>/captcha.png?'+Math.random()); return false" id="change-image-register" class="captcha" tabindex="500">
            <img src="<?php echo CLO_URL; ?>/captcha.png" class="captcha_img" tabindex="500" />
            <i class="icon icon-refresh"></i>
         </a>
      </div>
      <div class="form-group">
         <input type="text" name="captcha" id="captcha_input_recover" class="form-control" minlength="4" data-bv-stringlength="true" data-bv-stringlength-min="4" data-bv-stringlength-message="<?php echo \Nedo\Lang::get("Please enter what you see above"); ?>" placeholder="<?php echo \Nedo\Lang::get("Enter what you see above"); ?>" autocomplete="off" />
      </div>
      <div class="form-group">
         <button data-loading-text="<?php echo \Nedo\Lang::get("Procesing"); ?>" class="btn btn-default button-loading btn-large pull-right" id="reset-submit" type="submit"><?php echo \Nedo\Lang::get("Send"); ?></button>
      </div>
      <input type="hidden" name="resetme" value="<?php echo $encryption->encode(date("Ymd")); ?>" />
   <?php } ?>
</form>