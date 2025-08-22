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
                case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || empty($data['email']) || empty($data['full_name'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Full name and email required']);
                break;
            }

            if (isset($data['id'])) {
                $exists = $db->fetch('SELECT id FROM users WHERE id = :id', ['id' => (int)$data['id']]);
                if ($exists) {
                    http_response_code(409);
                    echo json_encode(['success' => false, 'error' => 'Duplicate ID']);
                    break;
                }
            }

            $exists = $db->fetch('SELECT id FROM users WHERE email = :email', ['email' => $data['email']]);
            if ($exists) {
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => 'Duplicate email']);
                break;
            }

            $insertData = [
                'full_name' => $data['full_name'],
                'email' => $data['email'],
                'role' => $data['role'] ?? 'uye',
                'department' => $data['department'] ?? null,
                'password_hash' => password_hash($data['password'] ?? bin2hex(random_bytes(4)), PASSWORD_DEFAULT)
            ];
            if (isset($data['id'])) {
                $insertData['id'] = (int)$data['id'];
            }

            $id = $db->insert('users', $insertData);
            echo json_encode(['success' => true, 'id' => $id]);
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
