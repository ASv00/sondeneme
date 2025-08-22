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
                $project = $db->fetch("SELECT * FROM projects WHERE id = :id", ['id' => (int)$_GET['id']]);
                echo json_encode(['success' => true, 'project' => $project]);
            } else {
                $projects = $db->fetchAll("SELECT * FROM projects ORDER BY created_at DESC");
                echo json_encode(['success' => true, 'projects' => $projects]);
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
                'project_type' => $data['project_type'] ?? null,
                'status' => $data['status'] ?? 'planlama',
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'budget_total' => $data['budget_total'] ?? 0,
                'budget_used' => $data['budget_used'] ?? 0,
                'partners' => json_encode($data['partners'] ?? []),
                'created_by' => $data['created_by'] ?? 1
            ];
            $id = $db->insert('projects', $insertData);
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
            $updateFields = [];
            $fields = ['title', 'description', 'project_type', 'status', 'start_date', 'end_date', 'budget_total', 'budget_used', 'partners'];
            foreach ($fields as $field) {
                if (isset($data[$field])) {
                    $updateFields[$field] = ($field === 'partners') ? json_encode($data[$field]) : $data[$field];
                }
            }
            if (empty($updateFields)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'No data to update']);
                break;
            }
            $db->update('projects', $updateFields, 'id = :id', ['id' => $id]);
            echo json_encode(['success' => true]);
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID required']);
                break;
            }
            $db->delete('projects', 'id = :id', ['id' => (int)$id]);
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
