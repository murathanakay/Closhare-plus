<?php

/**
 * class.mail
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: class.mail.php UTF-8 , 01-Jul-2013 | 02:53:01 nwdo ε
 */

use Nedo\Core;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

class Mailit
{

    private $method;
    private $smtp_host;
    private $smtp_user;
    private $smtp_pass;
    private $smtp_port;
    private $phpmailer;
    private $mailer_connection_type;

    /**
     * Mailer::__construct()
     * 
     * @return mailer settings
     */
    function __construct()
    {
        global $core;

        $this->method   = $core->mailer_method;
        $this->phpmailer = "/usr/sbin/sendmail -t -i";
        $this->smtp_host = $core->mailer_smtp_host;
        $this->smtp_user = $core->mailer_smtp_user;
        $this->smtp_pass = $core->mailer_smtp_pass;
        $this->smtp_port = $core->mailer_smtp_port;
        $this->mailer_connection_type = ($core->mailer_connection_type != 'None' ? strtolower($core->mailer_connection_type) : false);
    }

    /**
     * Mailer::sendMail()
     * 
     * Sends emails
     * @return true/false
     */
    public function _prepare()
    {
        require_once(LIB_PATH . 'mail/vendor/swift/swift_required.php');

        if ($this->method == "SMTP") {
            $transport = Swift_SmtpTransport::newInstance($this->smtp_host, $this->smtp_port, $this->mailer_connection_type)
                ->setUsername($this->smtp_user)
                ->setPassword($this->smtp_pass);
        } elseif ($this->method == "PHP") {
            $transport = Swift_SendmailTransport::newInstance($this->phpmailer);
        } else
            $transport = Swift_MailTransport::newInstance();

        return Swift_Mailer::newInstance($transport);
    }
}
$mail = new Mailit();
