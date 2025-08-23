<?php
require_once __DIR__ . '/../config.php';

function sendTemplatedEmail($to, $templateKey, $variables = []) {
    $templateConfig = EMAIL_TEMPLATES[$templateKey] ?? null;
    if (!$templateConfig) {
        return false;
    }

    $templateFile = rtrim(EMAIL_TEMPLATE_PATH, '/') . '/' . $templateConfig['template'];
    if (!file_exists($templateFile)) {
        return false;
    }

    $subject = $templateConfig['subject'];
    $body = file_get_contents($templateFile);

    foreach ($variables as $key => $value) {
        $body = str_replace('{{' . $key . '}}', $value, $body);
    }

    $headers = 'From: ' . SMTP_FROM_EMAIL . "\r\n" .
               'Content-Type: text/html; charset=UTF-8';

    @mail($to, $subject, $body, $headers);
    return true;
}
?>
