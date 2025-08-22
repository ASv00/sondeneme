<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getInstance();
    switch ($method) {
        case 'GET':
            $departments = $db->fetchAll("SELECT id, name FROM departments WHERE is_active = 1 ORDER BY name ASC");
            echo json_encode(['success' => true, 'departments' => $departments]);
            break;
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
