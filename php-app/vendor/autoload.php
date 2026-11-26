<?php
declare(strict_types=1);

/**
 * Zero-dependency PSR-4 Autoloader for Hostinger Shared Hosting.
 * Works immediately upon FTP/File Manager upload without requiring SSH or Composer runtime.
 */
spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    $baseDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR;

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', DIRECTORY_SEPARATOR, $relativeClass) . '.php';

    if (is_file($file)) {
        require_once $file;
    }
});

$helpersFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'Core' . DIRECTORY_SEPARATOR . 'helpers.php';
if (is_file($helpersFile)) {
    require_once $helpersFile;
}
