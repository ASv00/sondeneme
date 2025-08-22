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
                $task = $db->fetch("SELECT * FROM tasks WHERE id = :id", ['id' => (int)$_GET['id']]);
                echo json_encode(['success' => true, 'task' => $task]);
            } else {
                $tasks = $db->fetchAll("SELECT * FROM tasks ORDER BY created_at DESC");
                echo json_encode(['success' => true, 'tasks' => $tasks]);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
                break;
            }
            $insertData = [
                'title' => $data['title'] ?? '',
                'description' => $data['description'] ?? null,
                'assigned_to' => $data['assigned_to'] ?? null,
                'assigned_by' => $data['assigned_by'] ?? 1,
                'department_id' => $data['department_id'] ?? null,
                'due_date' => $data['due_date'] ?? null,
                'reminder_at' => $data['reminder_at'] ?? null,
                'priority' => $data['priority'] ?? 'orta',
                'estimated_hours' => $data['estimated_hours'] ?? null,
                'tags' => isset($data['tags']) ? (is_array($data['tags']) ? json_encode($data['tags']) : $data['tags']) : json_encode([]),
                'status' => $data['status'] ?? 'yapilacak'
            ];
            $id = $db->insert('tasks', $insertData);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
        case 'PUT':
        case 'PATCH':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID required']);
                break;
            }
            $id = (int)$data['id'];
            $fields = ['title', 'description', 'assigned_to', 'department_id', 'due_date', 'status', 'priority', 'estimated_hours', 'reminder_at', 'completion_percentage', 'tags'];
            $updateFields = [];
            foreach ($fields as $field) {
                if (isset($data[$field])) {
                    $updateFields[$field] = ($field === 'tags' && is_array($data[$field])) ? json_encode($data[$field]) : $data[$field];
                }
            }
            if (isset($data['status']) && $data['status'] === 'tamamlandi') {
                $updateFields['completed_at'] = date('Y-m-d H:i:s');
            }
            if (empty($updateFields)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'No data to update']);
                break;
            }
            $db->update('tasks', $updateFields, 'id = :id', ['id' => $id]);
            echo json_encode(['success' => true]);
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID required']);
                break;
            }
            $db->delete('tasks', 'id = :id', ['id' => (int)$id]);
            echo json_encode(['success' => true]);
            break;
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
index.html
