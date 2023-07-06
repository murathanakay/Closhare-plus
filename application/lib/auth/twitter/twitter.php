<?php

/*
 * twitter
 * @package      closhare v1.00
 * @copyright    2014
 * @license      MIT
 * @contact      contact@closhare.com
 * @version $Id: twitter.php UTF-8 , Jan 22, 2014 | 12:36:38 AM nwdo ε
 */

require_once("twitteroauth.php");


if (!empty($_GET['oauth_verifier']) && !empty($_SESSION['oauth_token']) && !empty($_SESSION['oauth_token_secret'])) {

    $twitteroauth = new TwitterOAuth($core->twitter_key, $core->twitter_secret, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
    $twitteroauth->host = "https://api.twitter.com/1.1/";

    // Let's request the access token  
    $access_token = $twitteroauth->getAccessToken($_GET['oauth_verifier']);
    // Save it in a session var 
    $_SESSION['access_token'] = $access_token;
    // Let's get the user's info 
    $user_info = $twitteroauth->get('account/verify_credentials');

    $twlogin = $user->twLogin($user_info);

    if ($user_info && $twlogin) {
        //add a mark to ask user for their email cause twitter doesnt supply this information
        if ($twlogin["user_email"] == "") {
            setcookie("CLO_TWMA", 1, time() + 3600 * 24 * 7);
        }
        closeAndRedirect(CLO_URL);
    }
} else {

    $twitteroauth = new TwitterOAuth($core->twitter_key, $core->twitter_secret);
    $twitteroauth->host = "https://api.twitter.com/1.1/";

    $urlr = CLO_DEBUG ? "oob" : CLO_URL . '/?auth=twitter';

    $request_token = $twitteroauth->getRequestToken(CLO_URL . '/?auth=twitter');

    $_SESSION['oauth_token'] = $request_token['oauth_token'];
    $_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

    // If everything goes well..  
    if ($twitteroauth->http_code == 200) {
        // Let's generate the URL and redirect  
        $url = $twitteroauth->getAuthorizeURL($request_token['oauth_token']);
        redirectPage_to($url);
    } else {
        closeAndRedirect(false);
    }
}
