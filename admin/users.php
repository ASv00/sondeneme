<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../lib/activity_log.php';

// Only allow access for admin users
if (!isset($_SESSION['user_id'])) {
    header('Location: /');
    exit;
}

$db = Database::getInstance();
$currentUser = $db->fetch('SELECT role FROM users WHERE id = :id', ['id' => $_SESSION['user_id']]);
if (!$currentUser || $currentUser['role'] !== 'baskan') {
    http_response_code(403);
    echo 'Permission denied';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = (int)($_POST['user_id'] ?? 0);
    $newRole = $_POST['role'] ?? '';
    $allowed = array_keys(USER_ROLES);
    if ($userId && in_array($newRole, $allowed, true)) {
        $old = $db->fetch('SELECT role FROM users WHERE id = :id', ['id' => $userId]);
        $db->update('users', ['role' => $newRole], 'id = :id', ['id' => $userId]);
        logActivity($_SESSION['user_id'], 'change_role', 'users', $userId, $old, ['role' => $newRole]);
    }
    header('Location: users.php');
    exit;
}

$users = $db->fetchAll('SELECT id, full_name, email, role FROM users ORDER BY full_name');
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Kullanıcı Yönetimi</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; }
    </style>
</head>
<body>
<h1>Kullanıcı Rolleri</h1>
<table>
    <tr>
        <th>Ad Soyad</th>
        <th>Email</th>
        <th>Rol</th>
        <th>İşlem</th>
    </tr>
    <?php foreach ($users as $user): ?>
    <tr>
        <td><?php echo htmlspecialchars($user['full_name']); ?></td>
        <td><?php echo htmlspecialchars($user['email']); ?></td>
        <td><?php echo htmlspecialchars(USER_ROLES[$user['role']] ?? $user['role']); ?></td>
        <td>
            <form method="POST" style="display:inline-block">
                <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                <select name="role">
                    <?php foreach (USER_ROLES as $key => $label): ?>
                        <option value="<?php echo $key; ?>" <?php if ($key === $user['role']) echo 'selected'; ?>><?php echo $label; ?></option>
                    <?php endforeach; ?>
                </select>
                <button type="submit">Güncelle</button>
            </form>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
</body>
</html>
