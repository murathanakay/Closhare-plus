<?php

/**
 * header
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: header.php UTF-8 , 01-Jun-2013 | 02:32:11 nwdo ε
 */
//redirect if host is not the same of the site settings.
if (!CLO_DEBUG) $core->fdirect();
?>
<!DOCTYPE html>

<head>
    <meta charset="utf-8">
    <title><?php echo (isset($meta['title']) && !empty($meta['title'])) ? $meta['title'] : (\CLO_SITE_NAME . ' | ' . CLO_SITE_SLOGAN); ?></title>
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=0">
    <meta name="description" content="<?php echo (isset($meta['description']) && !empty($meta['description'])) ? $meta['description'] : $core->meta_description; ?>">
    <meta name="author" content="<?php echo \CLO_SITE_NAME; ?>">
    <?php if (isset($meta['extra']) && !empty($meta['extra'])) { ?>
        <?php
        print $meta['extra'];
        ?>
        <link rel="canonical" href="<?php echo $meta['canonical']; ?>">
    <?php } else { ?>
        <link rel="canonical" href="<?php echo CLO_URL; ?>">
    <?php } ?>
    <link rel="shortcut icon" type="image/x-icon" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/favicon.ico">
    <link rel="apple-touch-icon" sizes="57x57" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="144x144" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="60x60" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="120x120" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="152x152" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/apple-touch-icon-152x152.png">
    <link rel="icon" type="image/png" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/favicon-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/favicon-160x160.png" sizes="160x160">
    <link rel="icon" type="image/png" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="<?php echo CLO_DEF_ASS_URI ?>img/favicon/favicon-32x32.png" sizes="32x32">
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="msapplication-TileImage" content="<?php echo CLO_DEF_ASS_URI ?>img/favicon/mstile-144x144.png">
    <meta name="msapplication-square70x70logo" content="<?php echo CLO_DEF_ASS_URI ?>img/favicon/mstile-70x70.png">
    <meta name="msapplication-square150x150logo" content="<?php echo CLO_DEF_ASS_URI ?>img/favicon/mstile-150x150.png">
    <meta name="msapplication-square310x310logo" content="<?php echo CLO_DEF_ASS_URI ?>img/favicon/mstile-310x310.png">
    <meta name="msapplication-wide310x150logo" content="<?php echo CLO_DEF_ASS_URI ?>img/favicon/mstile-310x150.png">
    <?php print $content->printCssFiles(); ?>
    <?php print $content->printThemeCssFiles(); ?>
    <!--[if IE 7]>
<link rel="stylesheet" href="<?php echo CLO_DEF_CSS_URI . "font-awesome-ie7.min.css" . debugASS(); ?>">
<![endif]-->
    <?php if (!$core->isShareUrI()) : ?>
        <?php print $content->printJsFiles(true); ?>
    <?php endif; ?>
    <!-- HTML5 shim, for IE6-8 support -->
    <!--[if lt IE 9]>
<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
</head>

<body class="onload<?php if ($content->checkSideBarStatus()) : ?> sidebar-on<?php else : ?> sidebar-off<?php endif; ?>">
    <?php if (!$user->logged_in &&  !$core->isShareUrI()) { ?>
        <div class="welcome-container">
        <?php } else { ?>
            <?php if (!$core->isShareUrI()) : echo $content->getTopNav();
            endif; ?>
            <div id="container" role="main" <?php if ($core->isShareUrI()) : ?> class="container" <?php endif; ?>>
            <?php } ?>