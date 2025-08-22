<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getInstance();
    switch ($method) {
        case 'GET':
            $tags = $db->fetchAll("SELECT id, name, category, usage_count FROM library_tags ORDER BY name ASC");
            echo json_encode(['success' => true, 'tags' => $tags]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || empty($data['name'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Etiket adı gerekli']);
                break;
            }
            $tagData = [
                'name' => strtolower(trim($data['name'])),
                'category' => $data['category'] ?? 'genel',
                'created_by' => $data['created_by'] ?? 1
            ];
            try {
                $db->insert('library_tags', $tagData);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                break;
            }
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID gerekli']);
                break;
            }
            $db->delete('library_tags', 'id = :id', ['id' => (int)$id]);
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
