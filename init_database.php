
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
