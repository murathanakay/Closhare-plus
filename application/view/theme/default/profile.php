<?php

/**
 * profile
 * @package      Closhare +plus
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: profile.php UTF-8 , 17-May-2014 | 01:27:41 nwdo ε
 * 
 * This file cannot be called itself must only be included by some other.
 * 
 */
if (!defined("_SECURE_PHP")) {
    die('Direct access to this location is not allowed.');
}


$statics = $content->getUserLimitBR(true);
?>
<!--begin profile HTML BLOCK-->
<div id="uinotify"></div>
<div class="form-group">
    <label for="uipemail">Email address</label>
    <input type="email" class="form-control" name="email" id="uipemail" <?php if (!$user->isAdmin()) : ?> disabled="disabled" <?php endif; ?> value="<?php echo $user->user_email ?>" data-container="#box_tpage" required="" data-bv-notempty-message="You must provide an email address.">
</div>

<div class="form-group">
    <label for="uipusername">Full Name</label>
    <input type="text" class="form-control" data-bv-regexp="true" data-bv-regexp-regexp="^[a-zA-ZöçşğüıÖÇŞĞÜİâÂûÛî ]+$" data-container="#box_tpage" name="user_name" id="uipusername" value="<?php echo $user->user_name ?>" data-bv-regexp-message="Sorry usually a name doesn't contain numbers or special characters.<br><small class='light-blue'>Only [a-zA-Z] and öçşğüıÖÇŞĞÜİâÂûÛî are allowed.</small>">
</div>

<div class="form-group">
    <label for="uippasword">New Password</label>
    <input type="text" class="form-control" data-container="#box_tpage" minlength="<?php echo $core->register_password_min_length ?>" id="uippasword" name="user_password" value="">
    <p class="help-block">Leave empty if you don't want to change. <small class="db">Your password must be consisted of <?php echo $core->register_password_min_length ?> chars or more.</small></p>
</div>

<div class="form-group mt10 table-responsive last">
    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th></th>
                <th>Used</th>
                <th>Free</th>
                <th>Total</th>
                <th>Usage Percentage</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>Space</th>
                <td class="danger"><?php echo $statics['used']; ?></td>
                <td class="green"><?php echo $statics['free']; ?></td>
                <td class="light-blue"><?php echo $statics['total']; ?></td>
                <td class="active"><?php echo $statics['percent']; ?></td>
            </tr>
            <tr>
                <td colspan="5">
                    Stored <b><?php echo $statics['nfiles']; ?></b> file(s) and <b><?php echo $statics['nfolders']; ?></b> folder(s) in total.
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    Account created on <span class="date"><?php echo $user->user_created; ?></span>.
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    Last Logged on <span class="date"><?php echo $user->last_logged_on; ?></span> from <?php echo $user->last_logged_from ?>(IP).
                </td>
            </tr>

        </tbody>
    </table>

</div>
<script>
    (function() {

        $(".modal-footer").find(".go").addClass("noDisable");

        $('#form_tpage').bootstrapValidator({
            fields: {
                "user_name": {
                    container: "",
                    validators: {
                        notEmpty: {
                            message: 'Please enter your full name'
                        },
                    }
                }
            }
        });
    })(jQuery);
</script>
<!--end of profile HTML BLOCK-->