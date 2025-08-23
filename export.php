<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

$db = Database::getInstance();

// handle export request
if (!empty($_GET['tables'])) {
    $tables = $_GET['tables'];
    if (!is_array($tables)) {
        $tables = array_map('trim', explode(',', $tables));
    }
    $format = $_GET['format'] ?? 'csv';

    if ($format === 'csv' && count($tables) === 1) {
        $table = $tables[0];
        $csv = generateCsv($db, $table);
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $table . '.csv"');
        echo $csv;
        exit;
    }

    // create zip with csv files
    $zip = new ZipArchive();
    $tmpFile = tempnam(sys_get_temp_dir(), 'exp');
    if ($zip->open($tmpFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        http_response_code(500);
        echo 'Zip oluşturulamadı';
        exit;
    }

    foreach ($tables as $table) {
        $csv = generateCsv($db, $table);
        $zip->addFromString($table . '.csv', $csv);
    }
    $zip->close();

    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="export.zip"');
    readfile($tmpFile);
    unlink($tmpFile);
    exit;
}

$tables = $db->fetchAll('SHOW TABLES');
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Veri Dışa Aktar</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Veri Dışa Aktar</h2>
    <form method="get" action="export.php">
        <div class="table-selection">
            <?php foreach ($tables as $row): $tableName = array_values($row)[0]; ?>
                <label><input type="checkbox" name="tables[]" value="<?= $tableName ?>"> <?= htmlspecialchars($tableName) ?></label>
            <?php endforeach; ?>
        </div>
        <div class="export-options">
            <label><input type="radio" name="format" value="csv" checked> CSV</label>
            <label><input type="radio" name="format" value="zip"> ZIP</label>
        </div>
        <button type="submit" class="btn btn-primary">Dışa Aktar</button>
    </form>
</body>
</html>
<?php
function generateCsv($db, $table) {
    $rows = $db->fetchAll("SELECT * FROM `{$table}`");
    if (!$rows) return '';
    $fh = fopen('php://temp', 'r+');
    fputcsv($fh, array_keys($rows[0]));
    foreach ($rows as $row) {
        fputcsv($fh, $row);
    }
    rewind($fh);
    return stream_get_contents($fh);
}
?>
