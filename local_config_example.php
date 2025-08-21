
<?php
/**
 * Yerel Geliştirme Konfigürasyonu
 * Bu dosyayı local_config.php olarak kopyalayın ve kendi ayarlarınızla güncelleyin
 */

// Yerel veritabanı ayarları
$_ENV['DB_HOST'] = 'localhost';
$_ENV['DB_NAME'] = 'subu_asto_db';
$_ENV['DB_USER'] = 'subu_user';
$_ENV['DB_PASS'] = 'guvenli_sifre';

// Yerel uygulama ayarları
$_ENV['APP_URL'] = 'http://localhost:8000';

// Debug modunu aktifleştir
$_ENV['DEBUG_MODE'] = 'true';

// XAMPP/WAMP kullanıyorsanız:
// $_ENV['DB_USER'] = 'root';
// $_ENV['DB_PASS'] = '';

// Güvenlik anahtarları (üretim ortamında mutlaka değiştirin!)
$_ENV['JWT_SECRET'] = 'your-unique-secret-key-' . uniqid();
$_ENV['PASSWORD_SALT'] = 'your-unique-salt-' . uniqid();
?>
