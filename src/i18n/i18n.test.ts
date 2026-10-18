import test from 'node:test';
import assert from 'node:assert/strict';
import { en } from './locales/en.ts';
import { es } from './locales/es.ts';
import { pt } from './locales/pt.ts';
import { fr } from './locales/fr.ts';
import { de } from './locales/de.ts';
import { zh } from './locales/zh.ts';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './constants.ts';

test('i18n configures English (en) as default language', () => {
  assert.equal(DEFAULT_LANGUAGE, 'en');
});

test('i18n supports the 6 corporate global languages', () => {
  const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
  assert.deepEqual(codes, ['en', 'es', 'pt', 'fr', 'de', 'zh']);
});

test('all language dictionaries contain non-empty translations for core sections', () => {
  const locales = [en, es, pt, fr, de, zh];

  locales.forEach((dict) => {
    // Common
    assert.ok(dict.common.save);
    assert.ok(dict.common.cancel);
    assert.ok(dict.common.pts);

    // Navbar
    assert.ok(dict.navbar.brand);
    assert.ok(dict.navbar.enterpriseBadge);
    assert.ok(dict.navbar.indicators.matrix);
    assert.ok(dict.navbar.indicators.whatif);

    // Form
    assert.ok(dict.form.mainTitle);
    assert.ok(dict.form.submitButton);

    // KPIs
    assert.ok(dict.kpis.leadingAlt);
    assert.ok(dict.kpis.stabilityIndex);

    // Matrix
    assert.ok(dict.matrix.title);
    assert.ok(dict.matrix.autoNormalize);

    // Sensitivity
    assert.ok(dict.sensitivity.title);
    assert.ok(dict.sensitivity.resetBase);

    // Evidence
    assert.ok(dict.evidence.title);
    assert.ok(dict.evidence.linkNewMetric);

    // Report
    assert.ok(dict.report.title);
    assert.ok(dict.report.printPdf);

    // History
    assert.ok(dict.history.title);
  });
});
