<?php

/**
 * email-header
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: email-header.php UTF-8 , 03-Nov-2014 | 21:01:42 nwdo ε
 */

if (!defined("_SECURE_PHP"))
	die('Direct access to this location is not allowed.');

// Load colours
$base = "#333333";
$bg 		= "#fafafa";
$body		= "#ffffff";
$base_text 	= light_or_dark($base, '#202020', '#ffffff');
$text 		= "#333333";
$username = $user->user_name;
$bg_darker_10 = hex_darker($bg, 10);
$base_lighter_20 = hex_lighter($base, 20);
$base_lighter_50 = hex_lighter($base, 50);
$text_lighter_20 = hex_lighter($text, 20);

// For gmail compatibility, including CSS styles in head/body are stripped out therefore styles need to be inline. These variables contain rules which are added to the template inline. !important; is a gmail hack to prevent styles being stripped if it doesn't like something.
$wrapper = "
	background-color: " . sanitise($bg) . ";
	width:100%;
	-webkit-text-size-adjust:none !important;
	margin:0;
	padding: 30px 0 70px 0;
";
$template_container = "
	box-shadow:0 0 0 3px rgba(0,0,0,0.025) !important;
	border-radius:6px !important;
	background-color: " . sanitise($body) . ";
	border: 1px solid $bg_darker_10;
	border-radius:6px !important;
";
$template_header = "
	background-color: #EEEEEE;
	color: #777777;
	border-top-left-radius:6px !important;
	border-top-right-radius:6px !important;
	border-bottom: 0;
	font-family:sans-serif;
	font-weight:bold;
	line-height:100%;
	vertical-align:middle;
";
$body_content = "
	background-color: " . sanitise($body) . ";
	border-radius:6px !important;
";
$body_content_inner = "
	color: $text_lighter_20;
	font-family:Arial;
	font-size:14px;
	line-height:150%;
	text-align:left;
";
$header_content_h1 = "
	color: #777777;
	margin:0;
	padding: 20px 0;
	text-shadow: 0 1px 0 $base_lighter_20;
	display:block;
	font-family:Arial;
	font-size:16px;
	font-weight:normal;
	text-align:center;
	line-height: 150%;
";
?>
<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title><?php echo CLO_SITE_NAME; ?></title>
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
	<div style="<?php echo $wrapper; ?>">
		<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
			<tr>
				<td align="center" valign="top">
					<div id="template_header_image">
						<?php
						echo '<p style="margin-top:0;"><img src="' . CLO_DEF_ASS_URI . 'img/uploads/' . $core->site_logo . '" alt="' . CLO_SITE_NAME . '" /></p>';
						?>
					</div>
					<table border="0" cellpadding="0" cellspacing="0" width="530" id="template_container" style="<?php echo $template_container; ?>">
						<tr>
							<td align="center" valign="top">
								<!-- Header -->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_header" style="<?php echo $template_header; ?>">
									<tr>
										<td>
											<h4 style="<?php echo $header_content_h1; ?>"><u><?php echo $username . '</u> sent you the following files'; ?></h4>

										</td>
									</tr>
								</table>
								<!-- End Header -->
							</td>
						</tr>
						<tr>
							<td align="center" valign="top">
								<!-- Body -->
								<table border="0" cellpadding="0" cellspacing="0" width="520" id="template_body">
									<tr>
										<td valign="top" style="<?php echo $body_content; ?>">
											<!-- Content -->
											<table border="0" cellpadding="5" cellspacing="0" width="100%">
												<tr>
													<td valign="top">
														<div style="<?php echo $body_content_inner; ?>">