<?php
// ── Заголовки и CORS ─────────────────────────────────────────────
header('Content-Type: application/json');

// Разрешаем запросы только со своего домена (с www и без)
$allowed_origins = [
    'https://reform-architects.ru',
    'https://www.reform-architects.ru',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

// Принимаем только POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method not allowed']);
    exit;
}

date_default_timezone_set('Europe/Moscow');

// ── Конфиг с секретами (вне веб-корня) ───────────────────────────
$possible_paths = [
    __DIR__ . '/../../lead_config.php',
    __DIR__ . '/../lead_config.php',
];
$config_path = null;
foreach ($possible_paths as $p) {
    if ($p && file_exists($p)) { $config_path = $p; break; }
}
if (!$config_path) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'config not found']);
    exit;
}
require $config_path;

// ── Хелперы безопасности ─────────────────────────────────────────
// Чистим вход: убираем переносы строк (защита от header-инъекций),
// обрезаем по длине, тримим
function clean($v, $max = 255) {
    $v = (string)($v ?? '');
    $v = str_replace(["\r", "\n", "\0"], ' ', $v);
    $v = trim($v);
    if (mb_strlen($v) > $max) $v = mb_substr($v, 0, $max);
    return $v;
}
// Экранируем спецсимволы Markdown для Telegram (защита от XSS/инъекций в сообщение)
function tg_escape($v) {
    return str_replace(['_', '*', '[', ']', '`'], ['\_', '\*', '\[', '\]', '\`'], $v);
}

// ── Антиспам: honeypot ───────────────────────────────────────────
// Скрытое поле website — реальные люди его не заполняют, боты заполняют.
// Если заполнено — тихо «успех», но ничего не делаем.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// ── Антиспам: rate limit по IP ───────────────────────────────────
// Не больше 5 заявок с одного IP за 10 минут.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rl_file = sys_get_temp_dir() . '/lead_rl_' . md5($ip);
$now = time();
$hits = [];
if (file_exists($rl_file)) {
    $hits = array_filter(
        explode(',', (string)file_get_contents($rl_file)),
        function ($t) use ($now) { return ($now - (int)$t) < 600; }
    );
}
if (count($hits) >= 5) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'too many requests']);
    exit;
}
$hits[] = $now;
@file_put_contents($rl_file, implode(',', $hits));

// ── Валидация и сбор данных ──────────────────────────────────────
$raw_form_type = $_POST['form_type'] ?? '';
if ($raw_form_type === 'developer') {
    $form_type = 'developer';
} elseif ($raw_form_type === 'family') {
    $form_type = 'family';
} else {
    $form_type = 'private';
}

if ($form_type === 'private' || $form_type === 'family') {
    $name  = clean($_POST['name'] ?? '', 150);
    $phone = clean($_POST['phone'] ?? '', 30);
    $type  = clean($_POST['project_type'] ?? '', 50);
    $company = $project = $role = $contact = '';
} else {
    $company = clean($_POST['company'] ?? '', 200);
    $project = clean($_POST['project_name'] ?? '', 200);
    $role    = clean($_POST['role'] ?? '', 150);
    $contact = clean($_POST['contact'] ?? '', 150);
    $name = $phone = $type = '';
}

// ── Антиспам: серверная валидация (тихий выход при провале) ───────
// Боты бьют POST-ом напрямую по lead.php в обход формы: без Referer/Origin,
// с пустым project_type, телефоном без маски. Любой провал проверок ниже —
// ответ {"ok":true} и exit: бот видит «успех» и не подбирает обход, но в БД,
// Telegram и почту НИЧЕГО не уходит. (Honeypot `website` проверен выше.)

// 1) Запрос должен прийти со своего домена. Реальная форма отправляется через
//    fetch со страницы reform-architects.ru, поэтому браузер шлёт Origin и/или
//    Referer с нашим доменом. Нет домена ни там, ни там — тихий выход.
$site_host   = 'reform-architects.ru';
$origin_hdr  = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer_hdr = $_SERVER['HTTP_REFERER'] ?? '';
if (strpos($origin_hdr, $site_host) === false && strpos($referer_hdr, $site_host) === false) {
    echo json_encode(['ok' => true]);
    exit;
}

// 2) Валидация по типу формы.
if ($form_type === 'private' || $form_type === 'family') {
    // Имя 2–150; телефон — 11–15 цифр; тип объекта строго из списка формы
    // (главный фильтр: боты шлют пустой project_type).
    $phone_digits  = preg_replace('/\D/', '', $phone);
    $allowed_types = ['Дом', 'Квартира', 'Коммерция'];
    if (
        mb_strlen($name) < 2 || mb_strlen($name) > 150 ||
        strlen($phone_digits) < 11 || strlen($phone_digits) > 15 ||
        !in_array($type, $allowed_types, true)
    ) {
        echo json_encode(['ok' => true]);
        exit;
    }
} else {
    // Девелоперской форме обязателен контакт (телефон или email), 3–150.
    if (mb_strlen($contact) < 3 || mb_strlen($contact) > 150) {
        echo json_encode(['ok' => true]);
        exit;
    }
}

// 3) Проверка «человечности» по времени отправки не добавлена: у формы нет
//    скрытого поля с таймстампом загрузки, а фронт по условию не трогаем.

// UTM
$utm_source   = clean($_POST['utm_source'] ?? '');
$utm_medium   = clean($_POST['utm_medium'] ?? '');
$utm_campaign = clean($_POST['utm_campaign'] ?? '');
$utm_term     = clean($_POST['utm_term'] ?? '');
$utm_content  = clean($_POST['utm_content'] ?? '');
$utm_referrer = clean($_POST['utm_referrer'] ?? '', 500);
$utm_page     = clean($_POST['utm_page'] ?? '', 500);

// Если страница не пришла или равна '/', берём путь из referer
if ($utm_page === '' || $utm_page === '/') {
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if ($referer) {
        $parsed = parse_url($referer);
        $utm_page = $parsed['path'] ?? '/';
    }
}

$ua   = clean($_SERVER['HTTP_USER_AGENT'] ?? '', 500);
$date = date('d.m.Y H:i');

// ── MySQL: запись лида ───────────────────────────────────────────
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname={$db_name};charset=utf8mb4",
        $db_user, $db_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

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

    $stmt->execute([$form_type, $name, $phone, $type, $company, $project, $role, $contact,
        $utm_source, $utm_medium, $utm_campaign, $utm_term, $utm_content, $utm_referrer, $utm_page, $ip, $ua]);

    $lead_id = $pdo->lastInsertId();
} catch (Exception $e) {
    $lead_id = 0;
}

// ── Telegram ─────────────────────────────────────────────────────
function dash($v) { return $v !== '' ? tg_escape($v) : '—'; }

if ($form_type === 'private' || $form_type === 'family') {
    $is_family = ($form_type === 'family');
    $header = $is_family
        ? "🔔 *Новая заявка · Family (−15%)*"
        : "🔔 *Новая заявка · Reform Architects*";

    $tg_text = $header . "\n\n"
        . "Имя:           " . dash($name) . "\n"
        . "Телефон:    " . dash($phone) . "\n"
        . "Тип объекта: " . dash($type) . "\n";

    if ($is_family) {
        $tg_text .= "\n🎁 *Участник программы Family — скидка 15% на проектирование*\n";
    }

    $tg_text .= "\n*Источник*\n"
        . "Страница:      " . dash($utm_page) . "\n"
        . "utm\\_source:   " . dash($utm_source) . "\n"
        . "utm\\_medium:  " . dash($utm_medium) . "\n"
        . "utm\\_campaign: " . dash($utm_campaign) . "\n"
        . "utm\\_term:     " . dash($utm_term) . "\n"
        . "utm\\_content:  " . dash($utm_content) . "\n"
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
        . "utm\\_source:   " . dash($utm_source) . "\n"
        . "utm\\_medium:  " . dash($utm_medium) . "\n"
        . "utm\\_campaign: " . dash($utm_campaign) . "\n"
        . "utm\\_term:     " . dash($utm_term) . "\n"
        . "utm\\_content:  " . dash($utm_content) . "\n"
        . "Реферер:       " . dash($utm_referrer) . "\n\n"
        . "Время: " . $date . " (МСК)\n"
        . "Заявка #" . $lead_id;
}

$tg_url = "https://api.telegram.org/bot{$tg_token}/sendMessage";
$tg_params = [
    'chat_id'    => $tg_chat_id,
    'text'       => $tg_text,
    'parse_mode' => 'Markdown',
];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tg_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($tg_params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_exec($ch);
curl_close($ch);

// ── Email-дубль ──────────────────────────────────────────────────
if ($form_type === 'private' || $form_type === 'family') {
    $email_intro = ($form_type === 'family') ? "Новая заявка · Family" : "Новая заявка";
    $email_body = "{$email_intro}\n\nИмя: {$name}\nТелефон: {$phone}\nТип объекта: {$type}\n\n";
    if ($form_type === 'family') {
        $email_body .= "Участник программы Family — скидка 15% на проектирование\n\n";
    }
    $email_body .= "utm_source: {$utm_source}\nutm_medium: {$utm_medium}\nutm_campaign: {$utm_campaign}\n"
        . "Страница: {$utm_page}\nРеферер: {$utm_referrer}\n\nВремя: {$date} МСК\nЗаявка #{$lead_id}";
} else {
    $email_body = "Заявка от девелопера\n\nКомпания: {$company}\nПроект: {$project}\nРоль: {$role}\nКонтакт: {$contact}\n\n"
        . "utm_source: {$utm_source}\nutm_medium: {$utm_medium}\nutm_campaign: {$utm_campaign}\n"
        . "Страница: {$utm_page}\nРеферер: {$utm_referrer}\n\nВремя: {$date} МСК\nЗаявка #{$lead_id}";
}

$email_subject = ($form_type === 'family') ? 'Новая заявка · Family' : 'Новая заявка · Reform Architects';
mail(
    $email_to,
    '=?UTF-8?B?' . base64_encode($email_subject) . '?=',
    $email_body,
    "From: no-reply@reform-architects.ru\r\nContent-Type: text/plain; charset=UTF-8"
);

echo json_encode(['ok' => true, 'id' => $lead_id]);
