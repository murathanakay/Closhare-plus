<?php

/**
 * login
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: login.php UTF-8 , 23-Jun-2013 | 03:46:47 nwdo ε
 * @todo implementation to thematic version on v2.0
 */
if (!defined("_SECURE_PHP"))
  die('Direct access to this location is not allowed.');

?>
<?php if ($core->enable_facebook || $core->enable_twitter) : ?>
  <div class="social row">
    <?php if ($core->enable_facebook) : ?>
      <div class="col-xs-12 col-md-6 col-lg-6<?php if (!$core->enable_twitter) : ?> mlrauto<?php endif; ?> mtb5">
        <a href="javascript:;" title="Login with your Facebook Account" id="facebook" class="btn btn-facebook btn-block">
          <i class="icon icon-facebook icon-2x"></i> <span>Connect with Facebook</span>
        </a>
      </div>
    <?php endif; ?>
    <?php if ($core->enable_twitter) : ?>
      <div class="col-xs-12 col-md-6 col-lg-6<?php if (!$core->enable_facebook) : ?> mlrauto<?php endif; ?> mtb5">
        <a href="javascript:;" title="Login with your Twitter Account" id="twitter" class="btn btn-twitter btn-block">
          <i class="icon icon-twitter icon-2x"></i> <span>Connect with Twitter</span>
        </a>
      </div>
    <?php endif; ?>
  </div>
<?php endif; ?>

<form id="login_form" method="POST" action="<?php echo getUrlDirectoryRoot() ?>" class="col-xs-12 col-md-10 col-lg-10" novalidate>
  <div class="form-group mb0">
    <div class="col-xs-12 mb10 mt0 p5 thin-large">Please enter your login details</div>

  </div>
  <div class="form-group">
    <div class="btn-group btn-group-justified" data-toggle="buttons">
      <label class="btn btn-white active demo-login" data-email="admin@test.com" data-pass="demo123" style="padding: 12px 10px">
        <input type="radio" name="options" id="admin" class="not" autocomplete="off" checked> Administrator Login
      </label>
      <label class="btn btn-white demo-login" data-email="client@test.com" data-pass="demo123" style="padding: 12px 10px">
        <input type="radio" name="options" id="client" class="not" autocomplete="off"> Client Login
      </label>
    </div>
  </div>
  <?php if (post("loginme")) : ?>
    <div class="form-group" style="margin: 0">
      <?php echo $user->uilogin; ?>
    </div>
  <?php endif; ?>

  <div class="form-group">
    <input data-bv-notempty-message="Please enter your email address" data-bv-notempty="true" name="login-email" id="login-email" type="email" class="form-control" value="<?php echo isset($_POST['login-email']) ? $_POST['login-email'] : ''; ?>" placeholder="Email">
  </div>
  <div class="form-group">
    <input data-bv-notempty-message="Password is not ready" data-bv-notempty="true" data-bv-stringlength="true" data-bv-stringlength-min="<?php echo $core->register_password_min_length ?>" data-bv-stringlength-message="Password is not ready" minlength="<?php echo $core->register_password_min_length ?>" name="login-passw" id="login-passw" type="password" class="form-control nfb" placeholder="Password">
  </div>
  <div class="form-group warning" style="margin: 0;">
    <p class="help-block pull-left" style="text-align: left;font-size: 88%"></p>
  </div>
  <div class="form-group">
    <label class="<?php if (!$mobile->isMobile() && !$mobile->isTablet()) {
                    echo 'checkbox ';
                  } ?>pull-left">
      <input type="checkbox" value="remember-me" name="remember-me" id="remember-me" data-bv-excluded="true">
      Remember me
    </label>
    <button data-loading-text="Signing in" class="btn btn-default button-loading pull-right" id="login-submit" type="submit">Sign in</button>
  </div>
  <input type="hidden" name="loginme" value="<?php echo $encryption->encode(date("Ymd")); ?>" />
</form>
<script>
  $(function() {
    var $mailInput = $("#login-email"),
      $passInput = $("#login-passw");
    $(".demo-login").on("click", function() {
      var that = $(this),
        email = that.data("email"),
        pass = that.data("pass");

      $mailInput.val(email);
      $passInput.val(pass);
    }).first().trigger("click")
  });
</script>