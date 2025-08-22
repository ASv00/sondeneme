<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$uploadId = $_POST['upload_id'] ?? null;
$fileName = $_POST['file_name'] ?? null;
$totalChunks = isset($_POST['total_chunks']) ? (int)$_POST['total_chunks'] : null;
$previousVersionId = isset($_POST['previous_version_id']) ? (int)$_POST['previous_version_id'] : null;

if (!$uploadId || !$fileName || $totalChunks === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
    exit;
}

$tempDir = UPLOAD_PATH . 'chunks/';
$finalName = $uploadId . '_' . basename($fileName);
$finalPath = UPLOAD_PATH . $finalName;

$fp = fopen($finalPath, 'wb');
for ($i = 0; $i < $totalChunks; $i++) {
    $chunkPath = $tempDir . $uploadId . '_' . $i;
    if (!file_exists($chunkPath)) {
        fclose($fp);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Missing chunk ' . $i]);
        exit;
    }
    fwrite($fp, file_get_contents($chunkPath));
    unlink($chunkPath);
}
fclose($fp);

$previewPath = null;
$colorMode = 'rgb';
$iccPreserved = false;
$extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (in_array($extension, ALLOWED_IMAGE_TYPES)) {
    if (class_exists('Imagick')) {
        try {
            $image = new Imagick($finalPath);
            $colorSpace = $image->getImageColorspace();
            if ($colorSpace == Imagick::COLORSPACE_CMYK) {
                $colorMode = 'cmyk';
            }
            $iccProfiles = $image->getImageProfiles('icc', true);
            $iccPreserved = !empty($iccProfiles);

            $preview = clone $image;
            $preview->setImageColorspace(Imagick::COLORSPACE_SRGB);
            $preview->setImageFormat('jpeg');
            $preview->thumbnailImage(800, 0);
            $previewName = pathinfo($finalName, PATHINFO_FILENAME) . '.jpg';
            $previewPath = UPLOAD_PATH . 'previews/' . $previewName;
            $preview->writeImage($previewPath);
        } catch (Exception $e) {
            // ignore preview errors
        }
    }
}

$db = Database::getInstance();

$fileType = 'document';
if (in_array($extension, ALLOWED_IMAGE_TYPES)) {
    $fileType = 'image';
} elseif (in_array($extension, ALLOWED_VIDEO_TYPES)) {
    $fileType = 'video';
} elseif (in_array($extension, ALLOWED_AUDIO_TYPES)) {
    $fileType = 'audio';
}

$version = 1;
if ($previousVersionId) {
    $prev = $db->fetch('SELECT version FROM media_files WHERE id = :id', ['id' => $previousVersionId]);
    if ($prev) {
        $version = (int)$prev['version'] + 1;
    }
}

$data = [
    'title' => $fileName,
    'file_path' => 'uploads/' . $finalName,
    'preview_path' => $previewPath ? 'uploads/previews/' . basename($previewPath) : null,
    'file_type' => $fileType,
    'mime_type' => mime_content_type($finalPath),
    'file_size' => filesize($finalPath),
    'color_mode' => $colorMode,
    'version' => $version,
    'previous_version_id' => $previousVersionId,
    'uploaded_by' => $_SESSION['user_id'] ?? 1,
    'icc_profile_preserved' => $iccPreserved
];

$newId = $db->insert('media_files', $data);

echo json_encode([
    'success' => true,
    'file_id' => $newId,
    'file_path' => $data['file_path'],
    'preview_path' => $data['preview_path']
]);
