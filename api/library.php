<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getInstance();
    switch ($method) {
        case 'GET':
            $conditions = [];
            $params = [];

            if (!empty($_GET['type'])) {
                $conditions[] = 'resource_type = :type';
                $params['type'] = $_GET['type'];
            }

            if (!empty($_GET['search'])) {
                $conditions[] = '(title LIKE :search OR author LIKE :search)';
                $params['search'] = '%' . $_GET['search'] . '%';
            }

            if (!empty($_GET['age_groups'])) {
                $ageGroups = array_filter(explode(',', $_GET['age_groups']));
                foreach ($ageGroups as $idx => $age) {
                    $conditions[] = "JSON_CONTAINS(age_group, :age{$idx})";
                    $params["age{$idx}"] = json_encode($age);
                }
            }

            if (!empty($_GET['tags'])) {
                $tags = array_filter(explode(',', $_GET['tags']));
                foreach ($tags as $idx => $tag) {
                    $conditions[] = "JSON_CONTAINS(tags, :tag{$idx})";
                    $params["tag{$idx}"] = json_encode($tag);
                }
            }

            $where = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';
            $resources = $db->fetchAll(
                "SELECT * FROM library_resources {$where} ORDER BY created_at DESC",
                $params
            );
            echo json_encode(['success' => true, 'resources' => $resources]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || empty($data['title']) || empty($data['resource_type'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Eksik veri']);
                break;
            }

            $insertData = [
                'title' => $data['title'],
                'author' => $data['author'] ?? null,
                'isbn' => $data['isbn'] ?? null,
                'resource_type' => $data['resource_type'],
                'file_path' => $data['file_path'] ?? null,
                'external_url' => $data['external_url'] ?? null,
                'description' => $data['description'] ?? null,
                'age_group' => isset($data['age_group']) ? json_encode($data['age_group']) : json_encode([]),
                'difficulty_level' => $data['difficulty_level'] ?? 'orta',
                'language' => $data['language'] ?? 'tr',
                'page_count' => $data['page_count'] ?? null,
                'duration' => $data['duration'] ?? null,
                'category' => $data['category'] ?? null,
                'tags' => isset($data['tags']) ? json_encode($data['tags']) : json_encode([]),
                'custom_tags' => null,
                'added_by' => $data['added_by'] ?? 1
            ];

            $id = $db->insert('library_resources', $insertData);
            echo json_encode(['success' => true, 'id' => $id]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
