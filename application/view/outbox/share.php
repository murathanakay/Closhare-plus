<?php

/**
 * share
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: share.php UTF-8 , 02-Jun-2013 | 00:54:11 nwdo ε
 */
define("_SECURE_PHP", true);
include_once realpath(__DIR__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'init.php';

if (get("item")) {

  $page = $share->createSharePageItems();
} else {
  //shared item is not set so show an "Opps! Page"
  $content->errorPages(404);
}
$meta = $page['meta'];
include_once THEME_PATH . 'header.php';
?>
<nav role="navigation" class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a href="#" class="navbar-brand"><?php echo CLO_SITE_NAME ?></a>

      <button aria-controls="navbar" aria-expanded="false" data-target="#navbar" data-toggle="collapse" class="navbar-toggle collapsed pull-right" type="button">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    <div class="navbar-collapse collapse" id="navbar">

      <ul class="nav navbar-nav navbar-right">
        <?php if ($user->logged_in) : ?>
          <li><a href="<?php echo CLO_URL ?>/#dir=<?php echo $user->user_dir; ?>"><i class="icon icon-circle-o"></i> My Account</a></li>
          <li><a href="<?php echo CLO_URL; ?>/?logout=true&return_to=<?php echo urlencode($core->current_page_url(true)); ?>">logout <i class="icon icon-sign-out"></i></a></li>
        <?php else : ?>
          <li><a href="<?php echo CLO_URL ?>/#page=login">login <i class="icon icon-sign-in"></i></a></li>
        <?php endif; ?>
      </ul>
    </div><!--/.nav-collapse -->
  </div><!--/.container-fluid -->
</nav>
<?php
echo $page["content"];
?>
<div class="loadMoreItemContainer tacent dn">
  <button class="btn btn-black-alt btn-sm" data-loading="Loading..." disabled="">Loading...</button>
</div>
<?php
include_once THEME_PATH . 'footer.php';
?>