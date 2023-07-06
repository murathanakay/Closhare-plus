SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- --------------------------------------------------------
SET time_zone = "+00:00";
-- --------------------------------------------------------
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
-- --------------------------------------------------------
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
-- --------------------------------------------------------
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
-- --------------------------------------------------------
/*!40101 SET NAMES utf8 */;
-- --------------------------------------------------------
USE `##!DBNAME##`;
--
-- Table structure for table `##!DBPREFIX##_folders`
--
-- --------------------------------------------------------
CREATE TABLE `##!DBPREFIX##_attempts` (
  `IP` varchar(20) NOT NULL,
  `attempts` int(11) NOT NULL,
  `folder_id` bigint(20) NOT NULL,
  `ltime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- --------------------------------------------------------
INSERT INTO `##!DBPREFIX##_attempts` VALUES ('192.168.0.10',1,80,'2014-11-23 14:04:52');
-- --------------------------------------------------------
#
# Source for table "##!DBPREFIX##_folders"
#
-- --------------------------------------------------------
CREATE TABLE `##!DBPREFIX##_folders` (
  `folder_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `folder_user_id` int(11) NOT NULL,
  `folder_v_path` varchar(255) CHARACTER SET latin1 NOT NULL,
  `folder_hash` varchar(10) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `folder_name` varchar(255) NOT NULL,
  `folder_parent_id` int(11) NOT NULL,
  `folder_level` int(11) NOT NULL,
  `folder_description` varchar(255) NOT NULL,
  `folder_mime` varchar(255) CHARACTER SET latin1 NOT NULL,
  `folder_icon` varchar(255) CHARACTER SET latin1 NOT NULL,
  `folder_files` int(11) NOT NULL DEFAULT '0',
  `folder_size` varchar(55) NOT NULL DEFAULT '0',
  `folder_created` datetime NOT NULL,
  `folder_modified` datetime NOT NULL,
  `folder_pass` char(255) NOT NULL,
  `folder_static` varchar(1) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT '0',
  PRIMARY KEY (`folder_id`),
  UNIQUE KEY `folder_hash` (`folder_hash`),
  KEY `user_id` (`folder_user_id`),
  FULLTEXT KEY `folder_search` (`folder_name`,`folder_description`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
-- --------------------------------------------------------
#
# Data for table "##!DBPREFIX##_folders"
#
-- --------------------------------------------------------
/*!40000 ALTER TABLE `##!DBPREFIX##_folders` DISABLE KEYS */;
-- --------------------------------------------------------
INSERT INTO `##!DBPREFIX##_folders` VALUES 
(1,0,'Document Root','','Document Root',-1,0,'','','',0,'0','0000-00-00 00:00:00','0000-00-00 00:00:00','','1'),
(2,0,'images','image','Image Files',1,0,'jpg,png,gif...','image','icon-picture',0,'0','0000-00-00 00:00:00','0000-00-00 00:00:00','','1'),
(3,0,'videos','video','Video Files',1,0,'mp4,avi,mov,wmv...','video','icon-film',0,'0','0000-00-00 00:00:00','0000-00-00 00:00:00','','1'),
(4,0,'sounds','sound','Sound Files',1,0,'mp3,wma,aac...','audio','icon-music',0,'0','0000-00-00 00:00:00','0000-00-00 00:00:00','','1'),
(5,0,'documents','documents','Document Files',1,0,'txt,pdf,doc...','document','icon-book',0,'0','0000-00-00 00:00:00','0000-00-00 00:00:00','','1'),
(6,0,'others','other','Others',1,0,'html,zip,rar...','other','icon-archive',0,'0','0000-00-00 00:00:00','0000-00-00 00:00:00','','1');
-- --------------------------------------------------------
/*!40000 ALTER TABLE `##!DBPREFIX##_folders` ENABLE KEYS */;
-- --------------------------------------------------------
#
# Source for table "##!DBPREFIX##_options"
#
-- --------------------------------------------------------
CREATE TABLE `##!DBPREFIX##_options` (
  `setting_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `setting_name` varchar(64) NOT NULL,
  `setting_value` longtext NOT NULL,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `setting_name` (`setting_name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- --------------------------------------------------------
#
# Data for table "##!DBPREFIX##_options"
#
-- --------------------------------------------------------
INSERT INTO `##!DBPREFIX##_options` VALUES 
(NULL,'site_name','Closhare+plus'),
(NULL,'site_slogan','The coolest way to collect & share files on-line'),
(NULL,'meta_description','Upload & Store your files with simple clicks'),
(NULL,'site_email','info@closhareplus.com'),
(NULL,'site_url','http://closhareplus.com'),
(NULL,'site_logo','logo.png'),
(NULL,'site_dir_icon','metro'),
(NULL,'site_list_view','0'),
(NULL,'register_allowed','1'),
(NULL,'register_password_min_length','6'),
(NULL,'register_user_limit','0'),
(NULL,'register_send_welcome_mail','0'),
(NULL,'register_welcome_mail_template','Hello, <b>{NAME}</b><p></p> <br>  We want to say that we are pleased to see you among us!<br> <br>  Now you can easily store/share your files with simple clicks on <a href=\"{SITEURL}\">{SITENAME}</a>.<br>  You can login to your {SITENAME} account using details below.<br> <br>  E-mail: {USERMAIL}<br>  Password: {USERPASS}<p></p><br> <a href=\"{SITEURL}\" target=\"_blank\">Click here</a> to go to your account.<p></p><p align=\"right\">{SITENAME}.<br></p>'),
(NULL,'register_use_terms','1'),
(NULL,'register_terms_template','&lt;span style=&quot;font-size: 12px; color: rgb(51, 51, 51);&quot;&gt;&lt;span style=&quot;color:rgb(255,0,0);font-size: 12px;&quot;&gt;The following example for the terms of the service does not reflect the reality  else where&lt;/span&gt; &lt;b style=&quot;font-size:12px;color: rgb(51, 51, 51);&quot;&gt;demo.closhare.net&lt;/b&gt;&lt;/span&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;color: rgb(51, 51, 51); font-size: 18.6667px;&quot;&gt;&lt;br&gt;Introduction&lt;/span&gt; &lt;br&gt;&lt;br&gt;    Welcome to demo.closhare.net.  This website is owned and operated by XnedA.  By visiting our website and accessing the information, resources, services, products, and tools we provide, you understand and agree to accept and adhere to the following terms and conditions as stated in this policy (hereafter referred to as \'User Agreement\'). &lt;br&gt;&lt;br&gt;    This agreement is in effect as of Oct 10, 2012. &lt;br&gt;&lt;br&gt;    We reserve the right to change this User Agreement from time to time without notice. You acknowledge and agree that it is your responsibility to review this User Agreement periodically to familiarize yourself with any modifications. Your continued use of this site after such modifications will constitute acknowledgment and agreement of the modified terms and conditions. &lt;br&gt;&lt;br&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;font-size:14pt;&quot;&gt;Responsible Use and Conduct&lt;/span&gt; &lt;br&gt;&lt;br&gt;    By visiting our website and accessing the information, resources, services, products, and tools we provide for you, either directly or indirectly (hereafter referred to as \'Resources\'), you agree to use these Resources only for the purposes intended as permitted by (a) the terms of this User Agreement, and (b) applicable laws, regulations and generally accepted online practices or guidelines. &lt;br&gt;&lt;br&gt;    Wherein, you understand that: &lt;br&gt;&lt;br&gt;    a. In order to access our Resources, you may be required to provide certain information about yourself (such as identification, contact details,  etc.) as part of the registration  process, or as part of your ability to use the Resources. You agree that any information you provide will always be accurate, correct, and up to date. &lt;br&gt;&lt;br&gt;    b. You are responsible for maintaining the confidentiality of any login information associated with any account you use to access our Resources.  Accordingly, you are responsible for all activities that occur under your account/s. &lt;br&gt;&lt;br&gt;    c. Accessing (or attempting to access) any of our Resources by any means other than through the means we provide, is strictly prohibited. You specifically agree not to access (or attempt to access) any of our Resources through any automated, unethical or unconventional means. &lt;br&gt;&lt;br&gt;    d. Engaging in any activity that disrupts or interferes with our Resources, including the servers and/or networks to which our Resources are located or connected, is strictly prohibited. &lt;br&gt;&lt;br&gt;    e. Attempting to copy, duplicate, reproduce, sell, trade, or resell our Resources is strictly prohibited. &lt;br&gt;&lt;br&gt;    f. You are solely responsible any consequences, losses, or damages that we may directly or indirectly incur or suffer due to any unauthorized activities conducted by you, as explained above, and may incur criminal or civil liability. &lt;br&gt;&lt;br&gt;    g. We may provide various open communication tools on our website, such as blog comments, blog posts, public chat, forums, message boards, newsgroups, product ratings and reviews, various social media services, etc.  You understand that generally we do not pre-screen or monitor the content posted by users of these various communication tools, which means that if you choose to use these tools to submit any type of content to our website, then it is your personal responsibility to use these tools in a responsible and ethical manner.  By posting information or otherwise using any open communication tools as mentioned, you agree that you will not upload, post, share, or otherwise distribute any content that: &lt;br&gt;&lt;br&gt;    i. Is illegal, threatening, defamatory, abusive, harassing, degrading, intimidating, fraudulent, deceptive, invasive, racist, or contains any type of suggestive, inappropriate, or explicit language;&lt;br&gt;    ii. Infringes on any trademark, patent, trade secret, copyright, or other proprietary right of any party;&lt;br&gt;    Iii. Contains any type of unauthorized or unsolicited advertising;&lt;br&gt;    Iiii. Impersonates any person or entity, including any closhare.xneda.com employees or representatives.&lt;br&gt; &lt;br&gt;&lt;br&gt;    We have the right at our sole discretion to remove any content that, we feel in our judgment does not comply with this User Agreement, along with any content that we feel is otherwise offensive, harmful, objectionable, inaccurate, or violates any 3rd party copyrights or trademarks. We are not responsible for any delay or failure in removing such content. If you post content that we choose to remove, you hereby consent to such removal, and consent to waive any claim against us. &lt;br&gt;&lt;br&gt;    h. We do not assume any liability for any content posted by you or any other 3rd party users of our website.  However, any content posted by you using any open communication tools on our website, provided that it doesn\'t violate or infringe on any 3rd party copyrights or trademarks, becomes the property of XnedA, and as such, gives us a perpetual, irrevocable, worldwide, royalty-free, exclusive license to reproduce, modify, adapt, translate, publish, publicly display and/or distribute as we see fit.  This only refers and applies to content posted via open communication tools as described, and does not refer to information that is provided as part of the registration  process, necessary in order to use our Resources. &lt;br&gt;&lt;br&gt;        i. You agree to indemnify and hold harmless XnedA and its parent company and affiliates, and their directors, officers, managers, employees, donors, agents, and licensors, from and against all losses, expenses, damages and costs, including reasonable attorneys\' fees, resulting from any violation of this User Agreement or the failure to fulfill any obligations relating to your account incurred by you or any other person using your account. We reserve the right to take over the exclusive defense of any claim for which we are entitled to indemnification under this User Agreement. In such event, you shall provide us with such cooperation as is reasonably requested by us. &lt;br&gt;&lt;br&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;font-size:14pt;&quot;&gt;Limitation of Warranties&lt;/span&gt; &lt;br&gt;&lt;br&gt;    By using our website, you understand and agree that all Resources we provide are &quot;as is&quot; and &quot;as available&quot;.  This means that we do not represent or warrant to you that:&lt;br&gt;i) the use of our Resources will meet your needs or requirements.&lt;br&gt;ii) the use of our Resources will be uninterrupted, timely, secure or free from errors.&lt;br&gt;iii) the information obtained by using our Resources will be accurate or reliable, and&lt;br&gt;iv) any defects in the operation or functionality of any Resources we providewill be repaired or corrected.&lt;br&gt; &lt;br&gt;&lt;br&gt;    Furthermore, you understand and agree that: &lt;br&gt;&lt;br&gt;v) any content downloaded or otherwise obtained through the use of our Resources is done at your own discretion and risk, and that you are solely responsible for any damage to your computer or other devices for any loss of data that may result from the download of such content.&lt;br&gt;vi) no information or advice, whether expressed, implied, oral or written, obtained by you from XnedA or through any Resources we provide shall create any warranty, guarantee, or conditions of any kind, except for those expressly outlined in this User Agreement.&lt;br&gt; &lt;br&gt;&lt;br&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;font-size:14pt;&quot;&gt;Limitation of Liability&lt;/span&gt; &lt;br&gt;&lt;br&gt;        In conjunction with the Limitation of Warranties as explained above, you expressly understand and agree that any claim against us shall be limited to the amount you paid, if any, for use of products and/or services.  XnedA will not be liable for any direct, indirect, incidental, consequential or exemplary loss or damages which may be incurred by you as a result of using our Resources, or as a result of any changes, data loss or corruption, cancellation, loss of access, or downtime to the full extent that applicable limitation of liability laws apply. &lt;br&gt;&lt;br&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;font-size:14pt;&quot;&gt;Copyrights/Trademarks&lt;/span&gt; &lt;br&gt;&lt;br&gt;    All content and materials available on closhare.xneda.com, including but not limited to text, graphics, website name, code, images and logos are the intellectual property of XnedA, and are protected by applicable copyright and trademark law.  Any inappropriate use, including but not limited to the reproduction, distribution, display or transmission of any content on this site is strictly prohibited, unless specifically authorized by XnedA. &lt;br&gt;&lt;br&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;font-size:14pt;&quot;&gt;Termination of Use&lt;/span&gt; &lt;br&gt;&lt;br&gt;    You agree that we may, at our sole discretion, suspend or terminate your access to all or part of our website and Resources with or without notice and for any reason, including, without limitation, breach of this User Agreement. Any suspected illegal, fraudulent or abusive activity may be grounds for terminating your relationship and may be referred to appropriate law enforcement authorities.  Upon suspension or termination, your right to use the Resources we provide will immediately cease, and we reserve the right to remove or delete any information that you may have on file with us, including any account or login information. &lt;br&gt;&lt;br&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;font-size:14pt;&quot;&gt;Governing Law&lt;/span&gt; &lt;br&gt;&lt;br&gt;    This website is controlled by XnedATurkey.  It can be accessed by most countries around the world.  By accessing our website, you agree that the statutes and laws of our state, without regard to the conflict of laws and the United Nations Convention on the International Sales of Goods, will apply to all matters relating to the use of this website and the purchase of any products or services through this site. &lt;br&gt;&lt;br&gt;    Furthermore, any action to enforce this User Agreement shall be brought in the federal or state courts Turkey You hereby agree to personal jurisdiction by such courts, and waive any jurisdictional, venue, or inconvenient forum objections to such courts. &lt;br&gt;&lt;br&gt;&lt;span class=&quot;tosTitle&quot; style=&quot;font-size:14pt;&quot;&gt;Guarantee&lt;/span&gt; &lt;br&gt;&lt;br&gt;    UNLESS OTHERWISE EXPRESSED, XnedA EXPRESSLY DISCLAIMS ALL WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. &lt;br&gt;&lt;br&gt;'),
(NULL,'recover_mail_template','Hello, <b>{NAME}</b><br><br>You have just requested a password reset from {SITENAME}.<br>If you think this is on you. Please <a href=\"{SITEURL}/?reset={HASHV}\">click here</a> to go on.<br>If not please ignore this mail and do nothing.<br><p align=\"right\">{SITENAME}.<br></p>'),(NULL,'recover_mail_template_res','Hello, <b>{NAME}</b><br><br>Here your new login details you have just set:<br><br>E-mail: <b>{USERMAIL}</b><br>  Password: <b>{USERPASS}</b><br><br><p align=\"right\">{SITENAME}.<br></p>'),
(NULL,'enable_facebook','0'),
(NULL,'facebook_id',''),
(NULL,'facebook_secret',''),
(NULL,'enable_twitter','0'),
(NULL,'twitter_key',''),
(NULL,'twitter_secret',''),
(NULL,'upload_allowed_file_types','All'),
(NULL,'upload_max_file_size_limit','1073741824'),
(NULL,'upload_max_chunk_size_limit','2097152'),
(NULL,'upload_user_default_disk_limit','2147483648'),
(NULL,'upload_user_default_up_items','0'),
(NULL,'upload_concurrent_limit','1'),
(NULL,'upload_preview_max_file_size_limit','5242880'),
(NULL,'upload_preview_allowed_hdim','2592'),
(NULL,'upload_preview_allowed_vdim','1936'),
(NULL,'upload_thumb_crop','1'),
(NULL,'upload_thumb_w','200'),
(NULL,'upload_thumb_h','160'),
(NULL,'upload_psd_preview','1'),
(NULL,'items_per_page','10'),
(NULL,'share_options','facebook,twitter,linkedin,pinterest,googleplus,email'),
(NULL,'google_api_key',''),
(NULL,'mailer_method','PHP'),
(NULL,'mailer_smtp_host','smtp.example.com'),
(NULL,'mailer_smtp_user','connect@example.com'),
(NULL,'mailer_smtp_pass','smtp_server_password'),
(NULL,'mailer_smtp_port','25'),
(NULL,'mailer_connection_type','None'),
(NULL,'page_welcome_bg','login-bg.png'),
(NULL,'page_welcome_bg_animate','1'),
(NULL,'clo_hash',''),
(NULL,'clo_version','1.5');
-- --------------------------------------------------------
#
# Source for table "##!DBPREFIX##_uploads"
#
-- --------------------------------------------------------
CREATE TABLE `##!DBPREFIX##_uploads` (
  `file_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file_user_id` int(11) NOT NULL,
  `file_access` tinyint(1) NOT NULL COMMENT '1:Private, 2:Public',
  `file_description` tinytext NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_key` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `file_extension` varchar(15) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `file_folder` int(11) NOT NULL,
  `file_mime_folder` int(1) NOT NULL COMMENT '1:none,2:image,3:video,4:audio,5:documents,6:other',
  `file_path` tinytext NOT NULL,
  `file_size` varchar(55) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `file_password` varchar(55) DEFAULT NULL,
  `file_date` datetime NOT NULL,
  `file_modified` datetime NOT NULL,
  `file_prepend` tinyint(1) NOT NULL,
  UNIQUE KEY `file_id` (`file_id`),
  KEY `file_user_id` (`file_user_id`),
  KEY `file_folder_id` (`file_folder`),
  KEY `file_date` (`file_date`,`file_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- --------------------------------------------------------
#
# Source for table "##!DBPREFIX##_userdata"
#
-- --------------------------------------------------------
CREATE TABLE `##!DBPREFIX##_userdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(55) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- --------------------------------------------------------
#
# Source for table "##!DBPREFIX##_users"
#
-- --------------------------------------------------------
CREATE TABLE `##!DBPREFIX##_users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'auto incrementing user_id of each user, unique index',
  `fbid` varchar(44) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `twid` varchar(44) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `user_dir` varchar(6) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `user_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s name',
  `user_password` char(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s password in salted and hashed format',
  `user_email` text COLLATE utf8_unicode_ci COMMENT 'user''s email',
  `user_role` enum('admin','user') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user' COMMENT 'Required for user permissions',
  `user_limit` varchar(55) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `user_lastloginTime` datetime NOT NULL,
  `user_lastloginIP` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `user_created` datetime NOT NULL,
  `user_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_status` enum('active','inactive') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Set user status inactive or active',
  PRIMARY KEY (`user_id`),
  FULLTEXT KEY `user_name` (`user_name`),
  FULLTEXT KEY `name_email` (`user_name`,`user_email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user data';
-- --------------------------------------------------------
#
# Data for table "##!DBPREFIX##_users"
#
-- --------------------------------------------------------
/*!40000 ALTER TABLE `##!DBPREFIX##_users` DISABLE KEYS */;
-- --------------------------------------------------------
INSERT INTO `##!DBPREFIX##_users` VALUES 
(1,'','','356a19','Administrator','4BjPdDyjspOA','admin@admin.com','admin','0','2014-11-29 06:17:46','127.0.0.1','0000-00-00 00:00:00','','active');
-- --------------------------------------------------------
/*!40000 ALTER TABLE `##!DBPREFIX##_users` ENABLE KEYS */;

#
# Source for table "##!DBPREFIX##_viamail"
#
-- --------------------------------------------------------
CREATE TABLE `##!DBPREFIX##_viamail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `item_id` tinytext CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `to_mail` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `from_mail` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL DEFAULT 'sys_mail',
  `message` text NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='items that have been sent via email';
#
# Data for table "##!DBPREFIX##_viamail"
#
-- --------------------------------------------------------
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
-- --------------------------------------------------------
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
-- --------------------------------------------------------
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
-- --------------------------------------------------------
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
-- --------------------------------------------------------
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
-- --------------------------------------------------------
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
-- --------------------------------------------------------
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
