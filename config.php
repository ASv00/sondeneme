
<?php
// Veritabanı Konfigürasyonu
define('DB_HOST', 'localhost');
define('DB_NAME', 'subu_asto_cms');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Uygulama Konfigürasyonu
define('APP_NAME', 'SUBÜ ASTO CMS');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost:5000');
define('APP_TIMEZONE', 'Europe/Istanbul');

// Güvenlik Konfigürasyonu
define('JWT_SECRET', 'your-jwt-secret-key-here');
define('PASSWORD_SALT', 'your-password-salt-here');
define('SESSION_LIFETIME', 3600); // 1 saat

// Dosya Yükleme Konfigürasyonu
define('UPLOAD_MAX_SIZE', 50 * 1024 * 1024); // 50MB
define('UPLOAD_PATH', 'uploads/');
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
define('ALLOWED_VIDEO_TYPES', ['mp4', 'avi', 'mov', 'wmv']);
define('ALLOWED_AUDIO_TYPES', ['mp3', 'wav', 'ogg']);
define('ALLOWED_DOCUMENT_TYPES', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']);

// E-posta Konfigürasyonu
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_FROM_EMAIL', 'noreply@subuasto.edu.tr');
define('SMTP_FROM_NAME', 'SUBÜ ASTO');

// Dil Ayarları
define('DEFAULT_LANGUAGE', 'tr');
define('SUPPORTED_LANGUAGES', ['tr', 'en']);

// Tema Ayarları
define('DEFAULT_THEME', 'light');
define('SUPPORTED_THEMES', ['light', 'dark']);

// Cache Ayarları
define('CACHE_ENABLED', true);
define('CACHE_LIFETIME', 3600);

// Debug Ayarları
define('DEBUG_MODE', true);
define('LOG_ERRORS', true);
define('LOG_PATH', 'logs/');

// Varsayılan Kullanıcı Rolleri
define('USER_ROLES', [
    'baskan' => 'Başkan',
    'mentor' => 'Mentor',
    'birim_yoneticisi' => 'Birim Yöneticisi',
    'uye' => 'Üye',
    'misafir' => 'Misafir'
]);

// Birimler
define('DEPARTMENTS', [
    'sosyal_medya' => 'Sosyal Medya',
    'organizasyon' => 'Organizasyon',
    'sponsorluk' => 'Sponsorluk',
    'lojistik_finans' => 'Lojistik & Finans',
    'egitim' => 'Eğitim',
    'denetim' => 'Denetim',
    'sekreter' => 'Sekreter',
    'akademik' => 'Akademik'
]);

// Etkinlik Türleri
define('EVENT_TYPES', [
    'gozlem' => 'Gözlem',
    'konferans' => 'Konferans',
    'atolye' => 'Atölye',
    'gezi' => 'Gezi',
    'yarışma' => 'Yarışma',
    'sergi' => 'Sergi'
]);

// Sosyal Medya Platformları
define('SOCIAL_PLATFORMS', [
    'instagram' => 'Instagram',
    'twitter' => 'Twitter',
    'facebook' => 'Facebook',
    'youtube' => 'YouTube',
    'tiktok' => 'TikTok',
    'linkedin' => 'LinkedIn'
]);

// İçerik Durumları
define('CONTENT_STATUS', [
    'taslak' => 'Taslak',
    'inceleme' => 'İncelemede',
    'onaylandi' => 'Onaylandı',
    'yayinlandi' => 'Yayınlandı',
    'arsivlendi' => 'Arşivlendi'
]);

// Proje Durumları
define('PROJECT_STATUS', [
    'planlama' => 'Planlama',
    'devam_ediyor' => 'Devam Ediyor',
    'beklemede' => 'Beklemede',
    'tamamlandi' => 'Tamamlandı',
    'iptal_edildi' => 'İptal Edildi'
]);

// Görev Durumları
define('TASK_STATUS', [
    'yapilacak' => 'Yapılacak',
    'devam_ediyor' => 'Devam Ediyor',
    'tamamlandi' => 'Tamamlandı'
]);

// API Anahtarları (Gerekirse)
define('GOOGLE_API_KEY', 'your-google-api-key');
define('YOUTUBE_API_KEY', 'your-youtube-api-key');

// Hata Kodu Tanımları
define('ERROR_CODES', [
    'AUTH_FAILED' => 1001,
    'INVALID_INPUT' => 1002,
    'PERMISSION_DENIED' => 1003,
    'FILE_UPLOAD_FAILED' => 1004,
    'DATABASE_ERROR' => 1005,
    'EMAIL_SEND_FAILED' => 1006
]);

// Başarı Mesajları
define('SUCCESS_MESSAGES', [
    'USER_CREATED' => 'Kullanıcı başarıyla oluşturuldu',
    'LOGIN_SUCCESS' => 'Giriş başarılı',
    'FILE_UPLOADED' => 'Dosya başarıyla yüklendi',
    'DATA_SAVED' => 'Veriler başarıyla kaydedildi',
    'DATA_UPDATED' => 'Veriler başarıyla güncellendi',
    'DATA_DELETED' => 'Veriler başarıyla silindi'
]);

// Timezone ayarı
date_default_timezone_set(APP_TIMEZONE);

// Error reporting ayarları
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Session başlatma
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
