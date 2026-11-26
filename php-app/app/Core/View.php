<?php
declare(strict_types=1);

namespace App\Core;

use RuntimeException;

final class View
{
    /**
     * Render a view inside an optional layout.
     *
     * @param array<string, mixed> $data
     */
    public static function render(string $view, array $data = [], ?string $layout = 'layouts/public'): string
    {
        $viewFile = base_path('views/' . trim($view, '/') . '.php');
        if (!is_file($viewFile)) {
            throw new RuntimeException("View not found: {$view}");
        }

        $content = self::capture($viewFile, $data);

        if ($layout === null) {
            return $content;
        }

        $layoutFile = base_path('views/' . trim($layout, '/') . '.php');
        if (!is_file($layoutFile)) {
            throw new RuntimeException("Layout not found: {$layout}");
        }

        return self::capture($layoutFile, array_merge($data, ['content' => $content]));
    }

    /**
     * Render a partial snippet directly.
     *
     * @param array<string, mixed> $data
     */
    public static function partial(string $partial, array $data = []): string
    {
        $file = base_path('views/' . trim($partial, '/') . '.php');
        if (!is_file($file)) {
            return '';
        }
        return self::capture($file, $data);
    }

    /**
     * @param array<string, mixed> $data
     */
    private static function capture(string $____file, array $data): string
    {
        extract($data, EXTR_SKIP);
        ob_start();
        include $____file;
        return (string) ob_get_clean();
    }
}
