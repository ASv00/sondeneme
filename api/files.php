<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getInstance();
    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Authentication required']);
        exit;
    }
    $currentUser = $db->fetch('SELECT role FROM users WHERE id = :id', ['id' => $_SESSION['user_id']]);
    if (!$currentUser || $currentUser['role'] === 'misafir') {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Permission denied']);
        exit;
    }

    if ($method === 'GET') {
        $type = $_GET['type'] ?? null;
        $category = $_GET['category'] ?? null;
        $dateFrom = $_GET['date_from'] ?? null;
        $dateTo = $_GET['date_to'] ?? null;
        $search = $_GET['search'] ?? null;

        $where = [];
        $params = [];

        if ($type) {
            $where[] = 'm.file_type = :type';
            $params['type'] = $type;
        }
        if ($category) {
            $where[] = 'm.category = :category';
            $params['category'] = $category;
        }
        if ($dateFrom) {
            $where[] = 'DATE(m.uploaded_at) >= :date_from';
            $params['date_from'] = $dateFrom;
        }
        if ($dateTo) {
            $where[] = 'DATE(m.uploaded_at) <= :date_to';
            $params['date_to'] = $dateTo;
        }
        if ($search) {
            $where[] = 'm.title LIKE :search';
            $params['search'] = '%' . $search . '%';
        }

        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $sql = "SELECT m.id, m.title, m.file_type AS type, m.category, m.file_size, m.uploaded_at, m.file_path, m.download_count, u.full_name AS uploader_name " .
               "FROM media_files m " .
               "LEFT JOIN users u ON m.uploaded_by = u.id {$whereSql} ORDER BY m.uploaded_at DESC";

        $files = $db->fetchAll($sql, $params);

        $filteredCount = count($files);
        $totalCount = $db->fetch("SELECT COUNT(*) as cnt FROM media_files")['cnt'];

        echo json_encode([
            'success' => true,
            'files' => $files,
            'filtered_count' => $filteredCount,
            'total_count' => (int)$totalCount
        ]);
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? null;

        if ($action === 'restore') {
            $fileId = isset($input['file_id']) ? (int)$input['file_id'] : 0;
            $targetVersion = isset($input['target_version']) ? (int)$input['target_version'] : 0;

            $current = $db->fetch('SELECT * FROM media_files WHERE id = :id', ['id' => $fileId]);
            if (!$current) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'File not found']);
                exit;
            }

            $versionRow = $current;
            while ($versionRow && $versionRow['version'] > $targetVersion && $versionRow['previous_version_id']) {
                $versionRow = $db->fetch('SELECT * FROM media_files WHERE id = :id', ['id' => $versionRow['previous_version_id']]);
            }

            if (!$versionRow || $versionRow['version'] != $targetVersion) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Target version not found']);
                exit;
            }

            $data = [
                'title' => $current['title'],
                'file_path' => $versionRow['file_path'],
                'preview_path' => $versionRow['preview_path'],
                'file_type' => $current['file_type'],
                'mime_type' => $versionRow['mime_type'],
                'file_size' => $versionRow['file_size'],
                'color_mode' => $versionRow['color_mode'],
                'category' => $current['category'],
                'version' => $current['version'] + 1,
                'previous_version_id' => $current['id'],
                'uploaded_by' => $current['uploaded_by'],
                'icc_profile_preserved' => $versionRow['icc_profile_preserved']
            ];

            $newId = $db->insert('media_files', $data);

            echo json_encode(['success' => true, 'file_id' => $newId]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
