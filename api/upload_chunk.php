<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$uploadId = $_POST['upload_id'] ?? null;
$chunkIndex = isset($_POST['chunk_index']) ? (int)$_POST['chunk_index'] : null;
$chunk = $_FILES['chunk'] ?? null;

if (!$uploadId || $chunkIndex === null || !$chunk) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
    exit;
}

$tempDir = UPLOAD_PATH . 'chunks/';
if (!is_dir($tempDir)) {
    mkdir($tempDir, 0755, true);
}

$chunkPath = $tempDir . $uploadId . '_' . $chunkIndex;

if (!move_uploaded_file($chunk['tmp_name'], $chunkPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Chunk upload failed']);
    exit;
}

echo json_encode(['success' => true]);
