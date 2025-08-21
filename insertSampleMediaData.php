
<?php
require_once 'database.php';

function insertSampleMediaData() {
    $db = Database::getInstance();
    
    // Sample media files
    $mediaFiles = [
        [
            'title' => 'Geminids_2024_Poster.jpg',
            'description' => 'Geminids meteor yağmuru etkinlik posteri',
            'file_path' => '/uploads/media/geminids_poster.jpg',
            'file_type' => 'image',
            'mime_type' => 'image/jpeg',
            'file_size' => 2457600, // 2.4 MB
            'category' => 'etkinlik',
            'tags' => json_encode(['meteor', 'geminids', 'poster', 'etkinlik']),
            'uploaded_by' => 1,
            'is_public' => 1,
            'uploaded_at' => '2024-12-15 14:30:00'
        ],
        [
            'title' => 'Mars_Observation_Video.mp4',
            'description' => 'Mars gözlem videosu',
            'file_path' => '/uploads/media/mars_observation.mp4',
            'file_type' => 'video',
            'mime_type' => 'video/mp4',
            'file_size' => 47841280, // 45.6 MB
            'duration' => 180,
            'category' => 'gozlem',
            'tags' => json_encode(['mars', 'gözlem', 'video', 'teleskop']),
            'uploaded_by' => 1,
            'is_public' => 1,
            'uploaded_at' => '2024-12-10 16:45:00'
        ],
        [
            'title' => 'SUBU_ASTO_Logo.png',
            'description' => 'SUBÜ ASTO resmi logosu',
            'file_path' => '/uploads/media/logo.png',
            'file_type' => 'image',
            'mime_type' => 'image/png',
            'file_size' => 524288, // 512 KB
            'dimensions' => '1024x1024',
            'category' => 'genel',
            'tags' => json_encode(['logo', 'resmi', 'subü', 'asto']),
            'uploaded_by' => 1,
            'is_public' => 1,
            'uploaded_at' => '2024-12-05 10:15:00'
        ],
        [
            'title' => 'Toplanti_Tutanagi_Kasim2024.pdf',
            'description' => 'Kasım 2024 toplantı tutanağı',
            'file_path' => '/uploads/media/meeting_minutes_nov2024.pdf',
            'file_type' => 'document',
            'mime_type' => 'application/pdf',
            'file_size' => 1048576, // 1 MB
            'category' => 'toplanti',
            'tags' => json_encode(['toplantı', 'tutanak', 'kasım', '2024']),
            'uploaded_by' => 1,
            'is_public' => 0,
            'uploaded_at' => '2024-11-30 09:20:00'
        ],
        [
            'title' => 'Sosyal_Medya_Kapak_Fotografi.jpg',
            'description' => 'Sosyal medya için kapak fotoğrafı',
            'file_path' => '/uploads/media/social_cover.jpg',
            'file_type' => 'image',
            'mime_type' => 'image/jpeg',
            'file_size' => 3145728, // 3 MB
            'dimensions' => '1920x1080',
            'category' => 'sosyal',
            'tags' => json_encode(['sosyal medya', 'kapak', 'instagram', 'facebook']),
            'uploaded_by' => 1,
            'is_public' => 1,
            'uploaded_at' => '2024-12-08 11:30:00'
        ],
        [
            'title' => 'Astronomi_Ders_Notu.pdf',
            'description' => 'Başlangıç astronomi ders notu',
            'file_path' => '/uploads/media/astronomy_notes.pdf',
            'file_type' => 'document',
            'mime_type' => 'application/pdf',
            'file_size' => 2097152, // 2 MB
            'category' => 'egitim',
            'tags' => json_encode(['eğitim', 'ders', 'astronomi', 'başlangıç']),
            'uploaded_by' => 1,
            'is_public' => 1,
            'uploaded_at' => '2024-12-01 13:45:00'
        ]
    ];
    
    foreach ($mediaFiles as $file) {
        try {
            $db->insert('media_files', $file);
        } catch (Exception $e) {
            // File already exists, skip
            echo "Media file already exists: " . $file['title'] . "<br>";
        }
    }
    
    echo "Sample media files inserted successfully.<br>";
}

// Run the function if called directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    insertSampleMediaData();
}
?>
