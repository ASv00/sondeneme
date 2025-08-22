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
                $log = $db->fetch(
                    "SELECT cl.*, u.full_name AS member_name, cb.full_name AS created_by_name FROM contact_logs cl " .
                    "LEFT JOIN users u ON cl.member_id = u.id " .
                    "LEFT JOIN users cb ON cl.created_by = cb.id WHERE cl.id = :id",
                    ['id' => (int)$_GET['id']]
                );
                echo json_encode(['success' => true, 'log' => $log]);
            } else {
                $params = [];
                $where = [];
                if (isset($_GET['member'])) {
                    $where[] = 'cl.member_id = :member';
                    $params['member'] = (int)$_GET['member'];
                }
                $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
                $logs = $db->fetchAll(
                    "SELECT cl.*, u.full_name AS member_name, cb.full_name AS created_by_name FROM contact_logs cl " .
                    "LEFT JOIN users u ON cl.member_id = u.id " .
                    "LEFT JOIN users cb ON cl.created_by = cb.id {$whereSql} ORDER BY cl.contact_date DESC",
                    $params
                );
                echo json_encode(['success' => true, 'logs' => $logs]);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['contact_type']) || !isset($data['contact_date'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid data']);
                break;
            }
            $insertData = [
                'member_id' => $data['member_id'] ?? null,
                'company_name' => $data['company_name'] ?? null,
                'contact_type' => $data['contact_type'],
                'subject' => $data['subject'] ?? null,
                'message' => $data['message'] ?? null,
                'contact_date' => $data['contact_date'],
                'response_status' => $data['response_status'] ?? 'bekliyor',
                'priority' => $data['priority'] ?? 'orta',
                'follow_up_date' => $data['follow_up_date'] ?? null,
                'notes' => $data['notes'] ?? null,
                'attachments' => isset($data['attachments']) ? json_encode($data['attachments']) : null,
                'created_by' => $data['created_by'] ?? 1
            ];
            $id = $db->insert('contact_logs', $insertData);
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
            $fields = ['member_id','company_name','contact_type','subject','message','contact_date','response_status','priority','follow_up_date','notes','attachments','created_by'];
            $update = [];
            foreach ($fields as $field) {
                if (isset($data[$field])) {
                    $update[$field] = ($field === 'attachments') ? json_encode($data[$field]) : $data[$field];
                }
            }
            if (empty($update)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'No data to update']);
                break;
            }
            $db->update('contact_logs', $update, 'id = :id', ['id' => $id]);
            echo json_encode(['success' => true]);
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'ID required']);
                break;
            }
            $db->delete('contact_logs', 'id = :id', ['id' => (int)$id]);
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
