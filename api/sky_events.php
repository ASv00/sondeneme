<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

try {
    $db = Database::getInstance();

    // If specific event ID requested, return single event
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $event = $db->fetch(
            "SELECT id, event_name, event_type, event_date, visibility_time, description,
                    observation_difficulty, required_equipment, weather_dependency
             FROM sky_calendar WHERE id = :id",
            ['id' => $id]
        );

        if ($event) {
            echo json_encode(['success' => true, 'event' => $event]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Event not found']);
        }
        exit;
    }

    // List events for given month and year
    $month = isset($_GET['month']) ? (int)$_GET['month'] : (int)date('n');
    $year = isset($_GET['year']) ? (int)$_GET['year'] : (int)date('Y');

    $events = $db->fetchAll(
        "SELECT id, event_name, event_type, event_date, visibility_time
         FROM sky_calendar
         WHERE MONTH(event_date) = :month AND YEAR(event_date) = :year
         ORDER BY event_date",
        ['month' => $month, 'year' => $year]
    );

    echo json_encode(['success' => true, 'events' => $events]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
