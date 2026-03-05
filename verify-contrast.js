// verify-contrast.js — WCAG Contrast Ratio Calculator
// Verifies color pairs from panel.css redesign

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

function checkWCAG(ratio) {
  return {
    'AA Normal (4.5:1)': ratio >= 4.5,
    'AA Large (3:1)': ratio >= 3.0,
    'AAA Normal (7:1)': ratio >= 7.0,
    'AAA Large (4.5:1)': ratio >= 4.5
  };
}

console.log('═══════════════════════════════════════════════════════');
console.log('CONFIDENT PANEL - WCAG CONTRAST VERIFICATION');
console.log('═══════════════════════════════════════════════════════\n');

// Color pairs to verify (AFTER FIXES)
const pairs = [
  { name: 'Primary text (slate-300 on slate-900)', fg: '#cbd5e1', bg: '#0f172a' },
  { name: 'Secondary text (slate-400 on slate-900)', fg: '#94a3b8', bg: '#0f172a' },
  { name: 'Tertiary text (slate-400 on slate-900) [FIXED]', fg: '#94a3b8', bg: '#0f172a' },
  { name: 'Accent button text (white on cyan-700) [FIXED]', fg: '#ffffff', bg: '#0e7490' },
  { name: 'Primary text on elevated bg (slate-300 on slate-800)', fg: '#cbd5e1', bg: '#1e293b' },
  { name: 'Secondary text on elevated bg (slate-400 on slate-800)', fg: '#94a3b8', bg: '#1e293b' },
];

pairs.forEach(pair => {
  const ratio = contrastRatio(pair.fg, pair.bg);
  const wcag = checkWCAG(ratio);

  console.log(`${pair.name}`);
  console.log(`  FG: ${pair.fg} | BG: ${pair.bg}`);
  console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1`);
  console.log(`  WCAG AA Normal: ${wcag['AA Normal (4.5:1)'] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  WCAG AAA Normal: ${wcag['AAA Normal (7:1)'] ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════');
