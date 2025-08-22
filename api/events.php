<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

try {
    $db = Database::getInstance();

    $filters = [
        'type' => $_GET['type'] ?? null,
        'month' => $_GET['month'] ?? null,
        'sponsor' => $_GET['sponsor'] ?? null,
        'search' => $_GET['search'] ?? null
    ];

    function fetchEvents($db, $filters) {
        $where = [];
        $params = [];

        if (!empty($filters['type'])) {
            $where[] = 'event_type = :type';
            $params['type'] = $filters['type'];
        }
        if (!empty($filters['month'])) {
            $where[] = 'MONTH(start_date) = :month';
            $params['month'] = (int)$filters['month'];
        }
        if (!empty($filters['sponsor'])) {
            $where[] = 'sponsor_company = :sponsor';
            $params['sponsor'] = $filters['sponsor'];
        }
        if (!empty($filters['search'])) {
            $where[] = 'title LIKE :search';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

        $sql = "SELECT id, title, DATE(start_date) AS date, location, sponsor_company AS sponsor, event_type AS type, start_date, end_date FROM events {$whereSql} ORDER BY start_date ASC";

        return $db->fetchAll($sql, $params);
    }

    if (isset($_GET['export']) && $_GET['export'] === 'ics') {
        $events = fetchEvents($db, $filters);

        header('Content-Type: text/calendar; charset=utf-8');
        header('Content-Disposition: attachment; filename="subu-asto-etkinlikler.ics"');

        echo generateICS($events);
        exit;
    }

    $events = fetchEvents($db, $filters);
    $sponsors = array_values(array_unique(array_filter(array_column($events, 'sponsor'))));

    echo json_encode([
        'success' => true,
        'events' => $events,
        'sponsors' => $sponsors
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

function generateICS($events) {
    $eol = "\r\n";
    $ics = "BEGIN:VCALENDAR{$eol}VERSION:2.0{$eol}PRODID:-//SUBU ASTO//Events//TR{$eol}";

    foreach ($events as $event) {
        $start = gmdate('Ymd\THis\Z', strtotime($event['start_date']));
        $end = !empty($event['end_date']) ? gmdate('Ymd\THis\Z', strtotime($event['end_date'])) : null;
        $summary = escapeICS($event['title']);
        $location = escapeICS($event['location'] ?? '');

        $ics .= "BEGIN:VEVENT{$eol}";
        $ics .= "UID:event-{$event['id']}@subuasto.edu.tr{$eol}";
        $ics .= "DTSTAMP:" . gmdate('Ymd\THis\Z') . "{$eol}";
        $ics .= "DTSTART:{$start}{$eol}";
        if ($end) {
            $ics .= "DTEND:{$end}{$eol}";
        }
        if ($location !== '') {
            $ics .= "LOCATION:{$location}{$eol}";
        }
        $ics .= "SUMMARY:{$summary}{$eol}";
        $ics .= "END:VEVENT{$eol}";
    }

    $ics .= "END:VCALENDAR{$eol}";
    return $ics;
}

function escapeICS($string) {
    $string = str_replace("\n", "\\n", $string);
    return preg_replace('/([,;])/','\\\\$1', $string);
}
