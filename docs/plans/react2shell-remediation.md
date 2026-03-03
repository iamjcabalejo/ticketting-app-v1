# Plan: React2Shell (CVE-2025-66478) Remediation

## Task analysis / metadata

- **Type**: Infrastructure / Security
- **Complexity**: Small — version bump, lockfile update, verification; no feature or schema changes.
- **Estimated effort**: ~1 hour (upgrade, install, build/test, optional secret rotation).
- **Priority**: High (critical security vulnerability)

## Scope / metadata

- **In scope**
  - Upgrade Next.js and related tooling to patched versions (CVE-2025-66478 / React2Shell).
  - Update lockfile and verify build and dev server.
  - Document optional secret rotation if the app was deployed unpatched.
- **Out of scope**
  - Changing application code or features.
  - Vercel-specific deployment protection or WAF configuration (user/admin responsibility).
- **Security**: `Security: critical`

## Feature overview

- **Problem**: The project runs Next.js 15.5.6, which is in the vulnerable range (15.0.0–16.0.6) for React2Shell (CVE-2025-55182 / CVE-2025-66478). Specially crafted requests can lead to remote code execution via React Server Components. Remediation is to upgrade to a patched release.
- **Audience**: Developers and deployers of this app; no end-user-facing feature change.
- **Key functionality**
  - Bump `next` and `eslint-config-next` to the patched 15.5.7 release.
  - Regenerate lockfile and ensure install succeeds.
  - Confirm `next build` and `next dev` run successfully.
  - Optionally document secret rotation steps if the app was ever deployed unpatched.

**Reference**: [Vercel React2Shell Security Bulletin](https://vercel.com/kb/bulletin/react2shell) — Next.js 15.5.x patched release: **15.5.7**.

## Acceptance criteria

- **AC-1**: `package.json` specifies `next` at version `15.5.7` (or higher within 15.x patched line).
- **AC-2**: `package.json` specifies `eslint-config-next` at version `15.5.7` (or same as `next`).
- **AC-3**: Lockfile (e.g. `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`) is updated and committed with `package.json` changes.
- **AC-4**: `npm install` (or project package manager) completes without errors.
- **AC-5**: `next build` (or project build script) completes successfully.
- **AC-6**: `next dev` starts without errors (smoke check).
- **AC-7**: Implementation notes mention optional secret rotation and link to Vercel docs if the app was deployed unpatched before remediation.

## Technical design

- **Components / modules**: No new components. Only dependency version changes in `package.json` and lockfile.
- **Endpoints / APIs**: None.
- **Data model / schema**: No changes.
- **Data flow**: N/A.
- **References**: `core-standards.mdc` (no code logic change); security remediation per Vercel bulletin.

### Version mapping (from bulletin)

| Current (vulnerable) | Patched |
|----------------------|--------|
| Next.js 15.5.6       | 15.5.7 |

## Backend tasks

- **Phase 1 — Setup**
  - [ ] In `package.json`, set `"next": "15.5.7"` in `dependencies`.
  - [ ] In `package.json`, set `"eslint-config-next": "15.5.7"` in `devDependencies`.
  - **File changes**: `package.json` (modify).
  - **Dependencies**: `next@15.5.7`, `eslint-config-next@15.5.7` (version bump only).
- **Phase 2 — Database**: None.
- **Phase 3 — API**: None.
- **Phase 4 — Security**
  - [ ] In implementation notes, state whether the app was deployed unpatched; if yes, recommend rotating env vars per [Vercel rotating secrets](https://vercel.com/docs/environment-variables/rotating-secrets).
  - **File changes**: None (documentation in impl notes).

## Frontend tasks

- **Phase 1 — Components**: No new or changed components.
- **Phase 2 — Pages / views**: No route or layout changes.
- **Phase 3 — Integration**: Verify app still loads (dev and build); no API contract changes.
- **Phase 4 — Polish**: N/A.
- **API contract**: No change.

## Integration & testing

- **E2E flows**: One smoke flow — "App builds and dev server starts after upgrade" (build script + dev start).
- **Critical paths**: Build success; dev server start; no regression from dependency upgrade.
- **Unit / integration**: No new tests required; existing tests (if any) must still pass after `npm install` and build.

### Smoke flow: App builds and dev server starts after upgrade

**Purpose:** Verify no regression from the dependency upgrade; critical path for AC-4, AC-5, AC-6.

**Steps (run in project root):**

1. **Install dependencies**
   ```bash
   npm install
   ```
   - **Pass:** Exit code 0; no install errors.
   - **Fail:** Non-zero exit or dependency resolution errors.

2. **Build**
   ```bash
   npm run build
   ```
   - **Pass:** Build completes successfully (Next.js build output shows success).
   - **Fail:** Build errors or warnings that prevent a successful build.

3. **Dev server start (smoke)**
   ```bash
   npm run dev
   ```
   - **Pass:** Dev server starts without errors (e.g. "Ready in …" or equivalent); app is reachable at the reported local URL (e.g. http://localhost:3000).
   - **Fail:** Process exits with error or fails to bind.
   - **Manual:** Stop the dev server (Ctrl+C) after confirming it started.
   - **CI:** Run with a short timeout; consider `timeout 15 npm run dev` or a small script that starts dev, waits for "Ready", then exits 0.

**Existing E2E tests:** This project has no E2E test suite (no Playwright/Cypress config or `e2e/` tests). If E2E tests are added later, run the full E2E suite after `npm install` and build to confirm no regression from the upgrade.

## File changes

- `package.json` (modify) — bump `next` and `eslint-config-next` to `15.5.7`.
- Lockfile (modify) — e.g. `package-lock.json` or project lockfile, updated by install command.
- `docs/plans/react2shell-remediation.md` (this file, already created).

## Dependencies / env

- **Packages**
  - `next`: upgrade from `15.5.6` → `15.5.7` (patched for CVE-2025-66478).
  - `eslint-config-next`: upgrade from `15.5.6` → `15.5.7` (align with Next.js).
- **Env vars**: No new or changed env vars. If the app was deployed unpatched before remediation, rotate secrets per Vercel docs (user/team responsibility).
- **Config changes**: None.

## Risks / potential issues

- **Minor semver risk**: 15.5.6 → 15.5.7 is a patch release; breaking changes are unlikely. If any, revert and report.
- **Lockfile drift**: Always run install and commit the lockfile with `package.json` to avoid "works on my machine" and ensure deployed build uses patched deps. **Mitigation**: Plan AC-3 and install step.
- **Secret rotation**: If the app was live and unpatched as of Dec 4, 2025, assume compromise and rotate secrets. **Mitigation**: Document in implementation notes and link Vercel rotation guide.
- **Alternative path**: Using `npx fix-react2shell-next` is acceptable per bulletin; plan assumes manual version bump for clarity and traceability.

## Implementation notes (backend, Code phase)

- **Done**
  - **AC-1, AC-2**: `package.json` updated: `next` and `eslint-config-next` set to `15.5.7`.
  - **AC-3, AC-4**: `npm install` run; `package-lock.json` updated and install completed without errors.
  - **AC-5**: `npm run build` (next build --turbopack) completed successfully; Next.js 15.5.7 confirmed in build output.
- **Deferred**
  - AC-6 (next dev smoke check): not run in this backend pass; can be verified in integration or by the team.
- **Assumptions**
  - Package manager is npm (project has `package-lock.json`). No pnpm/yarn used.
  - Pre-existing lint warning in `lib/email-services/email-services.ts` (unused `fs`) was not changed; out of scope.
- **Env/config**
  - None. No new or changed env vars.
- **AC-7 — Secret rotation**
  - **Whether the app was deployed unpatched:** Not determined by this implementation (depends on deployment history). If the app was ever deployed with Next.js in the vulnerable range (15.0.0–16.0.6) before this remediation, treat as potentially compromised and rotate secrets.
  - **Recommendation:** If the app was deployed unpatched, rotate environment variables (API keys, database credentials, etc.) per Vercel’s rotating secrets guide: [Vercel: Rotating secrets](https://vercel.com/docs/environment-variables/rotating-secrets).

---

## Integration & Testing handoff (Review/Test)

- **Test status vs acceptance criteria**
  - **AC-4 (npm install):** ✅ Verified in Integration & Testing — `npm install` completed with exit code 0.
  - **AC-5 (build success):** ✅ Verified by backend and re-verified in Integration & Testing — `npm run build` completes successfully; Next.js 15.5.7 in build output.
  - **AC-6 (next dev smoke):** ⚠️ Deferred — Not run in backend; attempted in Integration & Testing failed in sandbox (network interface restriction). **Action for team/CI:** Run smoke flow steps manually or in CI (see [Smoke flow](#smoke-flow-app-builds-and-dev-server-starts-after-upgrade) above).
  - **Unit / integration tests:** No test script or test files in project; nothing to run. If tests are added later, run after `npm install` and build per plan.
- **Implementation notes (Integration & Testing)**
  - **Done:** (1) Confirmed critical path (build success) is already verified by backend and re-ran `npm install` + `npm run build` — both pass. (2) Documented smoke flow "App builds and dev server starts after upgrade" with steps (install, build, dev) in this plan for manual or CI execution. (3) Noted that project has no E2E tests; if added later, run full E2E suite after upgrade.
  - **Deferred:** AC-6 (dev server start) — verify manually or in CI using the documented smoke flow; no new E2E tests added (plan: "No new tests required").

---

## Next steps

1. Run **project-manager** with this plan to execute Code → Review/Test:  
   `/project-manager docs/plans/react2shell-remediation.md`
2. After deployment, if the app was previously deployed unpatched, rotate environment variables per [Vercel: Rotating secrets](https://vercel.com/docs/environment-variables/rotating-secrets).
