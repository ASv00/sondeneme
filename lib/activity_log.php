<?php
require_once __DIR__ . '/../database.php';

function logActivity($userId, $action, $table = null, $recordId = null, $oldValues = null, $newValues = null) {
    try {
        $db = Database::getInstance();
        $db->insert('activity_logs', [
            'user_id' => $userId,
            'action' => $action,
            'table_name' => $table,
            'record_id' => $recordId,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);
    } catch (Exception $e) {
        // Hata durumunda loglama işlemini yut
    }
}
?>
