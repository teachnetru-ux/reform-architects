<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://reform-architects.ru');

// Подключаем конфиг с секретами (лежит НА СЕРВЕРЕ, не в репозитории)
$config_path = __DIR__ . '/../lead_config.php';
if (!file_exists($config_path)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'config missing']);
    exit;
}
require $config_path;

// Валидация
$form_type = $_POST['form_type'] ?? 'private';

if ($form_type === 'private') {
    $name  = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $type  = trim($_POST['project_type'] ?? '');
    if (!$name || !$phone) {
        echo json_encode(['ok' => false, 'error' => 'required fields missing']);
        exit;
    }
} else {
    $company  = trim($_POST['company'] ?? '');
    $project  = trim($_POST['project_name'] ?? '');
    $role     = trim($_POST['role'] ?? '');
    $contact  = trim($_POST['contact'] ?? '');
    if (!$contact) {
        echo json_encode(['ok' => false, 'error' => 'required fields missing']);
        exit;
    }
}

// UTM
$utm_source   = trim($_POST['utm_source'] ?? '');
$utm_medium   = trim($_POST['utm_medium'] ?? '');
$utm_campaign = trim($_POST['utm_campaign'] ?? '');
$utm_term     = trim($_POST['utm_term'] ?? '');
$utm_content  = trim($_POST['utm_content'] ?? '');
$utm_referrer = trim($_POST['utm_referrer'] ?? '');
$utm_page     = trim($_POST['utm_page'] ?? '');
$ip           = $_SERVER['REMOTE_ADDR'] ?? '';
$ua           = $_SERVER['HTTP_USER_AGENT'] ?? '';
$date         = date('d.m.Y H:i', time() + 3 * 3600); // МСК

// --- MySQL: запись лида ---
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname={$db_name};charset=utf8mb4",
        $db_user, $db_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Создаём таблицу если не существует
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        form_type   VARCHAR(20),
        name        VARCHAR(255),
        phone       VARCHAR(50),
        project_type VARCHAR(100),
        company     VARCHAR(255),
        project_name VARCHAR(255),
        role        VARCHAR(255),
        contact     VARCHAR(255),
        utm_source  VARCHAR(255),
        utm_medium  VARCHAR(255),
        utm_campaign VARCHAR(255),
        utm_term    VARCHAR(255),
        utm_content VARCHAR(255),
        utm_referrer VARCHAR(500),
        utm_page    VARCHAR(500),
        ip          VARCHAR(50),
        ua          TEXT,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmt = $pdo->prepare("INSERT INTO leads
        (form_type, name, phone, project_type, company, project_name, role, contact,
         utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_referrer, utm_page, ip, ua)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

    if ($form_type === 'private') {
        $stmt->execute([$form_type, $name, $phone, $type, '', '', '', '',
            $utm_source, $utm_medium, $utm_campaign, $utm_term, $utm_content, $utm_referrer, $utm_page, $ip, $ua]);
    } else {
        $stmt->execute([$form_type, '', '', '', $company, $project, $role, $contact,
            $utm_source, $utm_medium, $utm_campaign, $utm_term, $utm_content, $utm_referrer, $utm_page, $ip, $ua]);
    }

    $lead_id = $pdo->lastInsertId();
} catch (Exception $e) {
    $lead_id = 0;
}

// --- Telegram ---
function dash($v) { return $v !== '' ? $v : '—'; }

if ($form_type === 'private') {
    $tg_text = "🔔 *Новая заявка · Reform Architects*\n\n"
        . "Имя:           " . dash($name) . "\n"
        . "Телефон:    " . dash($phone) . "\n"
        . "Тип объекта: " . dash($type) . "\n\n"
        . "*Источник*\n"
        . "Страница:      " . dash($utm_page) . "\n"
        . "utm\_source:   " . dash($utm_source) . "\n"
        . "utm\_medium:  " . dash($utm_medium) . "\n"
        . "utm\_campaign: " . dash($utm_campaign) . "\n"
        . "utm\_term:     " . dash($utm_term) . "\n"
        . "utm\_content:  " . dash($utm_content) . "\n"
        . "Реферер:       " . dash($utm_referrer) . "\n\n"
        . "Время: " . $date . " (МСК)\n"
        . "Заявка #" . $lead_id;
} else {
    $tg_text = "🏗 *Заявка от девелопера · Reform Architects*\n\n"
        . "Компания:    " . dash($company) . "\n"
        . "Проект / ЖК: " . dash($project) . "\n"
        . "Роль:        " . dash($role) . "\n"
        . "Контакт:     " . dash($contact) . "\n\n"
        . "*Источник*\n"
        . "Страница:      " . dash($utm_page) . "\n"
        . "utm\_source:   " . dash($utm_source) . "\n"
        . "utm\_medium:  " . dash($utm_medium) . "\n"
        . "utm\_campaign: " . dash($utm_campaign) . "\n"
        . "utm\_term:     " . dash($utm_term) . "\n"
        . "utm\_content:  " . dash($utm_content) . "\n"
        . "Реферер:       " . dash($utm_referrer) . "\n\n"
        . "Время: " . $date . " (МСК)\n"
        . "Заявка #" . $lead_id;
}

$tg_url = "https://api.telegram.org/bot{$tg_token}/sendMessage";
@file_get_contents($tg_url . '?' . http_build_query([
    'chat_id'    => $tg_chat_id,
    'text'       => $tg_text,
    'parse_mode' => 'Markdown',
]));

// --- Email-дубль ---
if ($form_type === 'private') {
    $email_body = "Новая заявка\n\nИмя: {$name}\nТелефон: {$phone}\nТип объекта: {$type}\n\n"
        . "utm_source: {$utm_source}\nutm_medium: {$utm_medium}\nutm_campaign: {$utm_campaign}\n"
        . "Страница: {$utm_page}\nРеферер: {$utm_referrer}\n\nВремя: {$date} МСК\nЗаявка #{$lead_id}";
} else {
    $email_body = "Заявка от девелопера\n\nКомпания: {$company}\nПроект: {$project}\nРоль: {$role}\nКонтакт: {$contact}\n\n"
        . "utm_source: {$utm_source}\nutm_medium: {$utm_medium}\nutm_campaign: {$utm_campaign}\n"
        . "Страница: {$utm_page}\nРеферер: {$utm_referrer}\n\nВремя: {$date} МСК\nЗаявка #{$lead_id}";
}

mail(
    $email_to,
    '=?UTF-8?B?' . base64_encode('Новая заявка · Reform Architects') . '?=',
    $email_body,
    "From: no-reply@reform-architects.ru\r\nContent-Type: text/plain; charset=UTF-8"
);

echo json_encode(['ok' => true, 'id' => $lead_id]);
