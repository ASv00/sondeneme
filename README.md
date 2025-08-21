
# SUBÜ ASTO Yönetim Sistemi

Bu proje, Sakarya Büyükşehir Belediyesi Astronomi Topluluğu için geliştirilmiş kapsamlı bir yönetim sistemidir. PHP 8, MySQL 8 ve vanilla HTML/CSS/JavaScript ile geliştirilmiştir.

## Özellikler

- Kullanıcı yönetimi ve rol bazlı yetkilendirme
- Etkinlik planlaması ve takibi
- Blog ve içerik yönetimi
- Sosyal medya paylaşım yönetimi
- Belge arşivi ve kütüphane sistemi
- Proje takibi ve görev yönetimi
- Gök takvimi ve astronomi etkinlikleri
- Medya arşivi ve dosya yönetimi

## Yerel Kurulum

### Gereksinimler

- **PHP 8.0+** (önerilen: PHP 8.1 veya üzeri)
- **MySQL 8.0+**
- **Web tarayıcısı** (Chrome, Firefox, Safari, Edge)

### 1. PHP Kurulumu

#### Windows:
- [PHP resmi sitesinden](https://www.php.net/downloads) PHP 8.1+ indirin
- XAMPP veya WAMP kullanabilirsiniz (içinde PHP ve MySQL birlikte gelir)

#### macOS:
```bash
brew install php mysql
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install php8.1 php8.1-mysql php8.1-pdo mysql-server
```

### 2. MySQL Kurulumu

#### Windows/macOS:
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) indirin ve kurun

#### Ubuntu/Debian:
```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 3. Proje Kurulumu

1. **Projeyi indirin:**
```bash
git clone [proje-url]
cd subu-asto-cms
```

2. **MySQL veritabanı oluşturun:**
```sql
CREATE DATABASE subu_asto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'subu_user'@'localhost' IDENTIFIED BY 'guvenli_sifre';
GRANT ALL PRIVILEGES ON subu_asto_db.* TO 'subu_user'@'localhost';
FLUSH PRIVILEGES;
```

3. **Veritabanı ayarlarını yapılandırın:**

`config.php` dosyasında veritabanı bağlantı bilgilerini güncelleyin:

```php
// Veritabanı Konfigürasyonu
define('DB_HOST', 'localhost');
define('DB_NAME', 'subu_asto_db');
define('DB_USER', 'subu_user');
define('DB_PASS', 'guvenli_sifre');
define('DB_CHARSET', 'utf8mb4');
```

4. **Güvenlik ayarlarını yapın:**

`config.php` dosyasında güvenlik anahtarlarını değiştirin:

```php
// Güvenlik Konfigürasyonu
define('JWT_SECRET', 'your-unique-secret-key-here');
define('PASSWORD_SALT', 'your-unique-password-salt-here');
```

### 4. Projeyi Çalıştırma

1. **PHP geliştirme sunucusunu başlatın:**
```bash
php -S localhost:8000
```

2. **Tarayıcınızda açın:**
```
http://localhost:8000
```

3. **Veritabanını başlatın:**

İlk çalıştırmada şu adresi ziyaret edin:
```
http://localhost:8000/init_database.php
```

Bu işlem:
- Gerekli tabloları oluşturur
- Varsayılan admin kullanıcısı oluşturur (admin@subuasto.edu.tr / admin123)
- Demo davet kodu oluşturur (SUBU2024)

### 5. Giriş Bilgileri

**Varsayılan Admin:**
- Email: `admin@subuasto.edu.tr`
- Şifre: `admin123`

**Demo Davet Kodu:** `SUBU2024`

## Üretim Ortamı

### Güvenlik Ayarları

1. **Debug modunu kapatın:**
```php
define('DEBUG_MODE', false);
```

2. **Güvenlik anahtarlarını değiştirin:**
```php
define('JWT_SECRET', 'production-secret-key');
define('PASSWORD_SALT', 'production-salt');
```

3. **Admin şifresini değiştirin**

### Web Sunucu Yapılandırması

#### Apache (.htaccess):
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/$1.php [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

#### Nginx:
```nginx
location /api/ {
    try_files $uri $uri.php $uri/ =404;
    fastcgi_pass php-fpm;
    include fastcgi_params;
}
```

## Dizin Yapısı

```
├── api/                 # API endpoint'leri
├── assets/             # Statik dosyalar
├── uploads/            # Yüklenen dosyalar
├── config.php          # Yapılandırma dosyası
├── database.php        # Veritabanı sınıfı
├── init_database.php   # Veritabanı kurulum scripti
├── index.html          # Ana sayfa
├── script.js           # Ana JavaScript dosyası
└── style.css          # Ana CSS dosyası
```

## Sorun Giderme

### Veritabanı Bağlantı Hatası
```
Veritabanı bağlantı hatası oluştu.
```

**Çözüm:**
- MySQL servisinin çalıştığından emin olun
- `config.php` dosyasındaki bağlantı bilgilerini kontrol edin
- Kullanıcı iznilerini kontrol edin

### Dosya Yükleme Hatası
```
Dosya yükleme başarısız
```

**Çözüm:**
- `uploads/` klasörünün yazma iznine sahip olduğundan emin olun:
```bash
chmod 755 uploads/
```

### PHP Uzantı Eksik
```
Class 'PDO' not found
```

**Çözüm:**
- PDO uzantısını aktif edin:
```bash
# Ubuntu/Debian
sudo apt install php8.1-pdo php8.1-mysql

# Windows (php.ini)
extension=pdo
extension=pdo_mysql
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- **Email:** info@subuasto.edu.tr
- **Organizasyon:** Sakarya Büyükşehir Belediyesi Astronomi Topluluğu
