<?php
declare(strict_types=1);

namespace App\Core;

final class Validator
{
    /**
     * Validate input fields and return array of error messages (empty if valid).
     *
     * @param array<string, mixed> $data
     * @param array<string, string> $rules
     * @return array<string, string>
     */
    public static function validate(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $ruleStr) {
            $val = $data[$field] ?? null;
            $strVal = is_scalar($val) ? trim((string) $val) : '';
            $parts = explode('|', $ruleStr);

            foreach ($parts as $rule) {
                [$name, $arg] = array_pad(explode(':', $rule, 2), 2, null);

                if ($name === 'required') {
                    if ($val === null || $strVal === '' || (is_array($val) && $val === [])) {
                        $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
                        break;
                    }
                }

                if ($strVal === '' && $name !== 'required') {
                    continue;
                }

                if ($name === 'email' && filter_var($strVal, FILTER_VALIDATE_EMAIL) === false) {
                    $errors[$field] = 'Please provide a valid email address.';
                    break;
                }

                if ($name === 'min' && $arg !== null && mb_strlen($strVal) < (int) $arg) {
                    $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must be at least {$arg} characters.";
                    break;
                }

                if ($name === 'max' && $arg !== null && mb_strlen($strVal) > (int) $arg) {
                    $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must not exceed {$arg} characters.";
                    break;
                }

                if ($name === 'numeric' && !is_numeric($strVal)) {
                    $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' must be numeric.';
                    break;
                }

                if ($name === 'in' && $arg !== null) {
                    $allowed = explode(',', $arg);
                    if (!in_array($strVal, $allowed, true)) {
                        $errors[$field] = 'Invalid selection for ' . str_replace('_', ' ', $field) . '.';
                        break;
                    }
                }
            }
        }

        return $errors;
    }

    public static function sanitizeText(mixed $val, int $maxLength = 5000): string
    {
        $clean = trim(strip_tags((string) ($val ?? '')));
        return mb_substr($clean, 0, $maxLength);
    }
}
