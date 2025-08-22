<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getInstance();

    if ($method === 'GET') {
        $status = $_GET['status'] ?? null;
        $params = [];
        $where = '';

        if ($status) {
            $where = 'WHERE status = :status';
            $params['status'] = $status;
        }

        $sql = "SELECT id, title, content, platform, post_type, status, hashtags, mention_users, scheduled_date, published_date, engagement_stats, media_files, created_by, approved_by, created_at, updated_at FROM social_media_posts {$where} ORDER BY id DESC";
        $posts = $db->fetchAll($sql, $params);

        echo json_encode([
            'success' => true,
            'posts' => $posts
        ]);
        exit;
    }

    if ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id']) || empty($data['status'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID ve durum gereklidir'
            ]);
            exit;
        }

        $updateData = [
            'status' => $data['status']
        ];

        if (!empty($data['scheduled_date'])) {
            $updateData['scheduled_date'] = $data['scheduled_date'];
        }

        if (!empty($data['published_date'])) {
            $updateData['published_date'] = $data['published_date'];
        }

        $updateData['updated_at'] = $data['updated_at'] ?? date('Y-m-d H:i:s');

        $db->update('social_media_posts', $updateData, 'id = :id', ['id' => $data['id']]);

        echo json_encode([
            'success' => true
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
