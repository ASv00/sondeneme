<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

$method = $_SERVER['REQUEST_METHOD'];

// ICS generation for events or social media posts
if (isset($_GET['ics']) && isset($_GET['id'])) {
    $type = $_GET['ics'];
    $id = (int)$_GET['id'];
    $db = Database::getInstance();

    if ($type === 'event') {
        $event = $db->fetch("SELECT id, title, description, start_date, end_date FROM events WHERE id = :id", ['id' => $id]);
        if ($event) {
            $summary = $event['title'];
            $description = $event['description'] ?? '';
            $start = $event['start_date'];
            $end = $event['end_date'] ?? $start;
            $ics = generateIcs($summary, $start, $end, $description, 'event-' . $event['id']);
            $filename = 'event-' . $event['id'] . '.ics';
            header('Content-Type: text/calendar; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            echo $ics;
            exit;
        }
    } elseif ($type === 'social') {
        $post = $db->fetch("SELECT id, title, content, scheduled_date FROM social_media_posts WHERE id = :id", ['id' => $id]);
        if ($post && $post['scheduled_date']) {
            $summary = $post['title'];
            $description = $post['content'] ?? '';
            $start = $post['scheduled_date'];
            $ics = generateIcs($summary, $start, null, $description, 'social-' . $post['id']);
            $filename = 'social-' . $post['id'] . '.ics';
            header('Content-Type: text/calendar; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            echo $ics;
            exit;
        }
    }

    http_response_code(404);
    echo 'Not found';
    exit;
}

header('Content-Type: application/json');

try {
    $db = Database::getInstance();

    switch ($method) {
        case 'GET':
            $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
            if ($userId <= 0) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'user_id required']);
                break;
            }

            $now = date('Y-m-d H:i:s');

            // Create task reminders
            $tasks = $db->fetchAll(
                "SELECT id, title FROM tasks WHERE assigned_to = :uid AND reminder_at IS NOT NULL AND reminder_at <= :now",
                ['uid' => $userId, 'now' => $now]
            );
            foreach ($tasks as $task) {
                $exists = $db->fetch(
                    "SELECT id FROM notifications WHERE related_table = 'tasks' AND related_id = :id",
                    ['id' => $task['id']]
                );
                if (!$exists) {
                    $db->insert('notifications', [
                        'user_id' => $userId,
                        'title' => 'Görev Hatırlatması',
                        'message' => $task['title'],
                        'type' => 'warning',
                        'related_table' => 'tasks',
                        'related_id' => $task['id']
                    ]);
                }
            }

            // Create event reminders (notify creator)
            $events = $db->fetchAll(
                "SELECT id, title FROM events WHERE created_by = :uid AND reminder_at IS NOT NULL AND reminder_at <= :now",
                ['uid' => $userId, 'now' => $now]
            );
            foreach ($events as $event) {
                $exists = $db->fetch(
                    "SELECT id FROM notifications WHERE related_table = 'events' AND related_id = :id",
                    ['id' => $event['id']]
                );
                if (!$exists) {
                    $db->insert('notifications', [
                        'user_id' => $userId,
                        'title' => 'Etkinlik Hatırlatması',
                        'message' => $event['title'],
                        'type' => 'info',
                        'related_table' => 'events',
                        'related_id' => $event['id'],
                        'action_url' => '/api/notifications.php?ics=event&id=' . $event['id']
                    ]);
                }
            }

            // Create social media post reminders (notify creator)
            $posts = $db->fetchAll(
                "SELECT id, title FROM social_media_posts WHERE created_by = :uid AND scheduled_date IS NOT NULL AND scheduled_date <= :now",
                ['uid' => $userId, 'now' => $now]
            );
            foreach ($posts as $post) {
                $exists = $db->fetch(
                    "SELECT id FROM notifications WHERE related_table = 'social_media_posts' AND related_id = :id",
                    ['id' => $post['id']]
                );
                if (!$exists) {
                    $db->insert('notifications', [
                        'user_id' => $userId,
                        'title' => 'Sosyal Medya Hatırlatması',
                        'message' => $post['title'],
                        'type' => 'info',
                        'related_table' => 'social_media_posts',
                        'related_id' => $post['id'],
                        'action_url' => '/api/notifications.php?ics=social&id=' . $post['id']
                    ]);
                }
            }

            $notifications = $db->fetchAll(
                "SELECT id, title, message, type, action_url, created_at FROM notifications WHERE user_id = :uid AND is_read = 0 ORDER BY created_at DESC",
                ['uid' => $userId]
            );
            echo json_encode(['success' => true, 'notifications' => $notifications]);
            break;
        case 'PATCH':
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID required']);
                break;
            }
            $db->update('notifications', ['is_read' => 1, 'read_at' => date('Y-m-d H:i:s')], 'id = :id', ['id' => (int)$data['id']]);
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

function generateIcs($summary, $start, $end = null, $description = '', $uid = 'reminder') {
    $eol = "\r\n";
    $ics = "BEGIN:VCALENDAR{$eol}VERSION:2.0{$eol}PRODID:-//SUBU ASTO//Reminders//TR{$eol}";
    $ics .= "BEGIN:VEVENT{$eol}";
    $ics .= "UID:{$uid}@subuasto.edu.tr{$eol}";
    $ics .= "DTSTAMP:" . gmdate('Ymd\THis\Z') . "{$eol}";
    $ics .= "DTSTART:" . gmdate('Ymd\THis\Z', strtotime($start)) . "{$eol}";
    if ($end) {
        $ics .= "DTEND:" . gmdate('Ymd\THis\Z', strtotime($end)) . "{$eol}";
    }
    $ics .= "SUMMARY:" . addslashes($summary) . "{$eol}";
    if ($description) {
        $ics .= "DESCRIPTION:" . addslashes($description) . "{$eol}";
    }
    $ics .= "END:VEVENT{$eol}END:VCALENDAR{$eol}";
    return $ics;
}
