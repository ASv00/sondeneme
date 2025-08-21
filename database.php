
<?php
require_once 'config.php';

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            if (DEBUG_MODE) {
                die("Veritabanı bağlantı hatası: " . $e->getMessage());
            } else {
                die("Veritabanı bağlantı hatası oluştu.");
            }
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            $this->logError("SQL Error: " . $e->getMessage() . " | Query: " . $sql);
            throw $e;
        }
    }
    
    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }
    
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    public function insert($table, $data) {
        $fields = array_keys($data);
        $placeholders = ':' . implode(', :', $fields);
        $sql = "INSERT INTO {$table} (" . implode(', ', $fields) . ") VALUES ({$placeholders})";
        
        $this->query($sql, $data);
        return $this->connection->lastInsertId();
    }
    
    public function update($table, $data, $where, $whereParams = []) {
        $setClause = [];
        foreach (array_keys($data) as $field) {
            $setClause[] = "{$field} = :{$field}";
        }
        
        $sql = "UPDATE {$table} SET " . implode(', ', $setClause) . " WHERE {$where}";
        $params = array_merge($data, $whereParams);
        
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
    
    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
    
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    public function commit() {
        return $this->connection->commit();
    }
    
    public function rollback() {
        return $this->connection->rollback();
    }
    
    private function logError($message) {
        if (LOG_ERRORS) {
            $logFile = LOG_PATH . 'database_errors.log';
            $timestamp = date('Y-m-d H:i:s');
            $logMessage = "[{$timestamp}] {$message}" . PHP_EOL;
            
            if (!is_dir(LOG_PATH)) {
                mkdir(LOG_PATH, 0755, true);
            }
            
            file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
        }
    }
}

// Veritabanı tabloları oluşturma scripti
function createDatabaseTables() {
    $db = Database::getInstance();
    
    $tables = [
        // Kullanıcılar tablosu
        'users' => "
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                role ENUM('baskan', 'mentor', 'birim_yoneticisi', 'uye', 'misafir') DEFAULT 'uye',
                department VARCHAR(100),
                department_id INT,
                phone VARCHAR(20),
                avatar_url VARCHAR(500),
                is_active BOOLEAN DEFAULT TRUE,
                email_verified BOOLEAN DEFAULT FALSE,
                two_factor_enabled BOOLEAN DEFAULT FALSE,
                two_factor_secret VARCHAR(32),
                invite_code VARCHAR(50),
                invited_by INT,
                last_login TIMESTAMP NULL,
                login_attempts INT DEFAULT 0,
                locked_until TIMESTAMP NULL,
                language_preference VARCHAR(5) DEFAULT 'tr',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (invited_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Etkinlikler tablosu
        'events' => "
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                event_type ENUM('gozlem', 'konferans', 'atolye', 'gezi', 'yarişma', 'sergi') NOT NULL,
                start_date DATETIME NOT NULL,
                end_date DATETIME,
                location VARCHAR(255),
                max_participants INT,
                registration_required BOOLEAN DEFAULT FALSE,
                registration_deadline DATETIME,
                sponsor_company VARCHAR(255),
                budget DECIMAL(10,2),
                status ENUM('taslak', 'onaylandi', 'yayinlandi', 'iptal', 'tamamlandi') DEFAULT 'taslak',
                reminder_at DATETIME,
                created_by INT NOT NULL,
                approved_by INT,
                tags JSON,
                metadata JSON,
                is_archived BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id),
                FOREIGN KEY (approved_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Sosyal medya içerikleri
        'social_media_posts' => "
            CREATE TABLE IF NOT EXISTS social_media_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                platform ENUM('instagram', 'twitter', 'facebook', 'youtube', 'tiktok', 'linkedin') NOT NULL,
                post_type ENUM('post', 'story', 'reel', 'video', 'live') DEFAULT 'post',
                scheduled_date DATETIME,
                published_date DATETIME,
                status ENUM('taslak', 'planlandi', 'yayinlandi', 'arsivlendi') DEFAULT 'taslak',
                hashtags TEXT,
                mention_users TEXT,
                engagement_stats JSON,
                media_files JSON,
                created_by INT NOT NULL,
                approved_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id),
                FOREIGN KEY (approved_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Gök takvimi
        'sky_calendar' => "
            CREATE TABLE IF NOT EXISTS sky_calendar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_name VARCHAR(255) NOT NULL,
                event_type ENUM('dolunay', 'yeniay', 'tutulma', 'meteor_yagmuru', 'gezegen_yakinlasma', 'komedi', 'diger') NOT NULL,
                event_date DATE NOT NULL,
                visibility_time TIME,
                description TEXT,
                observation_difficulty ENUM('kolay', 'orta', 'zor') DEFAULT 'orta',
                required_equipment TEXT,
                weather_dependency BOOLEAN DEFAULT TRUE,
                related_event_id INT,
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (related_event_id) REFERENCES events(id),
                FOREIGN KEY (created_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Resmi belgeler
        'documents' => "
            CREATE TABLE IF NOT EXISTS documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                document_type ENUM('yonetmelik', 'protokol', 'rapor', 'plan', 'butce', 'diger') NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_size INT,
                mime_type VARCHAR(100),
                version VARCHAR(10) DEFAULT '1.0',
                status ENUM('taslak', 'inceleme', 'onaylandi', 'yayinlandi', 'arsivlendi') DEFAULT 'taslak',
                approval_workflow JSON,
                access_level ENUM('herkese_acik', 'uyeler', 'yoneticiler', 'gizli') DEFAULT 'uyeler',
                related_event_id INT,
                related_project_id INT,
                tags JSON,
                uploaded_by INT NOT NULL,
                approved_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (uploaded_by) REFERENCES users(id),
                FOREIGN KEY (approved_by) REFERENCES users(id),
                FOREIGN KEY (related_event_id) REFERENCES events(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Projeler
        'projects' => "
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                project_type ENUM('bireysel', 'ortak', 'kurumsal') NOT NULL,
                status ENUM('planlama', 'devam_ediyor', 'beklemede', 'tamamlandi', 'iptal_edildi') DEFAULT 'planlama',
                start_date DATE,
                end_date DATE,
                budget DECIMAL(12,2),
                spent_budget DECIMAL(12,2) DEFAULT 0,
                project_manager INT,
                team_members JSON,
                partners JSON,
                milestones JSON,
                progress_percentage INT DEFAULT 0,
                priority ENUM('dusuk', 'orta', 'yuksek', 'acil') DEFAULT 'orta',
                tags JSON,
                is_archived BOOLEAN DEFAULT FALSE,
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (project_manager) REFERENCES users(id),
                FOREIGN KEY (created_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Medya arşivi
        'media_files' => "
            CREATE TABLE IF NOT EXISTS media_files (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                file_path VARCHAR(500) NOT NULL,
                thumbnail_path VARCHAR(500),
                preview_path VARCHAR(500),
                file_type ENUM('image', 'video', 'audio', 'document') NOT NULL,
                mime_type VARCHAR(100),
                file_size INT,
                dimensions VARCHAR(20),
                duration INT,
                color_mode ENUM('rgb', 'cmyk') DEFAULT 'rgb',
                category VARCHAR(100),
                tags JSON,
                metadata JSON,
                download_count INT DEFAULT 0,
                version INT DEFAULT 1,
                previous_version_id INT,
                icc_profile_preserved BOOLEAN DEFAULT FALSE,
                chunk_hash VARCHAR(64),
                uploaded_by INT NOT NULL,
                is_public BOOLEAN DEFAULT FALSE,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (uploaded_by) REFERENCES users(id),
                FOREIGN KEY (previous_version_id) REFERENCES media_files(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Blog yazıları
        'blog_posts' => "
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                content LONGTEXT NOT NULL,
                excerpt TEXT,
                featured_image VARCHAR(500),
                category_id INT,
                category VARCHAR(100),
                tags JSON,
                status ENUM('taslak', 'inceleme', 'yayinlandi', 'arsivlendi') DEFAULT 'taslak',
                visibility ENUM('herkese_acik', 'uyeler', 'gizli') DEFAULT 'herkese_acik',
                publish_date DATETIME,
                published_at TIMESTAMP NULL,
                author_id INT NOT NULL,
                editor_id INT,
                view_count INT DEFAULT 0,
                like_count INT DEFAULT 0,
                comment_count INT DEFAULT 0,
                seo_title VARCHAR(255),
                seo_description VARCHAR(500),
                is_archived BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (author_id) REFERENCES users(id),
                FOREIGN KEY (editor_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Kütüphane kaynakları
        'library_resources' => "
            CREATE TABLE IF NOT EXISTS library_resources (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255),
                isbn VARCHAR(13),
                resource_type ENUM('kitap', 'dergi', 'makale', 'pdf', 'video', 'podcast') NOT NULL,
                file_path VARCHAR(500),
                external_url VARCHAR(500),
                description TEXT,
                age_group JSON,
                difficulty_level ENUM('baslangic', 'orta', 'ileri') DEFAULT 'orta',
                language VARCHAR(10) DEFAULT 'tr',
                page_count INT,
                duration INT,
                category VARCHAR(100),
                tags JSON,
                custom_tags JSON,
                is_available BOOLEAN DEFAULT TRUE,
                download_count INT DEFAULT 0,
                rating DECIMAL(3,2),
                added_by INT NOT NULL,
                is_archived BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (added_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Görevler
        'tasks' => "
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status ENUM('yapilacak', 'devam_ediyor', 'tamamlandi') DEFAULT 'yapilacak',
                priority ENUM('dusuk', 'orta', 'yuksek', 'acil') DEFAULT 'orta',
                assigned_to INT,
                assigned_by INT NOT NULL,
                department VARCHAR(100),
                department_id INT,
                due_date DATETIME,
                reminder_at DATETIME,
                estimated_hours INT,
                actual_hours INT,
                completion_percentage INT DEFAULT 0,
                related_project_id INT,
                related_event_id INT,
                tags JSON,
                attachments JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                completed_at TIMESTAMP NULL,
                FOREIGN KEY (assigned_to) REFERENCES users(id),
                FOREIGN KEY (assigned_by) REFERENCES users(id),
                FOREIGN KEY (related_project_id) REFERENCES projects(id),
                FOREIGN KEY (related_event_id) REFERENCES events(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Sistem logları
        'activity_logs' => "
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                action VARCHAR(100) NOT NULL,
                table_name VARCHAR(100),
                record_id INT,
                old_values JSON,
                new_values JSON,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Davet kodları
        'invite_codes' => "
            CREATE TABLE IF NOT EXISTS invite_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                role ENUM('baskan', 'mentor', 'birim_yoneticisi', 'uye') DEFAULT 'uye',
                department VARCHAR(100),
                max_uses INT DEFAULT 1,
                used_count INT DEFAULT 0,
                expires_at DATETIME,
                created_by INT NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Bildirimler
        'notifications' => "
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type ENUM('info', 'success', 'warning', 'danger') DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                action_url VARCHAR(500),
                related_table VARCHAR(100),
                related_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                read_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Blog kategorileri
        'blog_categories' => "
            CREATE TABLE IF NOT EXISTS blog_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                slug VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Etkinlik katılımcıları
        'event_participants' => "
            CREATE TABLE IF NOT EXISTS event_participants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_id INT NOT NULL,
                user_id INT,
                guest_name VARCHAR(255),
                guest_email VARCHAR(255),
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                attendance_status ENUM('kayitli', 'katildi', 'katilmadi') DEFAULT 'kayitli',
                notes TEXT,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Bütçe logları
        'budget_logs' => "
            CREATE TABLE IF NOT EXISTS budget_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                event_id INT,
                amount DECIMAL(10,2) NOT NULL,
                transaction_type ENUM('gelir', 'gider') NOT NULL,
                category VARCHAR(100),
                description TEXT,
                receipt_file VARCHAR(500),
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id),
                FOREIGN KEY (event_id) REFERENCES events(id),
                FOREIGN KEY (created_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Sosyal medya istatistikleri
        'social_stats' => "
            CREATE TABLE IF NOT EXISTS social_stats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                platform VARCHAR(50) NOT NULL,
                likes_count INT DEFAULT 0,
                comments_count INT DEFAULT 0,
                shares_count INT DEFAULT 0,
                reach_count INT DEFAULT 0,
                impressions_count INT DEFAULT 0,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES social_media_posts(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Dosya chunk'ları
        'file_chunks' => "
            CREATE TABLE IF NOT EXISTS file_chunks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                upload_id VARCHAR(64) NOT NULL,
                chunk_number INT NOT NULL,
                chunk_data LONGBLOB,
                chunk_hash VARCHAR(64),
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX(upload_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // CSV import logları
        'import_logs' => "
            CREATE TABLE IF NOT EXISTS import_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                table_name VARCHAR(100) NOT NULL,
                file_name VARCHAR(255) NOT NULL,
                total_rows INT,
                successful_rows INT,
                failed_rows INT,
                errors JSON,
                imported_by INT NOT NULL,
                imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (imported_by) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        // Birimler tablosu
        'departments' => "
            CREATE TABLE IF NOT EXISTS departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                manager_id INT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (manager_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        "
    ];
    
    foreach ($tables as $tableName => $sql) {
        try {
            $db->query($sql);
            echo "Tablo '{$tableName}' başarıyla oluşturuldu.<br>";
        } catch (Exception $e) {
            echo "Tablo '{$tableName}' oluşturulurken hata: " . $e->getMessage() . "<br>";
        }
    }
}

// İlk admin kullanıcı oluşturma
function createDefaultAdmin() {
    $db = Database::getInstance();
    
    // Admin kullanıcısı var mı kontrol et
    $admin = $db->fetch("SELECT id FROM users WHERE role = 'baskan' LIMIT 1");
    
    if (!$admin) {
        $adminData = [
            'email' => 'admin@subuasto.edu.tr',
            'password_hash' => password_hash('admin123', PASSWORD_DEFAULT),
            'full_name' => 'SUBÜ ASTO Admin',
            'role' => 'baskan',
            'is_active' => 1,
            'email_verified' => 1
        ];
        
        $adminId = $db->insert('users', $adminData);
        
        if ($adminId) {
            echo "Varsayılan admin kullanıcısı oluşturuldu.<br>";
            echo "Email: admin@subuasto.edu.tr<br>";
            echo "Şifre: admin123<br>";
        }
    }
}

// Demo davet kodu oluşturma
function createDemoInviteCode() {
    $db = Database::getInstance();
    
    $codeData = [
        'code' => 'SUBU2024',
        'role' => 'uye',
        'max_uses' => 100,
        'created_by' => 1,
        'expires_at' => date('Y-m-d H:i:s', strtotime('+1 year'))
    ];
    
    try {
        $db->insert('invite_codes', $codeData);
        echo "Demo davet kodu oluşturuldu: SUBU2024<br>";
    } catch (Exception $e) {
        // Kod zaten varsa sessizce geç
    }
}
?>
