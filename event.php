
<?php
require_once 'config.php';
require_once 'database.php';

// Get event ID and type from URL parameters
$eventId = $_GET['id'] ?? null;
$eventType = $_GET['type'] ?? 'regular';

if (!$eventId) {
    header('Location: index.html');
    exit;
}

try {
    $db = Database::getInstance();
    $event = null;
    
    if ($eventType === 'sky') {
        // Fetch sky calendar event
        $event = $db->fetch(
            "SELECT sc.*, u.full_name as created_by_name 
             FROM sky_calendar sc 
             LEFT JOIN users u ON sc.created_by = u.id 
             WHERE sc.id = :id",
            ['id' => $eventId]
        );
        $eventTitle = $event ? $event['event_name'] : 'Gök Olayı Bulunamadı';
    } else {
        // Fetch regular event
        $event = $db->fetch(
            "SELECT e.*, u.full_name as created_by_name, approver.full_name as approved_by_name
             FROM events e 
             LEFT JOIN users u ON e.created_by = u.id 
             LEFT JOIN users approver ON e.approved_by = approver.id 
             WHERE e.id = :id",
            ['id' => $eventId]
        );
        $eventTitle = $event ? $event['title'] : 'Etkinlik Bulunamadı';
    }
    
    if (!$event) {
        $errorMessage = 'Belirtilen etkinlik bulunamadı.';
    }
    
} catch (Exception $e) {
    $errorMessage = 'Etkinlik bilgileri yüklenirken hata oluştu: ' . $e->getMessage();
}

function formatDate($dateString) {
    if (!$dateString) return 'Belirsiz';
    return date('d.m.Y H:i', strtotime($dateString));
}

function formatDateOnly($dateString) {
    if (!$dateString) return 'Belirsiz';
    return date('d.m.Y', strtotime($dateString));
}

function getEventTypeText($eventType) {
    $types = [
        'dolunay' => 'Dolunay',
        'yeniay' => 'Yeniay', 
        'tutulma' => 'Tutulma',
        'meteor_yagmuru' => 'Meteor Yağmuru',
        'gezegen_yakinlasma' => 'Gezegen Yakınlaşması',
        'komedi' => 'Kuyruklu Yıldız',
        'gozlem' => 'Gözlem',
        'konferans' => 'Konferans',
        'atolye' => 'Atölye',
        'gezi' => 'Gezi',
        'yarişma' => 'Yarışma',
        'sergi' => 'Sergi',
        'diger' => 'Diğer'
    ];
    return $types[$eventType] ?? ucfirst($eventType);
}

function getDifficultyText($difficulty) {
    $difficulties = [
        'kolay' => 'Kolay',
        'orta' => 'Orta',
        'zor' => 'Zor'
    ];
    return $difficulties[$difficulty] ?? $difficulty;
}

function getStatusText($status) {
    $statuses = [
        'taslak' => 'Taslak',
        'onaylandi' => 'Onaylandı',
        'yayinlandi' => 'Yayınlandı',
        'iptal' => 'İptal Edildi',
        'tamamlandi' => 'Tamamlandı'
    ];
    return $statuses[$status] ?? $status;
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($eventTitle) ?> - SUBÜ ASTO</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .event-detail-container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: var(--card-background, #ffffff);
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .event-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--border-color, #e5e7eb);
        }
        
        .event-type-badge {
            display: inline-block;
            padding: 6px 12px;
            background: var(--primary-color, #3b82f6);
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .event-title {
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary, #1f2937);
            margin: 0;
        }
        
        .event-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-item {
            background: var(--background-color, #f9fafb);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color, #3b82f6);
        }
        
        .info-label {
            font-weight: 600;
            color: var(--text-secondary, #6b7280);
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .info-value {
            font-size: 16px;
            color: var(--text-primary, #1f2937);
        }
        
        .event-description {
            background: var(--background-color, #f9fafb);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .action-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: var(--primary-color, #3b82f6);
            color: white;
        }
        
        .btn-secondary {
            background: var(--secondary-color, #6b7280);
            color: white;
        }
        
        .btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        .error-message {
            text-align: center;
            padding: 40px;
            color: var(--error-color, #ef4444);
            font-size: 18px;
        }
        
        @media (max-width: 768px) {
            .event-info {
                grid-template-columns: 1fr;
            }
            
            .event-detail-container {
                margin: 20px;
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="event-detail-container">
        <?php if (isset($errorMessage)): ?>
            <div class="error-message">
                <h2>❌ Hata</h2>
                <p><?= htmlspecialchars($errorMessage) ?></p>
                <div class="action-buttons">
                    <a href="index.html" class="btn btn-primary">Ana Sayfaya Dön</a>
                </div>
            </div>
        <?php else: ?>
            <div class="event-header">
                <?php if ($eventType === 'sky'): ?>
                    <div class="event-type-badge">🌌 Gök Olayı</div>
                    <h1 class="event-title"><?= htmlspecialchars($event['event_name']) ?></h1>
                <?php else: ?>
                    <div class="event-type-badge"><?= getEventTypeText($event['event_type']) ?></div>
                    <h1 class="event-title"><?= htmlspecialchars($event['title']) ?></h1>
                <?php endif; ?>
            </div>

            <div class="event-info">
                <?php if ($eventType === 'sky'): ?>
                    <div class="info-item">
                        <div class="info-label">📅 Tarih</div>
                        <div class="info-value"><?= formatDateOnly($event['event_date']) ?></div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">🔍 Olay Türü</div>
                        <div class="info-value"><?= getEventTypeText($event['event_type']) ?></div>
                    </div>
                    
                    <?php if ($event['visibility_time']): ?>
                    <div class="info-item">
                        <div class="info-label">🕐 Görünürlük Zamanı</div>
                        <div class="info-value"><?= htmlspecialchars($event['visibility_time']) ?></div>
                    </div>
                    <?php endif; ?>
                    
                    <div class="info-item">
                        <div class="info-label">⭐ Gözlem Zorluğu</div>
                        <div class="info-value"><?= getDifficultyText($event['observation_difficulty']) ?></div>
                    </div>
                    
                    <?php if ($event['required_equipment']): ?>
                    <div class="info-item">
                        <div class="info-label">🔭 Gerekli Ekipman</div>
                        <div class="info-value"><?= htmlspecialchars($event['required_equipment']) ?></div>
                    </div>
                    <?php endif; ?>
                    
                    <div class="info-item">
                        <div class="info-label">🌤️ Hava Durumu Bağımlılığı</div>
                        <div class="info-value"><?= $event['weather_dependency'] ? 'Evet' : 'Hayır' ?></div>
                    </div>
                    
                <?php else: ?>
                    <div class="info-item">
                        <div class="info-label">📅 Başlangıç Tarihi</div>
                        <div class="info-value"><?= formatDate($event['start_date']) ?></div>
                    </div>
                    
                    <?php if ($event['end_date']): ?>
                    <div class="info-item">
                        <div class="info-label">🏁 Bitiş Tarihi</div>
                        <div class="info-value"><?= formatDate($event['end_date']) ?></div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if ($event['location']): ?>
                    <div class="info-item">
                        <div class="info-label">📍 Konum</div>
                        <div class="info-value"><?= htmlspecialchars($event['location']) ?></div>
                    </div>
                    <?php endif; ?>
                    
                    <div class="info-item">
                        <div class="info-label">📊 Durum</div>
                        <div class="info-value"><?= getStatusText($event['status']) ?></div>
                    </div>
                    
                    <?php if ($event['max_participants']): ?>
                    <div class="info-item">
                        <div class="info-label">👥 Maksimum Katılımcı</div>
                        <div class="info-value"><?= $event['max_participants'] ?> kişi</div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if ($event['budget']): ?>
                    <div class="info-item">
                        <div class="info-label">💰 Bütçe</div>
                        <div class="info-value">₺<?= number_format($event['budget'], 2) ?></div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if ($event['sponsor_company']): ?>
                    <div class="info-item">
                        <div class="info-label">🏢 Sponsor</div>
                        <div class="info-value"><?= htmlspecialchars($event['sponsor_company']) ?></div>
                    </div>
                    <?php endif; ?>
                <?php endif; ?>
                
                <div class="info-item">
                    <div class="info-label">👤 Oluşturan</div>
                    <div class="info-value"><?= htmlspecialchars($event['created_by_name'] ?? 'Bilinmiyor') ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">📅 Oluşturulma Tarihi</div>
                    <div class="info-value"><?= formatDate($event['created_at']) ?></div>
                </div>
            </div>

            <?php if (!empty($event['description'])): ?>
            <div class="event-description">
                <h3>📄 Açıklama</h3>
                <p><?= nl2br(htmlspecialchars($event['description'])) ?></p>
            </div>
            <?php endif; ?>

            <div class="action-buttons">
                <a href="index.html" class="btn btn-secondary">🏠 Ana Sayfaya Dön</a>
                <a href="index.html#<?= $eventType === 'sky' ? 'sky-calendar' : 'events' ?>" class="btn btn-primary">
                    <?= $eventType === 'sky' ? '🌌 Gök Takvimine Dön' : '📅 Etkinliklere Dön' ?>
                </a>
                <?php if ($eventType !== 'sky' && $event['registration_required']): ?>
                    <a href="#" class="btn btn-primary">✅ Kayıt Ol</a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>

    <script>
        // Add some basic interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scroll for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href.includes('#')) {
                        e.preventDefault();
                        window.location.href = href;
                    }
                });
            });
        });
    </script>
</body>
</html>
