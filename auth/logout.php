<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/activity_log.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => true]);
    exit;
}

logActivity($_SESSION['user_id'], 'logout');

session_unset();
session_destroy();

echo json_encode(['success' => true]);
?>
