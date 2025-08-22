<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'CSV file is required']);
    exit;
}

$uploaded = $_FILES['file']['tmp_name'];
if (!is_uploaded_file($uploaded)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid upload']);
    exit;
}

$db = Database::getInstance();
$handle = fopen($uploaded, 'r');
if (!$handle) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Cannot open file']);
    exit;
}

$lineNumber = 0;
$imported = 0;
$errors = [];

// Optional: handle header row
$header = fgetcsv($handle);
$lineNumber++;
$hasHeader = false;
if ($header && preg_grep('/email/i', $header)) {
    $hasHeader = true;
} else {
    // rewind if first row is data
    rewind($handle);
    $lineNumber = 0;
}

while (($row = fgetcsv($handle)) !== false) {
    $lineNumber++;
    // Expecting: id, full_name, email, role, department
    $id = isset($row[0]) ? trim($row[0]) : null;
    $fullName = isset($row[1]) ? trim($row[1]) : null;
    $email = isset($row[2]) ? trim($row[2]) : null;
    $role = isset($row[3]) ? trim($row[3]) : 'uye';
    $department = isset($row[4]) ? trim($row[4]) : null;

    if (empty($email) || empty($fullName)) {
        $errors[] = ['line' => $lineNumber, 'error' => 'Missing required fields'];
        continue;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = ['line' => $lineNumber, 'error' => 'Invalid email'];
        continue;
    }

    try {
        if ($id) {
            $exists = $db->fetch('SELECT id FROM users WHERE id = :id', ['id' => $id]);
            if ($exists) {
                $errors[] = ['line' => $lineNumber, 'error' => 'Duplicate ID'];
                continue;
            }
        }

        $exists = $db->fetch('SELECT id FROM users WHERE email = :email', ['email' => $email]);
        if ($exists) {
            $errors[] = ['line' => $lineNumber, 'error' => 'Duplicate email'];
            continue;
        }

        $data = [
            'full_name' => $fullName,
            'email' => $email,
            'role' => $role ?: 'uye',
            'department' => $department,
            'password_hash' => password_hash(bin2hex(random_bytes(4)), PASSWORD_DEFAULT)
        ];
        if ($id) {
            $data['id'] = (int)$id;
        }

        $db->insert('users', $data);
        $imported++;
    } catch (Exception $e) {
        $errors[] = ['line' => $lineNumber, 'error' => $e->getMessage()];
    }
}

fclose($handle);

echo json_encode([
    'success' => empty($errors),
    'imported' => $imported,
    'errors' => $errors
]);
