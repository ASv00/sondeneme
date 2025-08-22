<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getInstance();

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $user = $db->fetch(
                     "SELECT id, full_name, email, role, risk_status FROM users WHERE id = :id",
                    ['id' => (int)$_GET['id']]
                );
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
               $users = $db->fetchAll("SELECT id, full_name, email, role, risk_status FROM users ORDER BY full_name ASC");
                echo json_encode(['success' => true, 'users' => $users]);
            }
            break;
        case 'PUT':
        case 'PATCH':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'ID required']);
                break;
            }
            $id = (int)$data['id'];
            $fields = [];
            if (isset($data['risk_status'])) {
                $fields['risk_status'] = $data['risk_status'];
            }
            if (isset($data['role'])) {
                $fields['role'] = $data['role'];
            }
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'No data to update']);
                break;
            }
        
            $old = $db->fetch('SELECT role, risk_status FROM users WHERE id = :id', ['id' => $id]);
            $db->update('users', $fields, 'id = :id', ['id' => $id]);
            logActivity($_SESSION['user_id'] ?? null, 'update_user', 'users', $id, $old, $fields);
            echo json_encode(['success' => true]);
            break;
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
