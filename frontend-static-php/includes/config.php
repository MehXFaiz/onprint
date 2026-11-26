<?php
/**
 * ONPRINT Dubai — Static Frontend Configuration
 * Pure frontend-only template configuration (no database, no backend auth).
 */

define('SITE_NAME', 'ONPRINT');
define('SITE_LEGAL_NAME', 'ONPRINT Commercial Printing LLC');
define('SITE_URL', 'https://www.0nprint.com');
define('WHATSAPP_PHONE', '447344546056');
define('FORMATTED_PHONE', '+44 7344 546056');
define('CONTACT_EMAIL', '0nprint183@gmail.com');
define('STUDIO_ADDRESS', 'Al Quoz, Dubai, UAE');
define('STUDIO_HOURS', 'Monday – Saturday: 9:00 AM – 8:00 PM');

// Determine base path and current clean route path dynamically
// Works seamlessly whether deployed in Hostinger public_html/ root or a subfolder.
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php'));
$BASE_PATH = ($scriptDir === '/' || $scriptDir === '.') ? '' : rtrim($scriptDir, '/');

$rawRequestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if ($BASE_PATH !== '' && strpos($rawRequestUri, $BASE_PATH) === 0) {
    $routePath = substr($rawRequestUri, strlen($BASE_PATH));
} else {
    $routePath = $rawRequestUri;
}
$ROUTE_PATH = '/' . trim($routePath, '/');
if ($ROUTE_PATH === '//') {
    $ROUTE_PATH = '/';
}

// Compute relative prefix based on route depth so all assets & links use clean relative paths
$trimmedRoute = trim($ROUTE_PATH, '/');
$depth = ($trimmedRoute === '') ? 0 : substr_count($trimmedRoute, '/') + 1;
// Note: for "/about" (no trailing slash), browser resolves relative links from "/", so depth is 0;
// for "/products/die-cut-stickers" (1 slash), browser resolves from "/products/", so "../" (1 level up).
$slashCount = ($trimmedRoute === '') ? 0 : substr_count($trimmedRoute, '/');
$REL_PREFIX = ($slashCount > 0) ? str_repeat('../', $slashCount) : '';

$IS_ARABIC = ($ROUTE_PATH === '/ar' || strpos($ROUTE_PATH, '/ar/') === 0);
