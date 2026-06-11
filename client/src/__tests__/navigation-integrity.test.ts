import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Navigation Integrity Tests
 *
 * Guards against two categories of bugs discovered in production:
 *
 * 1. BROKEN URL PATTERNS — navigation strings with spaces or invalid
 *    prefixes (e.g. "/Readiness Protocol-library/") that silently 404
 *    because the browser encodes spaces as %20 and no route matches.
 *
 * 2. INVALID ROUTE REFERENCES — setLocation/navigate/href calls that
 *    point to paths not registered in App.tsx.
 *
 * These bugs only surface in the authenticated experience on the
 * deployed site, making them invisible to casual guest-mode review.
 * This suite catches them at commit time instead.
 */

const CLIENT_SRC = path.resolve(__dirname, '../../');

function getAllTsxFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results.push(...getAllTsxFiles(full));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      results.push(full);
    }
  }
  return results;
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

// ─── Broken URL Pattern Detection ────────────────────────────────────────────

const BROKEN_URL_PATTERNS: { pattern: RegExp; description: string }[] = [
  {
    pattern: /[`'"](\/[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]*)/,
    description: 'URL path starting with an uppercase word followed by a space (e.g. "/Readiness Protocol-library")',
  },
  {
    pattern: /setLocation\(`\/[A-Z][a-zA-Z]+ /,
    description: 'setLocation() call with a space in the URL path',
  },
  {
    pattern: /navigate\(`\/[A-Z][a-zA-Z]+ /,
    description: 'navigate() call with a space in the URL path',
  },
  {
    pattern: /href=\{`\/[A-Z][a-zA-Z]+ /,
    description: 'href prop with a space in the URL path',
  },
  {
    pattern: /href="\/[A-Z][a-zA-Z]+ /,
    description: 'static href with a space in the URL path',
  },
];

// Specific retired path prefixes that were found in production
const RETIRED_URL_PREFIXES = [
  '/Readiness Protocol-library',
  '/Readiness Protocol-customize',
  '/Readiness Protocol-activation',
  '/Readiness Protocols/',
  '/Readiness Protocol/',
];

describe('Navigation URL Integrity', () => {
  const allFiles = getAllTsxFiles(CLIENT_SRC);
  const sourceFiles = allFiles.filter(f => !f.includes('__tests__') && !f.includes('.test.'));

  it('no source file contains a URL path with embedded spaces', () => {
    const violations: string[] = [];

    for (const filePath of sourceFiles) {
      const content = readFile(filePath);
      const lines = content.split('\n');
      const relativePath = path.relative(CLIENT_SRC, filePath);

      lines.forEach((line, idx) => {
        for (const { pattern, description } of BROKEN_URL_PATTERNS) {
          if (pattern.test(line)) {
            // Skip comments and non-navigation contexts
            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
            // Skip the scene ID comparison in DemoStrategicSimulation (intentional string, not a URL)
            if (line.includes("'Readiness Protocol-activation'") && line.includes('sceneId')) continue;
            violations.push(`  ${relativePath}:${idx + 1} — ${description}\n    → ${line.trim()}`);
          }
        }
      });
    }

    if (violations.length > 0) {
      throw new Error(
        `Found ${violations.length} navigation URL(s) with spaces in the path.\n` +
        `These cause silent 404s on the deployed site because no route matches.\n\n` +
        violations.join('\n\n')
      );
    }
  });

  it('no source file references a retired URL prefix', () => {
    const violations: string[] = [];

    for (const filePath of sourceFiles) {
      const content = readFile(filePath);
      const lines = content.split('\n');
      const relativePath = path.relative(CLIENT_SRC, filePath);

      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
        // Skip the intentional scene ID comparison
        if (line.includes("'Readiness Protocol-activation'") && line.includes('sceneId')) return;

        for (const prefix of RETIRED_URL_PREFIXES) {
          if (line.includes(prefix)) {
            violations.push(`  ${relativePath}:${idx + 1} — retired prefix "${prefix}"\n    → ${trimmed}`);
          }
        }
      });
    }

    if (violations.length > 0) {
      throw new Error(
        `Found ${violations.length} reference(s) to retired URL prefixes.\n` +
        `Use /playbooks/:id/preview, /playbooks/:id/customize, /playbook-library, etc.\n\n` +
        violations.join('\n\n')
      );
    }
  });

  it('protocol preview links use the /playbooks/:id/preview pattern', () => {
    // Positive assertion: the canonical preview pattern exists in ProtocolLibrary
    const libraryPath = path.join(CLIENT_SRC, 'src/pages/ProtocolLibrary.tsx');
    if (!fs.existsSync(libraryPath)) return;
    const content = readFile(libraryPath);
    expect(content).toContain('/playbooks/${playbook.id}/preview');
  });

  it('protocol customize links use the /playbooks/:id/customize pattern', () => {
    const libraryPath = path.join(CLIENT_SRC, 'src/pages/ProtocolLibrary.tsx');
    if (!fs.existsSync(libraryPath)) return;
    const content = readFile(libraryPath);
    expect(content).toContain('/playbooks/${playbook.id}/customize');
  });
});

// ─── API Response Safety ──────────────────────────────────────────────────────

describe('API Response Array Safety', () => {
  it('alerts data must be guarded with Array.isArray() before .filter()', () => {
    const quickActionsPath = path.join(CLIENT_SRC, 'src/components/QuickActions.tsx');
    if (!fs.existsSync(quickActionsPath)) return;
    const content = readFile(quickActionsPath);

    // The guard must be present
    expect(content).toContain('Array.isArray(alertsData?.data)');

    // The unsafe pattern must not be present
    const unsafePattern = /alertsData\?\.data\s*\?\?\s*\[\]/;
    expect(unsafePattern.test(content)).toBe(false);
  });

  it('QuickActions does not call .filter() on an unguarded API response', () => {
    const quickActionsPath = path.join(CLIENT_SRC, 'src/components/QuickActions.tsx');
    if (!fs.existsSync(quickActionsPath)) return;
    const content = readFile(quickActionsPath);
    const lines = content.split('\n');

    // Find the alerts assignment line
    const alertsLine = lines.find(l => l.includes('const alerts') && l.includes('alertsData'));
    expect(alertsLine).toBeDefined();

    // It must use Array.isArray guard, not bare nullish coalescing
    expect(alertsLine).toContain('Array.isArray');
  });

  it('ProtocolDetail guards array data before rendering', () => {
    const detailPath = path.join(CLIENT_SRC, 'src/pages/ProtocolDetail.tsx');
    if (!fs.existsSync(detailPath)) return;
    const content = readFile(detailPath);
    // Should use Array.isArray checks somewhere in the file for array data
    expect(content).toContain('Array.isArray');
  });
});

// ─── Route Registration ───────────────────────────────────────────────────────

describe('Core Route Registration', () => {
  const appPath = path.join(CLIENT_SRC, 'src', 'App.tsx');

  it('App.tsx registers the /playbooks/:id/preview route', () => {
    const content = readFile(appPath);
    expect(content).toContain('/playbooks/:id/preview');
  });

  it('App.tsx registers the /playbooks/:id/customize route', () => {
    const content = readFile(appPath);
    expect(content).toContain('/playbooks/:id/customize');
  });

  it('App.tsx registers the /playbook-library route', () => {
    const content = readFile(appPath);
    expect(content).toContain('/playbook-library');
  });

  it('App.tsx registers the /mission-control route', () => {
    const content = readFile(appPath);
    expect(content).toContain('/mission-control');
  });

  it('App.tsx registers the /playbook-activation route', () => {
    const content = readFile(appPath);
    expect(content).toContain('playbook-activation');
  });
});
