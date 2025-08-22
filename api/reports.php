<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

try {
    $db = Database::getInstance();

    $type = $_GET['type'] ?? 'all';
    $dateFrom = $_GET['date_from'] ?? null;
    $dateTo = $_GET['date_to'] ?? null;

    $data = [];

    if ($type === 'all' || $type === 'events') {
        $data['events'] = getEventsReport($db, $dateFrom, $dateTo);
    }
    if ($type === 'all' || $type === 'budget') {
        $data['budget'] = getBudgetReport($db, $dateFrom, $dateTo);
    }
    if ($type === 'all' || $type === 'social') {
        $data['social'] = getSocialReport($db, $dateFrom, $dateTo);
    }
    if ($type === 'all' || $type === 'membership') {
        $data['membership'] = getMembershipReport($db, $dateFrom, $dateTo);
    }

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

function getEventsReport($db, $from = null, $to = null) {
    $where = [];
    $params = [];
    if ($from) {
        $where[] = 'e.start_date >= :from';
        $params['from'] = $from . ' 00:00:00';
    }
    if ($to) {
        $where[] = 'e.start_date <= :to';
        $params['to'] = $to . ' 23:59:59';
    }
    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "SELECT e.id, e.title, e.start_date, e.event_type, e.location, e.budget,
                   COUNT(ep.id) AS participants_count
            FROM events e
            LEFT JOIN event_participants ep ON ep.event_id = e.id
            $whereSql
            GROUP BY e.id
            ORDER BY e.start_date ASC";

    $events = $db->fetchAll($sql, $params);
    $totalParticipants = array_sum(array_column($events, 'participants_count'));
    $avgParticipants = count($events) ? round($totalParticipants / count($events)) : 0;

    return [
        'events' => $events,
        'total_events' => count($events),
        'total_participants' => (int)$totalParticipants,
        'avg_participants' => (int)$avgParticipants
    ];
}

function getBudgetReport($db, $from = null, $to = null) {
    $where = [];
    $params = [];
    if ($from) {
        $where[] = 'created_at >= :from';
        $params['from'] = $from . ' 00:00:00';
    }
    if ($to) {
        $where[] = 'created_at <= :to';
        $params['to'] = $to . ' 23:59:59';
    }
    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "SELECT amount, transaction_type, category FROM budget_logs $whereSql";
    $logs = $db->fetchAll($sql, $params);

    $totalIncome = 0;
    $totalExpense = 0;
    $categoryStats = [];

    foreach ($logs as &$log) {
        $log['amount'] = (float)$log['amount'];
        if ($log['transaction_type'] === 'gelir') {
            $totalIncome += $log['amount'];
        } else {
            $totalExpense += $log['amount'];
            $cat = $log['category'] ?: 'Diğer';
            $categoryStats[$cat] = ($categoryStats[$cat] ?? 0) + $log['amount'];
        }
    }

    return [
        'total_income' => $totalIncome,
        'total_expense' => $totalExpense,
        'category_stats' => $categoryStats,
        'logs' => $logs
    ];
}

function getSocialReport($db, $from = null, $to = null) {
    $where = ["status = 'yayinlandi'"];
    $params = [];
    if ($from) {
        $where[] = 'published_date >= :from';
        $params['from'] = $from . ' 00:00:00';
    }
    if ($to) {
        $where[] = 'published_date <= :to';
        $params['to'] = $to . ' 23:59:59';
    }
    $whereSql = 'WHERE ' . implode(' AND ', $where);

    $sql = "SELECT platform, engagement_stats FROM social_media_posts $whereSql";
    $posts = $db->fetchAll($sql, $params);

    $platformStats = [];
    $totalEngagement = 0;

    foreach ($posts as $post) {
        $platform = $post['platform'];
        $eng = json_decode($post['engagement_stats'] ?? '{}', true);
        $likes = $eng['likes'] ?? 0;
        $comments = $eng['comments'] ?? 0;
        $shares = $eng['shares'] ?? 0;

        if (!isset($platformStats[$platform])) {
            $platformStats[$platform] = ['likes' => 0, 'comments' => 0, 'shares' => 0];
        }
        $platformStats[$platform]['likes'] += $likes;
        $platformStats[$platform]['comments'] += $comments;
        $platformStats[$platform]['shares'] += $shares;

        $totalEngagement += $likes + $comments + $shares;
    }

    return [
        'published_posts' => count($posts),
        'total_engagement' => $totalEngagement,
        'platform_stats' => $platformStats
    ];
}

function getMembershipReport($db, $from = null, $to = null) {
    $totalMembers = $db->fetch("SELECT COUNT(*) AS cnt FROM users WHERE is_active = 1")['cnt'] ?? 0;

    $where = ['is_active = 1'];
    $params = [];
    if ($from) {
        $where[] = 'created_at >= :from';
        $params['from'] = $from . ' 00:00:00';
    }
    if ($to) {
        $where[] = 'created_at <= :to';
        $params['to'] = $to . ' 23:59:59';
    }
    $whereSql = 'WHERE ' . implode(' AND ', $where);

    $sql = "SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, COUNT(*) AS cnt
            FROM users $whereSql
            GROUP BY ym
            ORDER BY ym";
    $rows = $db->fetchAll($sql, $params);

    $monthlyJoins = [];
    $newCount = 0;
    foreach ($rows as $row) {
        $monthlyJoins[$row['ym']] = (int)$row['cnt'];
        $newCount += (int)$row['cnt'];
    }

    return [
        'total_members' => (int)$totalMembers,
        'new_members_count' => $newCount,
        'monthly_joins' => $monthlyJoins
    ];
}
