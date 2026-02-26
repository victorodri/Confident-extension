# Testing Checklist - Confident v1.0

## Last Updated
Date: 2026-02-26
Session: 13 - Phase 1 Bug Fixes

---

## Test Suite 1: Session Counter (BUG #1 Fix)

### Backend API Tests
- [ ] **Anonymous user - no sessions**: GET `/api/usage?anonymous_id=test-123`
  - Expected: `{ user_type: "anonymous", total_sessions: 0, remaining: 5, limit: 5 }`
- [ ] **Anonymous user - 3 sessions**: Create 3 sessions, then GET `/api/usage`
  - Expected: `{ user_type: "anonymous", total_sessions: 3, remaining: 2, limit: 5 }`
- [ ] **Anonymous user - 5 sessions** (limit reached)
  - Expected: `{ user_type: "anonymous", total_sessions: 5, remaining: 0, limit: 5 }`
- [ ] **Registered free user - 10 sessions**
  - Expected: `{ user_type: "free", total_sessions: 10, remaining: 5, limit: 15 }`
- [ ] **Registered free user - 15 sessions** (limit reached)
  - Expected: `{ user_type: "free", total_sessions: 15, remaining: 0, limit: 15 }`
- [ ] **Pro user - any sessions**
  - Expected: `{ user_type: "pro", total_sessions: X, remaining: Infinity, limit: null }`

### Extension Panel Tests
- [ ] **Counter visibility - Anonymous with sessions available**
  - Counter shows: "X sesiones gratuitas. Regístrate para 10 más"
  - Link to auth page works
- [ ] **Counter visibility - Anonymous at limit (0 remaining)**
  - Counter shows: "0 sesiones gratuitas" with warning styling
  - Regístrate link visible
- [ ] **Counter visibility - Free user with >3 sessions remaining**
  - Counter HIDDEN (not shown)
- [ ] **Counter visibility - Free user with ≤3 sessions remaining**
  - Counter shows: "X sesiones restantes. Ver planes Pro"
  - Orange/yellow warning color
- [ ] **Counter visibility - Free user at limit (0 remaining)**
  - Counter shows: "Límite alcanzado. Ver planes Pro"
  - Red color, pricing link works
- [ ] **Counter visibility - Pro user**
  - Counter HIDDEN (never shown)
- [ ] **Counter updates after starting session**
  - Start session → counter updates immediately
- [ ] **Counter updates after ending session**
  - End session → counter updates to reflect new total

---

## Test Suite 2: Smart Cards Logic (BUG #2 Fix)

### Urgency Level 1 (Informativo) - Green
- [ ] **Single urgency-1 card**
  - Shows with green left border
  - Badge shows: "🟢 INFO"
  - Background has subtle green gradient
- [ ] **Two urgency-1 cards**
  - Both visible
  - Newest at bottom
- [ ] **Three urgency-1 cards**
  - All three visible
  - Max limit reached
- [ ] **Fourth urgency-1 card arrives**
  - Oldest (first) card removed
  - Newest 3 cards visible

### Urgency Level 2 (Importante) - Yellow
- [ ] **Single urgency-2 card**
  - Shows with amber/yellow left border
  - Badge shows: "🟡 IMPORTANTE"
  - Background has subtle amber gradient
  - Box shadow is visible
- [ ] **Sequence: 1 → 1 → 2**
  - After urgency-2 arrives, only 2 cards visible (oldest urgency-1 removed)
- [ ] **Sequence: 1 → 1 → 1 → 2**
  - After urgency-2 arrives, max 2 cards visible
- [ ] **Two urgency-2 cards**
  - Both visible, max limit for urgency-2
- [ ] **Third urgency-2 card arrives**
  - Oldest urgency-2 removed, 2 remain

### Urgency Level 3 (Crítico) - Red
- [ ] **Single urgency-3 card**
  - Shows with red left border
  - Badge shows: "🔴 URGENTE"
  - Background has red gradient
  - Strong box shadow
  - Pulse animation plays on appearance
- [ ] **Sequence: 1 → 1 → 1 → 3**
  - ALL three urgency-1 cards cleared
  - Only urgency-3 card visible
- [ ] **Sequence: 2 → 2 → 3**
  - ALL urgency-2 cards cleared
  - Only urgency-3 card visible
- [ ] **Second urgency-3 card arrives**
  - Previous urgency-3 cleared
  - Only newest urgency-3 visible

### Cross-Urgency Sequences
- [ ] **Sequence: 3 → 1 → 1 → 1**
  - After critical, informativos accumulate normally (max 3)
- [ ] **Sequence: 3 → 2 → 2**
  - After critical, importantes accumulate (max 2)
- [ ] **Sequence: 1 → 2 → 3 → 1**
  - Critical clears everything
  - Then informativo shows alone
- [ ] **Console logs show correct urgency detection**
  - Check browser console for: "[Panel] Urgencia X: ..." messages

### Visual Verification
- [ ] **Urgency badge positioning**
  - Badge appears at top of each card
  - Text is uppercase, small, bold
- [ ] **Border colors match urgency**
  - Green for info, Amber for important, Red for critical
- [ ] **Background gradients visible**
  - Subtle gradient from border color to transparent
- [ ] **Pulse animation for critical**
  - Critical cards have brief scale animation on appearance

---

## Test Suite 3: Integration Tests

### Complete User Flow - Anonymous
1. [ ] Open extension on Google Meet
2. [ ] Check counter shows "5 sesiones gratuitas"
3. [ ] Start first session (urgency-1 suggestions appear)
4. [ ] Verify max 3 cards, green styling
5. [ ] Receive urgency-2 suggestion → max 2 cards visible
6. [ ] Receive urgency-3 suggestion → all cleared, only critical visible
7. [ ] End session
8. [ ] Counter updates to "4 sesiones gratuitas"
9. [ ] Repeat 4 more times
10. [ ] On 6th attempt, counter shows "0 sesiones gratuitas"
11. [ ] Soft paywall appears (if implemented)

### Complete User Flow - Registered Free
1. [ ] Login with Google OAuth
2. [ ] Counter hidden (>3 sessions remaining)
3. [ ] Use 12 sessions
4. [ ] Counter appears: "3 sesiones restantes"
5. [ ] Use 2 more sessions
6. [ ] Counter shows: "1 sesión restante" (orange/red warning)
7. [ ] Use final session
8. [ ] Counter shows: "Límite alcanzado. Ver planes Pro"
9. [ ] Hard paywall blocks next session start (if implemented)

### Complete User Flow - Pro
1. [ ] Upgrade to Pro (or simulate in DB)
2. [ ] Counter never appears
3. [ ] Can start unlimited sessions
4. [ ] Smart cards still work with urgency logic

---

## Test Suite 4: Error Handling

- [ ] **Missing anonymous_id**
  - API returns 400 error
  - Panel hides counter gracefully
- [ ] **Network error to /api/usage**
  - Panel catches error
  - Counter hidden
  - Console shows error log
- [ ] **Invalid urgency value (0, 4, null)**
  - Defaults to urgency 1
  - Green card displayed
- [ ] **Empty suggestion text**
  - Card not created
  - Listening state shown

---

## Test Suite 5: Performance

- [ ] **API response time < 500ms**
  - Test with curl/Postman
- [ ] **Counter updates without lag**
  - Visual update happens immediately after session start/end
- [ ] **Card removal is smooth**
  - No jank when cards are removed
  - Smooth CSS transitions
- [ ] **No memory leaks**
  - Create/remove 50 cards rapidly
  - Check Chrome DevTools Memory profiler

---

## Test Suite 6: Cross-Browser (Chrome Only for MV3)

- [ ] **Chrome Stable** (latest)
  - All features work
  - Manifest no warnings
- [ ] **Chrome Beta**
  - Extension installs
  - Core features work
- [ ] **Chrome Dev/Canary**
  - No console errors
  - MV3 API calls work

---

## Test Suite 7: Edge Cases

- [ ] **Rapid suggestions (3 in <1 second)**
  - Cards display correctly
  - Urgency logic respected
- [ ] **Very long suggestion text (>500 chars)**
  - Card expands to fit
  - No overflow issues
- [ ] **Special characters in suggestions**
  - HTML escaped correctly (no XSS)
  - Emojis display properly
- [ ] **Simultaneous users (same anonymous_id)**
  - Counter accurate
  - No race conditions
- [ ] **User switches profiles mid-session**
  - Counter reflects new profile
  - Cards cleared/reset appropriately

---

## Manual Testing Protocol

### Setup
1. Load extension unpacked in `chrome://extensions`
2. Open Google Meet call (or test page)
3. Open DevTools Console (F12)
4. Open Side Panel

### Per-Test Steps
1. Clear chrome.storage.local (DevTools → Application → Storage)
2. Create fresh anonymous_id
3. Execute test scenario
4. ✅ Mark pass/fail
5. 📝 Document any bugs in PROGRESS.md

### Bug Report Format
```markdown
## Bug #X: [Title]
- **Severity**: Critical / High / Medium / Low
- **Component**: Backend API / Extension Panel / CSS
- **Steps to reproduce**:
  1. ...
  2. ...
- **Expected**: ...
- **Actual**: ...
- **Fix**: ...
```

---

## Automated Testing (Future)

- [ ] Jest unit tests for /api/usage logic
- [ ] Playwright E2E tests for extension panel
- [ ] CI/CD with GitHub Actions
- [ ] Lighthouse performance audit

---

## Pre-Publication Checklist (Before Chrome Web Store)

- [ ] All Test Suite 1 tests passing (Session Counter)
- [ ] All Test Suite 2 tests passing (Smart Cards)
- [ ] At least 90% of Test Suite 3 passing (Integration)
- [ ] No console errors in normal flow
- [ ] No XSS vulnerabilities (escapeHtml works)
- [ ] manifest.json version bumped to 1.0.0
- [ ] All CLAUDE.md requirements met

---

**Notes**:
- Mark ✅ for passing tests
- Mark ❌ for failing tests with bug reference
- Mark ⚠️ for partial pass with notes
- Defer non-critical bugs to v1.1 if needed
