<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../lib/activity_log.php';
require_once __DIR__ . '/../lib/totp.php';
require_once __DIR__ . '/../lib/email.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$code = $_POST['code'] ?? null;

if (CORPORATE_DOMAIN && !str_ends_with(strtolower($email), '@' . strtolower(CORPORATE_DOMAIN))) {
    logLoginAttempt(null, $email, 'failure');
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized domain']);
    exit;
}

try {
    $db = Database::getInstance();
    $user = $db->fetch('SELECT * FROM users WHERE email = :email', ['email' => $email]);
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
        exit;
    }

    if ($user['two_factor_enabled']) {
        if (!$code || !TOTP::verifyCode($user['two_factor_secret'], $code)) {
            logLoginAttempt($user['id'] ?? null, $email, 'failure');
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => '2FA code required']);
            exit;
        }
    }

    $_SESSION['user_id'] = $user['id'];
    $db->update('users', ['last_login' => date('Y-m-d H:i:s')], 'id = :id', ['id' => $user['id']]);
    logActivity($user['id'], 'login');
    logLoginAttempt($user['id'], $email, 'success');
    sendTemplatedEmail($user['email'], 'login_alert', ['name' => $user['full_name']]);
    echo json_encode(['success' => true, 'user' => ['id' => $user['id'], 'full_name' => $user['full_name'], 'role' => $user['role']]]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
