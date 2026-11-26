<?php
declare(strict_types=1);

/**
 * Pure PHP State-Machine JS Object/Array Literal Transpiler & Importer.
 * Converts single-quoted JS data modules (${SITE_URL}, unquoted keys, comments, trailing commas)
 * into clean JSON -> PHP arrays -> MySQL rows & native PHP config files.
 */

define('ONPRINT_BASE_PATH', dirname(__DIR__, 2));
define('ONPRINT_PUBLIC_PATH', ONPRINT_BASE_PATH . DIRECTORY_SEPARATOR . 'public');

require_once ONPRINT_BASE_PATH . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

use App\Core\Database;
use App\Core\Env;

Env::load(ONPRINT_BASE_PATH . DIRECTORY_SEPARATOR . '.env');

$mernRoot = dirname(ONPRINT_BASE_PATH);
$siteUrl = 'https://www.0nprint.com';

function jsLiteralToArray(string $jsSource, string $siteUrl, ?string $constName = null): ?array
{
    if ($constName !== null) {
        $pos = strpos($jsSource, $constName);
        if ($pos !== false) {
            $eqPos = strpos($jsSource, '=', $pos);
            if ($eqPos !== false) {
                $jsSource = substr($jsSource, $eqPos + 1);
            }
        }
    }

    // Find outer { or [
    $len = strlen($jsSource);
    $start = -1;
    $openChar = '';
    $closeChar = '';
    for ($i = 0; $i < $len; $i++) {
        $ch = $jsSource[$i];
        if ($ch === '{' || $ch === '[') {
            $start = $i;
            $openChar = $ch;
            $closeChar = $ch === '{' ? '}' : ']';
            break;
        }
    }
    if ($start < 0) {
        return null;
    }

    // Walk balanced braces/brackets while converting JS strings/comments to valid JSON
    $out = '';
    $depth = 0;
    $inSingle = false;
    $inDouble = false;
    $inTemplate = false;
    $inLineComment = false;
    $inBlockComment = false;

    for ($i = $start; $i < $len; $i++) {
        $ch = $jsSource[$i];
        $next = $i + 1 < $len ? $jsSource[$i + 1] : '';

        if ($inLineComment) {
            if ($ch === "\n") {
                $inLineComment = false;
                $out .= "\n";
            }
            continue;
        }
        if ($inBlockComment) {
            if ($ch === '*' && $next === '/') {
                $inBlockComment = false;
                $i++;
            }
            continue;
        }

        if ($inSingle) {
            if ($ch === '\\') {
                $esc = $next;
                if ($esc === "'") {
                    $out .= "'";
                } elseif ($esc === '"') {
                    $out .= '\\"';
                } else {
                    $out .= '\\' . $esc;
                }
                $i++;
                continue;
            }
            if ($ch === '"') {
                $out .= '\\"';
                continue;
            }
            if ($ch === "\n") {
                $out .= '\\n';
                continue;
            }
            if ($ch === "\r") {
                continue;
            }
            if ($ch === "'") {
                $inSingle = false;
                $out .= '"';
                continue;
            }
            $out .= $ch;
            continue;
        }

        if ($inDouble) {
            if ($ch === '\\') {
                $out .= $ch . $next;
                $i++;
                continue;
            }
            if ($ch === "\n") {
                $out .= '\\n';
                continue;
            }
            if ($ch === "\r") {
                continue;
            }
            if ($ch === '"') {
                $inDouble = false;
            }
            $out .= $ch;
            continue;
        }

        if ($inTemplate) {
            if ($ch === '\\') {
                $out .= $ch . $next;
                $i++;
                continue;
            }
            if ($ch === '$' && $next === '{') {
                $endExpr = strpos($jsSource, '}', $i + 2);
                if ($endExpr !== false) {
                    $expr = trim(substr($jsSource, $i + 2, $endExpr - ($i + 2)));
                    if ($expr === 'SITE_URL') {
                        $out .= $siteUrl;
                    }
                    $i = $endExpr;
                    continue;
                }
            }
            if ($ch === '"') {
                $out .= '\\"';
                continue;
            }
            if ($ch === "\n") {
                $out .= '\\n';
                continue;
            }
            if ($ch === "\r") {
                continue;
            }
            if ($ch === '`') {
                $inTemplate = false;
                $out .= '"';
                continue;
            }
            $out .= $ch;
            continue;
        }

        // Outside strings
        if ($ch === '/' && $next === '/') {
            $inLineComment = true;
            $i++;
            continue;
        }
        if ($ch === '/' && $next === '*') {
            $inBlockComment = true;
            $i++;
            continue;
        }
        if ($ch === "'") {
            $inSingle = true;
            $out .= '"';
            continue;
        }
        if ($ch === '"') {
            $inDouble = true;
            $out .= '"';
            continue;
        }
        if ($ch === '`') {
            $inTemplate = true;
            $out .= '"';
            continue;
        }

        if ($ch === '{' || $ch === '[') {
            $depth++;
        } elseif ($ch === '}' || $ch === ']') {
            $depth--;
            $out .= $ch;
            if ($depth === 0) {
                break;
            }
            continue;
        }

        $out .= $ch;
    }

    // Quote unquoted object keys: e.g. `{ slug:` or `, metaDescription:`
    $out = preg_replace('/([\{\[,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/', '$1"$2":', $out) ?? $out;
    // Remove trailing commas before } or ]
    $out = preg_replace('/,\s*([\}\]])/', '$1', $out) ?? $out;

    $decoded = json_decode($out, true);
    return is_array($decoded) ? $decoded : null;
}

$pdo = Database::connection(true);
$dataDir = base_path('app/Data');
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0775, true);
}

// 1. Business Cards Landing Cluster Data (20 routes)
$bcRaw = (string) file_get_contents($mernRoot . '/src/data/businessCardsLandingData.js');
$bcData = jsLiteralToArray($bcRaw, $siteUrl, 'BUSINESS_CARDS_LANDING_DATA');
if (is_array($bcData)) {
    file_put_contents($dataDir . '/business_cards_landing.php', "<?php\ndeclare(strict_types=1);\n\nreturn " . var_export($bcData, true) . ";\n");
    echo "Exported " . count($bcData) . " Business Card Cluster pages to app/Data/business_cards_landing.php\n";
}

// 2. Programmatic SEO Location & Use-Case Pages
$progRaw = (string) file_get_contents($mernRoot . '/src/services/programmaticSeoService.js');
$locPages = jsLiteralToArray($progRaw, $siteUrl, 'LOCATION_PAGES') ?? [];
$usePages = jsLiteralToArray($progRaw, $siteUrl, 'USE_CASE_PAGES') ?? [];
file_put_contents(
    $dataDir . '/programmatic_pages.php',
    "<?php\ndeclare(strict_types=1);\n\nreturn " . var_export(['locations' => $locPages, 'use_cases' => $usePages], true) . ";\n"
);
echo "Exported " . count($locPages) . " Location pages & " . count($usePages) . " Use-Case pages to app/Data/programmatic_pages.php\n";

// 3. GEO FAQs
if ((int) Database::fetchScalar('SELECT COUNT(*) FROM geo_faqs') === 0) {
    $faqs = jsLiteralToArray((string) file_get_contents($mernRoot . '/src/data/geoFaqsData.js'), $siteUrl, 'GEO_FAQS') ?? [];
    foreach ($faqs as $f) {
        Database::insert('geo_faqs', [
            'question' => $f['question'] ?? '',
            'answer' => $f['answer'] ?? '',
            'category' => $f['category'] ?? 'General',
            'related_service' => $f['related_service'] ?? null,
            'related_keyword' => $f['related_keyword'] ?? null,
            'target_url' => $f['target_url'] ?? null,
            'search_intent' => $f['search_intent'] ?? 'Commercial',
            'status' => $f['status'] ?? 'published',
        ]);
    }
    echo "Seeded " . count($faqs) . " GEO FAQs into MySQL.\n";
}

// 4. GEO Content Knowledge Records
if ((int) Database::fetchScalar('SELECT COUNT(*) FROM geo_content') === 0) {
    $geoContent = jsLiteralToArray((string) file_get_contents($mernRoot . '/src/data/geoContentData.js'), $siteUrl, 'GEO_CONTENT_RECORDS') ?? [];
    foreach ($geoContent as $gc) {
        Database::insert('geo_content', [
            'topic' => $gc['topic'] ?? '',
            'question' => $gc['question'] ?? '',
            'answer' => $gc['answer'] ?? '',
            'target_keyword' => $gc['target_keyword'] ?? null,
            'entity' => $gc['entity'] ?? 'ONPRINT',
            'target_url' => $gc['target_url'] ?? null,
            'related_service' => $gc['related_service'] ?? null,
            'faq' => !empty($gc['faq']) ? 1 : 0,
            'source' => $gc['source'] ?? 'ONPRINT Pressroom Operations Manual',
            'author' => $gc['author'] ?? 'ONPRINT Technical Team',
            'status' => $gc['status'] ?? 'published',
        ]);
    }
    echo "Seeded " . count($geoContent) . " GEO Knowledge records into MySQL.\n";
}

// 5. AI Visibility Tracking Queries
if ((int) Database::fetchScalar('SELECT COUNT(*) FROM seo_ai_visibility_tracking') === 0) {
    $aiVis = jsLiteralToArray((string) file_get_contents($mernRoot . '/src/data/dubaiAiVisibilityData.js'), $siteUrl, 'DUBAI_AI_VISIBILITY_QUERIES') ?? [];
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO seo_ai_visibility_tracking
          (id, query, cluster, intent, target_page, target_url, overall_visibility_score, status, last_tested, engines_json, key_entities_extracted, recommended_action)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    foreach ($aiVis as $idx => $av) {
        $stmt->execute([
            (string) ($av['id'] ?? ('aiv-' . ($idx + 1))),
            $av['query'] ?? '',
            $av['cluster'] ?? 'Commercial Printing',
            $av['intent'] ?? 'Commercial',
            $av['target_page'] ?? null,
            $av['target_url'] ?? null,
            (int) ($av['overall_visibility_score'] ?? 85),
            $av['status'] ?? 'Dominant Citation',
            !empty($av['last_tested']) ? substr((string) $av['last_tested'], 0, 10) : date('Y-m-d'),
            isset($av['engines']) ? json_encode($av['engines'], JSON_UNESCAPED_UNICODE) : ($av['engines_json'] ?? null),
            isset($av['key_entities_extracted']) && is_array($av['key_entities_extracted']) ? json_encode($av['key_entities_extracted'], JSON_UNESCAPED_UNICODE) : ($av['key_entities_extracted'] ?? null),
            $av['recommended_action'] ?? null,
        ]);
    }
    echo "Seeded " . count($aiVis) . " AI Visibility queries into MySQL.\n";
}

// 6. 150 UAE Backlink Opportunities
if ((int) Database::fetchScalar('SELECT COUNT(*) FROM backlink_opportunities') === 0) {
    $bo150 = jsLiteralToArray((string) file_get_contents($mernRoot . '/src/data/dubaiBacklinkOpportunitiesData.js'), $siteUrl, 'BACKLINK_OPPORTUNITIES') ?? [];
    foreach ($bo150 as $bo) {
        Database::insert('backlink_opportunities', [
            'website_name' => $bo['website'] ?? $bo['website_name'] ?? 'Directory',
            'domain' => $bo['domain'] ?? 'example.ae',
            'website_url' => $bo['url'] ?? $bo['website_url'] ?? '',
            'category' => $bo['category'] ?? 'Local Directory',
            'submission_method' => $bo['submission_method'] ?? 'Online Form',
            'domain_authority' => (int) ($bo['domain_authority'] ?? 45),
            'priority' => $bo['priority'] ?? 'High',
            'country' => $bo['country'] ?? 'UAE',
            'city' => $bo['city'] ?? 'Dubai',
            'relevance' => $bo['relevance'] ?? 'High',
            'link_type' => $bo['link_type'] ?? 'Directory Profile',
            'follow_type' => $bo['follow_type'] ?? 'Follow',
            'contact_url' => $bo['contact_url'] ?? null,
            'submission_url' => $bo['submission_url'] ?? null,
            'target_url' => $bo['target_onprint_url'] ?? $bo['target_url'] ?? $siteUrl,
            'target_anchor_text' => $bo['anchor_text'] ?? $bo['target_anchor_text'] ?? 'ONPRINT',
            'status' => $bo['status'] ?? 'Planned',
            'notes' => $bo['notes'] ?? null,
        ]);
    }
    echo "Seeded " . count($bo150) . " UAE Backlink Opportunities into MySQL.\n";
}

// 7. Competitor Gaps (DLXPrint)
if ((int) Database::fetchScalar('SELECT COUNT(*) FROM seo_competitor_gaps') === 0 && is_file($mernRoot . '/src/data/dlxCompetitorGapData.js')) {
    $gaps = jsLiteralToArray((string) file_get_contents($mernRoot . '/src/data/dlxCompetitorGapData.js'), $siteUrl) ?? [];
    foreach ($gaps as $g) {
        if (!is_array($g) || empty($g['keyword_opportunity'] ?? $g['keyword'] ?? null)) {
            continue;
        }
        Database::insert('seo_competitor_gaps', [
            'competitor_url' => $g['competitor_url'] ?? 'https://dlxprint.com',
            'competitor_topic' => $g['competitor_topic'] ?? $g['topic'] ?? 'Commercial Printing',
            'onprint_url' => $g['onprint_url'] ?? $g['target_url'] ?? '/',
            'missing_topic' => $g['missing_topic'] ?? $g['gap'] ?? 'Specification Depth',
            'keyword_opportunity' => $g['keyword_opportunity'] ?? $g['keyword'],
            'search_intent' => $g['search_intent'] ?? 'Commercial',
            'recommended_content' => $g['recommended_content'] ?? null,
            'internal_link_opportunity' => $g['internal_link_opportunity'] ?? null,
            'geo_opportunity' => $g['geo_opportunity'] ?? null,
            'priority' => $g['priority'] ?? 'High',
        ]);
    }
    echo "Seeded Competitor Gap records into MySQL.\n";
}
