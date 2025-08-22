<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getInstance();

    if ($method === 'GET') {
        $category = $_GET['category'] ?? null;
        $status = $_GET['status'] ?? null;
        $role = $_GET['role'] ?? null;

        $where = [];
        $params = [];

        if ($category) {
            $where[] = 'document_type = :category';
            $params['category'] = $category;
        }

        if ($status) {
            $statusFields = ['bekliyor', 'onay_bekliyor', 'onaylandi', 'reddedildi'];
            if (in_array($status, $statusFields)) {
                $where[] = 'approval_status = :status';
            } else {
                $where[] = 'status = :status';
            }
            $params['status'] = $status;
        }

        if ($role !== 'baskan') {
            $where[] = "approval_status = 'onaylandi'";
        }

        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $sql = "SELECT d.id, d.title, d.document_type, d.file_path, d.approval_status, d.status, d.uploaded_by, d.approved_by, " .
               "d.approved_at, d.rejection_reason, d.access_level, u.full_name AS uploader_name, a.full_name AS approver_name " .
               "FROM documents d " .
               "LEFT JOIN users u ON d.uploaded_by = u.id " .
               "LEFT JOIN users a ON d.approved_by = a.id {$whereSql} ORDER BY d.created_at DESC";

        $documents = $db->fetchAll($sql, $params);

        echo json_encode([
            'success' => true,
            'data' => $documents,
            'user_role' => $role,
            'can_approve_any' => ($role === 'baskan')
        ]);
        exit;
    }

    if ($method === 'POST') {
        $action = $_POST['action'] ?? '';

        if ($action === 'approve') {
            $id = $_POST['document_id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Belge ID gerekli']);
                exit;
            }

            $db->update('documents', [
                'status' => 'onaylandi',
                'approval_status' => 'onaylandi',
                'approved_by' => 1,
                'approved_at' => date('Y-m-d H:i:s'),
                'rejection_reason' => null
            ], 'id = :id', ['id' => $id]);

            echo json_encode(['success' => true]);
            exit;
        }

        if ($action === 'reject') {
            $id = $_POST['document_id'] ?? null;
            $reason = $_POST['reason'] ?? '';
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Belge ID gerekli']);
                exit;
            }

            $db->update('documents', [
                'status' => 'reddedildi',
                'approval_status' => 'reddedildi',
                'rejection_reason' => $reason,
                'approved_by' => 1,
                'approved_at' => null
            ], 'id = :id', ['id' => $id]);

            echo json_encode(['success' => true]);
            exit;
        }

        if ($action === 'submit_for_approval') {
            $id = $_POST['document_id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Belge ID gerekli']);
                exit;
            }

            $db->update('documents', [
                'status' => 'onay_bekliyor',
                'approval_status' => 'bekliyor'
            ], 'id = :id', ['id' => $id]);

            echo json_encode(['success' => true]);
            exit;
        }

        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Geçersiz işlem']);
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
