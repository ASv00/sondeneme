<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

try {
    $db = Database::getInstance();

    $where = [];
    $params = [];

    if (!empty($_GET['category'])) {
        $where[] = 'p.category = :category';
        $params['category'] = $_GET['category'];
    }
    if (!empty($_GET['status'])) {
        $where[] = 'p.status = :status';
        $params['status'] = $_GET['status'];
    }
    if (!empty($_GET['date_from'])) {
        $where[] = 'p.published_at >= :date_from';
        $params['date_from'] = $_GET['date_from'];
    }
    if (!empty($_GET['date_to'])) {
        $where[] = 'p.published_at <= :date_to';
        $params['date_to'] = $_GET['date_to'];
    }
    if (!empty($_GET['search'])) {
        $where[] = '(p.title LIKE :search OR p.excerpt LIKE :search)';
        $params['search'] = '%' . $_GET['search'] . '%';
    }

    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "SELECT p.id, p.title, p.category, p.status, p.published_at, p.view_count, p.excerpt, u.full_name AS author_name
            FROM blog_posts p
            LEFT JOIN users u ON p.author_id = u.id
            {$whereSql}
            ORDER BY p.published_at DESC, p.created_at DESC";

    $posts = $db->fetchAll($sql, $params);

    // Total posts count without filters
    $totalRow = $db->fetch("SELECT COUNT(*) as total FROM blog_posts");
    $total = $totalRow ? (int)$totalRow['total'] : count($posts);

    echo json_encode([
        'success' => true,
        'posts' => $posts,
        'total' => $total
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
