<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method Not Allowed'
    ]);
    exit;
}

try {
    $db = Database::getInstance();

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
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
