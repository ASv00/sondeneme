<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../lib/totp.php';
require_once __DIR__ . '/../lib/activity_log.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: /');
    exit;
}

$db = Database::getInstance();
$user = $db->fetch('SELECT email, two_factor_enabled, two_factor_secret FROM users WHERE id = :id', ['id' => $_SESSION['user_id']]);

if ($user['two_factor_enabled']) {
    echo '2FA already enabled.';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = $_POST['code'] ?? '';
    $secret = $_SESSION['2fa_secret'] ?? '';
    if (TOTP::verifyCode($secret, $code)) {
        $db->update('users', ['two_factor_enabled' => 1, 'two_factor_secret' => $secret], 'id = :id', ['id' => $_SESSION['user_id']]);
        logActivity($_SESSION['user_id'], 'enable_2fa', 'users', $_SESSION['user_id'], null, ['two_factor_enabled' => 1]);
        unset($_SESSION['2fa_secret']);
        echo '2FA enabled successfully.';
        exit;
    } else {
        echo 'Invalid code.';
    }
}

if (!isset($_SESSION['2fa_secret'])) {
    $_SESSION['2fa_secret'] = TOTP::generateSecret();
}
$secret = $_SESSION['2fa_secret'];
$qrUrl = TOTP::getQRCodeUrl($user['email'], $secret);
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>2FA Kurulumu</title>
</head>
<body>
<h1>İki Aşamalı Doğrulama Kurulumu</h1>
<p>Google Authenticator veya uyumlu bir uygulama ile aşağıdaki QR kodu tarayın.</p>
<img src="<?php echo htmlspecialchars($qrUrl); ?>" alt="QR Code">
<p>Manuel giriş için gizli anahtar: <strong><?php echo htmlspecialchars($secret); ?></strong></p>
<form method="POST">
    <input type="text" name="code" placeholder="Uygulamadaki kod" required>
    <button type="submit">Doğrula</button>
</form>
</body>
</html>
