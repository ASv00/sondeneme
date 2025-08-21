
<?php
require_once 'database.php';

echo "<h2>SUBÜ ASTO CMS - Veritabanı Kurulumu</h2>";

try {
    // Veritabanı tablolarını oluştur
    createDatabaseTables();
    
    // Varsayılan admin kullanıcı oluştur
    createDefaultAdmin();
    
    // Demo davet kodu oluştur
    createDemoInviteCode();
    
    echo "<br><strong>Kurulum tamamlandı!</strong><br>";
    echo "Sisteme giriş yapmak için: <a href='index.html'>Buraya tıklayın</a>";
    
} catch (Exception $e) {
    echo "<br><strong>Kurulum hatası:</strong> " . $e->getMessage();
}
?>
<?php
require_once 'config.php';
require_once 'database.php';

echo "<h2>SUBÜ ASTO CMS - Veritabanı Kurulumu</h2>";

try {
    // Create database tables
    createDatabaseTables();
    
    // Create default admin user
    createDefaultAdmin();
    
    // Create demo invite code
    createDemoInviteCode();
    
    // Insert sample data
    insertSampleData();
    
    echo "<h3>✅ Kurulum tamamlandı!</h3>";
    echo "<p>Admin kullanıcısı: admin@subuasto.edu.tr / admin123</p>";
    echo "<p>Demo davet kodu: SUBU2024</p>";
    
} catch (Exception $e) {
    echo "<h3>❌ Kurulum sırasında hata:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
}

function insertSampleData() {
    $db = Database::getInstance();
    
    // Sample sky events
    $skyEvents = [
        [
            'event_name' => 'Geminids Meteor Yağmuru',
            'event_type' => 'meteor_yagmuru',
            'event_date' => '2024-12-13',
            'visibility_time' => '22:00:00',
            'description' => 'Yılın en iyi meteor yağmurlarından biri',
            'observation_difficulty' => 'kolay',
            'weather_dependency' => 1,
            'created_by' => 1
        ],
        [
            'event_name' => 'Kış Gündönümü',
            'event_type' => 'diger',
            'event_date' => '2024-12-21',
            'visibility_time' => '00:00:00',
            'description' => 'Yılın en uzun gecesi',
            'observation_difficulty' => 'kolay',
            'weather_dependency' => 0,
            'created_by' => 1
        ]
    ];
    
    foreach ($skyEvents as $event) {
        try {
            $db->insert('sky_calendar', $event);
        } catch (Exception $e) {
            // Event already exists, skip
        }
    }
    
    // Sample blog categories
    $categories = [
        ['name' => 'Rehber', 'slug' => 'rehber'],
        ['name' => 'Eğitim', 'slug' => 'egitim'],
        ['name' => 'Etkinlik', 'slug' => 'etkinlik'],
        ['name' => 'Teknoloji', 'slug' => 'teknoloji'],
        ['name' => 'Araştırma', 'slug' => 'arastirma'],
        ['name' => 'Gözlem', 'slug' => 'gozlem']
    ];
    
    foreach ($categories as $category) {
        try {
            $db->insert('blog_categories', $category);
        } catch (Exception $e) {
            // Category already exists, skip
        }
    }
    
    // Sample departments
    $departments = [
        ['name' => 'Yönetim', 'description' => 'Topluluk yönetimi ve karar alma', 'manager_id' => 1],
        ['name' => 'Sosyal Medya', 'description' => 'İçerik üretimi ve sosyal medya yönetimi', 'manager_id' => 1],
        ['name' => 'Organizasyon', 'description' => 'Etkinlik planlama ve organizasyon', 'manager_id' => 1],
        ['name' => 'Teknik', 'description' => 'Teknik destek ve altyapı', 'manager_id' => 1],
        ['name' => 'Eğitim', 'description' => 'Eğitim içerikleri ve atölyeler', 'manager_id' => 1]
    ];
    
    foreach ($departments as $department) {
        try {
            $db->insert('departments', $department);
        } catch (Exception $e) {
            // Department already exists, skip
        }
    }
    
    echo "Örnek veriler eklendi.<br>";
}
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SUBÜ ASTO CMS - Kurulum</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h2 { color: #2563eb; }
        h3 { margin-top: 30px; }
        p { margin: 10px 0; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
    </style>
</head>
<body>
</body>
</html>
