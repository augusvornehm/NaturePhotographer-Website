

<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

// Load environment variables from the 'assets' folder and 'encrypt.env' file
$dotenv = Dotenv\Dotenv::createImmutable($_SERVER['DOCUMENT_ROOT'] . '/assets', 'encrypt.env');
$dotenv->load();

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable($_SERVER['DOCUMENT_ROOT'] . '/assets', 'encrypt.env');
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST']; // Loaded from .env
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER']; // Loaded from .env
        $mail->Password = $_ENV['SMTP_PASS']; // Loaded from .env
        $mail->SMTPSecure = ($_ENV['SMTP_ENCRYPTION'] == 'ssl') ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS; // Use SSL or TLS based on .env
        $mail->Port = $_ENV['SMTP_PORT']; // Loaded from .env

        $mail->setFrom($_ENV['SMTP_USER'], 'Augus Vornehm');
        $mail->addAddress('recipient@example.com', 'Recipient');

        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission';
        $mail->Body = "Name: $name <br>Email: $email <br>Message: " . nl2br($message);
        $mail->AltBody = "Name: $name \nEmail: $email \nMessage: $message";

        $mail->send();
        echo '<div class="container">
        <div class="message-success">Message has been sent. <br>Thanks, I will be in touch soon!😊</div>
        <button onclick="window.history.back()" class="back-btn">Back</button>
        </div>';
    } catch (Exception $e) {
        echo '<div class="container">
        <div class="message-error">Message could not be sent. Mailer Error: ' . $mail->ErrorInfo . '</div>
        <br><button onclick="window.history.back()" class="back-btn">Back</button>';

    }
}
echo '<style>
    @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap");

    body {
        background: linear-gradient(to bottom, #040615, #050816);
        font-family: "Outfit", sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Aligns everything to the left */
        justify-content: center; /* Centers vertically */
        height: 100vh;
        text-align: left;
        padding: 0 5%; /* Adds equal padding on left & right */
    }

    .container {
        padding: 0 5%; /* Ensures both message & button are aligned with equal left & right padding */
    }

    .message-success, .message-error {
        font-size: 5rem;
        font-weight: bold;
        text-shadow: 1px 8px 20px #202955;
        margin-bottom: 2.5rem;
        padding: 0;
    }

    .message-success {
        color: white;
    }

    .message-error {
        color: red;
    }

    .back-btn {
        display: inline-block;
        padding: 1rem 2rem;
        background: #ff7300;
        color: rgb(234, 234, 234);
        text-decoration: none;
        border-radius: 5rem;
        font-weight: bold;
        width: fit-content;
        font-size: 1.15rem;
        border: none;
        cursor: pointer;
        font-family: "Outfit", sans-serif;
    }

    .back-btn:hover {
        background-color: #9a6afc;
        color: #fff;
    }

    /* Media Queries for Responsive Font Sizing */
    @media (max-width: 1200px) {
        .message-success, .message-error {
            font-size: 4.5rem;
        }
    }

    @media (max-width: 900px) {
        .message-success, .message-error {
            font-size: 4rem;
        }
    }

    @media (max-width: 600px) {
        .message-success, .message-error {
            font-size: 4rem;
        }
        .back-btn {
            font-size: 1rem;
            padding: 0.8rem 1.5rem;
        }
    }

</style>';





?>

